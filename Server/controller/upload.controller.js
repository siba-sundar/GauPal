// controllers/upload.controller.js
const admin = require('firebase-admin');
const db = admin.firestore();

exports.uploadProductImage = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.uid; // From auth middleware
  
  try {
    // Check if product exists and belongs to seller
    const productDoc = await db.collection('products').doc(productId).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (productDoc.data().sellerId !== userId) {
      return res.status(403).json({ message: 'You can only upload images to your own products' });
    }
    
    // If no file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    
    // Get the GCS public URL from the middleware
    const imageUrl = req.file.cloudStoragePublicUrl;
    
    // Update product with new image URL
    await productDoc.ref.update({
      images: admin.firestore.FieldValue.arrayUnion(imageUrl),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({ 
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  const userId = req.user.uid; // From auth middleware
  
  try {
    // If no file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    
    // Get the GCS public URL from the middleware
    const imageUrl = req.file.cloudStoragePublicUrl;
    
    // Update user with new profile picture URL
    await db.collection('users').doc(userId).update({
      profilePicture: imageUrl,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({ 
      message: 'Profile picture uploaded successfully',
      imageUrl
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.uploadMultipleProductImages = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.uid; // From auth middleware
  
  try {
    // Check if product exists and belongs to seller
    const productDoc = await db.collection('products').doc(productId).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (productDoc.data().sellerId !== userId) {
      return res.status(403).json({ message: 'You can only upload images to your own products' });
    }
    
    // If no files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }
    
    // Get the GCS public URLs from the middleware
    const imageUrls = req.files.map(file => file.cloudStoragePublicUrl);
    
    // Update product with new image URLs
    await productDoc.ref.update({
      images: admin.firestore.FieldValue.arrayUnion(...imageUrls),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({ 
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.uploadReviewImages = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.uid; // From auth middleware
  
  try {
    // Check if review exists and belongs to user
    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    
    if (!reviewDoc.exists) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (reviewDoc.data().reviewerId !== userId) {
      return res.status(403).json({ message: 'You can only upload images to your own reviews' });
    }
    
    // If no files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }
    
    // Get the GCS public URLs from the middleware
    const imageUrls = req.files.map(file => file.cloudStoragePublicUrl);
    
    // Update review with new image URLs
    await reviewDoc.ref.update({
      images: admin.firestore.FieldValue.arrayUnion(...imageUrls),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({ 
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};