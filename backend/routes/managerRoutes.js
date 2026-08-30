const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/managers
router.get('/', verifyToken, (req, res) => {
  db.all("SELECT * FROM managers ORDER BY manager_id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

module.exports = router;
