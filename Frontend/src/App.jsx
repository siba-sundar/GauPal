import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/SignupPage.jsx';
import NotFoundPage from './pages/NoFound.jsx';
import { AuthProvider } from '../utils/AuthProvider.jsx';

// common imports 
import ChatBot from "./components/ChatBot.jsx"
import Landing from './pages/Landing.jsx';
import ExploreBreed from "./components/common/ExploreBreed.jsx"
import Loading from './components/common/loading.jsx'; // Fixed capitalization

// farmer imports 
import Farmer from "./layouts/Farmer.jsx"
import FarmerDash from './components/farmer/FarmerDash.jsx';
import CowManage from "./pages/CowManage.jsx"
import FarmerMaps from "./components/farmer/GoogleMapView.jsx"
import AddProducts from "./components/farmer/AddProduct.jsx"
import ProductList from "./components/farmer/ProductList.jsx"
import ProductDetails from './components/farmer/ProductDetail.jsx';

// buyer imports 
import User from "./layouts/User.jsx"
import UserDash from './components/user/UserDash.jsx';
import Article from  "./components/user/Article.jsx"
import ItemList from "./components/user/ItemsList.jsx"
import ItemDetail from "./components/user/ItemDetails.jsx"

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

// Sample data
const sampleData = {
  "title": "Gir Cow Breed: India's Pride and a Symbol of Milk Abundance",
  "introduction": {
    "content": "The Gir cow is one of the most admired and famous indigenous cow breeds of India. Originating from Gujarat, the Gir breed is widely recognized for its milk production, resilience, and adaptability. This article provides an in-depth look into the Gir cow's characteristics, importance, and its role in Indian agriculture.",
    "image": {
      "url": "https://example.com/gir_cow_intro.jpg",
      "caption": "A majestic Gir cow from Gujarat, India"
    }
  },
  "headings": [
    {
      "heading": "Origin and History",
      "content": "The Gir cow breed hails from the Gir forests of Gujarat and parts of Maharashtra. This breed has been known for centuries and is revered for its strong genetics and milk production capabilities. It is one of the principal Zebu cattle breeds in India.",
      "image": {
        "url": "https://example.com/gir_cow_origin.jpg",
        "caption": "Gir cows grazing in the Gir forest, Gujarat"
      }
    },
    {
      "heading": "Physical Characteristics",
      "content": "Gir cows are distinct in appearance, characterized by their large, curving horns and prominent foreheads. They are typically reddish-brown in color, with some cows showing white patches. Their ears are pendulous, and they have a hump on their back, which is common in Zebu cattle.",
      "image": {
        "url": "https://example.com/gir_cow_physical.jpg",
        "caption": "Distinct physical features of the Gir cow: prominent forehead, curving horns, and reddish-brown color"
      }
    },
    {
      "heading": "Milk Production",
      "content": "One of the standout features of the Gir cow is its ability to produce high-quality milk. On average, a Gir cow produces around 10-15 liters of milk per day, rich in A2 protein, which is known to be healthier than A1 milk. This breed is often crossbred with other dairy breeds to improve milk production in other regions.",
      "image": {
        "url": "https://example.com/gir_cow_milk.jpg",
        "caption": "A Gir cow being milked, known for producing high-quality A2 milk"
      }
    },
    {
      "heading": "Common Diseases",
      "subsections": [
        {
          "disease": "Foot-and-Mouth Disease (FMD)",
          "details": "Gir cows, like many livestock, are susceptible to Foot-and-Mouth Disease, which causes sores and fever. It can affect their milk production and cause discomfort.",
          "prevention": "Regular vaccinations and maintaining hygiene in their habitat can prevent the spread of this disease."
        },
        {
          "disease": "Mastitis",
          "details": "Mastitis is an inflammation of the udder tissue in dairy cows. It can lead to reduced milk yield and quality. This condition is common in high-producing cows like Gir.",
          "prevention": "Ensuring the cleanliness of milking equipment and proper milking practices are vital in preventing mastitis."
        }
      ]
    },
    {
      "heading": "Special Features of the Gir Cow",
      "content": "Gir cows are highly resistant to hot weather and have adapted well to dry and arid environments. They are also disease-resistant, making them low-maintenance for farmers. Additionally, their milk contains high levels of A2 protein, which is considered beneficial for human consumption.",
      "image": {
        "url": "https://example.com/special_features_gir_cow.jpg",
        "caption": "Gir cows are known for their resilience and special adaptability to arid climates."
      }
    },
    {
      "heading": "Uses of the Gir Cow",
      "content": "The Gir cow is primarily used for milk production, but it also plays a role in draft work in some areas. Due to its strong genetic traits, Gir cows are often crossbred with other breeds to enhance milk production in dairy farms.",
      "image": {
        "url": "https://example.com/gir_cow_uses.jpg",
        "caption": "Gir cows are used for milk production and crossbreeding programs."
      }
    },
    {
      "heading": "Conclusion",
      "content": "The Gir cow holds an esteemed place in Indian dairy farming. With its rich history, unique physical attributes, and valuable milk production, it has made significant contributions to both rural economies and dairy farming industries worldwide.",
      "image": {
        "url": "https://example.com/gir_cow_conclusion.jpg",
        "caption": "Gir cow: A valuable asset to the Indian dairy farming industry"
      }
    }
  ]
};

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
      return <Navigate to="/farmer/dashboard" replace />;
    } else if (userType === 'buyer') {
      return <Navigate to="/buyer/dashboard" replace />;
    } else {
      return <Navigate to="/loading" replace />;
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
        <Landing />
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
    path: "/farmer",
    element: (
      <ProtectedRoute>
        <UserTypeRoute allowedType="farmer">
          <Farmer />
        </UserTypeRoute>
      </ProtectedRoute>
    ),
    children:[
      {
        path: "dashboard",
        element:<FarmerDash />            
      },
      {
        path:"manage-cow",
        element:<CowManage />
      },
      {
        path:"maps",
        element:<FarmerMaps />
      },
      {
        path:"chat",
        element:<ChatBot />
      },
      {
        path:"add-product",
        element:<AddProducts />
      },
      {
        path:"products",
        element:<ProductList />
      },
      {
        path:"product/:productId",
        element:<ProductDetails />
      },
      {
        path:"breed",
        element:<ExploreBreed />
      },
    ]
  },
  {
    path: "/buyer",
    element: (
      <ProtectedRoute>
        <UserTypeRoute allowedType="buyer">
          <User />
        </UserTypeRoute>
      </ProtectedRoute>
    ),
    children:[
      {
        path:"dashboard",
        element:<UserDash />
      },
      {
        path:"chat",
        element:<ChatBot />
      },
      {
        path:"article/:article-id",
        element:<Article articleData={sampleData}/>
      },
      {
        path:"breed",
        element:<ExploreBreed />
      },
      {
        path:'item-list',
        element:<ItemList />
      },
      {
        path:'product/:productId',
        element:<ItemDetail />
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/loading", // Fixed typo from "pat" to "path"
    element: <Loading /> // Capitalized component name
  }
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