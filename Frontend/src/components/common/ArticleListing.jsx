import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const ArticleListing = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0
  });
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [translations, setTranslations] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const navigate = useNavigate();

  const auth = getAuth();

  // Text content that needs to be translated
  const textContent = {
    pageTitle: "Breed Articles",
    pageDescription: "Browse our collection of informative articles on cattle breeding and management.",
    filterByCategory: "Filter by Category",
    showing: "Showing",
    of: "of",
    articles: "articles",
    noArticlesFound: "No articles found. Please try a different category or check back later.",
    uncategorized: "Uncategorized",
    noDescriptionAvailable: "No description available",
    previous: "Previous",
    next: "Next"
  };

  useEffect(() => {
    // Get selected language from localStorage
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && storedLanguage !== selectedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    // Translate all text content when language changes
    if (selectedLanguage && selectedLanguage !== 'en') {
      translateContent();
    } else {
      // Reset translations to original text if language is English
      setTranslations(textContent);
    }
  }, [selectedLanguage]);

  // Function to translate text content
  const translateContent = async () => {
    try {
      const textsToTranslate = Object.values(textContent);
      
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.BITE_GOOGLE_TRANSLATE_KEY}`,
        {
          q: textsToTranslate,
          target: selectedLanguage,
          source: 'en'
        }
      );

      if (response.data && response.data.data && response.data.data.translations) {
        const translatedTexts = response.data.data.translations.map(t => t.translatedText);
        
        // Create a new object with translated values
        const newTranslations = {};
        Object.keys(textContent).forEach((key, index) => {
          newTranslations[key] = translatedTexts[index];
        });
        
        setTranslations(newTranslations);
      }
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to original text
      setTranslations(textContent);
    }
  };

  // Function to translate a single text
  const translateText = async (text, targetLanguage) => {
    if (!text || targetLanguage === 'en') return text;
    
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_KEY}`,
        {
          q: [text],
          target: targetLanguage,
          source: 'en'
        }
      );

      if (response.data && response.data.data && response.data.data.translations) {
        return response.data.data.translations[0].translatedText;
      }
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  // Function to translate article data
  const translateArticles = async (articlesData) => {
    if (selectedLanguage === 'en') return articlesData;
    
    const translatedArticles = [];
    
    for (const article of articlesData) {
      const translatedTitle = await translateText(article.title, selectedLanguage);
      let translatedContent = article.introduction?.content;
      
      if (translatedContent) {
        translatedContent = await translateText(translatedContent, selectedLanguage);
      }
      
      translatedArticles.push({
        ...article,
        title: translatedTitle,
        introduction: article.introduction ? {
          ...article.introduction,
          content: translatedContent || article.introduction.content
        } : article.introduction
      });
    }
    
    return translatedArticles;
  };

  useEffect(() => {
    // Fetch available categories for the filter dropdown
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/article/category`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        let cats = ['All', ...response.data];
        
        // Translate categories if not English
        if (selectedLanguage !== 'en') {
          const translatedCats = await Promise.all(
            cats.map(cat => translateText(cat, selectedLanguage))
          );
          setCategories(translatedCats);
        } else {
          setCategories(cats);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Default categories if API endpoint doesn't exist
        const defaultCategories = [
          "All",
          "Breeding",
          "Cow Health",
          "Nutrition",
          "Indigenous Breeds",
          "Dairy Farming",
          "Cow Behavior",
          "Cow Protection & Conservation",
          "Milk Quality",
          "Cow Diseases",
          "Cow-Based Products"
        ];
        
        // Translate default categories if not English
        if (selectedLanguage !== 'en') {
          const translatedCats = await Promise.all(
            defaultCategories.map(cat => translateText(cat, selectedLanguage))
          );
          setCategories(translatedCats);
        } else {
          setCategories(defaultCategories);
        }
      }
    };

    fetchCategories();
  }, [selectedLanguage]);

  useEffect(() => {
    fetchArticles(pagination.currentPage, category);
  }, [pagination.currentPage, category, selectedLanguage]);

  const fetchArticles = async (page, categoryFilter) => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_SERVER_URL}/gaupal/article/all-article?page=${page}&limit=${pagination.perPage}`;

      const user = auth.currentUser;
      const token = await user.getIdToken();
      
      if (categoryFilter && categoryFilter !== 'All') {
        url += `&category=${categoryFilter}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Translate articles if needed
      const translatedArticlesData = await translateArticles(response.data.data);
      
      setArticles(translatedArticlesData);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.total
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      let errorMessage = err.response?.data?.message || 'Failed to fetch articles';
      
      // Translate error message
      if (selectedLanguage !== 'en') {
        errorMessage = await translateText(errorMessage, selectedLanguage);
      }
      
      setError(errorMessage);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({
        ...pagination,
        currentPage: newPage
      });
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value === 'All' ? '' : e.target.value);
    setPagination({
      ...pagination,
      currentPage: 1 // Reset to first page when changing category
    });
  };

  const handleArticleClick = (articleId) => {
    // Get the current path without any trailing slashes
    const currentPath = location.pathname.replace(/\/+$/, '');
    navigate(`${currentPath}/${articleId}`);
  };

  // Function to get a default image if the article image is missing
  const getDefaultImage = () => {
    return 'https://via.placeholder.com/300x200?text=No+Image+Available';
  };

  // Get translated text or default to original
  const getText = (key) => {
    return translations[key] || textContent[key];
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">{getText('pageTitle')}</h1>
          <p className="text-gray-600 mt-2">{getText('pageDescription')}</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="w-64">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              {getText('filterByCategory')}
            </label>
            <select
              id="category"
              value={category || 'All'}
              onChange={handleCategoryChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-gray-600">
            {getText('showing')} {articles.length} {getText('of')} {pagination.total} {getText('articles')}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <>
            {articles.length === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                {getText('noArticlesFound')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <div 
                    key={article.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.introduction?.image?.url || getDefaultImage()} 
                        alt={article.introduction?.image?.caption || article.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="uppercase tracking-wide text-xs text-green-600 font-semibold mb-1">
                        {article.category || getText('uncategorized')}
                      </div>
                      <h2 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {article.introduction?.content || getText('noDescriptionAvailable')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {getText('previous')}
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(pagination.totalPages).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        pagination.currentPage === page + 1
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === pagination.totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {getText('next')}
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleListing;