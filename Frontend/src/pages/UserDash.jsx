import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/Logout';

const BuyerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserData(user);
        
        const idToken = await auth.currentUser.getIdToken();
        
        // Fetch available products
        const productsResponse = await axios.get('http://localhost:5000/gaupal/products', {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });
        
        // Fetch buyer's orders
        const ordersResponse = await axios.get('http://localhost:5000/gaupal/buyer/orders', {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });
        
        setProducts(productsResponse.data.products);
        setOrders(ordersResponse.data.orders);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching buyer data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [auth]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {userData?.fullName}</span>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <Link to="/cart" className="hover:underline">Cart</Link>
            <button className="bg-white text-blue-600 px-3 py-1 rounded"><LogoutButton/></button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
                <p className="text-3xl font-bold">{orders.filter(order => order.status !== 'delivered').length}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Completed Orders</h2>
                <p className="text-3xl font-bold">{orders.filter(order => order.status === 'delivered').length}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Total Spent</h2>
                <p className="text-3xl font-bold">₹{orders.reduce((total, order) => total + order.totalAmount, 0)}</p>
              </div>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">Available Products</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden">
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600">{product.farmer.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold">₹{product.price}/kg</span>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/shop" className="text-blue-500 hover:underline">
                  View All Products
                </Link>
              </div>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
              
              {orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b text-left">Order ID</th>
                        <th className="py-2 px-4 border-b text-left">Date</th>
                        <th className="py-2 px-4 border-b text-left">Items</th>
                        <th className="py-2 px-4 border-b text-left">Total</th>
                        <th className="py-2 px-4 border-b text-left">Status</th>
                        <th className="py-2 px-4 border-b text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td className="py-2 px-4 border-b">#{order.id}</td>
                          <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-2 px-4 border-b">{order.items.length} items</td>
                          <td className="py-2 px-4 border-b">₹{order.totalAmount}</td>
                          <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b">
                            <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Link to="/orders" className="text-blue-500 hover:underline">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;