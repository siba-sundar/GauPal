import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Dna, Stethoscope, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
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
      
      // Services
      for (const service of services) {
        newTranslations[service.title] = await translateText(service.title, selectedLanguage, apiKey);
        newTranslations[service.description] = await translateText(service.description, selectedLanguage, apiKey);
      }
  
      setTranslations(newTranslations);
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
              <Link to="/coming-soon" className="bg-green-600 text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
                <span>{translations['Explore Services'] || 'Explore Services'}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products" className="bg-white text-green-600 px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors">
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
                <Link to={service.link} className="text-green-600 hover:text-green-700 font-medium">
                  {translations['Learn More →'] || 'Learn More →'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                    to={`/products?category=${category.category}`} 
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
              to="/register"
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