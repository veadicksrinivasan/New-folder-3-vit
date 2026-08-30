const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sendSecurityEvent } = require('../services/securityEventService');
const { verifyToken, getClientIp } = require('../middleware/authMiddleware');

// GET /api/students
router.get('/', verifyToken, (req, res) => {
  db.all("SELECT * FROM students ORDER BY student_id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST /api/students (Create Student)
router.post('/', verifyToken, (req, res) => {
  const { student_id, name, department, year, email } = req.body;

  if (!student_id || !name || !department || !year) {
    return res.status(400).json({ message: 'Missing required student fields' });
  }

  const query = "INSERT INTO students (student_id, name, department, year, email) VALUES (?, ?, ?, ?, ?)";
  db.run(query, [student_id, name, department, year, email || ''], function (err) {
    if (err) {
      return res.status(400).json({ message: 'Student ID may already exist or DB error: ' + err.message });
    }

    sendSecurityEvent({
      event_type: 'STUDENT_CREATED',
      username: req.user.username,
      user_role: req.user.role,
      ip_address: getClientIp(req),
      resource: `/students/${student_id}`,
      metadata: { student_id, name, department, year }
    });

    res.status(201).json({ message: 'Student created successfully', student_id });
  });
});

// PUT /api/students/:id (Update Student)
router.put('/:id', verifyToken, (req, res) => {
  const studentId = req.params.id;
  const { name, department, year, email } = req.body;

  const query = "UPDATE students SET name = ?, department = ?, year = ?, email = ? WHERE student_id = ?";
  db.run(query, [name, department, year, email, studentId], function (err) {
    if (err) return res.status(500).json({ message: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    sendSecurityEvent({
      event_type: 'STUDENT_UPDATED',
      username: req.user.username,
      user_role: req.user.role,
      ip_address: getClientIp(req),
      resource: `/students/${studentId}`,
      metadata: { student_id: studentId, updated_fields: { name, department, year, email } }
    });

    res.json({ message: 'Student updated successfully' });
  });
});

// DELETE /api/students/:id (Delete Student)
router.delete('/:id', verifyToken, (req, res) => {
  const studentId = req.params.id;

  db.run("DELETE FROM students WHERE student_id = ?", [studentId], function (err) {
    if (err) return res.status(500).json({ message: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    sendSecurityEvent({
      event_type: 'STUDENT_DELETED',
      username: req.user.username,
      user_role: req.user.role,
      ip_address: getClientIp(req),
      resource: `/students/${studentId}`,
      metadata: { student_id: studentId }
    });

    res.json({ message: `Student ${studentId} deleted successfully` });
  });
});

module.exports = router;
