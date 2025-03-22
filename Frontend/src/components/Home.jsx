import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Truck, Search, Dna, Stethoscope, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import dairyImage from '../assets/DairyImage.jpg';
import biogasImage from '../assets/BiogasImg.jpeg';
import ayurvedicImage from '../assets/AyurvedicImg.jpg';
import fertilizerImage from '../assets/FertilizerImg.jpg';

export default function Home() {
  const services = [
    {
      title: "Breed Identification",
      description: "Upload a cow's image and instantly identify its breed and regional availability in India.",
      icon: Search,
      link: "/breed-identification"
    },
    {
      title: "Breed Pairing",
      description: "Discover optimal breed combinations for enhanced product quality and market value.",
      icon: Dna,
      link: "/breed-pairing"
    },
    {
      title: "Disease Identification",
      description: "AI-powered disease detection with preventive measures and solutions.",
      icon: Stethoscope,
      link: "/disease-identification"
    },
    {
      title: "Breed Knowledge Hub",
      description: "Comprehensive information about cow breeds, their benefits, and regional distribution.",
      icon: BookOpen,
      link: "/breed-info"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-5xl font-bold mb-6">
              Complete Cow Management <br />
              & Marketplace Solution
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              From breed identification to disease detection, and direct market access - 
              we provide comprehensive solutions for farmers and cow products enthusiasts.
            </p>
            <div className="flex space-x-4">
              <Link to="/coming-soon" className="bg-green-600 text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
                <span>Explore Services</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products" className="bg-white text-green-600 px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors">
                <span>Visit Marketplace</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <motion.div
                key={service.title}
                whileHover={{ y: -10 }}
                className="p-6 bg-gray-50 rounded-lg"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link to="/coming-soon" className="text-green-600 hover:text-green-700 font-medium">
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Marketplace Categories</h2>
          <p className="text-center text-gray-600 mb-12">Connect directly with verified farmers for authentic cow products</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Dairy Products', description: 'Fresh milk, ghee, and dairy items', image: dairyImage, category: 'dairy' },
              { name: 'Biogas Solutions', description: 'Sustainable energy solutions', image: biogasImage, category: 'biogas' },
              { name: 'Ayurvedic Products', description: 'Traditional wellness products', image: ayurvedicImage, category: 'ayurvedic' },
              { name: 'Organic Fertilizers', description: 'Natural farming solutions', image: fertilizerImage, category: 'fertilizer' }
            ].map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link 
                    to={`/products?category=${category.category}`} 
                    className="text-green-600 font-medium hover:text-green-700"
                  >
                    Browse →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Farmers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Are You a Farmer?</h2>
            <p className="text-gray-600 mb-8">List your products and reach customers directly</p>
            <Link
              to="/register"
              className="bg-green-600 text-white px-8 py-3 rounded-lg inline-flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <span>Join as Farmer</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}