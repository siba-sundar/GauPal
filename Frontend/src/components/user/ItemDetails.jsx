import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <div className="text-center text-green-800 py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center text-red-600 py-8">Product not found</div>;
  }

  // Format date function
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Image carousel navigation
  const handleNextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % product.images.length
      );
    }
  };

  const handlePrevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-50 p-4">
          <h1 className="text-2xl font-bold text-green-800">{product.name}</h1>
        </div>

        {/* Image Carousel */}
        {product.images && product.images.length > 0 && (
          <div className="relative">
            <img 
              src={product.images[currentImageIndex]} 
              alt={`${product.name} - ${currentImageIndex + 1}`} 
              className="w-full h-64 object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full"
                >
                  &#10094;
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full"
                >
                  &#10095;
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {product.images.map((_, index) => (
                <span 
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentImageIndex ? 'bg-green-600' : 'bg-green-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-green-700 mb-2">Product Information</h2>
              <p><strong>Price:</strong> ₹{product.price} / {product.unit}</p>
              <p><strong>Quantity:</strong> {product.quantity} {product.unit}</p>
              <p><strong>Location:</strong> {product.location}</p>
              <p>
                <strong>Type:</strong> 
                <span className={product.organic ? 'text-green-600' : 'text-gray-600'}>
                  {product.organic ? 'Organic' : 'Non-Organic'}
                </span>
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-green-700 mb-2">Important Dates</h2>
              <p><strong>Harvest Date:</strong> {formatDate(product.harvestDate)}</p>
              <p><strong>Expiry Date:</strong> {formatDate(product.expiryDate)}</p>
              <p><strong>Listed On:</strong> {formatDate(product.createdAt)}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-700 mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Seller Information */}
          {product.seller && (
            <div className="bg-green-50 p-4 rounded mb-6">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Seller Details</h2>
              <p><strong>Name:</strong> {product.seller.fullName}</p>
              <p><strong>Seller Rating:</strong> {product.seller.rating || 'Not rated'}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="flex-1 border-2 border-green-500 text-green-700 py-2 rounded hover:bg-green-50 transition">
              Add to Cart
            </button>
            <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;