const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only .doc and .docx files
  const allowedMimes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .doc and .docx files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Ensure document_path column exists in projects table
db.run(`
  ALTER TABLE projects ADD COLUMN document_path TEXT;
`, (err) => {
  // Column might already exist, so we ignore errors
});

// GET /api/projects
router.get('/', (req, res) => {
  db.all("SELECT * FROM projects ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST /api/projects
router.post('/', upload.single('document'), (req, res) => {
  const { name, manager, team_count, start_date, deadline, progress, status, description } = req.body;
  const documentPath = req.file ? req.file.path : null;

  if (!name || !manager || !deadline) {
    return res.status(400).json({ message: 'Project name, manager, and deadline are required' });
  }

  const query = "INSERT INTO projects (name, manager, team_count, start_date, deadline, progress, status, description, document_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(query, [name, manager, team_count || 1, start_date || new Date().toISOString().split('T')[0], deadline, progress || 0, status || 'Active', description || '', documentPath], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ id: this.lastID, message: 'Project created successfully', document: documentPath ? req.file.filename : null });
  });
});

// PUT /api/projects/:id
router.put('/:id', upload.single('document'), (req, res) => {
  const { name, manager, team_count, deadline, progress, status, description } = req.body;
  const documentPath = req.file ? req.file.path : null;
  
  let query = "UPDATE projects SET name = ?, manager = ?, team_count = ?, deadline = ?, progress = ?, status = ?, description = ?";
  let params = [name, manager, team_count, deadline, progress, status, description, req.params.id];
  
  if (documentPath) {
    query += ", document_path = ?";
    params.splice(-1, 0, documentPath);
  }
  
  query += " WHERE id = ?";
  
  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Project updated successfully' });
  });
});

module.exports = router;
