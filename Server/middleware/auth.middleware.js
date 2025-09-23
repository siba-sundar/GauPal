// middleware/auth.middleware.js
const admin = require('firebase-admin');

// Middleware to verify Firebase ID token
exports.verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  // Check if the Authorization header is present and in the correct format
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }

  // Extract the token from the Authorization header
  const idToken = authorizationHeader.split('Bearer ')[1];

  try {
    // Verify the ID token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;

    // Fetch user data from Firestore
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      req.user.userType = userData.userType; // Add user type to req.user
    }

    // Call next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token ' });
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
  
  console.log('User is a farmer');
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