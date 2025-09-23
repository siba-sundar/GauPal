import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  TrendingUp,
  Package,
  Tag,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { getAuth } from "firebase/auth";
import axios from "axios";

import ChatbotComponent from "../ChatBot.jsx";
import { MessageCircle, X, Minus } from "lucide-react";

const FarmerDash = () => {
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  // State to track which item is active for auto-scrolling
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for the scrollable containers
  const articlesRef = useRef(null);
  const eventsRef = useRef(null);
  // (Removed unused sample data to keep lint clean)

  const upcomingEvents = [
    { id: 1, title: "Vaccination Due - 3 Cows", date: "Mar 25, 2025" },
    { id: 2, title: "Breeding Period - Lakshmi", date: "Apr 02, 2025" },
    { id: 3, title: "Health Check - All Cattle", date: "Apr 10, 2025" },
  ];

  const toggleChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  // Chat open/minimize is controlled by `isChatMinimized`. We removed separate closed state to keep hooks consistent.

  // Function to scroll containers
  const scroll = (containerRef, direction) => {
    if (containerRef.current) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      const newScrollPosition =
        containerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  // Function to handle auto-scrolling
  const scrollToArticle = useCallback(
    (index) => {
      if (
        articlesRef.current &&
        articles.length > 0 &&
        index < articles.length
      ) {
        const cardWidth =
          articlesRef.current.querySelector(".article-card")?.offsetWidth || 0;
        const margin = 16; // Adjust this to match your card's margin
        articlesRef.current.scrollTo({
          left: index * (cardWidth + margin),
          behavior: "smooth",
        });
        setActiveArticleIndex(index);
      }
    },
    [articles.length]
  );

  const scrollToEvent = useCallback(
    (index) => {
      if (eventsRef.current && events.length > 0 && index < events.length) {
        const cardWidth =
          eventsRef.current.querySelector(".event-card")?.offsetWidth || 0;
        const margin = 16; // Adjust this to match your card's margin
        eventsRef.current.scrollTo({
          left: index * (cardWidth + margin),
          behavior: "smooth",
        });
        setActiveEventIndex(index);
      }
    },
    [events.length]
  );

  // Auto scroll timer

  useEffect(() => {
    const articlesInterval = setInterval(() => {
      if (articles.length > 0) {
        const nextIndex = (activeArticleIndex + 1) % articles.length;
        scrollToArticle(nextIndex);
      }
    }, 5000);

    const eventsInterval = setInterval(() => {
      if (events.length > 0) {
        const nextIndex = (activeEventIndex + 1) % events.length;
        scrollToEvent(nextIndex);
      }
    }, 5000);

    return () => {
      clearInterval(articlesInterval);
      clearInterval(eventsInterval);
    };
  }, [
    activeArticleIndex,
    activeEventIndex,
    articles.length,
    events.length,
    scrollToArticle,
    scrollToEvent,
  ]);

  useEffect(() => {
    const fetchRandomArticles = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          // For non-authenticated users, fetch public articles
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/gaupal/article/public/random`
          );
          setArticles(response.data.data || []);
          return;
        }

        const token = await user.getIdToken();
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/gaupal/article/random/article`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArticles(response.data.data || []);
      } catch (error) {
        console.error("Error fetching random articles:", error);
        setError("Failed to fetch articles");
        setArticles([]);
      }
    };

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/gaupal/events?page=1&limit=6`
        );
        setEvents(response.data.data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomArticles();
    fetchEvents();
  }, []);

  return (
    <div className="relative min-h-screen">
      <main className="m:px-6 lg:px-8 py-6">
        {/* Top Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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
        </div> */}

        {/* Charts & Recent Activity */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
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
        </div> */}

        {/* Vaccinations & Cattle Health (Top cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Vaccinations
              </h3>
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
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Cattle Health Status
              </h3>
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
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "33%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-medium text-gray-700">Good</p>
                <p className="text-sm text-gray-500">12 cattle</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-medium text-gray-700">Fair</p>
                <p className="text-sm text-gray-500">3 cattle</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: "12.5%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-medium text-gray-700">Poor</p>
                <p className="text-sm text-gray-500">1 cattle</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: "4.5%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Below the top cards: Latest Articles (stacked) and Upcoming Events (below) */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-full">
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Latest Articles
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => scroll(articlesRef, "left")}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none hidden md:block"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => scroll(articlesRef, "right")}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none hidden md:block"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div
                ref={articlesRef}
                className="flex overflow-x-auto pb-3 gap-3 hide-scrollbar snap-x snap-mandatory px-2"
              >
                {isLoading ? (
                  <div className="w-full text-center py-4">
                    Loading articles...
                  </div>
                ) : error ? (
                  <div className="w-full text-center py-4 text-red-500">
                    {error}
                  </div>
                ) : articles.length > 0 ? (
                  articles.map((article, index) => (
                    <div
                      key={article._id || index}
                      className="article-card flex-shrink-0 w-96 bg-white rounded-lg shadow-md overflow-hidden snap-center"
                    >
                      <img
                        src={
                          article.introduction.image.url ||
                          "/api/placeholder/300/200"
                        }
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/300/200";
                        }}
                      />
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {article.description ||
                            article.content?.substring(0, 100)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-4">
                    No articles available
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-4 space-x-1 md:hidden">
                {articles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToArticle(index)}
                    className={`h-2 rounded-full focus:outline-none ${
                      activeArticleIndex === index
                        ? "w-4 bg-green-600"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-full mt-4">
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Upcoming Events
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => scroll(eventsRef, "left")}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none hidden md:block"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => scroll(eventsRef, "right")}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none hidden md:block"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div
                ref={eventsRef}
                className="flex overflow-x-auto pb-3 gap-3 hide-scrollbar snap-x snap-mandatory px-2"
              >
                {isLoading ? (
                  <div className="w-full text-center py-4">
                    Loading events...
                  </div>
                ) : error ? (
                  <div className="w-full text-center py-4 text-red-500">
                    {error}
                  </div>
                ) : events.length > 0 ? (
                  events.map((event, index) => (
                    <div
                      key={event._id || index}
                      className="event-card flex-shrink-0 w-96 bg-white rounded-lg shadow-md overflow-hidden relative snap-center"
                    >
                      <img
                        src={
                          event.images?.[0]?.url || "/api/placeholder/300/200"
                        }
                        alt={event.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/300/200";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 p-3 w-full">
                        <div className="flex justify-between items-end">
                          <div>
                            <h3 className="font-semibold text-white mb-1 line-clamp-3">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-200 mb-2 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end ml-2 text-xs text-gray-200">
                            <div className="flex items-center mb-1">
                              <Clock size={12} className="mr-1" />
                              <span>{event.time || event.date}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={12} className="mr-1" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-4">
                    No events available
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-4 space-x-1 md:hidden">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToEvent(index)}
                    className={`h-2 rounded-full focus:outline-none ${
                      activeEventIndex === index
                        ? "w-4 bg-green-600"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
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
              <MessageCircle
                size={24}
                className={`${window.innerWidth <= 600 ? "" : "mr-2"}`}
              />
              <span className="max-[600px]:hidden">GauGuru Assistant</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="bg-green-500 text-white p-3 rounded-t-lg flex justify-between items-center">
              <span className="font-semibold">GauGuru Assistant</span>
              <div className="flex space-x-2">
                <button
                  onClick={toggleChat}
                  className="hover:bg-green-600 p-1 rounded"
                >
                  <Minus size={20} />
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

export default FarmerDash;
