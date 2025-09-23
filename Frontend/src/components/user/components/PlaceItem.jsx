
import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { AiFillPhone } from 'react-icons/ai';

export default function PlaceItem({ place }) {
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
    <div className="flex gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="w-28 h-28 flex-shrink-0">
        {getImageUrl() ? (
          <img
            src={getImageUrl()}
            alt={place.name}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110"%3E%3Crect fill="%23f5f5f5" width="110" height="110"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="12" text-anchor="middle" x="55" y="55" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">{place.name}</h3>
        <p className="text-gray-600 mb-2">{place.vicinity}</p>
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
    </div>
  );

}