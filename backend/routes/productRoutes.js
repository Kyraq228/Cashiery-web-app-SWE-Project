const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { adminAuth } = require('../middleware/authMiddleware');

// Get all products (Cashier/Admin)
router.get('/', async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products');
    res.json(products.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (Admin-only)
router.post('/', adminAuth, async (req, res) => {
  const { name, price, stock, SKU } = req.body;
  try {
    await db.query(
      'INSERT INTO products (name, price, stock, SKU) VALUES ($1, $2, $3, $4)',
      [name, price, stock, SKU]
    );
    res.status(201).json({ message: 'Product added' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid SKU or missing fields' });
  }
});

// Update product stock/price (Admin-only)
router.put('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { price, stock } = req.body;
  try {
    await db.query(
      'UPDATE products SET price = $1, stock = $2 WHERE id = $3',
      [price, stock, id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;