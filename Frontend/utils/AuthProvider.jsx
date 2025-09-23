import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // Set up the auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from your backend or use cached data
          const cachedUserString = localStorage.getItem('user');
          if (cachedUserString) {
            try {
              const cachedUser = JSON.parse(cachedUserString);
              setCurrentUser(cachedUser);
            } catch (error) {
              console.error("Error parsing cached user:", error);
              localStorage.removeItem('user');
              setCurrentUser(null);
            }
          } else {
            // If no cached data, get from API
            const idToken = await firebaseUser.getIdToken();
            const response = await axios.get('http://localhost:5001/gaupal/auth/profile', {
              headers: {
                Authorization: `Bearer ${idToken}`
              }
            });
            setCurrentUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Update auth header for all axios requests
  useEffect(() => {
    const updateAuthHeader = async () => {
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error("Error getting ID token:", error);
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    };

    updateAuthHeader();
  }, [currentUser, auth]);

  const value = {
    currentUser,
    loading,
    getUserType: () => {
      return currentUser?.userType || null;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};