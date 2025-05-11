const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Create transaction (Cashier-only)
router.post('/', async (req, res) => {
  const { cashierId, items, total } = req.body;
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
router.get('/', async (req, res) => {
  try {
    const transactions = await db.query(`
      SELECT t.*, u.username 
      FROM transactions t
      JOIN users u ON t.cashier_id = u.id
    `);
    res.json(transactions.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;