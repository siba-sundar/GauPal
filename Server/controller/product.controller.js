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
        rating: sellerData.rating,
      } : null,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
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
      totalPages: Math.ceil(products.length / limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: error.message });
  }
};