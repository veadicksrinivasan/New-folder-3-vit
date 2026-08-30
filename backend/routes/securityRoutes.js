const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sendSecurityEvent } = require('../services/securityEventService');
const { getClientIp } = require('../middleware/authMiddleware');

// GET /api/security/events (List recent security events)
router.get('/events', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  db.all(
    "SELECT * FROM security_events ORDER BY timestamp DESC LIMIT ?",
    [limit],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      
      const events = rows.map(r => ({
        ...r,
        metadata: r.metadata ? JSON.parse(r.metadata) : {}
      }));
      res.json(events);
    }
  );
});

// POST /api/security/simulate-bruteforce (Demo 1 Helper: Fire 5x LOGIN_FAILED events)
router.post('/simulate-bruteforce', async (req, res) => {
  const targetUsername = req.body.username || 'admin';
  const ipAddress = getClientIp(req);

  const results = [];
  for (let i = 1; i <= 5; i++) {
    const result = await sendSecurityEvent({
      event_type: 'LOGIN_FAILED',
      username: targetUsername,
      user_role: 'admin',
      ip_address: ipAddress,
      resource: '/login',
      metadata: {
        attempt_number: i,
        simulation: true,
        reason: 'Incorrect password (Simulated)'
      }
    });
    results.push(result);
  }

  res.json({
    message: `Generated 5 LOGIN_FAILED events for user '${targetUsername}' to simulate brute-force attack for ZentraSec analysis`,
    events: results
  });
});

// POST /api/security/manual-event (Trigger any event type manually for testing)
router.post('/manual-event', async (req, res) => {
  const { event_type, username, user_role, resource, metadata } = req.body;
  
  if (!event_type) {
    return res.status(400).json({ message: 'event_type is required' });
  }

  const result = await sendSecurityEvent({
    event_type,
    username: username || 'demo_user',
    user_role: user_role || 'teacher',
    ip_address: getClientIp(req),
    resource: resource || '/manual-test',
    metadata: metadata || { test: true }
  });

  res.json({
    message: `Event '${event_type}' generated successfully`,
    event: result
  });
});

module.exports = router;
