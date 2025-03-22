import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function GoogleMapView() {
  const [mapRegion, setMapRegion] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyClQVMQ3tKZom-4ORyGP4ga5bfzNOLD5v4",
    libraries,
  });

  // Callback to load map
  const onMapLoad = useCallback((mapInstance) => setMap(mapInstance), []);

  // Fetch clinics
  const searchNearbyPlaces = useCallback(() => {
    if (!map || !mapRegion) return;

    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: new window.google.maps.LatLng(mapRegion.lat, mapRegion.lng),
      radius: 50000,
      type: ['veterinary_care'],
      keyword: 'veterinarian|animal hospital|pet clinic',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        console.log("✅ Clinics found:", results);
        setClinics(results);
        setError(null);
      } else {
        console.error("⚠️ Places search failed:", status);
        // Try a backup search with different parameters
        const backupRequest = {
          location: new window.google.maps.LatLng(mapRegion.lat, mapRegion.lng),
          radius: 50000,
          type: ['veterinary_care']
        };

        service.nearbySearch(backupRequest, (backupResults, backupStatus) => {
          if (backupStatus === window.google.maps.places.PlacesServiceStatus.OK && backupResults) {
            console.log("✅ Backup search found clinics:", backupResults);
            setClinics(backupResults);
            setError(null);
          } else {
            console.error("⚠️ Backup search also failed:", backupStatus);
            setError("No veterinary clinics found in your area.");
            setClinics([]);
          }
        });
      }
    });
  }, [map, mapRegion]);

  // Get user location or fallback
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapRegion({ lat: latitude, lng: longitude, zoom: 13 });
          setLoading(false);
        },
        (error) => {
          console.error("⚠️ Error getting location:", error);
          setMapRegion({ lat: 28.6139, lng: 77.2090, zoom: 13 }); // New Delhi fallback
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported.");
      setError("Geolocation not supported.");
      setLoading(false);
    }
  }, []);

  // Trigger search when map loads
  useEffect(() => {
    if (map && mapRegion) searchNearbyPlaces();
  }, [map, mapRegion, searchNearbyPlaces]);

  // Handle map loading error
  if (loadError) return <div className="text-red-500">Error loading map.</div>;

  // Show loading spinner
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
      <h2 className="text-2xl font-bold mb-4">Nearby Veterinary Clinics</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

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
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />

          {/* Clinic markers */}
          {clinics.length > 0 ? (
            clinics.map((place, index) => (
              <Marker
                key={index}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }}
                title={place.name}
                icon={{
                  url: place.name.toLowerCase().includes("cow") ||
                  place.name.toLowerCase().includes("cattle")
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                    "_blank"
                  )
                }
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">No clinics found.</p>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}