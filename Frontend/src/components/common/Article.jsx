import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const ArticleDetail = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {

        const user = auth.currentUser;
        const token = await user.getIdToken();
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/article/article/${articleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setArticle(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err.response?.data?.message || 'Failed to fetch article details');
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  // Function to get a default image if the article image is missing
  const getDefaultImage = () => {
    return 'https://via.placeholder.com/800x400?text=No+Image+Available';
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={handleBackClick}
            className="mb-4 flex items-center text-green-600 hover:text-green-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Articles
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={handleBackClick}
            className="mb-4 flex items-center text-green-600 hover:text-green-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Articles
          </button>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
            Article not found or has been removed.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <button 
          onClick={handleBackClick}
          className="mb-4 flex items-center text-green-600 hover:text-green-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Articles
        </button>

        {/* Article Category Badge */}
        {article.category && (
          <div className="mb-4">
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
        )}

        {/* Article Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
        
        {/* Introduction Section */}
        {article.introduction && (
          <section className="mb-8">
            {article.introduction.image && (
              <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={article.introduction.image.url || getDefaultImage()} 
                  alt={article.introduction.image.caption || article.title} 
                  className="w-full h-auto object-cover"
                />
                {article.introduction.image.caption && (
                  <p className="text-sm text-gray-500 italic py-2 px-4 bg-gray-50">
                    {article.introduction.image.caption}
                  </p>
                )}
              </div>
            )}
            
            {article.introduction.content && (
              <div className="text-lg text-gray-700 leading-relaxed">
                {article.introduction.content}
              </div>
            )}
          </section>
        )}
        
        {/* Article Content Sections */}
        {article.headings && article.headings.length > 0 && (
          <div className="space-y-12">
            {article.headings.map((section, index) => (
              <section key={index} className="border-t border-gray-100 pt-6">
                {section.heading && (
                  <h2 className="text-2xl font-semibold text-green-800 mb-4">
                    {section.heading}
                  </h2>
                )}
                
                {section.content && (
                  <div className="text-gray-700 leading-relaxed mb-4">
                    {section.content}
                  </div>
                )}
                
                {section.image && (
                  <div className="mt-6 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={section.image.url || getDefaultImage()} 
                      alt={section.image.caption || section.heading} 
                      className="w-full h-auto object-cover"
                    />
                    {section.image.caption && (
                      <p className="text-sm text-gray-500 italic py-2 px-4 bg-gray-50">
                        {section.image.caption}
                      </p>
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
        
        {/* Fallback content if no structure is provided */}
        {(!article.introduction && (!article.headings || article.headings.length === 0)) && (
          <div className="text-gray-700 leading-relaxed">
            <p>Content for this article is not available in the expected format.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;