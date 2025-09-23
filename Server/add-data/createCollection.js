const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

// Function to create collections and add sample documents
async function createCollections() {

  // users Collection
  const usersRef = db.collection('users');
  await usersRef.doc('user1').set({
    uid: 'user1UID',
    email: 'user1@example.com',
    fullName: 'John Doe',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      country: 'USA',
      coordinates: {
        latitude: 39.7817,
        longitude: -89.6501
      }
    },
    userType: 'farmer',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    profilePicture: 'https://example.com/profile1.jpg',
    isVerified: true,
    rating: 4.8,
    ratingCount: 50
  });

  // products Collection
  const productsRef = db.collection('products');
  await productsRef.doc('product1').set({
    productId: 'product1ID',
    sellerId: 'user1UID',
    name: 'Fresh Apples',
    description: 'Organically grown apples',
    category: 'fruits',
    price: 2.99,
    unit: 'kg',
    quantity: 50,
    images: ['https://example.com/apple1.jpg'],
    organic: true,
    harvestDate: admin.firestore.Timestamp.fromDate(new Date('2023-09-01')),
    expiryDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-01')),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    location: {
      address: '123 Orchard Rd, Springfield',
      coordinates: {
        latitude: 39.7817,
        longitude: -89.6501
      }
    },
    isAvailable: true
  });

  // orders Collection
  const ordersRef = db.collection('orders');
  await ordersRef.doc('order1').set({
    orderId: 'order1ID',
    buyerId: 'user2UID',
    sellerId: 'user1UID',
    items: [
      {
        productId: 'product1ID',
        name: 'Fresh Apples',
        quantity: 5,
        price: 2.99,
        subtotal: 14.95
      }
    ],
    totalAmount: 14.95,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'credit card',
    paymentId: 'payment1ID',
    shippingAddress: {
      street: '456 Elm St',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      country: 'USA'
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    deliveryDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-15')),
    notes: 'Please deliver between 9am and 5pm'
  });

  // reviews Collection
  const reviewsRef = db.collection('reviews');
  await reviewsRef.doc('review1').set({
    reviewId: 'review1ID',
    productId: 'product1ID',
    orderId: 'order1ID',
    reviewerId: 'user2UID',
    sellerId: 'user1UID',
    rating: 5,
    comment: 'Excellent quality apples!',
    images: ['https://example.com/review1.jpg'],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    isVerified: true
  });

  // messages Collection
  const messagesRef = db.collection('messages');
  await messagesRef.doc('message1').set({
    messageId: 'message1ID',
    conversationId: 'conv1ID',
    senderId: 'user1UID',
    receiverId: 'user2UID',
    message: 'Hello, is the product still available?',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isRead: false
  });

  // conversations Collection
  const conversationsRef = db.collection('conversations');
  await conversationsRef.doc('conv1ID').set({
    conversationId: 'conv1ID',
    participants: ['user1UID', 'user2UID'],
    lastMessage: 'Hello, is the product still available?',
    lastMessageTime: admin.firestore.FieldValue.serverTimestamp(),
    unreadCount: 1
  });

  // notifications Collection
  const notificationsRef = db.collection('notifications');
  await notificationsRef.doc('notif1ID').set({
    notificationId: 'notif1ID',
    userId: 'user2UID',
    type: 'order',
    title: 'Order Confirmation',
    message: 'Your order has been confirmed!',
    referenceId: 'order1ID',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isRead: false
  });

  console.log("Collections and documents created successfully.");
}

// Run the function
createCollections().catch(console.error);
