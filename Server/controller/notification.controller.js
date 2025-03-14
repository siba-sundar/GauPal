

// controllers/notification.controller.js
exports.getNotifications = async (req, res) => {
    const userId = req.user.uid; // From auth middleware
    const { limit = 20, page = 1 } = req.query;
  
    try {
      // Get notifications for this user
      const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
  
      const notifications = [];
  
      snapshot.forEach(doc => {
        notifications.push(doc.data());
      });
  
      // Handle pagination
      const startAt = (page - 1) * limit;
      const paginatedNotifications = notifications.slice(startAt, startAt + parseInt(limit));
  
      return res.status(200).json({
        notifications: paginatedNotifications,
        total: notifications.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(notifications.length / limit)
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.markNotificationRead = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user.uid; // From auth middleware
  
    try {
      const notificationDoc = await db.collection('notifications').doc(notificationId).get();
  
      if (!notificationDoc.exists) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      const notificationData = notificationDoc.data();
  
      if (notificationData.userId !== userId) {
        return res.status(403).json({ message: 'You do not have access to this notification' });
      }
  
      await notificationDoc.ref.update({ isRead: true });
  
      return res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.markAllNotificationsRead = async (req, res) => {
    const userId = req.user.uid; // From auth middleware
  
    try {
      const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .where('isRead', '==', false)
        .get();
  
      const batch = db.batch();
  
      snapshot.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
      });
  
      await batch.commit();
  
      return res.status(200).json({
        message: 'All notifications marked as read',
        count: snapshot.size
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };