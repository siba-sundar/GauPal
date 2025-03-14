// routes/product.routes.js
const express = require('express');
const { 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProduct,
  getAllProducts
} = require('../controller/product.controller.js');
const { verifyToken, isFarmer } = require('../middleware/auth.middleware.js');
const { uploadProductImage } = require('../controller/upload.controller.js');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:productId', getProduct);

// Protected routes
router.post('/', verifyToken, isFarmer, createProduct);
router.put('/:productId', verifyToken, isFarmer, updateProduct);
router.delete('/:productId', verifyToken, isFarmer, deleteProduct);
router.post('/:productId/upload', verifyToken, isFarmer, uploadProductImage);

module.exports = router;
