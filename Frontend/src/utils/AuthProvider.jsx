import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
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
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/auth/profile`, {
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
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
export default AuthContext;