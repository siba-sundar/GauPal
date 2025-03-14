// routes/dashboard.routes.js
const express = require('express');
const { 
  getFarmerDashboard,
  getBuyerDashboard
} = require('../controller/dashboard.controller.js');
const { verifyToken, isFarmer, isBuyer } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Protected routes
router.get('/farmer', verifyToken, isFarmer, getFarmerDashboard);
router.get('/buyer', verifyToken, isBuyer, getBuyerDashboard);

module.exports = router;
