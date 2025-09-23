const admin = require('firebase-admin');
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');

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