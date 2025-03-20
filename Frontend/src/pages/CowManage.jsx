import React, { useState } from 'react';
import { Search, Plus, Calendar, Clipboard, Tag, Filter, ChevronRight } from 'lucide-react';

// Main App Component
const CattleManagementApp = () => {
  const [page, setPage] = useState('dashboard');
  const [selectedCattle, setSelectedCattle] = useState(null);
  const [cattleList, setCattleList] = useState([
    { id: 1, name: 'Bessie', breed: 'Holstein', age: 3, weight: 1200, lastCheckup: '2025-02-15', disease: 'None', image: '/api/placeholder/300/200' },
    { id: 2, name: 'Daisy', breed: 'Jersey', age: 4, weight: 950, lastCheckup: '2025-03-01', disease: 'Mastitis', image: '/api/placeholder/300/200' },
    { id: 3, name: 'Buttercup', breed: 'Angus', age: 2, weight: 1050, lastCheckup: '2025-02-20', disease: 'None', image: '/api/placeholder/300/200' },
  ]);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  // Register new cattle
  const [newCattle, setNewCattle] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    lastCheckup: '',
    disease: '',
    image: '/api/placeholder/300/200'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCattle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCattleEntry = {
      id: cattleList.length + 1,
      ...newCattle
    };
    setCattleList(prev => [...prev, newCattleEntry]);
    setNewCattle({
      name: '',
      breed: '',
      age: '',
      weight: '',
      lastCheckup: '',
      disease: '',
      image: '/api/placeholder/300/200'
    });
    setPage('dashboard');
  };

  // Sort and filter operations
  const sortedCattle = [...cattleList].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'breed') return a.breed.localeCompare(b.breed);
    if (sortBy === 'age') return a.age - b.age;
    return 0;
  });

  const filteredCattle = sortedCattle.filter(cattle => {
    if (filterBy === 'all') return true;
    if (filterBy === 'healthy') return cattle.disease === 'None';
    if (filterBy === 'sick') return cattle.disease !== 'None';
    return cattle.breed === filterBy;
  });

  // Get unique breeds for filter options
  const breedOptions = ['all', 'healthy', 'sick', ...new Set(cattleList.map(cattle => cattle.breed))];

  // Navigation
  const navigateToCattle = (cattle) => {
    setSelectedCattle(cattle);
    setPage('cattle-detail');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cattle Manager</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setPage('dashboard')} 
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md"
            >
              Dashboard
            </button>
            <button 
              onClick={() => setPage('register')} 
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Register Cattle
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {page === 'dashboard' && (
          <div>
            <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-green-800">Cattle Overview</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 bg-green-50 p-4 rounded-md border border-green-200">
                  <h3 className="text-green-700 font-medium">Total Cattle</h3>
                  <p className="text-2xl font-bold">{cattleList.length}</p>
                </div>
                <div className="flex-1 bg-green-50 p-4 rounded-md border border-green-200">
                  <h3 className="text-green-700 font-medium">Healthy</h3>
                  <p className="text-2xl font-bold">{cattleList.filter(c => c.disease === 'None').length}</p>
                </div>
                <div className="flex-1 bg-green-50 p-4 rounded-md border border-green-200">
                  <h3 className="text-green-700 font-medium">Requiring Attention</h3>
                  <p className="text-2xl font-bold">{cattleList.filter(c => c.disease !== 'None').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-800">Cattle List</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <select 
                      className="bg-green-50 border border-green-200 rounded-md px-3 py-2 pr-8 appearance-none"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="breed">Sort by Breed</option>
                      <option value="age">Sort by Age</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <Filter size={16} className="text-green-700" />
                    </div>
                  </div>
                  <div className="relative">
                    <select 
                      className="bg-green-50 border border-green-200 rounded-md px-3 py-2 pr-8 appearance-none"
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                    >
                      {breedOptions.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <Filter size={16} className="text-green-700" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCattle.map(cattle => (
                  <div 
                    key={cattle.id} 
                    className="border border-green-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
                    onClick={() => navigateToCattle(cattle)}
                  >
                    <img 
                      src={cattle.image} 
                      alt={cattle.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-green-800">{cattle.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${cattle.disease === 'None' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {cattle.disease === 'None' ? 'Healthy' : 'Sick'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Breed: {cattle.breed}</p>
                      <p className="text-sm text-gray-600">Age: {cattle.age} years</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          Last check: {cattle.lastCheckup}
                        </span>
                        <ChevronRight size={16} className="text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
                {filteredCattle.length === 0 && (
                  <div className="col-span-full p-8 text-center text-gray-500">
                    No cattle found matching your criteria
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {page === 'register' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-green-800">Register New Cattle</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCattle.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={newCattle.breed}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                  <input
                    type="number"
                    name="age"
                    value={newCattle.age}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    name="weight"
                    value={newCattle.weight}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Checkup</label>
                  <input
                    type="date"
                    name="lastCheckup"
                    value={newCattle.lastCheckup}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
                  <select
                    name="disease"
                    value={newCattle.disease}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="None">Healthy</option>
                    <option value="Mastitis">Mastitis</option>
                    <option value="Foot Rot">Foot Rot</option>
                    <option value="Pneumonia">Pneumonia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setPage('dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                >
                  Register Cattle
                </button>
              </div>
            </form>
          </div>
        )}

        {page === 'cattle-detail' && selectedCattle && (
          <div>
            <button 
              onClick={() => setPage('dashboard')} 
              className="mb-4 flex items-center text-green-700 hover:text-green-500"
            >
              <ChevronRight className="transform rotate-180 mr-1" size={16} />
              Back to All Cattle
            </button>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                  <img 
                    src={selectedCattle.image} 
                    alt={selectedCattle.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/3">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-800">{selectedCattle.name}</h2>
                    <span className={`px-3 py-1 text-sm rounded-full ${selectedCattle.disease === 'None' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedCattle.disease === 'None' ? 'Healthy' : selectedCattle.disease}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-green-50 rounded-md">
                      <p className="text-sm text-green-700">Breed</p>
                      <p className="font-medium">{selectedCattle.breed}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-md">
                      <p className="text-sm text-green-700">Age</p>
                      <p className="font-medium">{selectedCattle.age} years</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-md">
                      <p className="text-sm text-green-700">Weight</p>
                      <p className="font-medium">{selectedCattle.weight} lbs</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-md">
                      <p className="text-sm text-green-700">Last Checkup</p>
                      <p className="font-medium">{selectedCattle.lastCheckup}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <h3 className="text-lg font-medium text-green-800 mb-2">Health Records</h3>
                    <div className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="text-sm font-medium">Vaccination</p>
                        <p className="text-xs text-gray-500">Standard annual vaccination</p>
                      </div>
                      <p className="text-sm">2025-01-15</p>
                    </div>
                    <div className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="text-sm font-medium">Weight Check</p>
                        <p className="text-xs text-gray-500">Regular monitoring</p>
                      </div>
                      <p className="text-sm">2025-02-18</p>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <div>
                        <p className="text-sm font-medium">General Checkup</p>
                        <p className="text-xs text-gray-500">Routine health check</p>
                      </div>
                      <p className="text-sm">2025-03-05</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-green-300 text-green-700 rounded-md hover:bg-green-50"
                    >
                      Edit Details
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                    >
                      Add Health Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© 2025 Cattle Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default CattleManagementApp;