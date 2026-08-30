const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/teachers
router.get('/', verifyToken, (req, res) => {
  db.all("SELECT * FROM teachers ORDER BY teacher_id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

module.exports = router;
