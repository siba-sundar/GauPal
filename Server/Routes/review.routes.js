// routes/review.routes.js
const express = require('express');
const { 
  createReview,
  getProductReviews
} = require('../controller/review.controller.js');
const { verifyToken, isBuyer } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', verifyToken, isBuyer, createReview);

module.exports = router;