import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { AiFillPhone } from 'react-icons/ai';
import { FaGlobe } from 'react-icons/fa';
import { MdDirections } from 'react-icons/md';

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
      <span className={place.business_status === "OPERATIONAL" ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {place.business_status === "OPERATIONAL" ? 'Open' : 'Closed'}
      </span>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 hover:bg-green-50">
      <div className="w-full sm:w-24 h-24 flex-shrink-0">
        {getImageUrl() ? (
          <img
            src={getImageUrl()}
            alt={place.name}
            className="w-full h-full object-cover rounded-lg shadow-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110"%3E%3Crect fill="%23f0fdf4" width="110" height="110"/%3E%3Ctext fill="%23166534" font-family="Arial" font-size="12" text-anchor="middle" x="55" y="55" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-full h-full bg-green-50 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-green-700">No Image</span>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-1 text-green-800">{place.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{place.vicinity}</p>
        
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
            <AiFillStar className="text-yellow-500 mr-1" />
            <span className="text-sm">{place.rating || 'N/A'}</span>
          </div>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <div className="px-2 py-1 rounded-full bg-green-50">
            {renderOpenStatus()}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-2">
          {place.formatted_phone_number && (
            <a 
              href={`tel:${place.formatted_phone_number}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center text-sm text-green-700 hover:text-green-900 bg-green-50 px-2 py-1 rounded-full"
            >
              <AiFillPhone className="mr-1" />
              {place.formatted_phone_number}
            </a>
          )}
          
          {place.website && (
            <a 
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center text-sm text-green-700 hover:text-green-900 bg-green-50 px-2 py-1 rounded-full"
            >
              <FaGlobe className="mr-1" />
              Website
            </a>
          )}
          
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.vicinity}&destination_place_id=${place.place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center text-sm text-green-700 hover:text-green-900 bg-green-50 px-2 py-1 rounded-full"
          >
            <MdDirections className="mr-1" />
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}