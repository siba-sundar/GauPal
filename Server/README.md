"# GauPal" 
/**
 * Firestore Database Collections Structure
 * 
 * Here's the recommended collection structure for your farmers marketplace:
 */

// users Collection
{
  uid: String, // Firebase Auth UID
  email: String,
  fullName: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  userType: String, // "farmer" or "buyer"
  createdAt: Timestamp,
  updatedAt: Timestamp,
  profilePicture: String, // URL to storage
  isVerified: Boolean,
  rating: Number,
  ratingCount: Number
}

// products Collection
{
  productId: String,
  sellerId: String, // Reference to user UID
  name: String,
  description: String,
  category: String, // e.g., "vegetables", "fruits", "dairy"
  price: Number,
  unit: String, // e.g., "kg", "lb", "dozen"
  quantity: Number, // available quantity
  images: Array, // URLs to storage
  organic: Boolean,
  harvestDate: Timestamp,
  expiryDate: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  isAvailable: Boolean
}

// orders Collection
{
  orderId: String,
  buyerId: String, // Reference to user UID
  sellerId: String, // Reference to user UID
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
      subtotal: Number
    }
  ],
  totalAmount: Number,
  status: String, // "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"
  paymentStatus: String, // "pending", "completed", "failed", "refunded"
  paymentMethod: String,
  paymentId: String, // For payment gateway reference
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  deliveryDate: Timestamp,
  notes: String
}

// reviews Collection
{
  reviewId: String,
  productId: String,
  orderId: String,
  reviewerId: String, // User who wrote the review
  sellerId: String, // User being reviewed
  rating: Number, // 1-5
  comment: String,
  images: Array, // URLs to storage
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isVerified: Boolean
}

// messages Collection
{
  messageId: String,
  conversationId: String,
  senderId: String,
  receiverId: String,
  message: String,
  createdAt: Timestamp,
  isRead: Boolean
}

// conversations Collection
{
  conversationId: String,
  participants: Array, // User UIDs
  lastMessage: String,
  lastMessageTime: Timestamp,
  unreadCount: Number
}

// notifications Collection
{
  notificationId: String,
  userId: String, // Recipient
  type: String, // "order", "message", "review", etc.
  title: String,
  message: String,
  referenceId: String, // ID of related entity (order, product, etc.)
  createdAt: Timestamp,
  isRead: Boolean
}