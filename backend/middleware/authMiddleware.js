const jwt = require('jsonwebtoken');
const { sendSecurityEvent } = require('../services/securityEventService');

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'zentrasec_school_portal_secret_key_2026', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    req.clientIp = getClientIp(req);
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    // Generate UNAUTHORIZED_ACCESS event
    sendSecurityEvent({
      event_type: 'UNAUTHORIZED_ACCESS',
      username: req.user.username,
      user_role: req.user.role,
      ip_address: getClientIp(req),
      resource: req.originalUrl,
      metadata: {
        attempted_action: req.method + ' ' + req.originalUrl,
        reason: 'Role restriction: Requires admin role'
      }
    });

    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access Denied: Only Administrator users can access this resource.'
    });
  }

  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
  getClientIp
};
