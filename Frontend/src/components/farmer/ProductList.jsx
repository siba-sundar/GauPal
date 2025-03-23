import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const FarmerProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5000/gaupal/farmer/farmer-products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
        toast.error('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(`http://localhost:5000/gaupal/farmer/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Remove the deleted product from state
        setProducts(products.filter(product => product._id !== productId));
        toast.success('Product deleted successfully');
      } catch (err) {
        console.error('Error deleting product:', err);
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link 
          to="/farmer/add-product" 
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center p-10 bg-gray-100 rounded-lg">
          <p className="text-lg text-gray-600">You haven't added any products yet.</p>
          <Link 
            to="/farmer/add-product" 
            className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="border rounded-lg overflow-hidden shadow-md">
              <div className="h-48 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={`http://localhost:5000/${product.images[0]}`} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-700 mb-2">Price: ₹{product.price}</p>
                <p className="text-gray-700 mb-2">Quantity: {product.quantity} {product.unit}</p>
                <p className="text-gray-700 mb-4">Status: 
                  <span className={`ml-1 ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {product.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </p>
                
                <div className="flex justify-between mt-4">
                  <Link 
                    to={`/farmer/products/${product._id}`} 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                  >
                    View Details
                  </Link>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/farmer/edit-product/${product._id}`} 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(product._id)} 
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerProductList;