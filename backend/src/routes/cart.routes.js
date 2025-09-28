const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cart.controller');

router.use(authenticateToken);
router.get('/', getCart);
router.post('/add', addItem);
router.put('/item', updateItem);
router.delete('/item/:productId', removeItem);
router.delete('/clear', clearCart);

module.exports = router;
