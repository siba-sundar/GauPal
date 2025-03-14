import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LogoutButton from '../components/Logout.jsx';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from your backend
          const response = await axios.get('/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${await firebaseUser.getIdToken()}`
            }
          });
          
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If there's an error (e.g., token expired), redirect to login
          navigate('/login');
        }
      } else {
        // No user is signed in, redirect to login
        navigate('/login');
      }
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Farm Fresh Connect</h1>
          <div className="flex items-center">
            {user && (
              <div className="flex items-center">
                <span className="mr-4 text-gray-700">
                  Welcome, {user.fullName} ({user.userType})
                </span>
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                  Profile
                </button>
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            
            {user.userType === 'farmer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard 
                  title="My Products" 
                  description="Manage your farm products" 
                  linkTo="/products" 
                  icon="🥕"
                />
                <DashboardCard 
                  title="Orders" 
                  description="View incoming orders" 
                  linkTo="/orders" 
                  icon="📦"
                />
                <DashboardCard 
                  title="Analytics" 
                  description="View your sales analytics" 
                  linkTo="/analytics" 
                  icon="📊"
                />
              </div>
            )}
            
            {user.userType === 'buyer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard 
                  title="Browse Products" 
                  description="Find fresh products from local farmers" 
                  linkTo="/market" 
                  icon="🛒"
                />
                <DashboardCard 
                  title="My Orders" 
                  description="Track your orders" 
                  linkTo="/orders" 
                  icon="📦"
                />
                <DashboardCard 
                  title="Favorite Farms" 
                  description="View your favorite farms" 
                  linkTo="/favorites" 
                  icon="⭐"
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// Helper component for dashboard cards
const DashboardCard = ({ title, description, linkTo, icon }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(linkTo)}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;