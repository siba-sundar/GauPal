
const admin = require('firebase-admin');
const db = admin.firestore();


// controllers/dashboard.controller.js
exports.getFarmerDashboard = async (req, res) => {
    const userId = req.user.uid; // From auth middleware
  
    try {
      // Verify user is a farmer
      const userDoc = await db.collection('users').doc(userId).get();
  
      if (!userDoc.exists || userDoc.data().userType !== 'farmer') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Get total products
      const productsSnapshot = await db.collection('products')
        .where('sellerId', '==', userId)
        .get();
  
      const totalProducts = productsSnapshot.size;
      const availableProducts = productsSnapshot.docs.filter(doc => doc.data().isAvailable).length;
  
      // Get recent orders
      const ordersSnapshot = await db.collection('orders')
        .where('sellerId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
  
      const recentOrders = [];
      ordersSnapshot.forEach(doc => {
        recentOrders.push(doc.data());
      });
  
      // Get order statistics
      const allOrdersSnapshot = await db.collection('orders')
        .where('sellerId', '==', userId)
        .get();
  
      let totalRevenue = 0;
      let pendingOrders = 0;
      let processingOrders = 0;
      let shippedOrders = 0;
      let deliveredOrders = 0;
  
      allOrdersSnapshot.forEach(doc => {
        const order = doc.data();
        totalRevenue += order.totalAmount;
  
        switch (order.status) {
          case 'pending':
            pendingOrders++;
            break;
          case 'processing':
            processingOrders++;
            break;
          case 'shipped':
            shippedOrders++;
            break;
          case 'delivered':
            deliveredOrders++;
            break;
        }
      });
  
      // Get recent reviews
      const reviewsSnapshot = await db.collection('reviews')
        .where('sellerId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
  
      const recentReviews = [];
      reviewsSnapshot.forEach(doc => {
        recentReviews.push(doc.data());
      });
  
      return res.status(200).json({
        productStats: {
          total: totalProducts,
          available: availableProducts,
          outOfStock: totalProducts - availableProducts
        },
        orderStats: {
          total: allOrdersSnapshot.size,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders
        },
        financialStats: {
          totalRevenue
        },
        recentOrders,
        recentReviews,
        ratingData: userDoc.data().rating || 0,
        reviewCount: userDoc.data().ratingCount || 0
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.getBuyerDashboard = async (req, res) => {
    const userId = req.user.uid; // From auth middleware
  
    try {
      // Verify user is a buyer
      const userDoc = await db.collection('users').doc(userId).get();
  
      if (!userDoc.exists || userDoc.data().userType !== 'buyer') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Get recent orders
      const ordersSnapshot = await db.collection('orders')
        .where('buyerId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
  
      const recentOrders = [];
      ordersSnapshot.forEach(doc => {
        recentOrders.push(doc.data());
      });
  
      // Get order statistics
      const allOrdersSnapshot = await db.collection('orders')
        .where('buyerId', '==', userId)
        .get();
  
      let totalSpent = 0;
      let pendingOrders = 0;
      let processingOrders = 0;
      let shippedOrders = 0;
      let deliveredOrders = 0;
  
      allOrdersSnapshot.forEach(doc => {
        const order = doc.data();
        totalSpent += order.totalAmount;
  
        switch (order.status) {
          case 'pending':
            pendingOrders++;
            break;
          case 'processing':
            processingOrders++;
            break;
          case 'shipped':
            shippedOrders++;
            break;
          case 'delivered':
            deliveredOrders++;
            break;
        }
      });
  
      // Get recent reviewed products
      const reviewsSnapshot = await db.collection('reviews')
        .where('reviewerId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
  
      const reviewedProducts = [];
      for (const doc of reviewsSnapshot.docs) {
        const review = doc.data();
        const productDoc = await db.collection('products').doc(review.productId).get();
  
        if (productDoc.exists) {
          reviewedProducts.push({
            ...review,
            product: productDoc.data()
          });
        }
      }
  
      return res.status(200).json({
        orderStats: {
          total: allOrdersSnapshot.size,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders
        },
        financialStats: {
          totalSpent
        },
        recentOrders,
        reviewedProducts
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };