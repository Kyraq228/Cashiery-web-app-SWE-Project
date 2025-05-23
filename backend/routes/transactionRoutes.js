const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authMiddleware, adminAuth } = require('../middleware/authMiddleware');


// Create transaction (Cashier-only)
router.post('/', authMiddleware, async (req, res) => {
  const { items, total } = req.body;
  const cashierId = req.user.id; // Always use authenticated user id

  try {
    // Insert transaction
    const transaction = await db.query(
      'INSERT INTO transactions (cashier_id, total) VALUES ($1, $2) RETURNING *',
      [cashierId, total]
    );

    // Update stock for each item
    for (const item of items) {
      await db.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }

    res.status(201).json(transaction.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Transaction failed' });
  }
});
// Get all transactions (Admin-only)
router.get('/', authMiddleware, adminAuth, async (req, res) => { // Add authMiddleware
  try {
    const transactions = await db.query(`
      SELECT t.*, u.username 
      FROM transactions t
      JOIN users u ON t.cashier_id = u.id
      ORDER BY t.timestamp
    `);
    res.json(transactions.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Sales summary (Admin-only)
router.get('/summary', authMiddleware, adminAuth, async (req, res) => {
  try {
    // Use date from query param, or default to today
    const dateParam = req.query.date;
    let dateStr;
    if (dateParam) {
      dateStr = dateParam;
    } else {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateStr = `${yyyy}-${mm}-${dd}`;
    }

    const summary = await db.query(
      `SELECT 
         SUM(total) AS "totalSales", 
         COUNT(*) AS "transactionCount"
       FROM transactions
       WHERE DATE("timestamp") = $1`,
      [dateStr]
    );

    res.json(summary.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get sales summary' });
  }
});

module.exports = router;