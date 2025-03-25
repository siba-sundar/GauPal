import React from 'react';

const GirCowArticle = ({ articleData }) => {
  // Render image with fallback
  const renderImage = (imageObj, altText = "Article Image") => {
    if (!imageObj || !imageObj.url) {
      return null;
    }
    
    return (
      <div className="w-full max-h-96 overflow-hidden rounded-lg shadow-md mb-4">
        <img 
          src={imageObj.url} 
          alt={imageObj.caption || altText} 
          className="w-full h-full object-cover"
          onError={(e) => e.target.style.display = 'none'}
        />
        {imageObj.caption && (
          <p className="text-sm text-green-700 italic text-center mt-2">
            {imageObj.caption}
          </p>
        )}
      </div>
    );
  };

  // Render section with optional image
  const renderSection = (section) => {
    if (!section) return null;

    return (
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-green-50">
        {section.heading && (
          <h2 className="text-2xl font-bold text-green-800 mb-4 border-b-2 border-green-200 pb-2">
            {section.heading}
          </h2>
        )}
        
        {renderImage(section.image, section.heading)}
        
        {section.content && (
          <p className="text-green-900 leading-relaxed">
            {section.content}
          </p>
        )}
        
        {/* Handle subsections for diseases */}
        {section.subsections && section.subsections.map((subsection, index) => (
          <div key={index} className="mt-4 p-4 bg-green-50 rounded-md">
            {subsection.disease && (
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                {subsection.disease}
              </h3>
            )}
            {renderImage(subsection.image, subsection.disease)}
            {subsection.details && (
              <p className="text-green-800 mb-2">{subsection.details}</p>
            )}
            {subsection.prevention && (
              <p className="text-green-600 italic">
                Prevention: {subsection.prevention}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Main render
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white min-h-screen mt-10">
      {/* Title */}
      {articleData.title && (
        <h1 className="text-4xl font-bold text-center text-green-900 mb-8 border-b-4 border-green-200 pb-4">
          {articleData.title}
        </h1>
      )}

      {/* Introduction */}
      {articleData.introduction && (
        <div className="mb-8">
          {renderImage(articleData.introduction.image, "Introduction Image")}
          {articleData.introduction.content && (
            <p className="text-green-800 text-lg leading-relaxed">
              {articleData.introduction.content}
            </p>
          )}
        </div>
      )}

      {/* Render all sections */}
      {articleData.headings && articleData.headings.map((section, index) => (
        <React.Fragment key={index}>
          {renderSection(section)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GirCowArticle;