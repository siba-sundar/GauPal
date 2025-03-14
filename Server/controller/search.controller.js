
const admin = require('firebase-admin');
const db = admin.firestore();
// controllers/search.controller.js
exports.search = async (req, res) => {
    const { query, type = 'product', limit = 10, page = 1 } = req.query;
  
    try {
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
  
      const queryLowerCase = query.toLowerCase();
      let results = [];
  
      if (type === 'product') {
        // Search products
        const productsSnapshot = await db.collection('products')
          .where('isAvailable', '==', true)
          .get();
  
        productsSnapshot.forEach(doc => {
          const product = doc.data();
          const name = product.name.toLowerCase();
          const description = product.description.toLowerCase();
          const category = product.category.toLowerCase();
  
          if (name.includes(queryLowerCase) ||
            description.includes(queryLowerCase) ||
            category.includes(queryLowerCase)) {
            results.push(product);
          }
        });
      } else if (type === 'farmer') {
        // Search farmers
        const usersSnapshot = await db.collection('users')
          .where('userType', '==', 'farmer')
          .get();
  
        usersSnapshot.forEach(doc => {
          const user = doc.data();
          const name = user.fullName.toLowerCase();
          const address = user.address ?
            `${user.address.city} ${user.address.state}`.toLowerCase() : '';
  
          if (name.includes(queryLowerCase) || address.includes(queryLowerCase)) {
            // Remove sensitive data
            delete user.email;
            delete user.phone;
            results.push(user);
          }
        });
      }
  
      // Handle pagination
      const startAt = (page - 1) * limit;
      const paginatedResults = results.slice(startAt, startAt + parseInt(limit));
  
      return res.status(200).json({
        results: paginatedResults,
        total: results.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(results.length / limit)
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };