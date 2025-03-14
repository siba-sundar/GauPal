// routes/order.routes.js
const express = require('express');
const { 
  createOrder, 
  getOrder, 
  updateOrderStatus,
  getUserOrders
} = require('../controller/order.controller');
const { verifyToken, isBuyer, isFarmer } = require('../middleware/auth.middleware');

const router = express.Router();

// Protected routes
router.post('/', verifyToken, isBuyer, createOrder);
router.get('/:orderId', verifyToken, getOrder);
router.put('/:orderId/status', verifyToken, isFarmer, updateOrderStatus);
router.get('/', verifyToken, getUserOrders);

module.exports = router;