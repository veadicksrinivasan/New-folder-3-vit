const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { reportFileAccess, reportFileDownload } = require('../zentraSecConnector');

// GET /api/documents
router.get('/', (req, res) => {
  db.all("SELECT * FROM documents ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    reportFileAccess(req, { resource: '/api/documents', metadata: { action: 'list' } });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!row) return res.status(404).json({ message: 'Document not found' });
    reportFileAccess(req, {
      resource: `/api/documents/${req.params.id}`,
      metadata: { document_id: row.id, document_name: row.name, action: 'view' }
    });
    res.json(row);
  });
});

router.get('/:id/download', (req, res) => {
  db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!row) return res.status(404).json({ message: 'Document not found' });
    reportFileDownload(req, {
      resource: `/api/documents/${req.params.id}/download`,
      metadata: { document_id: row.id, document_name: row.name }
    });
    res.json({ message: 'Download started', document: row });
  });
});

// POST /api/documents
router.post('/', (req, res) => {
  const { name, category, owner, size } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: 'Document name and category required' });
  }

  const query = "INSERT INTO documents (name, category, owner, last_modified, size) VALUES (?, ?, ?, ?, ?)";
  const today = new Date().toISOString().split('T')[0];
  db.run(query, [name, category, owner || 'Alex Johnson', today, size || '1.2 MB'], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ id: this.lastID, message: 'Document uploaded' });
  });
});

module.exports = router;
