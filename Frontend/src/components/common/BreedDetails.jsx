import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Adjust the import path as needed
import { Image, Loader2, AlertCircle } from 'lucide-react';

const BreedDetailsComponent = ({ breedName }) => {
  const [breedData, setBreedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreedDetails = async () => {
      try {
        setLoading(true);
        const breedDocRef = doc(collection(db, 'cow-breeds'), breedName);
        const breedDocSnap = await getDoc(breedDocRef);

        if (breedDocSnap.exists()) {
          setBreedData(breedDocSnap.data());
        } else {
          setError('Breed not found');
        }
      } catch (err) {
        setError('Error fetching breed details');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (breedName) {
      fetchBreedDetails();
    }
  }, [breedName]);

  const renderImage = (imageData) => {
    if (!imageData || !imageData.url) {
      return (
        <div className="flex items-center justify-center bg-gray-100 h-64 w-full">
          <Image className="text-gray-400" size={48} />
          <span className="ml-2 text-gray-500">No Image Available</span>
        </div>
      );
    }

    return (
      <div className="w-full">
        <img 
          src={imageData.url} 
          alt={imageData.caption || 'Breed Image'} 
          className="w-full h-64 object-cover rounded-lg"
        />
        {imageData.caption && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            {imageData.caption}
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={48} />
        <span className="ml-2">Loading breed details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <AlertCircle size={48} />
        <p className="mt-4 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {breedData.title}
        </h1>
      </div>

      {/* Introduction Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="flex items-center">
          <p className="text-lg text-gray-700">
            {breedData.introduction.content}
          </p>
        </div>
        <div>
          {renderImage(breedData.introduction.image)}
        </div>
      </div>

      {/* Headings/Sections */}
      {breedData.headings && breedData.headings.map((heading, index) => (
        <div 
          key={index} 
          className={`mb-8 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} p-6 rounded-lg shadow-sm`}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {heading.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center">
              <p className="text-gray-700">
                {heading.content}
              </p>
            </div>
            <div>
              {renderImage(heading.image)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BreedDetailsComponent;