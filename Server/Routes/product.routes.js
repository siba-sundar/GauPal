// routes/product.routes.js
const express = require('express');
const { 

  getProduct,
  getAllProducts
} = require('../controller/product.controller.js');
const { verifyToken, isFarmer } = require('../middleware/auth.middleware.js');
// const { uploadProductImage } = require('../controller/upload.controller.js');
const uploadImage  = require('../utils/upload.utils.js')

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:productId', getProduct);


module.exports = router;
