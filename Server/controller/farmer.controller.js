
const admin = require('firebase-admin');
const db = admin.firestore();

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