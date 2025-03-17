import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserData(user);
        
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.get('http://localhost:5000/gaupal/farmer/products', {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });
        
        setProducts(response.data.products);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching farmer data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [auth]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {userData?.fullName}</span>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <button className="bg-white text-green-600 px-3 py-1 rounded">Logout</button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Products</h2>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Orders Received</h2>
                <p className="text-3xl font-bold">24</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Total Revenue</h2>
                <p className="text-3xl font-bold">₹15,420</p>
              </div>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Products</h2>
                <Link to="/add-product" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Add New Product
                </Link>
              </div>
              
              {products.length === 0 ? (
                <p>You haven't added any products yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b text-left">Product Name</th>
                        <th className="py-2 px-4 border-b text-left">Category</th>
                        <th className="py-2 px-4 border-b text-left">Price (₹/kg)</th>
                        <th className="py-2 px-4 border-b text-left">Quantity</th>
                        <th className="py-2 px-4 border-b text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="py-2 px-4 border-b">{product.name}</td>
                          <td className="py-2 px-4 border-b">{product.category}</td>
                          <td className="py-2 px-4 border-b">₹{product.price}</td>
                          <td className="py-2 px-4 border-b">{product.quantity} kg</td>
                          <td className="py-2 px-4 border-b">
                            <button className="text-blue-500 hover:underline mr-2">Edit</button>
                            <button className="text-red-500 hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;