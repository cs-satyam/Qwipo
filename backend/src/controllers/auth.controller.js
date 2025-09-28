const authService = require('../services/auth.service');

// In-memory token blacklist
let tokenBlacklist = [];

async function register(req, res) {
  const { name, email, password } = req.body;
  try {
    const { token, user } = await authService.registerUser(name, email, password);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const { token, user } = await authService.loginUser(email, password);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

function logout(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });

  tokenBlacklist.push(token);
  res.json({ message: 'Logged out successfully' });
}

module.exports = { register, login, logout, tokenBlacklist };
