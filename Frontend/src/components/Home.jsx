import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, MapPin, Calendar, ChevronRight, TrendingUp, Package, Tag } from 'lucide-react';
import { ArrowRight, Search, Dna, Stethoscope, BookOpen } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import dairyImage from '../assets/DairyImage.jpg';
import biogasImage from '../assets/BiogasImg.jpeg';
import ayurvedicImage from '../assets/AyurvedicImg.jpg';
import fertilizerImage from '../assets/FertilizerImg.jpg';

// Function to call Google Translate API
const translateText = async (text, targetLang, apiKey) => {
  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        target: targetLang,
        format: 'text',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

export default function Home() {
  const [language, setLanguage] = useState('en'); // default to English
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY;

  // Added state for articles and events
  const [articles, setArticles] = useState([]);
  const [translatedArticles, setTranslatedArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [translatedEvents, setTranslatedEvents] = useState([]);
  const [error, setError] = useState(null);
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Added refs for scrolling
  // const articlesRef = useRef(null);
  const eventsRef = useRef(null);

  // List of Indian languages with their language codes
  const indianLanguages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ur', name: 'Urdu' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'or', name: 'Odia' },
    { code: 'as', name: 'Assamese' },
  ];

  const services = [
    { title: "Breed Identification", description: "Upload a cow's image and instantly identify its breed and regional availability in India.", icon: Search, link: "/breed-identification" },
    { title: "Breed Pairing", description: "Discover optimal breed combinations for enhanced product quality and market value.", icon: Dna, link: "/breed-pairing" },
    { title: "Disease Identification", description: "AI-powered disease detection with preventive measures and solutions.", icon: Stethoscope, link: "/disease-identification" },
    { title: "Breed Knowledge Hub", description: "Comprehensive information about cow breeds, their benefits, and regional distribution.", icon: BookOpen, link: "/breed-info" }
  ];

  // Fetch articles and events on component mount
  useEffect(() => {
    // fetchRandomArticles();
    fetchEvents();

    // Get saved language from local storage or default to English
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    // Translate the text if saved language is not English
    if (savedLanguage !== 'en') {
      handleTranslation(savedLanguage);
    } else {
      setIsLoading(false);
    }
  }, []);

  /* // Function to fetch random articles
  const fetchRandomArticles = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        // For non-authenticated users, you might want to fetch public articles
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/article/public/random`);
        
        setArticles(response.data.data || []);

        // Set translated articles initially to original articles
        setTranslatedArticles(response.data.data || []);

        // Translate articles if language is not English
        const savedLanguage = localStorage.getItem('language') || 'en';
        if (savedLanguage !== 'en') {
          translateArticlesAndEvents(response.data.data || [], [], savedLanguage);
        }

        return;
      }

      const token = await user.getIdToken();
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/article/random/article`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setArticles(response.data.data || []);

      // Set translated articles initially to original articles
      setTranslatedArticles(response.data.data || []);

      // Translate articles if language is not English
      const savedLanguage = localStorage.getItem('language') || 'en';
      if (savedLanguage !== 'en') {
        translateArticlesAndEvents(response.data.data || [], events, savedLanguage);
      }
    } catch (error) {
      console.error('Error fetching random articles:', error);
      setError('Failed to fetch articles');
      // Set some fallback articles in case of error
      setArticles([]);
      setTranslatedArticles([]);
    }
  }; */

  // Function to fetch events
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/events?page=1&limit=6`);
      setEvents(response.data.data || []);

      // Set translated events initially to original events
      setTranslatedEvents(response.data.data || []);

      // Translate events if language is not English
      const savedLanguage = localStorage.getItem('language') || 'en';
      if (savedLanguage !== 'en') {
        translateArticlesAndEvents(articles, response.data.data || [], savedLanguage);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      // Set some fallback events in case of error
      setEvents([]);
      setTranslatedEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to translate both articles and events
  const translateArticlesAndEvents = async (articlesData, eventsData, selectedLanguage) => {
    setIsLoading(true);

    try {
      // Translate articles if they exist
      if (articlesData.length > 0) {
        const translatedArticlesData = await Promise.all(
          articlesData.map(async (article) => {
            const translatedTitle = await translateText(article.title, selectedLanguage, apiKey);
            const translatedDescription = article.description
              ? await translateText(article.description, selectedLanguage, apiKey)
              : article.content
                ? await translateText(article.content.substring(0, 100) + '...', selectedLanguage, apiKey)
                : '';

            return {
              ...article,
              title: translatedTitle,
              description: translatedDescription
            };
          })
        );

        setTranslatedArticles(translatedArticlesData);
      }

      // Translate events if they exist
      if (eventsData.length > 0) {
        const translatedEventsData = await Promise.all(
          eventsData.map(async (event) => {
            const translatedTitle = await translateText(event.title, selectedLanguage, apiKey);
            const translatedDescription = event.description
              ? await translateText(event.description.substring(0, 60) + '...', selectedLanguage, apiKey)
              : '';
            const translatedLocation = event.location
              ? await translateText(event.location, selectedLanguage, apiKey)
              : await translateText('Online', selectedLanguage, apiKey);

            return {
              ...event,
              title: translatedTitle,
              description: translatedDescription,
              location: translatedLocation
            };
          })
        );

        setTranslatedEvents(translatedEventsData);
      }
    } catch (error) {
      console.error('Error translating articles and events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to scroll articles and events containers
  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Functions to scroll to specific article or event
  /* const scrollToArticle = (index) => {
    if (articlesRef.current && articlesRef.current.children[index]) {
      articlesRef.current.scrollTo({
        left: articlesRef.current.children[index].offsetLeft,
        behavior: 'smooth'
      });
      setActiveArticleIndex(index);
    }
  };
 */
  const scrollToEvent = (index) => {
    if (eventsRef.current && eventsRef.current.children[index]) {
      eventsRef.current.scrollTo({
        left: eventsRef.current.children[index].offsetLeft,
        behavior: 'smooth'
      });
      setActiveEventIndex(index);
    }
  };

  // Function to translate page content
  const handleTranslation = async (selectedLanguage) => {
    setIsLoading(true);
    const newTranslations = {};

    try {
      // Translating each piece of text
      // Hero section
      newTranslations['Complete Cow Management'] = await translateText('Complete Cow Management', selectedLanguage, apiKey);
      newTranslations['& Marketplace Solution'] = await translateText('& Marketplace Solution', selectedLanguage, apiKey);
      newTranslations['From breed identification to disease detection, and direct market access - we provide comprehensive solutions for farmers and cow products enthusiasts.'] =
        await translateText('From breed identification to disease detection, and direct market access - we provide comprehensive solutions for farmers and cow products enthusiasts.', selectedLanguage, apiKey);
      newTranslations['Explore Services'] = await translateText('Explore Services', selectedLanguage, apiKey);
      newTranslations['Visit Marketplace'] = await translateText('Visit Marketplace', selectedLanguage, apiKey);

      // Services section
      newTranslations['Our Services'] = await translateText('Our Services', selectedLanguage, apiKey);
      newTranslations['Learn More →'] = await translateText('Learn More →', selectedLanguage, apiKey);

      // Marketplace section
      newTranslations['Marketplace Categories'] = await translateText('Marketplace Categories', selectedLanguage, apiKey);
      newTranslations['Connect directly with verified farmers for authentic cow products'] =
        await translateText('Connect directly with verified farmers for authentic cow products', selectedLanguage, apiKey);
      newTranslations['Browse →'] = await translateText('Browse →', selectedLanguage, apiKey);

      // Farmers section
      newTranslations['Are You a Farmer?'] = await translateText('Are You a Farmer?', selectedLanguage, apiKey);
      newTranslations['List your products and reach customers directly'] =
        await translateText('List your products and reach customers directly', selectedLanguage, apiKey);
      newTranslations['Join as Farmer'] = await translateText('Join as Farmer', selectedLanguage, apiKey);

      // All marketplace categories
      newTranslations['Dairy Products'] = await translateText('Dairy Products', selectedLanguage, apiKey);
      newTranslations['Fresh milk, ghee, and dairy items'] = await translateText('Fresh milk, ghee, and dairy items', selectedLanguage, apiKey);
      newTranslations['Biogas Solutions'] = await translateText('Biogas Solutions', selectedLanguage, apiKey);
      newTranslations['Sustainable energy solutions'] = await translateText('Sustainable energy solutions', selectedLanguage, apiKey);
      newTranslations['Ayurvedic Products'] = await translateText('Ayurvedic Products', selectedLanguage, apiKey);
      newTranslations['Traditional wellness products'] = await translateText('Traditional wellness products', selectedLanguage, apiKey);
      newTranslations['Organic Fertilizers'] = await translateText('Organic Fertilizers', selectedLanguage, apiKey);
      newTranslations['Natural farming solutions'] = await translateText('Natural farming solutions', selectedLanguage, apiKey);

      // Article and Events sections
      newTranslations['Latest Articles'] = await translateText('Latest Articles', selectedLanguage, apiKey);
      newTranslations['Upcoming Events'] = await translateText('Upcoming Events', selectedLanguage, apiKey);
      newTranslations['No articles available at the moment'] = await translateText('No articles available at the moment', selectedLanguage, apiKey);
      newTranslations['No upcoming events at the moment'] = await translateText('No upcoming events at the moment', selectedLanguage, apiKey);

      // Services
      for (const service of services) {
        newTranslations[service.title] = await translateText(service.title, selectedLanguage, apiKey);
        newTranslations[service.description] = await translateText(service.description, selectedLanguage, apiKey);
      }

      setTranslations(newTranslations);

      // Also translate the articles and events
      translateArticlesAndEvents(articles, events, selectedLanguage);
    } catch (error) {
      console.error('Translation process error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (event) => {
    const selectedLang = event.target.value;
    setLanguage(selectedLang);
    localStorage.setItem('language', selectedLang);

    if (selectedLang !== 'en') {
      await handleTranslation(selectedLang);
    } else {
      setTranslations({}); // Reset to English
      setTranslatedArticles(articles); // Reset to original articles
      setTranslatedEvents(events); // Reset to original events
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen z-0">
      {/* Show a loading indicator while translations are in progress */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Language Selector */}
      {/* <div className="absolute top-4 right-4 z-20">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-white bg-opacity-80 text-gray-800 px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {indianLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/30010790/pexels-photo-30010790/free-photo-of-group-of-cows-in-rustic-farm-setting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-5xl font-bold mb-6">
              {translations['Complete Cow Management'] || 'Complete Cow Management'} <br />
              {translations['& Marketplace Solution'] || '& Marketplace Solution'}
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              {translations['From breed identification to disease detection, and direct market access - we provide comprehensive solutions for farmers and cow products enthusiasts.'] ||
                'From breed identification to disease detection, and direct market access - we provide comprehensive solutions for farmers and cow products enthusiasts.'}
            </p>
            <div className="flex space-x-4">
              <Link to="/login" className="bg-green-600 text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
                <span>{translations['Explore Services'] || 'Explore Services'}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="bg-white text-green-600 px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors">
                <span>{translations['Visit Marketplace'] || 'Visit Marketplace'}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {translations['Our Services'] || 'Our Services'}
          </h2>

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
                <h3 className="text-xl font-semibold mb-2">
                  {translations[service.title] || service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {translations[service.description] || service.description}
                </p>
                <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                  {translations['Learn More →'] || 'Learn More →'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Articles Section */}
        {/* <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{translations['Latest Articles'] || 'Latest Articles'}</h2>
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

          {translatedArticles.length > 0 ? (
            <div
              ref={articlesRef}
              className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x snap-mandatory"

            >
              {translatedArticles.map((article) => (
                <div
                  key={article.id || article._id}
                  className="article-card flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden snap-center"
                  onClick={() => Navigate('/login')}
                >
                  <img src={article.imageUrl || "/placeholder-image.jpg"} alt={article.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.introduction?.content || article.content?.substring(0, 100)}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">{translations['No articles available at the moment'] || 'No articles available at the moment'}</p>
            </div>
          )} */}

          {/* Mobile scroll indicators */}
          {/* {translatedArticles.length > 0 && (
            <div className="flex justify-center mt-4 space-x-1 md:hidden">
              {translatedArticles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToArticle(index)}
                  className={`h-2 rounded-full focus:outline-none ${activeArticleIndex === index ? 'w-4 bg-green-600' : 'w-2 bg-gray-300'
                    }`}
                />
              ))}
            </div>
          )}
        </div> */}

        {/* Events Section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{translations['Upcoming Events'] || 'Upcoming Events'}</h2>
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

          {translatedEvents.length > 0 ? (
            <div
              ref={eventsRef}
              className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x snap-mandatory"
              onClick={() => Navigate('/login')}
            >
              {translatedEvents.map((event) => (
                <div
                  key={event.id || event._id}
                  className="event-card flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden relative snap-center"
                >
                  <img src={event.images[0].url || "/placeholder-event.jpg"} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 p-4 w-full">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-200 mb-2 line-clamp-2">{event.description}</p>
                      </div>
                      <div className="flex flex-col items-end ml-2 text-xs text-gray-200">
                        <div className="flex items-center mb-1">
                          <Clock size={12} className="mr-1" />
                          <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={12} className="mr-1" />
                          <span>{event.location || 'Online'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">{translations['No upcoming events at the moment'] || 'No upcoming events at the moment'}</p>
            </div>
          )}

          {/* Mobile scroll indicators */}
          {translatedEvents.length > 0 && (
            <div className="flex justify-center mt-4 space-x-1 md:hidden">
              {translatedEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToEvent(index)}
                  className={`h-2 rounded-full focus:outline-none ${activeEventIndex === index ? 'w-4 bg-green-600' : 'w-2 bg-gray-300'
                    }`}
                />
              ))}
            </div>
          )}
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

      {/* Marketplace Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            {translations['Marketplace Categories'] || 'Marketplace Categories'}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {translations['Connect directly with verified farmers for authentic cow products'] ||
              'Connect directly with verified farmers for authentic cow products'}
          </p>

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
                  <h3 className="text-xl font-semibold mb-2">
                    {translations[category.name] || category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {translations[category.description] || category.description}
                  </p>
                  <Link
                    to="/login"
                    className="text-green-600 font-medium hover:text-green-700"
                  >
                    {translations['Browse →'] || 'Browse →'}
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
            <h2 className="text-3xl font-bold mb-4">
              {translations['Are You a Farmer?'] || 'Are You a Farmer?'}
            </h2>
            <p className="text-gray-600 mb-8">
              {translations['List your products and reach customers directly'] ||
                'List your products and reach customers directly'}
            </p>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-8 py-3 rounded-lg inline-flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <span>{translations['Join as Farmer'] || 'Join as Farmer'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}