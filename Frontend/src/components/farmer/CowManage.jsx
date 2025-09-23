import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { CattleService } from './CattleServices.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

// Icons for better UI
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  InfoIcon,
  XIcon,
  HeartIcon
} from 'lucide-react';

import BreedingForm from './compatibility';

const CattleManagementDashboard = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for different sections
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [cattleList, setCattleList] = useState([]);
  const [selectedCattle, setSelectedCattle] = useState(null);

  // Modal states
  const [isAddCattleModalOpen, setIsAddCattleModalOpen] = useState(false);
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBreedingModalOpen, setIsBreedingModalOpen] = useState(false);
  const [breedingRecommendations, setBreedingRecommendations] = useState([]);
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState(null);

  // Form data states
  const [newCattleForm, setNewCattleForm] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    dateOfBirth: '',

    // Physical Characteristics
    weight: '',
    height: '',
    color: '',

    // Health Information
    healthStatus: 'healthy',
    lastVeterinaryCheckup: '',
    vaccinations: [],

    // Breeding Information
    isBreedingStock: false,
    lastCalvingDate: '',
    numberOfCalves: 0,

    // Identification
    earTag: '',
    microchipNumber: '',

    // Farm-Specific Details
    paddockLocation: '',
    feedType: '',

    // Disease Tracking
    disease: 'None',
    customDisease: '',

    // Additional Notes
    specialNotes: ''
  });

  const [vaccinationForm, setVaccinationForm] = useState({
    name: '',
    date: '',
    nextDueDate: ''
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    // If it's a Firestore Timestamp object
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString();
    }

    // If it's already a string date
    return new Date(timestamp).toLocaleDateString();
  };

  // Dropdown Options
  const BREED_OPTIONS = [
    'Gir', 'Tharparkar', 'Kankrej', 'Rathi',
    'Ongole', 'Deoni', 'Malvi', 'Hallikar',
    'Nagori', 'Kherigarh', 'Punganur', 'Gaolao',
    'Nimari', 'Kangayam', 'Mewati', 'Bargur',
    'Hariana', 'Siri'
  ];


  const DISEASE_OPTIONS = [
    'Abscess', 'Actinomycosis', 'Bovine Dermatophilosis (Rain Rot)',
    'Bovine Warts', 'Bovine spongiform encephalopathy (BSE)', 'Dermatophytosis',
    'Digital Dermatitis (also causes lameness)', 'Foot and Mouth Disease', 'Hoof Rot',
    'Lumpy Skin Diseases', 'Mange', 'Mastititis', 'Pediculosis',
    'Photosensitization', 'Pink Eye', 'Healthy Cows'
  ];

  const auth = getAuth();

  // Fetch breeding recommendations
  const fetchBreedingRecommendations = async (breed) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/breeding-recommendations?breed=${breed}`);
      // Ensure the response data is an array, default to empty array if not
      const recommendations = Array.isArray(response.data)
        ? response.data
        : [];
      setBreedingRecommendations(recommendations);
      setIsBreedingModalOpen(true);
    } catch (error) {
      console.error('Error fetching breeding recommendations:', error);
      toast.error('Failed to fetch breeding recommendations');
      // Set an empty array to prevent map errors
      setBreedingRecommendations([]);
    }
  };


  const handleHealthStatusChange = (e) => {
    const status = e.target.value;
    setNewCattleForm(prev => {
      // If health status is set to "healthy", reset disease to "None"
      if (status === "healthy") {
        return { ...prev, healthStatus: status, disease: "None", customDisease: "" };
      }
      // Otherwise just update the health status
      return { ...prev, healthStatus: status };
    });
  };

  const handleDiseaseChange = (e) => {
    const diseaseValue = e.target.value;
    setNewCattleForm(prev => {
      // If a disease other than "None" or "Healthy Cows" is selected, update health status
      if (diseaseValue !== "None" && diseaseValue !== "Healthy Cows") {
        return {
          ...prev,
          disease: diseaseValue,
          healthStatus: "sick"
        };
      }
      // Otherwise just update the disease
      return { ...prev, disease: diseaseValue };
    });
  };


  // Handle cattle deletion
  const handleDeleteCattle = async () => {
    try {
      if (!selectedCattle || !token) {
        toast.error('Select a cattle and ensure authentication');
        return;
      }

      await CattleService.deleteCattle(selectedCattle.id, token);

      // Remove the deleted cattle from the list
      setCattleList(prev => prev.filter(cattle => cattle.id !== selectedCattle.id));

      // Close modals
      setIsDetailModalOpen(false);
      setSelectedCattle(null);

      toast.success('Cattle deleted successfully');
    } catch (error) {
      toast.error('Failed to delete cattle');
    }
  };

  // Fetch user and cattle data on component mount
  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError('Please log in to access cattle management');
          setLoading(false);
          return;
        }

        const userToken = await currentUser.getIdToken();
        setUser(currentUser);
        setToken(userToken);

        // Fetch dashboard metrics
        const metrics = await CattleService.getDashboardMetrics(currentUser.uid, userToken);
        setDashboardMetrics(metrics);

        // Fetch cattle list
        const cattle = await CattleService.getAllCattle(currentUser.uid, userToken);
        setCattleList(cattle);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard. Please try again.');
        setLoading(false);
        toast.error('Failed to load dashboard');
      }
    };

    fetchUserAndData();
  }, []);

  // Handle adding new cattle
  const handleAddCattle = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Determine final disease value
      const finalDisease = newCattleForm.disease === 'Other'
        ? newCattleForm.customDisease
        : newCattleForm.disease;

      const newCattle = await CattleService.addCattle(
        user.uid,
        { ...newCattleForm, disease: finalDisease },
        token
      );

      setCattleList(prev => [...prev, newCattle]);
      setIsAddCattleModalOpen(false);
      toast.success('Cattle added successfully');

      // Reset form
      setNewCattleForm({
        name: '', breed: '', age: '', gender: '', dateOfBirth: '',
        weight: '', height: '', color: '',
        healthStatus: 'healthy', lastVeterinaryCheckup: '', vaccinations: [],
        isBreedingStock: false, lastCalvingDate: '', numberOfCalves: 0,
        earTag: '', microchipNumber: '',
        paddockLocation: '', feedType: '',
        disease: 'None', customDisease: '',
        specialNotes: ''
      });
    } catch (error) {
      toast.error('Failed to add cattle');
    }
  };

  // Handle adding vaccination
  const handleAddVaccination = async (e) => {
    e.preventDefault();
    try {
      if (!selectedCattle || !token) {
        toast.error('Select a cattle and ensure authentication');
        return;
      }

      await CattleService.addVaccination(
        selectedCattle.id,
        vaccinationForm,
        token
      );

      toast.success('Vaccination record added');
      setIsVaccinationModalOpen(false);

      // Reset vaccination form
      setVaccinationForm({
        name: '',
        date: '',
        nextDueDate: ''
      });
    } catch (error) {
      toast.error('Failed to add vaccination record');
    }
  };

  const handleCompatibilityCheck = async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BREEDING_PAIR }/predict`, formData);
      setCompatibilityResult(response.data);
    } catch (error) {
      toast.error('Failed to check compatibility');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Dashboard Metrics Section */}
      {dashboardMetrics && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3>Total Cattle</h3>
            <p className="text-2xl font-bold">{dashboardMetrics.totalCattle}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3>Healthy Cattle</h3>
            <p className="text-2xl font-bold">{dashboardMetrics.cattleHealthSummary.healthy}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3>Upcoming Vaccinations</h3>
            <p className="text-2xl font-bold">{dashboardMetrics.upcomingVaccinations.length}</p>
          </div>
        </div>
      )}

      {/* Cattle List Section */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-2">
          <h2 className="text-xl font-semibold">My Cattle</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setIsCompatibilityModalOpen(true)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <HeartIcon className="mr-2" /> Check Compatibility
            </button>
            <button
              onClick={() => setIsAddCattleModalOpen(true)}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md"
            >
              <PlusIcon className="mr-2" /> Add Cattle
            </button>
          </div>
        </div>

        {/* Cattle List Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-green-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Breed</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Health Status</th>
              <th className="p-3 text-left">Disease</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cattleList.map(cattle => (
              <tr key={cattle.id} className="border-b">
                <td className="p-3">{cattle.name}</td>
                <td className="p-3">{cattle.breed}</td>
                <td className="p-3">{cattle.age} years</td>
                <td className="p-3">
                  <span className={`
                    px-2 py-1 rounded-full text-xs 
                    ${cattle.healthStatus === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {cattle.healthStatus}
                  </span>
                </td>
                <td className="p-3">{cattle.disease}</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setSelectedCattle(cattle);
                      setIsDetailModalOpen(true);
                    }}
                    className={`px-3 py-1 rounded-md text-white ${cattle.disease !== 'None' && cattle.disease !== 'Healthy Cows'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-green-500 hover:bg-green-600'
                      }`}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed Cattle View Modal */}
      {isDetailModalOpen && selectedCattle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] relative flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
            >
              <XIcon size={24} />
            </button>

            {/* Header with disease warning if applicable */}
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">
                Cattle Details: {selectedCattle.name}
              </h2>

              {/* Disease Warning Banner */}
              {selectedCattle.disease &&
                selectedCattle.disease !== 'None' &&
                selectedCattle.disease !== 'Healthy Cows' && (
                  <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-3 flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        This animal has been diagnosed with <strong>{selectedCattle.disease}</strong>.
                        Take precautions when handling and consult a veterinarian.
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {/* Detailed Information Container */}
            <div className="overflow-y-auto flex-grow p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information Column */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-green-700 border-b pb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedCattle.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Breed:</span>
                      <span>{selectedCattle.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Gender:</span>
                      <span>{selectedCattle.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Age:</span>
                      <span>{selectedCattle.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Color:</span>
                      <span>{selectedCattle.color || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Weight:</span>
                      <span>{selectedCattle.weight ? `${selectedCattle.weight} kg` : 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Health Information Column */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-green-700 border-b pb-2">Health Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Health Status:</span>
                      <span className={`
                  px-2 py-1 rounded-full text-xs 
                  ${selectedCattle.healthStatus === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                        {selectedCattle.healthStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Disease:</span>
                      <span className={`
                  ${selectedCattle.disease !== 'None' && selectedCattle.disease !== 'Healthy Cows' ? 'text-red-600 font-medium' : 'text-green-600'}
                `}>
                        {selectedCattle.disease || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Last Veterinary Checkup:</span>
                      <span>{formatDate(selectedCattle.lastVeterinaryCheckup)}</span>
                    </div>
                  </div>
                </div>

                {/* Vaccination History */}
                <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3 text-green-700 border-b pb-2">Vaccination History</h3>
                  {selectedCattle.vaccinations && selectedCattle.vaccinations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Administered</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedCattle.vaccinations.map((vaccine, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap">{vaccine.name}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{formatDate(vaccine.date)}</td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                {vaccine.nextDueDate ? formatDate(vaccine.nextDueDate) : 'Not scheduled'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No vaccination records found.</p>
                  )}
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        setIsVaccinationModalOpen(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" /> Add Vaccination
                    </button>
                  </div>
                </div>

                {/* Additional Details Column */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-green-700 border-b pb-2">Additional Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Ear Tag:</span>
                      <span>{selectedCattle.earTag || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Paddock Location:</span>
                      <span>{selectedCattle.paddockLocation || 'N/A'}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Special Notes:</span>
                      <p className="mt-1 text-gray-600">{selectedCattle.specialNotes || 'None'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Column */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-green-700 border-b pb-2">Actions</h3>
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={() => fetchBreedingRecommendations(selectedCattle.breed)}
                      className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      disabled={selectedCattle.disease !== 'None' && selectedCattle.disease !== 'Healthy Cows'}
                    >
                      <HeartIcon className="mr-2" /> Find Breeding Pair
                    </button>
                    {selectedCattle.disease !== 'None' && selectedCattle.disease !== 'Healthy Cows' && (
                      <p className="text-xs text-red-500 italic">
                        Breeding is not recommended for animals with active diseases.
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button
                        onClick={() => {/* Implement edit logic */ }}
                        className="flex items-center justify-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                      >
                        <EditIcon className="mr-2" /> Edit
                      </button>
                      <button
                        onClick={handleDeleteCattle}
                        className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        <TrashIcon className="mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isBreedingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-1/2 max-h-[70vh] relative flex flex-col">
            <button
              onClick={() => setIsBreedingModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
            >
              <XIcon size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4 p-4 border-b">
              Breeding Pair Recommendations
            </h2>


            <div className="overflow-y-auto flex-grow p-4">
              {breedingRecommendations.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="p-3 text-left">Breed</th>
                      <th className="p-3 text-right">Milk Yield</th>
                      <th className="p-3 text-right">Compatibility Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breedingRecommendations.map((recommendation, index) => (
                      <tr
                        key={recommendation.Breed}
                        className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-green-50'}
                    hover:bg-green-100 transition-colors
                  `}
                      >
                        <td className="p-3">{recommendation.Breed}</td>
                        <td className="p-3 text-right">{recommendation.Milk_Yield.toLocaleString()} L</td>
                        <td className="p-3 text-right">
                          <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${recommendation.Score >= 9 ? 'bg-green-100 text-green-800' :
                              recommendation.Score >= 8 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}
                    `}>
                            {recommendation.Score.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 p-4">
                  No breeding recommendations available
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Add Cattle Modal */}
      {isAddCattleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-3/4 max-h-[80vh] relative flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsAddCattleModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
            >
              <XIcon size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4 p-4 border-b">Register New Cattle</h2>

            {/* Scrollable Form Container */}
            <form
              onSubmit={handleAddCattle}
              className="overflow-y-auto flex-grow p-4"
              style={{ maxHeight: 'calc(80vh - 100px)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Information */}
                <div className="col-span-1 md:col-span-3">
                  <h3 className="text-lg font-semibold mb-3 text-green-700">Basic Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCattleForm.name}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                  <select
                    name="breed"
                    value={newCattleForm.breed}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, breed: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Breed</option>
                    {BREED_OPTIONS.map(breed => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={newCattleForm.gender}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, gender: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Physical Characteristics */}
                <div className="col-span-1 md:col-span-3 mt-4">
                  <h3 className="text-lg font-semibold mb-3 text-green-700">Physical Characteristics</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                  <input
                    type="number"
                    name="age"
                    value={newCattleForm.age}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, age: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    name="weight"
                    value={newCattleForm.weight}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, weight: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={newCattleForm.color}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, color: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Health Information */}
                <div className="col-span-1 md:col-span-3 mt-4">
                  <h3 className="text-lg font-semibold mb-3 text-green-700">Health Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
                  <select
                    name="healthStatus"
                    value={newCattleForm.healthStatus}
                    onChange={handleHealthStatusChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="healthy">Healthy</option>
                    <option value="sick">Sick</option>
                    <option value="recovering">Recovering</option>
                  </select>
                  {newCattleForm.healthStatus === "healthy" && (
                    <p className="text-xs text-gray-500 mt-1">Healthy cattle cannot have diseases.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
                  <select
                    name="disease"
                    value={newCattleForm.disease}
                    onChange={handleDiseaseChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={newCattleForm.healthStatus === "healthy"}
                  >
                    {newCattleForm.healthStatus === "healthy" ? (
                      <option value="None">None</option>
                    ) : (
                      DISEASE_OPTIONS.filter(disease => disease !== "Healthy Cows").map(disease => (
                        <option key={disease} value={disease}>{disease}</option>
                      ))
                    )}
                  </select>
                  {newCattleForm.healthStatus !== "healthy" && !newCattleForm.disease && (
                    <p className="text-xs text-red-500 mt-1">Please select a disease for non-healthy cattle.</p>
                  )}
                </div>
                {newCattleForm.disease === 'Other' && (
                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specify Custom Disease</label>
                    <input
                      type="text"
                      name="customDisease"
                      value={newCattleForm.customDisease}
                      onChange={(e) => setNewCattleForm({ ...newCattleForm, customDisease: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Veterinary Checkup</label>
                  <input
                    type="date"
                    name="lastVeterinaryCheckup"
                    value={newCattleForm.lastVeterinaryCheckup}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, lastVeterinaryCheckup: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Additional Details */}
                <div className="col-span-1 md:col-span-3 mt-4">
                  <h3 className="text-lg font-semibold mb-3 text-green-700">Additional Details</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ear Tag</label>
                  <input
                    type="text"
                    name="earTag"
                    value={newCattleForm.earTag}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, earTag: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paddock Location</label>
                  <input
                    type="text"
                    name="paddockLocation"
                    value={newCattleForm.paddockLocation}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, paddockLocation: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
                  <textarea
                    name="specialNotes"
                    value={newCattleForm.specialNotes}
                    onChange={(e) => setNewCattleForm({ ...newCattleForm, specialNotes: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 sticky bottom-0 bg-white py-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddCattleModalOpen(false)}
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
        </div>
      )}

      {/* Vaccination Modal */}
      {isVaccinationModalOpen && selectedCattle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/2 relative">
            <button
              onClick={() => setIsVaccinationModalOpen(false)}
              className="absolute top-4 right-4"
            >
              <XIcon />
            </button>
            <h2 className="text-xl mb-4">Add Vaccination for {selectedCattle.name}</h2>
            <form onSubmit={handleAddVaccination}>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Vaccination Name"
                  value={vaccinationForm.name}
                  onChange={(e) => setVaccinationForm({ ...vaccinationForm, name: e.target.value })}
                  required
                />
                <input
                  type="date"
                  value={vaccinationForm.date}
                  onChange={(e) => setVaccinationForm({ ...vaccinationForm, date: e.target.value })}
                  required
                />
                <input
                  type="date"
                  placeholder="Next Due Date"
                  value={vaccinationForm.nextDueDate}
                  onChange={(e) => setVaccinationForm({ ...vaccinationForm, nextDueDate: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsVaccinationModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Vaccination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compatibility Check Modal */}
      {isCompatibilityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] relative flex flex-col">
            <button
              onClick={() => {
                setIsCompatibilityModalOpen(false);
                setCompatibilityResult(null);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
            >
              <XIcon size={24} />
            </button>

            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Check Breeding Compatibility</h2>
            </div>

            <div className="overflow-y-auto flex-grow p-4">
              {!compatibilityResult ? (
                <BreedingForm onSubmit={handleCompatibilityCheck} />
              ) : (
                <div className="space-y-4">
                  <div className={`p-6 rounded-lg border ${
                    compatibilityResult.compatible === 'Yes' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                  }`}>
                    <h3 className="text-xl font-semibold mb-4">Results</h3>
                    <div className="space-y-2">
                      <p className="text-lg">
                        Compatible: 
                        <span className={`font-bold ${
                          compatibilityResult.compatible === 'Yes' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {compatibilityResult.compatible}
                        </span>
                      </p>
                      <p className="text-lg">
                        Confidence Score: 
                        <span className="font-bold">
                          {compatibilityResult.confidence_score}%
                        </span>
                      </p>
                      <p className="text-lg">
                        Raw Score: 
                        <span className="font-bold">
                          {compatibilityResult.raw_ccs_score}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCompatibilityResult(null)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Check Another Pair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CattleManagementDashboard;