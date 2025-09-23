import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import HomePage from './pages/HomePage';
import LoginPage from './pages/login.jsx';
import SignupPage from './pages/SignupPage.jsx';
import NotFoundPage from './pages/NoFound.jsx';
import { AuthProvider } from './utils/AuthProvider.jsx';

// common imports 
import ChatBot from "./components/ChatBot.jsx"
import Landing from './pages/Landing.jsx';
import ExploreBreed from "./components/common/ExploreBreed.jsx"
import { FullScreenLoader } from './components/common/loading.jsx'; // Fixed capitalization
import SettingsPage from './components/common/Settings.jsx';
import ArticleListing from './components/common/ArticleListing.jsx';
import Article from  "./components/common/Article.jsx";
import Events from "./components/common/EventList.jsx"
import IdentifyDisease from './layouts/IdentifyDisease.jsx';
import ComingSoon from "./pages/ComingSoon.jsx"
import CowBreedIdentifier from './components/common/BreedIdentify.jsx';

// farmer imports 
import Farmer from "./layouts/Farmer.jsx"
import FarmerDash from './components/farmer/FarmerDash.jsx';
import CowManage from "./components/farmer/CowManage.jsx"
import FarmerMaps from "./components/farmer/GoogleMapView.jsx"
// import AddProducts from "./components/farmer/AddProduct.jsx"
// import ProductList from "./components/farmer/ProductList.jsx"
// import ProductDetails from './components/farmer/ProductDetail.jsx';
import FindDisease from "./components/farmer/Disease.jsx"
import Diseaseqna from "./components/farmer/DiseaseQnA.jsx"
import FarmerMap from "./components/farmer/GoogleMapView.jsx"


// buyer imports 
import User from "./layouts/User.jsx"
import UserDash from './components/user/UserDash_temp.jsx';

import ItemList from "./components/user/ItemsList.jsx"
import ItemDetail from "./components/user/ItemDetails.jsx"
import BuyerGoogleMap from "./components/user/GoogleMapView.jsx"

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




// ProtectedRoute component
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
  const location = window.location.pathname;  // Get current path

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
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
    return <FullScreenLoader />;
  }

  // Allow access to landing page even when authenticated
  if (location === '/' && isAuthenticated) {
    return children;
  }

  // Redirect to appropriate dashboard if authenticated and trying to access login/signup
  if (isAuthenticated && (location === '/login' || location === '/signup')) {
    if (userType === 'farmer') {
      return <Navigate to="/farmer/dashboard" replace />;
    } else if (userType === 'buyer') {
      return <Navigate to="/buyer/dashboard" replace />;
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
    element: <PublicRoute><Landing /></PublicRoute>  // Changed from ProtectedRoute to PublicRoute
  },
  {
    path: "/login",
    element: <PublicRoute><LoginPage /></PublicRoute>
  },
  {
    path: "/signup",
    element: <PublicRoute><SignupPage /></PublicRoute>
  },
  {
    path: "/farmer",
    element: <ProtectedRoute>
      <UserTypeRoute allowedType="farmer">
        <Farmer />
      </UserTypeRoute>
    </ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <FarmerDash />            
      },
      {
        path: "manage-cow",
        element: <ComingSoon />
      },
      {
        path: "maps",
        element: <FarmerMaps />
      },
      {
        path: "chat",
        element: <ChatBot />
      },
      {
        path: "add-product",
        element: <ComingSoon />
      },
      {
        path: "products",
        element: <ComingSoon />
      },
      {
        path: "product/:productId",
        element: <ComingSoon />
      },
      {
        path: "breed",
        element: <ExploreBreed />
      },
      {
        path: 'disease',
        element: <IdentifyDisease />,
        children: [
          {
            index: true,
            element: <Navigate to="image" replace />
          },
          {
            path: "image",
            element: <FindDisease />
          },
          {
            path: "question",
            element: <Diseaseqna />
          }
        ]
      },
      {
        path: "settings",
        element: <SettingsPage/>
      },
      {
        path: "article",
        element: <ArticleListing/>
      },
      {
        path: "article/:articleId",
        element: <Article/>
      },
      {
        path: 'events',
        element: <Events/>
      },
      {
        path: "map",
        element: <FarmerMap/>
      },
      {
        path:"breed-identify",
        element:<CowBreedIdentifier/>
      },
      {
        path:"coming-soon",
        element: <ComingSoon/>
      },
    ]
  },
  {
    path: "/buyer",
    element: <ProtectedRoute>
      <UserTypeRoute allowedType="buyer">
        <User />
      </UserTypeRoute>
    </ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <UserDash />
      },
      {
        path: "chat",
        element: <ChatBot />
      },
      {
        path: "breed",
        element: <ExploreBreed />
      },
      {
        path: 'item-list',
        element: <ItemList />
      },
      {
        path: 'product/:productId',
        element: <ItemDetail />
      },
      {
        path: "article",
        element: <ArticleListing/>
      },
      {
        path: "article/:articleId",
        element: <Article/>
      },
      {
        path: "map",
        element: <BuyerGoogleMap/>
      },
      {
        path: 'disease',
        element: <IdentifyDisease />,
        children: [
          {
            index: true,
            element: <Navigate to="image" replace />
          },
          {
            path: "image",
            element: <FindDisease />
          },
          {
            path: "question",
            element: <Diseaseqna />
          }
        ]
      },
      {
        path:"breed-identify",
        element:<CowBreedIdentifier/>
      },
      {
        path: 'events',
        element: <Events/>
      },
      {
        path:"coming-soon",
        element: <ComingSoon/>
      },
      {
        path: "settings",
        element: <SettingsPage/>
      },
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  },
  {
    path: "/loading",
    element: <FullScreenLoader />
  },
  {
    path:"/coming-soon",
    element: <ComingSoon/>
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