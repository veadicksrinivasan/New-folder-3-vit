const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/developer/repositories
router.get('/repositories', (req, res) => {
  db.all("SELECT * FROM repositories ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

module.exports = router;
