const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const customerRoutes = require('./routes/customerRoutes');
const documentRoutes = require('./routes/documentRoutes');
const devRoutes = require('./routes/devRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
let PORT = parseInt(process.env.PORT, 10) || 5001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/developer', devRoutes);
app.use('/api/activities', activityRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    company: 'NexaCore Technologies',
    tagline: 'Building Digital Solutions for a Smarter Future',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if present
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.'
  });
});

// Start server with automatic port fallback logic if initial port is occupied
function startServer(portToTry) {
  const server = app.listen(portToTry, () => {
    console.log(`====================================================`);
    console.log(`🚀 NexaCore Technologies Server Running on Port ${portToTry}`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Port Warning] Port ${portToTry} is occupied. Retrying on port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('[Server Error]', err);
    }
  });
}

startServer(PORT);
