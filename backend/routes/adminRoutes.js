const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sendSecurityEvent } = require('../services/securityEventService');
const { verifyToken, requireAdmin, getClientIp } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(requireAdmin);

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', (req, res) => {
  db.get("SELECT COUNT(*) as total_workers FROM workers", [], (err1, row1) => {
    db.get("SELECT COUNT(*) as total_managers FROM managers", [], (err2, row2) => {
      db.get("SELECT COUNT(*) as present_today FROM attendance WHERE status = 'Present'", [], (err3, row3) => {
        db.get("SELECT AVG(marks) as avg_marks FROM results", [], (err4, row4) => {
          res.json({
            total_workers: row1?.total_workers || 0,
            total_managers: row2?.total_managers || 0,
            present_today: row3?.present_today || 0,
            avg_result: row4?.avg_marks ? Math.round(row4.avg_marks * 10) / 10 : 0
          });
        });
      });
    });
  });
});

// POST /api/admin/system-action
router.post('/system-action', (req, res) => {
  const { action_name, details } = req.body;

  sendSecurityEvent({
    event_type: 'ADMIN_ACTION',
    username: req.user.username,
    user_role: req.user.role,
    ip_address: getClientIp(req),
    resource: '/admin/system-action',
    metadata: {
      action: action_name || 'SYSTEM_MAINTENANCE_EXECUTE',
      details: details || 'Administrative privilege action performed'
    }
  });

  res.json({
    message: `Admin action '${action_name || 'SYSTEM_MAINTENANCE'}' executed successfully`,
    executed_by: req.user.username
  });
});

module.exports = router;
