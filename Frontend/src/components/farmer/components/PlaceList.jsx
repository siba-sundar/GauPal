import React from 'react';
import PlaceItem from './PlaceItem';

export default function PlaceList({ places }) {
  return (
    <div className="bg-white">
      <div className="px-4 py-2 text-sm text-green-700 bg-green-50 border-b border-green-100">
        Found {places.length} {places.length === 1 ? 'Place' : 'Places'}
      </div>
      <div>
        {places.map((place) => (
          <div 
            key={place.place_id} 
            onClick={() => window.open(`https://www.google.com/maps/place/?q=place_id:${place.place_id}`, '_blank')}
            className="cursor-pointer border-b border-green-100 transition-all duration-200 hover:bg-green-50"
          >
            <PlaceItem place={place} />
          </div>
        ))}
      </div>
    </div>
  );
}