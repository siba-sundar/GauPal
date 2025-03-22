import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const products = [
  {
    id: '1',
    name: 'Organic Cow Milk',
    description: 'Fresh organic cow milk from grass-fed cows',
    price: 60,
    category: 'dairy',
    rating: 4.5,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=500'],
  },
  {
    id: '2',
    name: 'Biogas Plant Setup',
    description: 'Complete biogas plant setup for home use',
    price: 15000,
    category: 'biogas',
    rating: 4.8,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1553708881-112abc53fe54?auto=format&fit=crop&q=80&w=500'],
  },
];

const categories = [
  { id: 'dairy', name: 'Dairy Products' },
  { id: 'biogas', name: 'Biogas' },
  { id: 'ayurvedic', name: 'Ayurvedic Products' },
  { id: 'fertilizer', name: 'Organic Fertilizers' },
];

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar and Filter */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>

          {/* Price Filter Popup */}
          {showPriceFilter && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Price Range</h3>
                <button 
                  onClick={() => setShowPriceFilter(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full p-2 border rounded-md"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full p-2 border rounded-md"
                      min="0"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowPriceFilter(false)}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-4 overflow-x-auto pb-2 mb-4">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              category.id === selectedCategory ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative pb-[75%]">
              <img
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">₹{product.price}</span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1">{product.rating}</span>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">Add to Cart</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}