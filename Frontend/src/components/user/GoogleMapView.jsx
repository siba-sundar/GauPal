import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import PlaceList from './components/PlaceList';

const libraries = ["places"];

export default function GoogleMapView() {
  const [mapRegion, setMapRegion] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
    libraries
  });

  const getPlaceDetails = (place) => {
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.places.PlacesService(map);
      service.getDetails(
        {
          placeId: place.place_id,
          fields: ['formatted_phone_number', 'international_phone_number', 'website']
        },
        (result, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve({ ...place, ...result });
          } else {
            resolve(place);
          }
        }
      );
    });
  };

  const searchNearbyPlaces = useCallback(() => {
    if (!map || !mapRegion) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: new window.google.maps.LatLng(mapRegion.lat, mapRegion.lng),
      radius: 15000,
      keyword: "animal ngos|gaushala|goshala|animal shelter|animal refuge|animal rescue center",
    };

    service.nearbySearch(request, async (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const detailedResults = await Promise.all(
          results.map(place => getPlaceDetails(place))
        );
        setNgos(detailedResults);
      } else {
        console.error("Places search failed:", status);
      }
    });
  }, [map, mapRegion]);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (map && mapRegion) {
      searchNearbyPlaces();
    }
  }, [map, mapRegion, searchNearbyPlaces]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapRegion({
            lat: latitude,
            lng: longitude,
            zoom: 13
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    }
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="ml-2">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Map Section - 70% width */}
      <div className="w-[70%] h-screen">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={mapRegion}
          zoom={mapRegion.zoom}
          onLoad={onMapLoad}
        >
          <Marker
            position={{ lat: mapRegion.lat, lng: mapRegion.lng }}
            title="Your Location"
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
          />
          
          {ngos.map((place, index) => (
            <Marker
              key={index}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }}
              title={place.name}
              icon={{
                url: place.name.toLowerCase().includes('gaushala') || 
                     place.name.toLowerCase().includes('goshala') || 
                     place.name.toLowerCase().includes('cow') 
                  ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  : "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
              }}
              onClick={() => {
                window.open(`https://www.google.com/maps/place/?q=place_id:${place.place_id}`, '_blank');
              }}
            />
          ))}
        </GoogleMap>
      </div>

      {/* Places List Section - 30% width */}
      <div className="w-[30%] h-screen bg-white shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Nearby NGOs and Animal Shelter</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {ngos.length > 0 && <PlaceList places={ngos} />}
        </div>
      </div>
    </div>
  );
}