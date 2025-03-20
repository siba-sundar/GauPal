import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/SignupPage.jsx';
import FarmerDashboard from './pages/FarmerDash.jsx';
import BuyerDashboard from './pages/UserDash.jsx';
import NotFoundPage from './pages/NoFound.jsx';
import { AuthProvider, useAuth } from '../utils/AuthProvider.jsx';

import CowManage from "./pages/CowManage.jsx"

// Initialize Firebase - replace with your actual firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

initializeApp(firebaseConfig);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const [authChecked, setAuthChecked] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [auth]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public route component - redirects to appropriate dashboard if already authenticated
const PublicRoute = ({ children }) => {
  const auth = getAuth();
  const [authChecked, setAuthChecked] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userType, setUserType] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Check user type from localStorage
        try {
          const userString = localStorage.getItem('user');
          if (userString) {
            const userData = JSON.parse(userString);
            setUserType(userData.userType);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      } else {
        setIsAuthenticated(false);
        setUserType(null);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [auth]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (userType === 'farmer') {
      return <Navigate to="/farmer-dashboard" replace />;
    } else if (userType === 'buyer') {
      return <Navigate to="/buyer-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

// User type-based route component
const UserTypeRoute = ({ children, allowedType }) => {
  const [loading, setLoading] = React.useState(true);
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const checkUserType = () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        if (user.userType === allowedType) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error checking user type:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserType();
  }, [allowedType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return authorized ? children : <Navigate to="/" replace />;
};

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  {
    path: "/farmer-dashboard",
    element: (
     
        <UserTypeRoute allowedType="farmer">
          <FarmerDashboard />
        </UserTypeRoute>
    
    ),
  },

  {
    path:"/manage-cow",
    element:(
      <ProtectedRoute>
        <UserTypeRoute allowedType="farmer">
          <CowManage/>
        </UserTypeRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/buyer-dashboard",
    element: (
      <ProtectedRoute>
        <UserTypeRoute allowedType="buyer">
          <BuyerDashboard />
        </UserTypeRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

// Main App component
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;