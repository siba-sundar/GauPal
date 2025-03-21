import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart, User as UserIcon, ChevronDown } from "lucide-react";
import logo from '../assets/6.png';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center space-x-8">
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-green-600"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg">
                  <div className="py-1">
                    <Link 
                      to="/coming-soon" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      Breed Identification
                    </Link>
                    <Link 
                      to="/coming-soon" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      Breed Pairing
                    </Link>
                    <Link 
                      to="/coming-soon" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      Disease Identification
                    </Link>
                    <Link 
                      to="/coming-soon" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      Know More About Breeds
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/products" className="text-gray-700 hover:text-green-600">
              Marketplace
            </Link>

            <Link to="/nearby-ngos" className="text-gray-700 hover:text-green-600">
              Find NGOs
            </Link>

            <Link to="/find-clinics" className="text-gray-700 hover:text-green-600">
              Find Clinics
            </Link>

            {user?.type === 'farmer' && (
              <Link to="/farmer-dashboard" className="text-gray-700 hover:text-green-600">
                Farmer Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="text-gray-700 hover:text-green-600">
              <ShoppingCart className="h-6 w-6" />
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
              >
                <UserIcon className="h-6 w-6" />
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;