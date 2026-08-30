const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/activities
router.get('/', (req, res) => {
  db.all("SELECT * FROM activities ORDER BY id DESC LIMIT 50", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

module.exports = router;
