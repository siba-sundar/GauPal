
const admin = require('firebase-admin');
const db = admin.firestore();

// controllers/order.controller.js
exports.createOrder = async (req, res) => {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    const buyerId = req.user.uid; // From auth middleware
  
    try {
      // Verify user is a buyer
      if (req.user.role !== 'buyer') {
        return res.status(403).json({ message: 'Only buyers can create orders' });
      }
  
      // Process items and calculate total
      let totalAmount = 0;
      const processedItems = [];
      const updatedProducts = [];
  
      for (const item of items) {
        // Get product details and verify availability
        const productDoc = await db.collection('products').doc(item.productId).get();
  
        if (!productDoc.exists) {
          return res.status(404).json({ message: `Product ${item.productId} not found` });
        }
  
        const product = productDoc.data();
  
        if (!product.isAvailable) {
          return res.status(400).json({ message: `Product ${product.name} is not available` });
        }
  
        if (product.quantity < item.quantity) {
          return res.status(400).json({ message: `Only ${product.quantity} units of ${product.name} available` });
        }
  
        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;
  
        processedItems.push({
          productId: item.productId,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          subtotal
        });
  
        // Prepare product update (reduce quantity)
        updatedProducts.push({
          ref: productDoc.ref,
          quantity: product.quantity - item.quantity,
          isAvailable: (product.quantity - item.quantity) > 0
        });
      }
  
      // Create order
      const orderRef = db.collection('orders').doc();
      const sellerId = productDoc.data().sellerId; // Assuming all items from same seller
  
      const orderData = {
        orderId: orderRef.id,
        buyerId,
        sellerId,
        items: processedItems,
        totalAmount,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        shippingAddress,
        notes,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
  
      // Perform updates in a transaction for consistency
      await db.runTransaction(async transaction => {
        // Create the order
        transaction.set(orderRef, orderData);
  
        // Update product quantities
        for (const product of updatedProducts) {
          transaction.update(product.ref, {
            quantity: product.quantity,
            isAvailable: product.isAvailable,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
  
        // Create notification for seller
        const notificationRef = db.collection('notifications').doc();
        transaction.set(notificationRef, {
          notificationId: notificationRef.id,
          userId: sellerId,
          type: 'order',
          title: 'New Order',
          message: `You have received a new order of $${totalAmount.toFixed(2)}`,
          referenceId: orderRef.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isRead: false
        });
      });
  
      return res.status(201).json({
        message: 'Order created successfully',
        orderId: orderRef.id,
        totalAmount
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.getOrder = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.uid; // From auth middleware
  
    try {
      const orderDoc = await db.collection('orders').doc(orderId).get();
  
      if (!orderDoc.exists) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const orderData = orderDoc.data();
  
      // Verify permission (buyer or seller of this order)
      if (orderData.buyerId !== userId && orderData.sellerId !== userId) {
        return res.status(403).json({ message: 'You do not have permission to view this order' });
      }
  
      return res.status(200).json(orderData);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user.uid; // From auth middleware
  
    try {
      const orderDoc = await db.collection('orders').doc(orderId).get();
  
      if (!orderDoc.exists) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const orderData = orderDoc.data();
  
      // Verify permission (only seller can update status)
      if (orderData.sellerId !== userId) {
        return res.status(403).json({ message: 'Only the seller can update order status' });
      }
  
      // Valid status transitions
      const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      await db.runTransaction(async transaction => {
        // Update order status
        transaction.update(orderDoc.ref, {
          status,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
  
        // Create notification for buyer
        const notificationRef = db.collection('notifications').doc();
        transaction.set(notificationRef, {
          notificationId: notificationRef.id,
          userId: orderData.buyerId,
          type: 'order',
          title: 'Order Update',
          message: `Your order #${orderId} has been ${status}`,
          referenceId: orderId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isRead: false
        });
      });
  
      return res.status(200).json({ message: `Order status updated to ${status}` });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.getUserOrders = async (req, res) => {
    const userId = req.user.uid; // From auth middleware
    const { status, limit = 10, page = 1 } = req.query;
  
    try {
      // Determine if user is buyer or seller
      const userDoc = await db.collection('users').doc(userId).get();
      const userType = userDoc.data().userType;
  
      let query;
      if (userType === 'buyer') {
        query = db.collection('orders').where('buyerId', '==', userId);
      } else {
        query = db.collection('orders').where('sellerId', '==', userId);
      }
  
      if (status) {
        query = query.where('status', '==', status);
      }
  
      // Sort by creation time descending
      query = query.orderBy('createdAt', 'desc');
  
      // Handle pagination
      const startAt = (page - 1) * limit;
  
      // Execute query
      const snapshot = await query.get();
      const orders = [];
  
      snapshot.forEach(doc => {
        orders.push(doc.data());
      });
  
      // Manual pagination (limitation with Firestore)
      const paginatedOrders = orders.slice(startAt, startAt + parseInt(limit));
  
      return res.status(200).json({
        orders: paginatedOrders,
        total: orders.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(orders.length / limit)
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };