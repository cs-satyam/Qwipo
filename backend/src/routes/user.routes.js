const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  deleteUserAccount,
  upgradeToRetailer,
} = require('../controllers/user.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

// User profile routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.put('/change-password', authenticateToken, changePassword);
router.delete('/account', authenticateToken, deleteUserAccount);

// Admin routes (you may want to add admin middleware later)
router.get('/all', authenticateToken, getAllUsers);

// Upgrade to retailer
router.post('/upgrade-retailer', authenticateToken, upgradeToRetailer);

module.exports = router;
