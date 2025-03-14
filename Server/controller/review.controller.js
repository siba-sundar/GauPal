
const admin = require('firebase-admin');
const db = admin.firestore();

// controllers/review.controller.js
exports.createReview = async (req, res) => {
    const { productId, orderId, rating, comment, images = [] } = req.body;
    const reviewerId = req.user.uid; // From auth middleware
  
    try {
      // Verify the order exists and belongs to the reviewer
      const orderDoc = await db.collection('orders').doc(orderId).get();
  
      if (!orderDoc.exists) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const orderData = orderDoc.data();
  
      if (orderData.buyerId !== reviewerId) {
        return res.status(403).json({ message: 'You can only review your own orders' });
      }
  
      if (orderData.status !== 'delivered') {
        return res.status(400).json({ message: 'You can only review delivered orders' });
      }
  
      // Check if review already exists
      const existingReview = await db.collection('reviews')
        .where('orderId', '==', orderId)
        .where('reviewerId', '==', reviewerId)
        .get();
  
      if (!existingReview.empty) {
        return res.status(400).json({ message: 'You have already reviewed this order' });
      }
  
      // Get seller ID from product
      const productDoc = await db.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const sellerId = productDoc.data().sellerId;
  
      // Create review
      const reviewRef = db.collection('reviews').doc();
  
      await db.runTransaction(async transaction => {
        // Create the review
        transaction.set(reviewRef, {
          reviewId: reviewRef.id,
          productId,
          orderId,
          reviewerId,
          sellerId,
          rating,
          comment,
          images,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          isVerified: true
        });
  
        // Update product rating
        const productReviews = await db.collection('reviews')
          .where('productId', '==', productId)
          .get();
  
        let totalRating = rating;
        let reviewCount = 1;
  
        productReviews.forEach(doc => {
          if (doc.id !== reviewRef.id) {
            totalRating += doc.data().rating;
            reviewCount++;
          }
        });
  
        const averageRating = totalRating / reviewCount;
  
        transaction.update(productDoc.ref, {
          rating: averageRating,
          reviewCount
        });
  
        // Update seller rating
        const sellerReviews = await db.collection('reviews')
          .where('sellerId', '==', sellerId)
          .get();
  
        totalRating = rating;
        reviewCount = 1;
  
        sellerReviews.forEach(doc => {
          if (doc.id !== reviewRef.id) {
            totalRating += doc.data().rating;
            reviewCount++;
          }
        });
  
        const sellerAverageRating = totalRating / reviewCount;
  
        transaction.update(db.collection('users').doc(sellerId), {
          rating: sellerAverageRating,
          ratingCount: reviewCount
        });
  
        // Create notification for seller
        const notificationRef = db.collection('notifications').doc();
        transaction.set(notificationRef, {
          notificationId: notificationRef.id,
          userId: sellerId,
          type: 'review',
          title: 'New Review',
          message: `You received a ${rating}-star review for your product`,
          referenceId: reviewRef.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isRead: false
        });
      });
  
      return res.status(201).json({
        message: 'Review created successfully',
        reviewId: reviewRef.id
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.getProductReviews = async (req, res) => {
    const { productId } = req.params;
    const { limit = 10, page = 1 } = req.query;
  
    try {
      // Check if product exists
      const productDoc = await db.collection('products').doc(productId).get();
  
      if (!productDoc.exists) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Get reviews for this product
      const snapshot = await db.collection('reviews')
        .where('productId', '==', productId)
        .orderBy('createdAt', 'desc')
        .get();
  
      const reviews = [];
  
      snapshot.forEach(doc => {
        reviews.push(doc.data());
      });
  
      // Manual pagination
      const startAt = (page - 1) * limit;
      const paginatedReviews = reviews.slice(startAt, startAt + parseInt(limit));
  
      // Get reviewer details
      for (const review of paginatedReviews) {
        const reviewerDoc = await db.collection('users').doc(review.reviewerId).get();
        if (reviewerDoc.exists) {
          const reviewerData = reviewerDoc.data();
          review.reviewer = {
            uid: reviewerData.uid,
            fullName: reviewerData.fullName,
            profilePicture: reviewerData.profilePicture
          };
        }
      }
  
      return res.status(200).json({
        reviews: paginatedReviews,
        total: reviews.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(reviews.length / limit)
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };