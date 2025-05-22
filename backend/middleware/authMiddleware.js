const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { JWT_SECRET } = process.env;

// Middleware to validate JWT token and attach user role to the request
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user ID and role to the request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to restrict access to admins only
// authMiddleware.js
const adminAuth = (req, res, next) => {
  console.log('User Role:', req.user?.role); // <-- Add this line
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { authMiddleware, adminAuth };