const express = require('express');
const {
    createOrder, getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require('../controllers/order.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();


router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id', authenticateToken, updateOrder);
router.delete('/:id', authenticateToken, deleteOrder);

module.exports = router;
