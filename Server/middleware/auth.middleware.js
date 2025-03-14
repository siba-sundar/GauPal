// middleware/auth.middleware.js
const admin = require('firebase-admin');

// Middleware to verify Firebase ID token
exports.verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization;
  
  if (!idToken) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    
    // Get user data from Firestore
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      req.user.userType = userData.userType;
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to verify user is a farmer
exports.isFarmer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  if (req.user.userType !== 'farmer') {
    return res.status(403).json({ message: 'Access denied. Farmers only.' });
  }
  
  next();
};

// Middleware to verify user is a buyer
exports.isBuyer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  if (req.user.userType !== 'buyer') {
    return res.status(403).json({ message: 'Access denied. Buyers only.' });
  }
  
  next();
};