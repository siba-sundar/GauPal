import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/7.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex flex-col justify-start">
            <img src={logo} alt="GauPal Logo" className="h-20 w-48 mb-4" />
            <div className="flex space-x-12 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/breed-identification" className="text-gray-400 hover:text-white">
                  Breed Identification
                </Link>
              </li>
              <li>
                <Link to="/breed-pairing" className="text-gray-400 hover:text-white">
                  Breed Pairing
                </Link>
              </li>
              <li>
                <Link to="/disease-identification" className="text-gray-400 hover:text-white">
                  Disease Identification
                </Link>
              </li>
              <li>
                <Link to="/breed-info" className="text-gray-400 hover:text-white">
                  Breed Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace/dairy" className="text-gray-400 hover:text-white">
                  Dairy Products
                </Link>
              </li>
              <li>
                <Link to="/marketplace/biogas" className="text-gray-400 hover:text-white">
                  Biogas Solutions
                </Link>
              </li>
              <li>
                <Link to="/marketplace/ayurvedic" className="text-gray-400 hover:text-white">
                  Ayurvedic Products
                </Link>
              </li>
              <li>
                <Link to="/marketplace/fertilizer" className="text-gray-400 hover:text-white">
                  Organic Fertilizers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:support@gaupal.com">support@gaupal.com</a>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-2" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Bengaluru, Karnataka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} GauPal. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/faq" className="text-gray-400 hover:text-white text-sm">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;