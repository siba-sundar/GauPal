import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { User as UserIcon, ChevronDown, Globe } from "lucide-react";
import logo from '../assets/6.png';

// Define the text that needs to be translated
const navbarTextKeys = {
  services: 'Services',
  breedIdentification: 'Breed Identification',
  breedPairing: 'Breed Pairing',
  diseaseIdentification: 'Disease Identification',
  knowMoreAboutBreeds: 'Know More About Breeds',
  marketplace: 'Marketplace',
  findNGOs: 'Find NGOs',
  findClinics: 'Find Clinics',
  farmerDashboard: 'Farmer Dashboard',
  login: 'Login'
};

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState({...navbarTextKeys});
  const [isTranslating, setIsTranslating] = useState(false);

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

  // Function to translate text using Google Translate API - wrapped in useCallback
  const translateText = useCallback(async (text, targetLang) => {
    // Skip translation if target language is English or if text is empty
    if (targetLang === 'en' || !text) {
      return text;
    }

    try {
      // Replace with your actual Google Translate API endpoint and key
      const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY;
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          format: 'text'
        })
      });
      
      const data = await response.json();
      
      if (data && data.data && data.data.translations && data.data.translations.length > 0) {
        return data.data.translations[0].translatedText;
      }
      
      return text; // Fallback to original text if translation fails
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text if translation fails
    }
  }, []);

  // Function to translate all navbar text elements - wrapped in useCallback
  const translateAllText = useCallback(async (targetLang) => {
    // Skip translation if target language is English
    if (targetLang === 'en') {
      setTranslatedText({...navbarTextKeys});
      return;
    }

    setIsTranslating(true);
    
    try {
      const translationPromises = Object.entries(navbarTextKeys).map(async ([key, value]) => {
        const translatedValue = await translateText(value, targetLang);
        return [key, translatedValue];
      });
      
      const translatedEntries = await Promise.all(translationPromises);
      const newTranslatedText = Object.fromEntries(translatedEntries);
      
      setTranslatedText(newTranslatedText);
    } catch (error) {
      console.error('Error translating navbar text:', error);
      // Fallback to English if translation fails
      setTranslatedText({...navbarTextKeys});
    } finally {
      setIsTranslating(false);
    }
  }, [translateText]); // Add translateText as a dependency

  // Load the saved language from local storage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    
    // Translate all text to the saved language on initial load
    translateAllText(savedLanguage);
  }, [translateAllText]); // Add translateAllText as a dependency

  // Function to handle language change
  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    setIsLanguageDropdownOpen(false);
    
    // Translate all text to the new language
    translateAllText(languageCode);

    window.location.reload(); // Reload the page to apply the new language
  };

  return (
    <nav className="bg-white shadow-lg Z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center space-x-8">
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-green-600"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isTranslating}
              >
                {isTranslating ? '...' : translatedText.services}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg">
                  <div className="py-1">
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      {isTranslating ? '...' : translatedText.breedIdentification}
                    </Link>
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      {isTranslating ? '...' : translatedText.breedPairing}
                    </Link>
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      {isTranslating ? '...' : translatedText.diseaseIdentification}
                    </Link>
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      {isTranslating ? '...' : translatedText.knowMoreAboutBreeds}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/login" className="text-gray-700 hover:text-green-600">
              {isTranslating ? '...' : translatedText.marketplace}
            </Link>

            <Link to="/login" className="text-gray-700 hover:text-green-600">
              {isTranslating ? '...' : translatedText.findNGOs}
            </Link>

            <Link to="/login" className="text-gray-700 hover:text-green-600">
              {isTranslating ? '...' : translatedText.findClinics}
            </Link>

            {user?.type === 'farmer' && (
              <Link to="/farmer/dashboard" className="text-gray-700 hover:text-green-600">
                {isTranslating ? '...' : translatedText.farmerDashboard}
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-green-600"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                disabled={isTranslating}
              >
                <Globe className="h-5 w-5 mr-1" />
                <span className="text-sm">{indianLanguages.find(lang => lang.code === currentLanguage)?.name || 'English'}</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
                  <div className="py-1">
                    {indianLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          currentLanguage === language.code 
                            ? 'bg-green-50 text-green-600' 
                            : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                        }`}
                        disabled={isTranslating}
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
              >
                <UserIcon className="h-6 w-6" />
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {isTranslating ? '...' : translatedText.login}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;