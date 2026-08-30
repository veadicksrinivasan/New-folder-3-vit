const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/customers
router.get('/', (req, res) => {
  db.all("SELECT * FROM customers ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

module.exports = router;
