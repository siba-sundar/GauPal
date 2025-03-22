import React from 'react';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import Logout from "../../components/Logout.jsx";

const Navbar = () => {
  return (
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
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
            <Heart size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
              R
            </div>
            <span className="text-sm font-medium text-gray-700">Rajesh Kumar</span>
          </div>
          <Logout />
        </div>
      </div>
    </header>
  );
};

export default Navbar;