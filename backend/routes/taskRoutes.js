const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/tasks
router.get('/', (req, res) => {
  db.all("SELECT * FROM tasks ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST /api/tasks
router.post('/', (req, res) => {
  const { title, assigned_employee, priority, due_date, status, project_name } = req.body;
  if (!title || !assigned_employee) {
    return res.status(400).json({ message: 'Title and assigned employee required' });
  }

  const query = "INSERT INTO tasks (title, assigned_employee, priority, due_date, status, project_name) VALUES (?, ?, ?, ?, ?, ?)";
  db.run(query, [title, assigned_employee, priority || 'Medium', due_date || '2026-09-15', status || 'To Do', project_name || 'General'], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ id: this.lastID, message: 'Task created' });
  });
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const { title, assigned_employee, priority, due_date, status } = req.body;
  const query = "UPDATE tasks SET title = ?, assigned_employee = ?, priority = ?, due_date = ?, status = ? WHERE id = ?";
  db.run(query, [title, assigned_employee, priority, due_date, status, req.params.id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Task updated' });
  });
});

module.exports = router;
