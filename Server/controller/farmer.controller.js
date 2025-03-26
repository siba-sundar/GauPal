
const admin = require('firebase-admin');
const db = admin.firestore();

const { v4: uuidv4 } = require('uuid');

exports.createProduct = async (req, res) => {
  const bucket = req.app.locals.bucket;
  const { name, description, category, price, unit, quantity, organic, harvestDate, expiryDate, location } = req.body;
  const sellerId = req.user.uid; // From auth middleware

  try {
    // Verify user is a farmer
    if (req.user.userType !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can create products' });
    }

    // Create a product document first
    const productRef = db.collection('products').doc();
    const productId = productRef.id;

    // Upload images if any
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const fileName = `product-images/${productId}/${uuidv4()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);

        // Upload the file to storage
        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
        });

        // Make the file publicly accessible
        await fileUpload.makePublic();

        // Get the public URL
        const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        imageUrls.push(url);
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
    }

    // Validate and parse dates
    const parsedHarvestDate = harvestDate ? new Date(harvestDate) : null;
    const parsedExpiryDate = expiryDate ? new Date(expiryDate) : null;

    if (parsedHarvestDate && isNaN(parsedHarvestDate.getTime())) {
      return res.status(400).json({ message: 'Invalid harvestDate format. Please provide a valid date.' });
    }

    if (parsedExpiryDate && isNaN(parsedExpiryDate.getTime())) {
      return res.status(400).json({ message: 'Invalid expiryDate format. Please provide a valid date.' });
    }

    // Now add the product with image URLs
    await productRef.set({
      productId,
      sellerId,
      name,
      description,
      category,
      price: parseFloat(price),
      unit,
      quantity: parseInt(quantity),
      images: imageUrls, // Store the image URLs
      organic: organic === 'true',
      harvestDate: parsedHarvestDate ? admin.firestore.Timestamp.fromDate(parsedHarvestDate) : null,
      expiryDate: parsedExpiryDate ? admin.firestore.Timestamp.fromDate(parsedExpiryDate) : null,
      location,
      isAvailable: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      message: 'Product created successfully',
      productId,
      images: imageUrls,
    });
  } catch (error) {
    console.error('Error creating product:', error);
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

    // Validate and parse dates if provided
    if (updates.harvestDate) {
      const parsedHarvestDate = new Date(updates.harvestDate);
      if (isNaN(parsedHarvestDate.getTime())) {
        return res.status(400).json({ message: 'Invalid harvestDate format. Please provide a valid date.' });
      }
      updates.harvestDate = admin.firestore.Timestamp.fromDate(parsedHarvestDate);
    }

    if (updates.expiryDate) {
      const parsedExpiryDate = new Date(updates.expiryDate);
      if (isNaN(parsedExpiryDate.getTime())) {
        return res.status(400).json({ message: 'Invalid expiryDate format. Please provide a valid date.' });
      }
      updates.expiryDate = admin.firestore.Timestamp.fromDate(parsedExpiryDate);
    }

    // Add timestamp to updates
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection('products').doc(productId).update(updates);

    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
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
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Product Controllers
exports.getProductsByFarmer = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or userId not available"
      });
    }

    const productsRef = db.collection('products');
    const snapshot = await productsRef.where('sellerId', '==', req.user.uid).get();
    
    if (snapshot.empty) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching farmer products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productDoc = await db.collection('products').doc(req.params.productId).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: productDoc.id,
        ...productDoc.data()
      }
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: error.message
    });
  }
};