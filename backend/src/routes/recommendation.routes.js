const express = require('express');
const {
  getUserRecommendations,
  generateRecommendations,
  createRecommendation,
  deleteRecommendation,
} = require('../controllers/recommendation.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

// Get recommendations for logged-in user
router.get('/', authenticateToken, getUserRecommendations);

// Generate new recommendations based on user history
router.post('/generate', authenticateToken, generateRecommendations);

// Create manual recommendation (admin function)
router.post('/', authenticateToken, createRecommendation);

// Delete recommendation
router.delete('/:id', authenticateToken, deleteRecommendation);

module.exports = router;
