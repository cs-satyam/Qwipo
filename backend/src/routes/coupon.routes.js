const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const { validateCoupon } = require('../controllers/coupon.controller');

router.get('/validate', authenticateToken, validateCoupon);

module.exports = router;
