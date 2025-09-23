// User model
const User = {
    id: '',
    name: '',
    email: '',
    role: 'farmer', // or 'customer'
    isVerified: false,
    location: {
      lat: 0,
      lng: 0,
      address: '',
    },
  };
  
  // Product model
  const Product = {
    id: '',
    name: '',
    description: '',
    price: 0,
    category: 'dairy', // or 'biogas', 'ayurvedic', 'fertilizer'
    farmerId: '',
    rating: 0,
    reviews: [],
    stock: 0,
    images: [],
  };
  
  // Review model
  const Review = {
    id: '',
    userId: '',
    rating: 0,
    comment: '',
    createdAt: '',
  };
  
  // Order model
  const Order = {
    id: '',
    userId: '',
    farmerId: '',
    products: [
      {
        productId: '',
        quantity: 0,
        price: 0,
      },
    ],
    status: 'pending', // or 'processing', 'shipped', 'delivered'
    totalAmount: 0,
    createdAt: '',
    deliveryLocation: {
      lat: 0,
      lng: 0,
      address: '',
    },
  };
  
  // Export models
  export { User, Product, Review, Order };  