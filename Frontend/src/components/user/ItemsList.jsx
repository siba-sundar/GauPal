import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    searchQuery: '',
    organic: false
  });
  const navigate = useNavigate();

  // Helper function to safely convert objects to strings
  const safeStringify = (obj) => {
    if (obj === null || obj === undefined) return 'N/A';
    if (typeof obj === 'object') {
      // If it's an object with address or coordinates, try to extract meaningful info
      if (obj.address) return obj.address.toString();
      if (obj.coordinates) return `Lat: ${obj.coordinates.lat}, Lng: ${obj.coordinates.lng}`;
      return JSON.stringify(obj);
    }
    return obj.toString();
  };

  // Sanitize product data to handle specific data structure
  const sanitizeProductData = (product) => {
    return {
      ...product,
      // Convert timestamps to readable dates if needed
      harvestDate: product.harvestDate 
        ? new Date(product.harvestDate._seconds * 1000).toLocaleDateString() 
        : 'N/A',
      expiryDate: product.expiryDate 
        ? new Date(product.expiryDate._seconds * 1000).toLocaleDateString() 
        : 'N/A',
      // Ensure images is always an array
      images: product.images && product.images.length > 0 
        ? product.images 
        : ['/default-product-image.png'], // Add a default image path
      
      // Safely handle any potential nested objects
      location: safeStringify(product.location),
      address: safeStringify(product.address),
      coordinates: safeStringify(product.coordinates)
    };
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/products`, {
        params: {
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          organic: filters.organic,
          page: pagination.page,
          limit: pagination.limit
        }
      });

      const { products, total, page, limit, totalPages } = response.data;
      
      // Sanitize products
      const sanitizedProducts = products.map(sanitizeProductData);
      
      // Apply search filter client-side
      const searchFilteredProducts = sanitizedProducts.filter(product => 
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      );

      setProducts(sanitizedProducts);
      setFilteredProducts(searchFilteredProducts);
      setPagination({ 
        page: page || 1, 
        limit: limit || 10, 
        totalPages: totalPages || Math.ceil(total / limit) || 1 
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      // Optionally set error state or show error message
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/buyer/product/${productId}`);
  };

  // Render product card
  const renderProductCard = (product) => {
    // Additional safety check
    if (!product || typeof product !== 'object') return null;

    return (
      <div 
        key={product.productId} 
        className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
        onClick={() => handleProductClick(product.productId)}
      >
        <div className="flex-shrink-0 mb-4">
          {product.images && product.images.length > 0 && (
            <img 
              src={product.images[0]} 
              alt={product.name || 'Product'} 
              className="w-full h-48 object-cover rounded"
            />
          )}
        </div>
        <div className="flex-grow">
          <h2 className="text-lg font-bold text-green-700 mb-2">
            {product.name || 'Unnamed Product'}
          </h2>
          <div>
            <p className="text-gray-600">
              Price: ₹{product.price || 'N/A'} / {product.unit || 'unit'}
            </p>
            <p className="text-gray-600">
              Location: {product.location || 'Unknown'}
            </p>
            <p className="text-gray-600">
              Harvest Date: {product.harvestDate || 'N/A'}
            </p>
            <p className={`font-semibold ${product.organic ? 'text-green-600' : 'text-gray-600'}`}>
              {product.organic !== undefined 
                ? (product.organic ? 'Organic' : 'Non-Organic') 
                : 'Unknown Type'}
            </p>
            <p className="text-gray-600">
              Quantity: {product.quantity || 'N/A'} {product.unit || 'units'}
            </p>
            {/* Optional: Display address or coordinates if available */}
            {product.address && (
              <p className="text-gray-600 text-sm">
                Address: {product.address}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <div className="mb-6 bg-green-50 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Farm Fresh Products</h1>
        
        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4">
          <input 
            type="text"
            placeholder="Search products..." 
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              searchQuery: e.target.value 
            }))}
            className="border border-green-300 rounded p-2 focus:outline-none focus:border-green-500"
          />
          
          <select 
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              category: e.target.value 
            }))}
            className="border border-green-300 rounded p-2 focus:outline-none focus:border-green-500"
          >
            <option value="">All Categories</option>
            {['Fruits', 'Vegetables', 'Grains', 'Dairy'].map(cat => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="Min Price" 
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              minPrice: e.target.value 
            }))}
            className="border border-green-300 rounded p-2 focus:outline-none focus:border-green-500"
          />

          <input 
            type="number" 
            placeholder="Max Price" 
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              maxPrice: e.target.value 
            }))}
            className="border border-green-300 rounded p-2 focus:outline-none focus:border-green-500"
          />
        </div>
        
        {/* Organic Toggle */}
        <div className="mt-4 flex items-center">
          <input 
            type="checkbox" 
            id="organic" 
            checked={filters.organic}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              organic: e.target.checked 
            }))}
            className="mr-2 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="organic" className="text-green-800">
            Show Only Organic Products
          </label>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No products found
          </div>
        ) : (
          filteredProducts.map(renderProductCard)
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button 
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 border rounded bg-green-50 hover:bg-green-100 disabled:opacity-50"
        >
          Previous
        </button>
        
        {[...Array(pagination.totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded ${
              pagination.page === index + 1 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-green-600 hover:bg-green-50'
            }`}
          >
            {index + 1}
          </button>
        ))}
        
        <button 
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="px-4 py-2 border rounded bg-green-50 hover:bg-green-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;