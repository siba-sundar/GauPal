// routes/notification.routes.js
const express = require('express');
const { 
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} = require('../controller/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Protected routes
router.get('/', verifyToken, getNotifications);
router.put('/:notificationId/read', verifyToken, markNotificationRead);
router.put('/read-all', verifyToken, markAllNotificationsRead);

module.exports = router;