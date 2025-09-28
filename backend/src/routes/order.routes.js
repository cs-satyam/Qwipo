const express = require('express');
const {
    createOrder, getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getSalesOrders,
} = require('../controllers/order.controller');
const authenticateToken = require('../middleware/auth.middleware');
const { isRetailer } = require('../middleware/role.middleware');

const router = express.Router();


router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id', authenticateToken, updateOrder);
router.delete('/:id', authenticateToken, deleteOrder);
router.get('/retailer/sales', authenticateToken, isRetailer, getSalesOrders);

module.exports = router;
