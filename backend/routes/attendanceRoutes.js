const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sendSecurityEvent } = require('../services/securityEventService');
const { verifyToken, getClientIp } = require('../middleware/authMiddleware');

// GET /api/attendance
router.get('/', verifyToken, (req, res) => {
  db.all("SELECT * FROM attendance ORDER BY date DESC, student_id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// PUT /api/attendance/:id (Modify Attendance)
router.put('/:id', verifyToken, (req, res) => {
  const attendanceId = req.params.id;
  const { new_status } = req.body;

  if (!new_status || !['Present', 'Absent', 'Late', 'Excused'].includes(new_status)) {
    return res.status(400).json({ message: 'Invalid attendance status' });
  }

  // Fetch old attendance status first
  db.get("SELECT * FROM attendance WHERE id = ?", [attendanceId], (err, record) => {
    if (err || !record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    const old_status = record.status;
    const student_id = record.student_id;
    const student_name = record.student_name;

    db.run(
      "UPDATE attendance SET status = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [new_status, req.user.username, attendanceId],
      function (updateErr) {
        if (updateErr) return res.status(500).json({ message: updateErr.message });

        // Generate ATTENDANCE_MODIFIED event
        sendSecurityEvent({
          event_type: 'ATTENDANCE_MODIFIED',
          username: req.user.username,
          user_role: req.user.role,
          ip_address: getClientIp(req),
          resource: `/attendance/${student_id}`,
          metadata: {
            attendance_id: attendanceId,
            student_id: student_id,
            student_name: student_name,
            old_status: old_status,
            new_status: new_status
          }
        });

        res.json({
          message: `Attendance updated for ${student_name} from ${old_status} to ${new_status}`,
          record: { ...record, status: new_status }
        });
      }
    );
  });
});

module.exports = router;
