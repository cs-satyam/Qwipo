const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require('../controllers/auth.controller');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Must have 'Bearer <token>'

  if (!token) return res.status(401).json({ message: 'No token provided' });

  if (tokenBlacklist.includes(token)) {
    return res.status(403).json({ message: 'Token invalidated. Please login again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticateToken;
