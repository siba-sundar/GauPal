// controllers/auth.controller.js
const admin = require('firebase-admin');
const db = admin.firestore();

exports.signup = async (req, res) => {
  const { email, password, fullName, phone, userType, address } = req.body;
  
  try {
    // Get the user ID from the Authorization header
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ message: 'No ID token provided' });
    }
    
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Store additional user data in Firestore
    await db.collection('users').doc(uid).set({
      uid: uid,
      email,
      fullName,
      phone,
      userType,
      address,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isVerified: false,
      rating: 0,
      ratingCount: 0
    });
    
    // Create custom claims for role-based auth
    await admin.auth().setCustomUserClaims(uid, { role: userType });
    console.log("done adding details")
    
    return res.status(201).json({
      message: 'User created successfully',
      uid: uid
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    
    // Handle token verification errors
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/invalid-id-token') {
      return res.status(401).json({ message: 'Invalid or expired authentication token' });
    }
    
    // Generic error handling
    return res.status(500).json({ 
      message: 'An error occurred while creating the user profile',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    // Note: This backend endpoint should receive the ID token from the client
    // The actual email/password authentication happens on the client side using Firebase Auth
    // Client should send the ID token in the request body after authenticating
    
    const idToken = req.body.idToken;
    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    const userData = userDoc.data();
    
    // Update last login timestamp
    await db.collection('users').doc(decodedToken.uid).update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });
    
  
    return res.status(200).json({
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email || userData.email,
        fullName: userData.fullName,
        userType: userData.userType,
        phone: userData.phone,
        address: userData.address,
        isVerified: userData.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.uid; // From auth middleware
    
    // Update last activity
    await db.collection('users').doc(userId).update({
      lastLogout: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Note: In Firebase, actual token revocation happens on the client side
    // by removing the token from storage. The server can't directly invalidate tokens
    // but we can track the logout event.
    
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ message: 'No ID token provided' });
    }
    
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    return res.status(200).json({
      uid: userId,
      email: userData.email,
      fullName: userData.fullName,
      userType: userData.userType,
      phone: userData.phone,
      address: userData.address,
      isVerified: userData.isVerified
    });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ message: 'No ID token provided' });
    }
    
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    
    const { fullName, phone, address } = req.body;
    
    await db.collection('users').doc(userId).update({
      fullName,
      phone,
      address,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: error.message });
  }
};