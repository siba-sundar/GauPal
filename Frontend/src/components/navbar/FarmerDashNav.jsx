import React from 'react';
import { Bell } from 'lucide-react';
import LogoutButton from '../Logout.jsx';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">
            G
          </span>
          <h1 className="text-xl font-bold text-gray-800">GauPalak Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
            <Bell size={20} />
          </button>

          <div>
            <LogoutButton />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
              A
            </div>
            <span className="hidden sm:inline-block text-sm font-medium text-gray-700">Anand Singh</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;