
import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { AiFillPhone } from 'react-icons/ai';

export default function PlaceItemBig({ place }) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (place?.photos?.length > 0 && typeof place.photos[0].getUrl === 'function') {
      return place.photos[0].getUrl();
    }
    return null;
  };

  const renderOpenStatus = () => {
    if (!place.business_status) return null;
    return (
      <span className={place.business_status === "OPERATIONAL" ? 'text-green-600' : 'text-red-600'}>
        {place.business_status === "OPERATIONAL" ? 'Open' : 'Closed'}
      </span>
    );
  };

  return (
    <div className="mb-6 p-4 border-b border-gray-200 hover:bg-gray-50">
      {getImageUrl() && !imageError ? (
        <img
          src={getImageUrl()}
          alt={place.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
      <p className="text-gray-600 mb-3">{place.vicinity}</p>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center">
          <AiFillStar className="text-yellow-400 mr-1" />
          <span>{place.rating || 'N/A'}</span>
        </div>
        <span className="text-gray-300">•</span>
        {renderOpenStatus()}
      </div>
      {place.formatted_phone_number && (
        <div className="flex items-center text-gray-600">
          <AiFillPhone className="mr-1" />
          <a 
            href={`tel:${place.formatted_phone_number}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-green-600"
          >
            {place.formatted_phone_number}
          </a>
        </div>
      )}
    </div>
  );

}