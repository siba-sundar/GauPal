import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Menu,
  X,
  Home,
  ClipboardList,
  ShoppingBag,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  FileText,
  Stethoscope,
  Newspaper,
  MapPin,
  Package,
  ListOrdered,
  ScanSearch,
  Calendar,
  Dna
} from 'lucide-react';
import axios from "axios";
import LogoutButton from '../Logout.jsx';

import { getAuth } from "firebase/auth"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/farmer/dashboard' },
    { icon: Dna, label: 'Manage Cows', path: '/farmer/manage-cow' },
    { icon: ListOrdered, label: 'Orders', path: '/farmer/coming-soon' },
    { icon: Stethoscope, label: 'Identify Disease', path: '/farmer/disease' },
    { icon: ScanSearch, label: 'Identify Breed', path: '/farmer/breed-identify' },
    { icon: Newspaper, label: 'Articles', path: '/farmer/article' },
    { icon: Calendar, label: 'Events', path: '/farmer/events' },
    { icon: MapPin, label: 'Vet Near Me', path: '/farmer/map' },
  ];

  const productItems = [
    { icon: Package, label: 'Add Product', path: '/farmer/add-product' },
    { icon: ClipboardList, label: 'Products List', path: '/farmer/products' }
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleProductsDropdown = () => setIsProductsOpen(!isProductsOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const auth = getAuth();
  useEffect(() => {
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
  }, [])

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-20 px-4 py-2">
        <div className="flex items-center justify-between">
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="text-xl font-bold text-gray-800">GauPalak</span>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:transform-none
      `}>
        {/* Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <span className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">
              G
            </span>
            <h1 className="text-xl font-bold text-gray-800">GauPalak</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex-1">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Products Dropdown */}
            <div>
              <button
                onClick={toggleProductsDropdown}
                className="w-full flex items-center justify-between space-x-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingBag size={20} />
                  <span>Products</span>
                </div>
                {isProductsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {isProductsOpen && (
                <div className="pl-6 mt-1 space-y-1">
                  {productItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="block px-3 py-2 text-sm rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t p-4">
          <button 
            onClick={toggleUserMenu}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600"
          >
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
              {username ? username.charAt(0) : "A"}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-700">{username ? username : "username"}</p>
              <p className="text-xs text-gray-500">Farmer</p>
            </div>
            {isUserMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
              
          {isUserMenuOpen && (
            <div className="mt-2 space-y-2">
              <Link to="/farmer/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600">
                <Settings size={20} />
                <span>Settings</span>
              </Link>

              <div className="px-3">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;