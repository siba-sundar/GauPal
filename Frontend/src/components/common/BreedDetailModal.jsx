import React from "react";
import { X, MapPin, Milk, Palette, Activity } from "lucide-react";

const BreedDetailsModal = ({ breed, onClose }) => {
  if (!breed) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Cross Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition-colors z-10"
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Header with Breed Image */}
        <div className="h-64 bg-gray-200 relative">
          <img
            src={breed.images?.[0]?.url || "/api/placeholder/600/300"}
            alt={breed.breed}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
            <h2 className="text-3xl font-bold text-white capitalize">
              {breed.breed} Breed
            </h2>
            <p className="text-white text-lg">{breed.title}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Origin Information */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <MapPin className="text-green-600 mr-2" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Origin</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong className="text-gray-700">State:</strong>
                  <p className="text-gray-600">
                    {breed.origin?.state || "Not specified"}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-700">Region:</strong>
                  <p className="text-gray-600">
                    {breed.origin?.region || "Not specified"}
                  </p>
                </div>
              </div>
              {breed.origin?.history_summary && (
                <div className="mt-3">
                  <strong className="text-gray-700">History:</strong>
                  <p className="text-gray-600 mt-1">
                    {breed.origin.history_summary}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Physical Characteristics */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Palette className="text-blue-600 mr-2" size={24} />
              <h3 className="text-xl font-bold text-gray-800">
                Physical Characteristics
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <strong className="text-gray-700">Size:</strong>
                  <p className="text-gray-600">
                    {breed.physical_characteristics?.size || "Not specified"}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-700">Horns:</strong>
                  <p className="text-gray-600">
                    {breed.physical_characteristics?.horns || "Not specified"}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-700">Coat Type:</strong>
                  <p className="text-gray-600">
                    {breed.physical_characteristics?.coat_type ||
                      "Not specified"}
                  </p>
                </div>
              </div>

              {breed.physical_characteristics?.color?.length > 0 && (
                <div className="mt-3">
                  <strong className="text-gray-700">Colors:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {breed.physical_characteristics.color.map(
                      (color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {color}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {breed.physical_characteristics?.distinct_features?.length >
                0 && (
                <div className="mt-3">
                  <strong className="text-gray-700">Distinct Features:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {breed.physical_characteristics.distinct_features.map(
                      (feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Milk Production */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Milk className="text-yellow-600 mr-2" size={24} />
              <h3 className="text-xl font-bold text-gray-800">
                Milk Production
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong className="text-gray-700">
                    Average Liters per Day:
                  </strong>
                  <p className="text-gray-600">
                    {breed.milk_production?.average_liters_per_day || 0} liters
                  </p>
                </div>
                <div>
                  <strong className="text-gray-700">Fat Content:</strong>
                  <p className="text-gray-600">
                    {breed.milk_production?.fat_content_percentage || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Adaptability */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Activity className="text-red-600 mr-2" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Adaptability</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              {breed.adaptability?.climate?.length > 0 && (
                <div className="mb-3">
                  <strong className="text-gray-700">
                    Climate Adaptability:
                  </strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {breed.adaptability.climate.map((climate, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {climate}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {breed.adaptability?.resilience_traits?.length > 0 && (
                <div>
                  <strong className="text-gray-700">Resilience Traits:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {breed.adaptability.resilience_traits.map(
                      (trait, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Images Gallery */}
          {breed.images?.length > 1 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Image Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {breed.images.slice(1).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {image.caption && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {image.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreedDetailsModal;
