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
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logout from "../../components/Logout.jsx";

import ChatbotComponent from '../ChatBot.jsx';
import { MessageCircle, X, Minus } from 'lucide-react';

const Navbar = () => {
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const productsDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [isChatClosed, setIsChatClosed] = useState(false);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  const closeChat = () => {
    setIsChatClosed(true);
  };

  const reopenChat = () => {
    setIsChatClosed(false);
    setIsChatMinimized(true);
  };

  if (isChatClosed) {
    return (
      <>
        <DashboardContent />
        
      </>
    );
  }

  const productItems = [
    { icon: Package, name: 'Fresh Milk', path: '/products/milk' },
    { icon: Package, name: 'Cheese', path: '/products/cheese' },
    { icon: Package, name: 'Yogurt', path: '/products/yogurt' },
   
  ];

  const userMenuItems = [
    {
      icon: User,
      label: 'Profile',
      path: '/profile'
    },
    {
      icon: Settings,
      label: 'Account Settings',
      path: '/settings'
    },
    {
      icon: CreditCard,
      label: 'Billing',
      path: '/billing'
    },
    {
      icon: LogOut,
      label: 'Logout',
      component: <Logout />
    }
  ];

  return (
    <div className="relative min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">
              G
            </span>
            <h1 className="text-xl font-bold text-gray-800">GauShala Marketplace</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            {/* Products Dropdown */}
            <div className="relative" ref={productsDropdownRef}>
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
            </div>

            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <Heart size={20} />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2"
              >
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                  R
                </div>
                <span className="text-sm font-medium text-gray-700">Rajesh Kumar</span>
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


      {/* Chatbot Widget */}
      <div className="fixed bottom-4 right-4 z-50 ">
        {isChatMinimized ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleChat}
              className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center"
            >
              <MessageCircle size={24} className="mr-2" /> GauGuru Assistant
            </button>

          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl border border-gray-200">
            <div
              className="bg-green-500 text-white p-3 rounded-t-lg flex justify-between items-center"
            >
              <span className="font-semibold">Customer Support</span>
              <div className="flex space-x-2">
                <button
                  onClick={toggleChat}
                  className="hover:bg-green-600 p-1 rounded"
                >
                  <Minus size={20} />
                </button>
                <button
                  onClick={closeChat}
                  className="hover:bg-red-600 p-1 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="h-[80vh]">
              <ChatbotComponent />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;