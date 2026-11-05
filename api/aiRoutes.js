const express = require('express');

function createAiRouter(db, authenticateToken) {
  const router = express.Router();

  const schemas = {
    products: ['name', 'category', 'price', 'stock'],
    orders: [
      'customerName', 'product', 'quantity',
      'collectionDate', 'orderStatus', 'paymentStatus'
    ]
  };

  const allowedOperators = ['$eq', '$gte', '$lte'];

  router.post('/query', authenticateToken, async (req, res) => {
    const question = req.body?.question;

    if (typeof question !== 'string' ||
        !question.trim() || question.length > 500) {
      return res.status(400).json({
        error: 'Question must contain 1–500 characters'
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({
        error: 'OpenRouter is not configured'
      });
    }

    try {
      const aiResponse = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: process.env.OPENROUTER_MODEL || 'openrouter/free',
            temperature: 0,
            max_tokens: 400,
            messages: [
              {
                role: 'system',
                content: `You convert questions into read-only MongoDB query plans.
Return ONLY a JSON object with:
{"collection":"products|orders","operation":"find|count","filter":{}}

Database schemas:
products: name (string), category (string), price (number), stock (number)
orders: customerName (string), product (string), quantity (number),
collectionDate (YYYY-MM-DD string), orderStatus (string),
paymentStatus (string)

Order statuses: Order Received, Processing,
Ready for Collection, Completed, Cancelled.
Payment statuses: Pending, Paid.

Allowed filters: direct field equality or
{"$eq":value}, {"$gte":number}, {"$lte":number}.
Multiple fields mean AND.
Do not use $where, $regex, $or, aggregation, JavaScript,
updates, deletions, or invented fields.
Use an empty filter for all records.
If the question cannot be answered with this schema,
return {"collection":"unsupported","operation":"unsupported","filter":{}}.
Return no markdown or explanation.`
              },
              {
                role: 'user',
                content: question.trim()
              }
            ]
          }),
          signal: AbortSignal.timeout(30000)
        }
      );

      if (!aiResponse.ok) {
        return res.status(502).json({
          error: 'AI provider request failed'
        });
      }

      const aiResult = await aiResponse.json();
      const content = aiResult.choices?.[0]?.message?.content;

      if (typeof content !== 'string') {
        return res.status(502).json({
          error: 'AI returned no query'
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
          error: 'AI returned invalid JSON'
        });
      }

      if (!plan || typeof plan !== 'object' ||
          Array.isArray(plan) ||
          !Object.hasOwn(schemas, plan.collection) ||
          !['find', 'count'].includes(plan.operation) ||
          !plan.filter ||
          typeof plan.filter !== 'object' ||
          Array.isArray(plan.filter)) {
        return res.status(400).json({
          error: 'Unsupported AI query'
        });
      }

      const safeFilter = {};

      for (const [field, condition] of Object.entries(plan.filter)) {
        if (!schemas[plan.collection].includes(field)) {
          return res.status(400).json({
            error: 'AI requested an invalid field'
          });
        }

        const numericFields = ['price', 'stock', 'quantity'];
        const numeric = numericFields.includes(field);

        if (condition !== null &&
            typeof condition === (numeric ? 'number' : 'string')) {
          if (numeric && !Number.isFinite(condition)) {
            return res.status(400).json({ error: 'Invalid numeric value' });
          }
          safeFilter[field] = condition;
          continue;
        }

        if (!condition || typeof condition !== 'object' ||
            Array.isArray(condition) ||
            Object.keys(condition).length !== 1) {
          return res.status(400).json({
            error: 'Invalid query condition'
          });
        }

        const [operator, value] = Object.entries(condition)[0];

        if (!allowedOperators.includes(operator) ||
            (!numeric && operator !== '$eq') ||
            typeof value !== (numeric ? 'number' : 'string') ||
            (numeric && !Number.isFinite(value))) {
          return res.status(400).json({
            error: 'Unsafe or invalid query condition'
          });
        }

        safeFilter[field] = { [operator]: value };
      }

      const collection = db.collection(plan.collection);
      let data;

      if (plan.operation === 'count') {
        data = {
          count: await collection.countDocuments(safeFilter)
        };
      } else {
        data = await collection.find(safeFilter, {
          projection: { _id: 0 }
        }).limit(50).toArray();
      }

      res.json({
        question: question.trim(),
        generatedQuery: {
          collection: plan.collection,
          operation: plan.operation,
          filter: safeFilter
        },
        data,
        model: aiResult.model || process.env.OPENROUTER_MODEL
      });
    } catch (error) {
      console.error('AI query failed:', error.message);
      res.status(502).json({
        error: 'AI query failed'
      });
    }
  });

  return router;
}

module.exports = createAiRouter;
