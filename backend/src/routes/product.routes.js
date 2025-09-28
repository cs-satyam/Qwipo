const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/product.controller');
const authenticateToken = require('../middleware/auth.middleware');
const { isRetailer } = require('../middleware/role.middleware');

const router = express.Router();

// Public read endpoints
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/mine/list', authenticateToken, isRetailer, getMyProducts);

// Authenticated write endpoints (reserved for retailers/admins if role middleware is added)
router.post('/', authenticateToken, isRetailer, createProduct);
router.put('/:id', authenticateToken, isRetailer, updateProduct);
router.delete('/:id', authenticateToken, isRetailer, deleteProduct);

module.exports = router;
