
const admin = require('firebase-admin');
const db = admin.firestore();

// controllers/product.controller.js
exports.createProduct = async (req, res) => {
    const { name, description, category, price, unit, quantity, organic, harvestDate, expiryDate, location } = req.body;
    const sellerId = req.user.uid; // From auth middleware
  
    try {
      // Verify user is a farmer
      if (req.user.role !== 'farmer') {
        return res.status(403).json({ message: 'Only farmers can create products' });
      }
  
      const productRef = db.collection('products').doc();
      await productRef.set({
        productId: productRef.id,
        sellerId,
        name,
        description,
        category,
        price,
        unit,
        quantity,
        images: [], // Will be updated when images are uploaded
        organic,
        harvestDate: new Date(harvestDate),
        expiryDate: new Date(expiryDate),
        location,
        isAvailable: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
  
      return res.status(201).json({
        message: 'Product created successfully',
        productId: productRef.id
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const updates = req.body;
    const sellerId = req.user.uid; // From auth middleware
  
    try {
      // Check if product exists and belongs to seller
      const productDoc = await db.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (productDoc.data().sellerId !== sellerId) {
        return res.status(403).json({ message: 'You can only update your own products' });
      }
  
      // Add timestamp to updates
      updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  
      await db.collection('products').doc(productId).update(updates);
  
      return res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const sellerId = req.user.uid; // From auth middleware
  
    try {
      // Check if product exists and belongs to seller
      const productDoc = await db.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (productDoc.data().sellerId !== sellerId) {
        return res.status(403).json({ message: 'You can only delete your own products' });
      }
  
      await db.collection('products').doc(productId).delete();
  
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.getProduct = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const productDoc = await db.collection('products').doc(productId).get();
  
      if (!productDoc.exists) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Get seller info
      const productData = productDoc.data();
      const sellerDoc = await db.collection('users').doc(productData.sellerId).get();
      const sellerData = sellerDoc.exists ? sellerDoc.data() : null;
  
      return res.status(200).json({
        ...productData,
        seller: sellerData ? {
          uid: sellerData.uid,
          fullName: sellerData.fullName,
          rating: sellerData.rating
        } : null
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.getAllProducts = async (req, res) => {
    try {
      const { category, minPrice, maxPrice, organic, sortBy, order, limit = 10, page = 1 } = req.query;
  
      let query = db.collection('products').where('isAvailable', '==', true);
  
      if (category) {
        query = query.where('category', '==', category);
      }
  
      if (organic === 'true') {
        query = query.where('organic', '==', true);
      }
  
      const startAt = (page - 1) * limit;
  
      // Execute query
      let snapshot = await query.get();
      let products = [];
  
      snapshot.forEach(doc => {
        products.push(doc.data());
      });
  
      // Handle filtering by price (Firestore doesn't support multiple range filters)
      if (minPrice) {
        products = products.filter(p => p.price >= parseFloat(minPrice));
      }
  
      if (maxPrice) {
        products = products.filter(p => p.price <= parseFloat(maxPrice));
      }
  
      // Handle sorting
      if (sortBy) {
        products.sort((a, b) => {
          if (order === 'desc') {
            return b[sortBy] - a[sortBy];
          }
          return a[sortBy] - b[sortBy];
        });
      }
  
      // Handle pagination
      const paginatedProducts = products.slice(startAt, startAt + parseInt(limit));
  
      return res.status(200).json({
        products: paginatedProducts,
        total: products.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(products.length / limit)
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };