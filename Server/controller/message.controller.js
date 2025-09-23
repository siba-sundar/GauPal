
const admin = require('firebase-admin');
const db = admin.firestore();

// controllers/message.controller.js
exports.sendMessage = async (req, res) => {
    const { receiverId, message } = req.body;
    const senderId = req.user.uid; // From auth middleware
  
    try {
      // Check if receiver exists
      const receiverDoc = await db.collection('users').doc(receiverId).get();
  
      if (!receiverDoc.exists) {
        return res.status(404).json({ message: 'Receiver not found' });
      }
  
      // Find or create conversation
      const conversationQuery = await db.collection('conversations')
        .where('participants', 'array-contains', senderId)
        .get();
  
      let conversationId = null;
      let conversationRef = null;
  
      conversationQuery.forEach(doc => {
        const data = doc.data();
        if (data.participants.includes(receiverId)) {
          conversationId = doc.id;
          conversationRef = doc.ref;
        }
      });
  
      if (!conversationId) {
        // Create new conversation
        conversationRef = db.collection('conversations').doc();
        conversationId = conversationRef.id;
  
        await conversationRef.set({
          conversationId,
          participants: [senderId, receiverId],
          lastMessage: message,
          lastMessageTime: admin.firestore.FieldValue.serverTimestamp(),
          unreadCount: 1
        });
      } else {
        // Update existing conversation
        await conversationRef.update({
          lastMessage: message,
          lastMessageTime: admin.firestore.FieldValue.serverTimestamp(),
          unreadCount: admin.firestore.FieldValue.increment(1)
        });
      }
  
      // Create message
      const messageRef = db.collection('messages').doc();
  
      await messageRef.set({
        messageId: messageRef.id,
        conversationId,
        senderId,
        receiverId,
        message,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false
      });
  
      // Create notification for receiver
      const notificationRef = db.collection('notifications').doc();
  
      await notificationRef.set({
        notificationId: notificationRef.id,
        userId: receiverId,
        type: 'message',
        title: 'New Message',
        message: `You have a new message from ${req.user.displayName}`,
        referenceId: conversationId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false
      });
  
      return res.status(201).json({
        message: 'Message sent successfully',
        messageId: messageRef.id,
        conversationId
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.getConversations = async (req, res) => {
    const userId = req.user.uid; // From auth middleware
  
    try {
      const snapshot = await db.collection('conversations')
        .where('participants', 'array-contains', userId)
        .orderBy('lastMessageTime', 'desc')
        .get();
  
      const conversations = [];
  
      for (const doc of snapshot.docs) {
        const data = doc.data();
  
        // Get other participant's details
        const otherParticipantId = data.participants.find(id => id !== userId);
        const otherParticipantDoc = await db.collection('users').doc(otherParticipantId).get();
  
        if (otherParticipantDoc.exists) {
          const otherParticipantData = otherParticipantDoc.data();
  
          conversations.push({
            ...data,
            otherParticipant: {
              uid: otherParticipantData.uid,
              fullName: otherParticipantData.fullName,
              profilePicture: otherParticipantData.profilePicture
            }
          });
        }
      }
  
      return res.status(200).json({ conversations });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.getMessages = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.uid; // From auth middleware
    const { limit = 20, before } = req.query;
  
    try {
      // Verify user is part of this conversation
      const conversationDoc = await db.collection('conversations').doc(conversationId).get();
  
      if (!conversationDoc.exists) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
  
      const conversationData = conversationDoc.data();
  
      if (!conversationData.participants.includes(userId)) {
        return res.status(403).json({ message: 'You do not have access to this conversation' });
      }
  
      // Query messages
      let query = db.collection('messages')
        .where('conversationId', '==', conversationId)
        .orderBy('createdAt', 'desc')
        .limit(parseInt(limit));
  
      if (before) {
        const beforeTimestamp = new Date(before);
        query = query.where('createdAt', '<', beforeTimestamp);
      }
  
      const snapshot = await query.get();
      const messages = [];
  
      snapshot.forEach(doc => {
        messages.push(doc.data());
      });
  
      // Mark messages as read
      const batch = db.batch();
      let unreadCount = 0;
  
      for (const message of messages) {
        if (message.receiverId === userId && !message.isRead) {
          batch.update(db.collection('messages').doc(message.messageId), {
            isRead: true
          });
          unreadCount++;
        }
      }
  
      if (unreadCount > 0) {
        batch.update(conversationDoc.ref, {
          unreadCount: admin.firestore.FieldValue.increment(-unreadCount)
        });
      }
  
      await batch.commit();
  
      return res.status(200).json({
        messages: messages.reverse(), // Return in chronological order
        hasMore: messages.length === parseInt(limit)
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };