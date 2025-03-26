// routes/product.routes.js
const express = require('express');

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByFarmer,
  getProductById
} = require('../controller/farmer.controller.js')


const { verifyToken, isFarmer } = require('../middleware/auth.middleware.js');
// const { uploadProductImage } = require('../controller/upload.controller.js');
const uploadImage = require('../utils/upload.utils.js')

const router = express.Router();


// Protected routes
router.post('/add-product', verifyToken, isFarmer, uploadImage.productImages, createProduct);
router.put('/:productId', verifyToken, isFarmer, updateProduct);
router.delete('/:productId', verifyToken, isFarmer, deleteProduct);
router.get('/farmer-products', verifyToken, isFarmer, getProductsByFarmer);
router.get('/:productId', getProductById);

module.exports = router;
