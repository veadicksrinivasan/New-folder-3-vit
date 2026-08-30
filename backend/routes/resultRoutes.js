const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sendSecurityEvent } = require('../services/securityEventService');
const { verifyToken, getClientIp } = require('../middleware/authMiddleware');

// Helper to determine grade
const calculateGrade = (marks) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
};

// GET /api/results
router.get('/', verifyToken, (req, res) => {
  db.all("SELECT * FROM results ORDER BY student_id ASC, subject ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// PUT /api/results/:id (Modify Result)
router.put('/:id', verifyToken, (req, res) => {
  const resultId = req.params.id;
  const newMarks = parseInt(req.body.marks, 10);

  if (isNaN(newMarks) || newMarks < 0 || newMarks > 100) {
    return res.status(400).json({ message: 'Marks must be a valid number between 0 and 100' });
  }

  db.get("SELECT * FROM results WHERE id = ?", [resultId], (err, record) => {
    if (err || !record) {
      return res.status(404).json({ message: 'Result record not found' });
    }

    const oldMarks = record.marks;
    const newGrade = calculateGrade(newMarks);

    db.run(
      "UPDATE results SET marks = ?, grade = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newMarks, newGrade, req.user.username, resultId],
      function (updateErr) {
        if (updateErr) return res.status(500).json({ message: updateErr.message });

        // Generate RESULT_MODIFIED event
        sendSecurityEvent({
          event_type: 'RESULT_MODIFIED',
          username: req.user.username,
          user_role: req.user.role,
          ip_address: getClientIp(req),
          resource: `/results/${record.student_id}/${record.subject}`,
          metadata: {
            result_id: resultId,
            student_id: record.student_id,
            student_name: record.student_name,
            subject: record.subject,
            old_marks: oldMarks,
            new_marks: newMarks,
            old_grade: record.grade,
            new_grade: newGrade
          }
        });

        res.json({
          message: `Marks updated for ${record.student_name} (${record.subject}): ${oldMarks} → ${newMarks}`,
          record: { ...record, marks: newMarks, grade: newGrade }
        });
      }
    );
  });
});

// DELETE /api/results/:id (Delete Result)
router.delete('/:id', verifyToken, (req, res) => {
  const resultId = req.params.id;

  db.get("SELECT * FROM results WHERE id = ?", [resultId], (err, record) => {
    if (err || !record) {
      return res.status(404).json({ message: 'Result record not found' });
    }

    db.run("DELETE FROM results WHERE id = ?", [resultId], function (deleteErr) {
      if (deleteErr) return res.status(500).json({ message: deleteErr.message });

      sendSecurityEvent({
        event_type: 'RESULT_DELETED',
        username: req.user.username,
        user_role: req.user.role,
        ip_address: getClientIp(req),
        resource: `/results/${record.student_id}/${record.subject}`,
        metadata: {
          result_id: resultId,
          student_id: record.student_id,
          subject: record.subject
        }
      });

      res.json({ message: 'Result deleted successfully' });
    });
  });
});

module.exports = router;
