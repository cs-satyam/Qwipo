const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.post('/', authenticateToken, createProduct);
router.get('/', authenticateToken, getProducts);
router.get('/:id', authenticateToken, getProductById);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;
