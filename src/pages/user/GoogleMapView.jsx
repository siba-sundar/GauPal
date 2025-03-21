import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function GoogleMapView() {
  const [mapRegion, setMapRegion] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAyz0KbO8Wr6hnOFl3BvnVamL12W-dZ64o",
    libraries
  });

  const searchNearbyPlaces = useCallback(() => {
    if (!map || !mapRegion) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: new window.google.maps.LatLng(mapRegion.lat, mapRegion.lng),
      radius: 50000,
      keyword: "gaushala|goshala|cow shelter|animal shelter|ngo|animal welfare",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("Places found:", results);
        setNgos(results);
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
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="ml-2">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Nearby Gaushalas and Animal Welfare Centers</h2>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <GoogleMap
          mapContainerClassName="w-full h-[400px]"
          center={mapRegion}
          zoom={mapRegion.zoom}
          onLoad={onMapLoad}
        >
          {/* User location marker */}
          <Marker
            position={{ lat: mapRegion.lat, lng: mapRegion.lng }}
            title="Your Location"
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
          />
          
          {/* NGO and Gaushala markers */}
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
    </div>
  );
}