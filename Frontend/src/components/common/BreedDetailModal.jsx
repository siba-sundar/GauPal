import React from 'react';
import { X, ChevronRight } from 'lucide-react';

const BreedDetailsModal = ({ breed, onClose }) => {
  if (!breed) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Cross Button - More Prominent */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition-colors z-10"
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Header with Breed Image */}
        <div className="h-64 bg-gray-200 relative">
          <img 
            src={breed.introduction.image.url} 
            alt={breed.breed} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
            <h2 className="text-3xl font-bold text-white capitalize">{breed.breed} Breed</h2>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h3>
          <p className="text-gray-600 mb-6">{breed.introduction.content}</p>

          {/* Headings Sections */}
          {breed.headings.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{section.heading}</h3>
              <div className="flex">
                {section.image && (
                  <div className="w-1/3 mr-4">
                    <img 
                      src={section.image.url} 
                      alt={section.image.caption} 
                      className="rounded-lg object-cover h-48 w-full"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">{section.image.caption}</p>
                  </div>
                )}
                <p className="text-gray-600 flex-1">{section.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreedDetailsModal;