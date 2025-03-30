
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Clock, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Calendar, ChevronRight, TrendingUp, Package, Tag } from 'lucide-react';

import ChatbotComponent from '../ChatBot.jsx';
import { MessageCircle, X, Minus } from 'lucide-react';

const DashboardContent = () => {

  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [isChatClosed, setIsChatClosed] = useState(false);
  // State to track which item is active for auto-scrolling
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Refs for the scrollable containers
  const articlesRef = useRef(null);
  const eventsRef = useRef(null);
  // Sample data
  const cattleData = [
    { id: 'COW001', name: 'Lakshmi', breed: 'Gir', age: 4, health: 'Good', lastVaccination: '2025-02-15', milkYield: '18 liters/day' },
    { id: 'COW002', name: 'Nandini', breed: 'Sahiwal', age: 3, health: 'Excellent', lastVaccination: '2025-03-01', milkYield: '15 liters/day' },
    { id: 'COW003', name: 'Ganga', breed: 'Red Sindhi', age: 5, health: 'Fair', lastVaccination: '2025-01-20', milkYield: '12 liters/day' },
    { id: 'COW004', name: 'Gomata', breed: 'Tharparkar', age: 6, health: 'Good', lastVaccination: '2025-02-28', milkYield: '14 liters/day' },
  ];

  const salesData = [
    { name: 'Jan', value: 12500 },
    { name: 'Feb', value: 14800 },
    { name: 'Mar', value: 13900 },
  ];

  const productSplitData = [
    { name: 'Milk', value: 55 },
    { name: 'Ghee', value: 20 },
    { name: 'Dung Cakes', value: 15 },
    { name: 'Fertilizer', value: 10 },
  ];

  const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];

  const recentOrders = [
    { id: '#ORD-7829', customer: 'Rahul Sharma', product: 'Organic Milk (20L)', amount: '₹1,200', status: 'Delivered' },
    { id: '#ORD-7830', customer: 'Priya Desai', product: 'Desi Ghee (5kg)', amount: '₹3,500', status: 'Processing' },
    { id: '#ORD-7831', customer: 'Arvind Patel', product: 'Cow Dung Cakes (50)', amount: '₹500', status: 'Shipped' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Vaccination Due - 3 Cows', date: 'Mar 25, 2025' },
    { id: 2, title: 'Breeding Period - Lakshmi', date: 'Apr 02, 2025' },
    { id: 3, title: 'Health Check - All Cattle', date: 'Apr 10, 2025' },
  ];

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


  // Sample data - replace with your actual data
  const articles = [
    {
      id: 1,
      image: '/api/placeholder/300/200',
      title: 'Best Practices for Dairy Farming',
      description: 'Learn about the latest techniques to improve milk production and cow health.'
    },
    {
      id: 2,
      image: '/api/placeholder/300/200',
      title: 'Organic Feed Solutions',
      description: 'Discover organic feed options that can boost cow health and milk quality.'
    },
    {
      id: 3,
      image: '/api/placeholder/300/200',
      title: 'Disease Prevention Guide',
      description: 'Essential tips to keep your cattle healthy and prevent common diseases.'
    },
    {
      id: 4,
      image: '/api/placeholder/300/200',
      title: 'Modern Dairy Equipment',
      description: 'New technologies that can improve efficiency on your dairy farm.'
    }
  ];

  const events = [
    {
      id: 1,
      image: '/api/placeholder/300/200',
      title: 'Farmer\'s Market',
      description: 'Sell your dairy products directly to customers',
      location: 'City Center',
      time: 'Apr 15, 9AM-2PM'
    },
    {
      id: 2,
      image: '/api/placeholder/300/200',
      title: 'Cattle Health Workshop',
      description: 'Expert veterinarians will share insights',
      location: 'Agricultural College',
      time: 'Apr 22, 10AM-12PM'
    },
    {
      id: 3,
      image: '/api/placeholder/300/200',
      title: 'Annual Dairy Expo',
      description: 'Network with other farmers and suppliers',
      location: 'Exhibition Center',
      time: 'May 5-7, All Day'
    },
    {
      id: 4,
      image: '/api/placeholder/300/200',
      title: 'Sustainable Farming Seminar',
      description: 'Learn eco-friendly farming practices',
      location: 'Community Hall',
      time: 'May 12, 2PM-5PM'
    }
  ];

  // Function to scroll containers
  const scroll = (containerRef, direction) => {
    if (containerRef.current) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      const newScrollPosition = containerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Function to handle auto-scrolling
  const scrollToArticle = (index) => {
    if (articlesRef.current && index < articles.length) {
      const cardWidth = articlesRef.current.querySelector('.article-card').offsetWidth;
      const margin = 16; // Adjust this to match your card's margin
      articlesRef.current.scrollTo({
        left: index * (cardWidth + margin),
        behavior: 'smooth'
      });
      setActiveArticleIndex(index);
    }
  };

  const scrollToEvent = (index) => {
    if (eventsRef.current && index < events.length) {
      const cardWidth = eventsRef.current.querySelector('.event-card').offsetWidth;
      const margin = 16; // Adjust this to match your card's margin
      eventsRef.current.scrollTo({
        left: index * (cardWidth + margin),
        behavior: 'smooth'
      });
      setActiveEventIndex(index);
    }
  };

  // Auto scroll timer
  useEffect(() => {
    const articlesInterval = setInterval(() => {
      const nextIndex = (activeArticleIndex + 1) % articles.length;
      scrollToArticle(nextIndex);
    }, 5000);

    const eventsInterval = setInterval(() => {
      const nextIndex = (activeEventIndex + 1) % events.length;
      scrollToEvent(nextIndex);
    }, 5000);

    return () => {
      clearInterval(articlesInterval);
      clearInterval(eventsInterval);
    };
  }, [activeArticleIndex, activeEventIndex, articles.length, events.length]);


  return (
    <div className="relative min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Cattle</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">24</h2>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">

              </div>
            </div>
            <div className="mt-3 md:mt-4 flex items-center text-sm">
              <span className="text-green-500 font-medium">+3 </span>
              <span className="text-gray-500 ml-1">since last month</span>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">₹41,200</h2>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="mt-3 md:mt-4 flex items-center text-sm">
              <span className="text-green-500 font-medium">+18% </span>
              <span className="text-gray-500 ml-1">since last month</span>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Orders</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">12</h2>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Package size={20} />
              </div>
            </div>
            <div className="mt-3 md:mt-4 flex items-center text-sm">
              <span className="text-yellow-500 font-medium">4 </span>
              <span className="text-gray-500 ml-1">need attention</span>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Milk Yield</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">14.7 L/day</h2>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Tag size={20} />
              </div>
            </div>
            <div className="mt-3 md:mt-4 flex items-center text-sm">
              <span className="text-green-500 font-medium">+2.3 L </span>
              <span className="text-gray-500 ml-1">since last month</span>
            </div>
          </div>
        </div>

        {/* Charts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Monthly Sales Chart */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Sales</h3>
            <div className="h-64 md:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Split */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Product Split</h3>
            <div className="h-64 md:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productSplitData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productSplitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Recent Orders */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                View All <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-2 md:px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-2 md:px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="px-2 md:px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.product}
                        </td>
                        <td className="px-2 md:px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.amount}
                        </td>
                        <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Upcoming Events & Cattle Health */}
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {/* Upcoming Events */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Upcoming Events</h3>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                  View Calendar <Calendar size={16} className="ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cattle Health Status */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Cattle Health Status</h3>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                  View All <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">Excellent</p>
                  <p className="text-sm text-gray-500">8 cattle</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm font-medium text-gray-700">Good</p>
                  <p className="text-sm text-gray-500">12 cattle</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm font-medium text-gray-700">Fair</p>
                  <p className="text-sm text-gray-500">3 cattle</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '12.5%' }}></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm font-medium text-gray-700">Poor</p>
                  <p className="text-sm text-gray-500">1 cattle</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '4.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      
      </main>

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

      <div className="mt-6 space-y-8">
        {/* Articles Section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Latest Articles</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(articlesRef, 'left')}
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none hidden md:block"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll(articlesRef, 'right')}
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none hidden md:block"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={articlesRef}
            className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x snap-mandatory"
          >
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="article-card flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden snap-center"
              >
                <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile scroll indicators */}
          <div className="flex justify-center mt-4 space-x-1 md:hidden">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToArticle(index)}
                className={`h-2 rounded-full focus:outline-none ${activeArticleIndex === index ? 'w-4 bg-green-600' : 'w-2 bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(eventsRef, 'left')}
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none hidden md:block"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll(eventsRef, 'right')}
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none hidden md:block"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={eventsRef}
            className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x snap-mandatory"
          >
            {events.map((event, index) => (
              <div
                key={event.id}
                className="event-card flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden relative snap-center"
              >
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-4 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-200 mb-2">{event.description}</p>
                    </div>
                    <div className="flex flex-col items-end ml-2 text-xs text-gray-200">
                      <div className="flex items-center mb-1">
                        <Clock size={12} className="mr-1" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile scroll indicators */}
          <div className="flex justify-center mt-4 space-x-1 md:hidden">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToEvent(index)}
                className={`h-2 rounded-full focus:outline-none ${activeEventIndex === index ? 'w-4 bg-green-600' : 'w-2 bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Add some custom styles for hiding scrollbar but allowing scroll functionality */}
        <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </div>
    </div>
  );
};

export default DashboardContent;

