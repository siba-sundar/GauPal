// routes/upload.routes.js
const express = require('express');
const { 
  uploadProfilePicture, 
  uploadProductImage, 
  uploadMultipleProductImages,
  uploadReviewImages
} = require('../controller/upload.controller');
const { verifyToken, isFarmer, isBuyer } = require('../middleware/auth.middleware');
const { upload, uploadToGcs } = require('../config/storage');

const router = express.Router();

// Profile picture upload route
router.post(
  '/profile-picture', 
  verifyToken, 
  upload.single('image'), 
  uploadToGcs('profile-pictures'), 
  uploadProfilePicture
);

// Single product image upload route
router.post(
  '/products/:productId/image', 
  verifyToken, 
  isFarmer, 
  upload.single('image'), 
  uploadToGcs('product-images'), 
  uploadProductImage
);

// Multiple product images upload route
router.post(
  '/products/:productId/images', 
  verifyToken, 
  isFarmer, 
  upload.array('images', 5), // Allow up to 5 images at once
  (req, res, next) => {
    // Process each file individually
    if (!req.files || req.files.length === 0) return next();
    
    // Track completion for all files
    const promises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        // Create a mock request with a single file
        const mockReq = {
          file: file
        };
        
        // Create a mock response
        const mockRes = {
          on: (event, callback) => {
            if (event === 'end') {
              resolve();
            }
          }
        };
        
        // Create a mock next function
        const mockNext = (err) => {
          if (err) return reject(err);
          resolve();
        };
        
        // Upload to GCS
        uploadToGcs('product-images')(mockReq, mockRes, mockNext);
        
        // Update the original file with cloudStoragePublicUrl
        req.files[index] = mockReq.file;
      });
    });
    
    // Wait for all uploads to complete
    Promise.all(promises)
      .then(() => next())
      .catch(err => next(err));
  },
  uploadMultipleProductImages
);

// Review images upload route
router.post(
  '/reviews/:reviewId/images', 
  verifyToken, 
  isBuyer, 
  upload.array('images', 3), // Allow up to 3 images per review
  (req, res, next) => {
    // Process each file individually
    if (!req.files || req.files.length === 0) return next();
    
    // Track completion for all files
    const promises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        // Create a mock request with a single file
        const mockReq = {
          file: file
        };
        
        // Create a mock response
        const mockRes = {
          on: (event, callback) => {
            if (event === 'end') {
              resolve();
            }
          }
        };
        
        // Create a mock next function
        const mockNext = (err) => {
          if (err) return reject(err);
          resolve();
        };
        
        // Upload to GCS
        uploadToGcs('review-images')(mockReq, mockRes, mockNext);
        
        // Update the original file with cloudStoragePublicUrl
        req.files[index] = mockReq.file;
      });
    });
    
    // Wait for all uploads to complete
    Promise.all(promises)
      .then(() => next())
      .catch(err => next(err));
  },
  uploadReviewImages
);

module.exports = router;