
import React from 'react';
import PlaceItem from './PlaceItem';
import PlaceItemBig from './PlaceItemBig';

export default function PlaceList({ places }) {
  return (
    <div>
      <div className="px-4 py-2 text-sm text-gray-600">
        Found {places.length} Places
      </div>
      <div>
        {places.map((place, index) => (
          <div 
            key={place.place_id} 
            onClick={() => window.open(`https://www.google.com/maps/place/?q=place_id:${place.place_id}`, '_blank')}
            className="cursor-pointer hover:bg-gray-50"
          >
            <PlaceItem place={place} />
          </div>
        ))}
      </div>
    </div>
  );

}