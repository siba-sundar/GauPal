import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import axios from 'axios';

const LogoutButton = ({ className }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Get the current authenticated user
      const user = auth.currentUser;
      
      if (user) {
        // Get the Firebase ID token for the API request
        const idToken = await user.getIdToken();
        
        // Call the backend logout endpoint
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/gaupal/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${idToken}` // Include token in the Authorization header
          }
        });
        
        // Sign out from Firebase Authentication
        await signOut(auth);
      }
      
      // Clear user data from localStorage
      localStorage.removeItem('user');
      
      // Redirect to login page after logout
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout. Please try again.');
      
      // Even if there's an error with the backend, try to sign out from Firebase
      try {
        await signOut(auth);
        localStorage.removeItem('user');
        navigate('/login');
      } catch (signOutErr) {
        console.error('Firebase sign out error:', signOutErr);
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${className || 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md'}`}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
