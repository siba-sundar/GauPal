// routes/message.routes.js
const express = require('express');
const { 
  sendMessage,
  getConversations,
  getMessages
} = require('../controller/message.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Protected routes
router.post('/', verifyToken, sendMessage);
router.get('/conversations', verifyToken, getConversations);
router.get('/conversations/:conversationId', verifyToken, getMessages);

module.exports = router;