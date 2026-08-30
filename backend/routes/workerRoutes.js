const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sendSecurityEvent } = require('../services/securityEventService');
const { verifyToken, getClientIp } = require('../middleware/authMiddleware');

// GET /api/workers
router.get('/', verifyToken, (req, res) => {
  db.all("SELECT * FROM workers ORDER BY worker_id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST /api/workers (Create Worker)
router.post('/', verifyToken, (req, res) => {
  const { worker_id, name, department, role_title, email } = req.body;

  if (!worker_id || !name || !department) {
    return res.status(400).json({ message: 'Missing required worker fields' });
  }

  const query = "INSERT INTO workers (worker_id, name, department, role_title, email) VALUES (?, ?, ?, ?, ?)";
  db.run(query, [worker_id, name, department, role_title || 'Technician', email || ''], function (err) {
    if (err) {
      return res.status(400).json({ message: 'Worker ID may already exist or DB error: ' + err.message });
    }

    sendSecurityEvent({
      event_type: 'WORKER_CREATED',
      username: req.user.username,
      user_role: req.user.role,
      ip_address: getClientIp(req),
      resource: `/workers/${worker_id}`,
      metadata: { worker_id, name, department, role_title }
    });

    res.status(201).json({ message: 'Worker created successfully', worker_id });
  });
});

// PUT /api/workers/:id (Update Worker)
router.put('/:id', verifyToken, (req, res) => {
  const workerId = req.params.id;
  const { name, department, role_title, email } = req.body;

  const query = "UPDATE workers SET name = ?, department = ?, role_title = ?, email = ? WHERE worker_id = ?";
  db.run(query, [name, department, role_title, email, workerId], function (err) {
    if (err) return res.status(500).json({ message: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    sendSecurityEvent({
      event_type: 'WORKER_UPDATED',
      username: req.user.username,
      user_role: req.user.role,
      ip_address: getClientIp(req),
      resource: `/workers/${workerId}`,
      metadata: { worker_id: workerId, updated_fields: { name, department, role_title, email } }
    });

    res.json({ message: 'Worker updated successfully' });
  });
});

// DELETE /api/workers/:id (Delete Worker)
router.delete('/:id', verifyToken, (req, res) => {
  const workerId = req.params.id;

  db.run("DELETE FROM workers WHERE worker_id = ?", [workerId], function (err) {
    if (err) return res.status(500).json({ message: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    sendSecurityEvent({
      event_type: 'WORKER_DELETED',
      username: req.user.username,
      user_role: req.user.role,
      ip_address: getClientIp(req),
      resource: `/workers/${workerId}`,
      metadata: { worker_id: workerId }
    });

    res.json({ message: `Worker ${workerId} deleted successfully` });
  });
});

module.exports = router;
