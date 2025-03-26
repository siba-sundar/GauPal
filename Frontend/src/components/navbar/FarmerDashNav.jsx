import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import LogoutButton from '../Logout.jsx';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/farmer/dashboard' },
    { icon: Home, label: 'Manage Cows', path: '/farmer/manage-cow' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' }
  ];

  const productItems = [
    { label: 'Add Product', path: '/farmer/add-product' },
    { label: 'Products List', path: '/farmer/products' }
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleProductsDropdown = () => setIsProductsOpen(!isProductsOpen);

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
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Anand Singh</p>
                <p className="text-xs text-gray-500">Farmer</p>
              </div>
            </div>
            
            <Link to="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
            
            <div className="px-3">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;