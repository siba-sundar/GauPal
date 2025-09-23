// routes/auth.routes.js
const express = require('express');
const { signup, login, getProfile, updateProfile, logout } = require('../controller/auth.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');


const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.post('/logout', verifyToken, logout);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;