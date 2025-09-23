import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import PlaceList from './components/PlaceList';

const libraries = ["places"];

export default function GoogleMapView() {
  const [mapRegion, setMapRegion] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
      keyword: "veterinary|animal|vet clinic|animal hospital",
    };

    service.nearbySearch(request, async (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const detailedResults = await Promise.all(
          results.map(place => getPlaceDetails(place))
        );
        setClinics(detailedResults);
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
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="ml-2 text-green-700">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Map Section */}
      <div className={`w-full ${isSidebarOpen ? 'md:w-2/3 lg:w-3/4' : 'md:w-full'} h-[60vh] md:h-screen transition-all duration-300`}>
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={mapRegion}
          zoom={mapRegion.zoom}
          onLoad={onMapLoad}
          options={{
            styles: [
              {
                featureType: "poi.business",
                stylers: [{ visibility: "on" }],
              },
              {
                featureType: "poi",
                elementType: "labels.icon",
                stylers: [{ color: "#0f9d58" }],
              },
            ],
          }}
        >
          <Marker
            position={{ lat: mapRegion.lat, lng: mapRegion.lng }}
            title="Your Location"
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
          />
          
          {clinics.map((place, index) => (
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
        
        {/* Toggle button for mobile */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        
        {/* Toggle button for desktop */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="hidden md:block fixed top-4 right-4 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-green-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Places List Section */}
      <div 
        className={`${isSidebarOpen ? 'block' : 'hidden md:block md:w-0 overflow-hidden'} w-full md:w-1/3 lg:w-1/4 h-[40vh] md:h-screen bg-white shadow-lg transition-all duration-300`}
      >
        <div className="p-4 border-b border-green-100 bg-green-50">
          <h2 className="text-xl md:text-2xl font-bold text-green-800">Nearby Vet Centers</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {clinics.length > 0 ? (
            <PlaceList places={clinics} />
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No vet centers found nearby.</p>
              <p>Try adjusting your location or search radius.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}