const express = require('express');

function createAiRouter(db, authenticateToken) {
  const router = express.Router();

  const products = db.collection('products');
  const orders = db.collection('orders');

  const allowedOperations = [
    'count_orders',
    'count_products',
    'orders_by_status',
    'low_stock_products',
    'total_order_value'
  ];

  const allowedStatuses = [
    'Pending', 'Processing', 'Completed', 'Cancelled'
  ];

  router.post('/query', authenticateToken, async (req, res) => {
    const question = req.body?.question;

    if (typeof question !== 'string' ||
        !question.trim() ||
        question.length > 500) {
      return res.status(400).json({
        error: 'A question of 1–500 characters is required'
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({
        error: 'AI service is not configured'
      });
    }

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: process.env.OPENROUTER_MODEL || 'openrouter/free',
            messages: [
              {
                role: 'system',
                content: [
                  'Convert the user question into one approved operation.',
                  'Return ONLY valid JSON.',
                  'Allowed operations:',
                  allowedOperations.join(', '),
                  'For orders_by_status use status:',
                  allowedStatuses.join(', '),
                  'For low_stock_products use threshold (integer 0-1000).',
                  'For total_order_value, status is optional.',
                  'Never generate MongoDB commands or JavaScript.',
                  'If unsupported, return {"operation":"unsupported"}.',
                  'Example: {"operation":"count_orders"}',
                  'Example: {"operation":"orders_by_status","status":"Pending"}',
                  'Example: {"operation":"low_stock_products","threshold":5}'
                ].join('\n')
              },
              {
                role: 'user',
                content: question.trim()
              }
            ],
            temperature: 0,
            max_tokens: 200
          }),
          signal: AbortSignal.timeout(30000)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('OpenRouter error:', response.status);
        return res.status(502).json({
          error: 'AI provider request failed'
        });
      }

      const content = result.choices?.[0]?.message?.content;

      if (typeof content !== 'string') {
        return res.status(502).json({
          error: 'AI returned an empty response'
        });
      }

      let plan;

      try {
        plan = JSON.parse(
          content.trim()
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/, '')
        );
      } catch {
        return res.status(502).json({
          error: 'AI did not return valid JSON'
        });
      }

      if (!plan || typeof plan !== 'object' ||
          Array.isArray(plan) ||
          !allowedOperations.includes(plan.operation)) {
        return res.status(400).json({
          error: 'Question is not supported',
          supportedOperations: allowedOperations
        });
      }

      const status = plan.status;

      if (status !== undefined &&
          !allowedStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid order status'
        });
      }

      let data;
      let answer;

      switch (plan.operation) {
        case 'count_orders': {
          const count = await orders.countDocuments({});
          data = { count };
          answer = `There are ${count} orders.`;
          break;
        }

        case 'count_products': {
          const count = await products.countDocuments({});
          data = { count };
          answer = `There are ${count} products.`;
          break;
        }

        case 'orders_by_status': {
          if (!status) {
            return res.status(400).json({
              error: 'Order status is required'
            });
          }

          const count = await orders.countDocuments({ status });
          data = { status, count };
          answer = `There are ${count} ${status.toLowerCase()} orders.`;
          break;
        }

        case 'low_stock_products': {
          const threshold = plan.threshold === undefined
            ? 5 : plan.threshold;

          if (!Number.isInteger(threshold) ||
              threshold < 0 || threshold > 1000) {
            return res.status(400).json({
              error: 'Invalid stock threshold'
            });
          }

          const items = await products.find(
            { stock: { $lte: threshold } },
            { projection: { name: 1, stock: 1, _id: 0 } }
          ).sort({ stock: 1 }).limit(50).toArray();

          data = { threshold, products: items };
          answer = `Showing ${items.length} products with stock at or below ${threshold}.`;
          break;
        }

        case 'total_order_value': {
          const filter = status ? { status } : {};

          const totals = await orders.aggregate([
            { $match: filter },
            {
              $group: {
                _id: null,
                total: { $sum: '$total' },
                count: { $sum: 1 }
              }
            }
          ]).toArray();

          const total = totals[0]?.total || 0;
          const count = totals[0]?.count || 0;

          data = { status: status || 'All', total, count };
          answer = `Total order value: ${total.toFixed(2)} across ${count} orders.`;
          break;
        }
      }

      res.json({
        question: question.trim(),
        operation: plan.operation,
        answer,
        data,
        model: result.model || process.env.OPENROUTER_MODEL
      });

    } catch (error) {
      console.error('AI query failed:', error.message);
      res.status(502).json({
        error: 'AI query could not be completed'
      });
    }
  });

  return router;
}

module.exports = createAiRouter;
