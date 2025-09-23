import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  Package,
  Clipboard,
  Truck,
  User,
  Settings,
  CreditCard,
  LogOut,
  ScanSearch,
  MapPin,
  Newspaper,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logout from "../../components/Logout.jsx";
import { getAuth } from "firebase/auth";
import axios from "axios";

const Navbar = () => {
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const productsDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [username, setUsername] = useState(null);
  const auth = getAuth();
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Products dropdown
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(event.target)
      ) {
        setIsProductsDropdownOpen(false);
      }

      // User dropdown
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    const fetchDetails = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.log('Error: Unable to find user');
          return;
        }

        const token = await user.getIdToken();
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUsername(response.data.fullName);


      } catch (err) {
        console.log('Error fetching data', err);
      }
    };

    fetchDetails();


    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, []);

  const productItems = [
    { icon: Newspaper, name: 'Knowledge Center', path: '/buyer/article' },
    { icon: Calendar, name: 'Events', path: '/buyer/events' },
    { icon: MapPin, name: 'NGOs Near me', path: '/buyer/map' },
    { icon: Package, name: 'Market', path: '/buyer/item-list' },
    { icon: Stethoscope, name: 'Identify Disease', path: '/buyer/disease' },
    { icon: ScanSearch, name: 'Identify Breed', path: '/buyer/breed-identify' },

  ];

  const userMenuItems = [
    {
      icon: User,
      label: 'Profile',
      path: '/buyer/coming-soon'
    },
    {
      icon: Settings,
      label: 'Account Settings',
      path: '/buyer/coming-soon'
    },
    {
      icon: CreditCard,
      label: 'Billing',
      path: '/buyer/coming-soon'
    },
    {
      icon: LogOut,
      label: 'Logout',
      component: <Logout />
    }
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">
            G
          </span>
          <Link to="/buyer/dashboard" className="text-xl font-bold text-gray-800">GauPal</Link>
        </div>
        <div className="flex items-center space-x-6">
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div> */}

          {/* Products Dropdown */}
          {/* <div className="relative" ref={productsDropdownRef}>
            <button
              onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
              className="flex items-center text-gray-700 hover:text-green-600 focus:outline-none"
            >
              Our Products
              <ChevronDown
                size={18}
                className={`ml-1 transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {isProductsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-[300px] bg-green-50 rounded-lg shadow-2xl p-4 z-50">
                <ul className="space-y-2">
                  {productItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.path}
                        className="flex items-center text-gray-700 hover:text-green-600 hover:bg-green-100 px-2 py-2 rounded-md"
                        onClick={() => setIsProductsDropdownOpen(false)}
                      >
                        <item.icon size={18} className="mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div> */}

          

          {/* User Dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                R
              </div>
              <span className="text-sm font-medium text-gray-700">{username ? username : "username"}</span>
              <ChevronDown
                size={18}
                className={`ml-1 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl p-2 z-50">
                {userMenuItems.map((item, index) => (
                  <div key={index}>
                    {item.component ? (
                      item.component
                    ) : (
                      <Link
                        to={item.path}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-green-50 text-gray-700 hover:text-green-600"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;