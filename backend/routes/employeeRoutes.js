const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/employees
router.get('/', (req, res) => {
  db.all("SELECT * FROM employees ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST /api/employees
router.post('/', (req, res) => {
  const { name, department, position, email, status, phone } = req.body;
  if (!name || !department || !email) {
    return res.status(400).json({ message: 'Name, department, and email required' });
  }

  const query = "INSERT INTO employees (name, department, position, email, status, phone) VALUES (?, ?, ?, ?, ?, ?)";
  db.run(query, [name, department, position || 'Software Engineer', email, status || 'Active', phone || '+1 (555) 000-0000'], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ id: this.lastID, message: 'Employee added' });
  });
});

module.exports = router;
