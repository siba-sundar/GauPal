import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ArrowRight } from 'lucide-react';
import BreedDetailsModal from './BreedDetailModal'; // Import the provided modal component
import { getAuth } from 'firebase/auth';

const BreedsListPage = () => {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState(null);


  const auth = getAuth();
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        // Get current user and token
        const user = auth.currentUser;
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const token = await user.getIdToken();

        // Fetch all breeds
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/article/all-breed`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Assuming the response matches the structure you showed
        setBreeds(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching breeds:', err);
        setError('Failed to fetch breeds');
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  // Filter breeds based on search term
  const filteredBreeds = breeds.filter(breed => 
    breed.breed.toLowerCase().includes(searchTerm.toLowerCase()) || 
    breed.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render breed card
  const renderBreedCard = (breed) => (
    <div 
      key={breed.id} 
      className="bg-green-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col border-2 border-green-100"
    >
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-green-800 mb-2 capitalize">
          {breed.breed}
        </h3>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {breed.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {breed.introduction.content}
        </p>
      </div>
      <div className="flex justify-between items-center mt-auto">
        <button 
          onClick={() => setSelectedBreed(breed)}
          className="flex items-center text-green-600 hover:text-green-800 font-semibold"
        >
          More Details <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-50">
        <p className="text-green-800">Loading breeds...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-800">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      {/* Search Bar */}
      <div className="mb-8 relative">
        <input 
          type="text" 
          placeholder="Search cow breeds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" 
          size={20} 
        />
      </div>

      {/* Breeds Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBreeds.map(renderBreedCard)}
      </div>

      {/* Breed Details Modal */}
      {selectedBreed && (
        <BreedDetailsModal 
          breed={selectedBreed} 
          onClose={() => setSelectedBreed(null)} 
        />
      )}
    </div>
  );
};

export default BreedsListPage;