require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createAiRouter = require('./aiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGO_URI);

// Allow the Codespaces frontend to communicate with the API.
app.use(cors({
  origin: function(origin, callback) {
    if (!origin ||
        /^https:\/\/[a-z0-9-]+-\d+\.app\.github\.dev$/.test(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed'));
  }
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', application: 'ChocoFix Order Management API' });
});

async function start() {
  await client.connect();
  const db = client.db('chocofix');
  const products = db.collection('products');

  // READ ALL and SEARCH
  app.get('/products', async (req, res) => {
    try {
      const search = req.query.search;
      const filter = search
        ? { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
        : {};
      res.json(await products.find(filter).toArray());
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  });

  // CREATE
  app.post('/products', async (req, res) => {
    try {
      const { name, category, price, stock, description } = req.body;
      if (typeof name !== 'string' || !name.trim() ||
          typeof category !== 'string' || !category.trim() ||
          typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
          !Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ error: 'Valid name, category, price and stock are required' });
      }
      const product = { name: name.trim(), category: category.trim(), price, stock, description: description || '' };
      const result = await products.insertOne(product);
      res.status(201).json({ _id: result.insertedId, ...product });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // UPDATE
  app.put('/products/:id', async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const { name, category, price, stock, description } = req.body;
      if (typeof name !== 'string' || !name.trim() ||
          typeof category !== 'string' || !category.trim() ||
          typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
          !Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ error: 'Valid name, category, price and stock are required' });
      }
      const updated = await products.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { name: name.trim(), category: category.trim(), price, stock, description: description || '' } },
        { returnDocument: 'after' }
      );
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  // DELETE
  app.delete('/products/:id', async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const result = await products.deleteOne({ _id: new ObjectId(req.params.id) });
      if (!result.deletedCount) return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });


  const orders = db.collection('orders');

  const allowedOrderStatuses = [
    'Order Received',
    'Processing',
    'Ready for Collection',
    'Completed',
    'Cancelled'
  ];

  const allowedPaymentStatuses = [
    'Pending',
    'Paid'
  ];

  function validateOrder(body) {
    const {
      customerName,
      product,
      quantity,
      collectionDate,
      orderStatus = 'Order Received',
      paymentStatus = 'Pending'
    } = body || {};

    if (
      typeof customerName !== 'string' ||
      !customerName.trim() ||
      typeof product !== 'string' ||
      !product.trim() ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      typeof collectionDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(collectionDate) ||
      !Number.isFinite(Date.parse(collectionDate)) ||
      new Date(collectionDate).toISOString().slice(0, 10) !== collectionDate ||
      !allowedOrderStatuses.includes(orderStatus) ||
      !allowedPaymentStatuses.includes(paymentStatus)
    ) {
      return null;
    }

    return {
      customerName: customerName.trim(),
      product: product.trim(),
      quantity,
      collectionDate,
      orderStatus,
      paymentStatus
    };
  }

  // READ
  app.get('/orders', async (req, res) => {
    try {
      res.json(await orders.find({}).toArray());
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve orders' });
    }
  });

  // CREATE
  app.post('/orders', async (req, res) => {
    try {
      const order = validateOrder(req.body);
      if (!order) {
        return res.status(400).json({ error: 'Invalid order details' });
      }

      const document = {
        ...order,
        createdAt: new Date()
      };

      const result = await orders.insertOne(document);
      res.status(201).json({ _id: result.insertedId, ...document });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // UPDATE
  app.put('/orders/:id', async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      const order = validateOrder(req.body);
      if (!order) {
        return res.status(400).json({ error: 'Invalid order details' });
      }

      const updated = await orders.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { ...order, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  // DELETE / CANCEL
  app.delete('/orders/:id', async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      const result = await orders.deleteOne({
        _id: new ObjectId(req.params.id)
      });

      if (!result.deletedCount) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ message: 'Order deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  });


  // USER AUTHENTICATION
  const users = db.collection('users');

  // REGISTER
  app.post('/auth/register', async (req, res) => {
    try {
      const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
      const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
      const password = req.body.password;

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
          error: 'Valid email and password of at least 8 characters are required'
        });
      }

      const existing = await users.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = {
        name,
        email,
        passwordHash,
        createdAt: new Date()
      };

      const result = await users.insertOne(user);

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: result.insertedId, name, email }
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  // LOGIN
  app.post('/auth/login', async (req, res) => {
    try {
      const email = typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
      const password = req.body.password;

      if (!email || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await users.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({
        message: 'Login successful',
        token,
        tokenType: 'Bearer',
        expiresIn: '2h'
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  // JWT AUTHENTICATION MIDDLEWARE
  function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      req.auth = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }

  // PROTECTED ROUTE
  app.get('/auth/me', authenticateToken, async (req, res) => {
    try {
      const user = await users.findOne(
        { _id: new ObjectId(req.auth.userId) },
        { projection: { passwordHash: 0 } }
      );

      if (!user) return res.status(404).json({ error: 'User not found' });

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve user' });
    }
  });

  app.use('/ai', createAiRouter(db, authenticateToken));

  app.listen(PORT, () => console.log(`ChocoFix API running on port ${PORT}`));
}

start().catch(err => {
  console.error('Failed to start ChocoFix API:', err.message);
  process.exit(1);
});
