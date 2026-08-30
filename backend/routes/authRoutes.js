const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const VALID_USERNAME = 'helloVIT';
const VALID_PASSWORD = 'hi@vit';

const roleProfile = (selectedRole) => {
  const isAdmin = selectedRole === 'admin';
  return {
    role: isAdmin ? 'admin' : 'developer',
    title: isAdmin ? 'IT Director' : 'Senior Software Engineer',
    department: isAdmin ? 'Management' : 'Engineering'
  };
};

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, username, name, password, role } = req.body;
  const loginName = String(username || email || name || '').trim();
  const selectedRole = role === 'admin' ? 'admin' : 'developer';

  if (!loginName || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (loginName !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const profile = roleProfile(selectedRole);

  db.get(
    'SELECT * FROM users WHERE email = ? OR name = ? LIMIT 1',
    [loginName, loginName],
    async (err, row) => {
      let passwordOk = true;
      if (!err && row && row.password) {
        passwordOk = await bcrypt.compare(password, row.password);
      }

      if (!passwordOk) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = {
        id: row?.id || 1,
        email: VALID_USERNAME,
        name: VALID_USERNAME,
        username: VALID_USERNAME,
        ...profile
      };

      const token = jwt.sign(
        user,
        process.env.JWT_SECRET || 'nexacore_technologies_secret_key_2026',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Access granted',
        token,
        user
      });
    }
  );
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  res.json({ message: 'Password reset request received' });
});

module.exports = router;
