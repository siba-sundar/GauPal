import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { CattleService } from './CattleServices.jsx'; // API service we just created
import { toast } from 'react-toastify';

// Icons for better UI
import { 
  PlusIcon, 
  TrashIcon, 
  EditIcon,  
  InfoIcon,
  XIcon 
} from 'lucide-react';

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

  // Dropdown Options
  const BREED_OPTIONS = [
    'Angus', 'Hereford', 'Charolais', 'Simmental', 
    'Holstein', 'Jersey', 'Brahman', 'Other'
  ];

  const DISEASE_OPTIONS = [
    'None', 'Mastitis', 'Foot Rot', 'Pneumonia', 
    'Bovine Respiratory Disease', 'Other'
  ];

  const auth = getAuth();
  
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
        {...newCattleForm, disease: finalDisease}, 
        token
      );

      setCattleList(prev => [...prev, newCattle]);
      setIsAddCattleModalOpen(false);
      toast.success('Cattle added successfully');
      
      // Reset form
      setNewCattleForm({
        name: '',
        breed: '',
        age: '',
        gender: '',
        dateOfBirth: '',
        weight: '',
        height: '',
        color: '',
        healthStatus: 'healthy',
        lastVeterinaryCheckup: '',
        vaccinations: [],
        isBreedingStock: false,
        lastCalvingDate: '',
        numberOfCalves: 0,
        earTag: '',
        microchipNumber: '',
        paddockLocation: '',
        feedType: '',
        disease: 'None',
        customDisease: '',
        specialNotes: ''
      });
    } catch (error) {
      toast.error('Failed to add cattle');
    }
  };

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
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">My Cattle</h2>
          <button 
            onClick={() => setIsAddCattleModalOpen(true)}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon className="mr-2" /> Add Cattle
          </button>
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
                <td className="p-3 flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedCattle(cattle);
                      setIsVaccinationModalOpen(true);
                    }}
                    className="text-blue-500 hover:bg-blue-50 p-1 rounded"
                  >
                    <PlusIcon size={16} />
                  </button>
                  <button 
                    onClick={() => setSelectedCattle(cattle)}
                    className="text-green-500 hover:bg-green-50 p-1 rounded"
                  >
                    <InfoIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                    onChange={(e) => setNewCattleForm({...newCattleForm, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                  <select
                    name="breed"
                    value={newCattleForm.breed}
                    onChange={(e) => setNewCattleForm({...newCattleForm, breed: e.target.value})}
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
                    onChange={(e) => setNewCattleForm({...newCattleForm, gender: e.target.value})}
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
                    onChange={(e) => setNewCattleForm({...newCattleForm, age: e.target.value})}
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
                    onChange={(e) => setNewCattleForm({...newCattleForm, weight: e.target.value})}
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
                    onChange={(e) => setNewCattleForm({...newCattleForm, color: e.target.value})}
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
                    onChange={(e) => setNewCattleForm({...newCattleForm, healthStatus: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="healthy">Healthy</option>
                    <option value="sick">Sick</option>
                    <option value="recovering">Recovering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
                  <select
                    name="disease"
                    value={newCattleForm.disease}
                    onChange={(e) => setNewCattleForm({...newCattleForm, disease: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {DISEASE_OPTIONS.map(disease => (
                      <option key={disease} value={disease}>{disease}</option>
                    ))}
                  </select>
                </div>
                {newCattleForm.disease === 'Other' && (
                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specify Custom Disease</label>
                    <input
                      type="text"
                      name="customDisease"
                      value={newCattleForm.customDisease}
                      onChange={(e) => setNewCattleForm({...newCattleForm, customDisease: e.target.value})}
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
                    onChange={(e) => setNewCattleForm({...newCattleForm, lastVeterinaryCheckup: e.target.value})}
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
                    onChange={(e) => setNewCattleForm({...newCattleForm, earTag: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paddock Location</label>
                  <input
                    type="text"
                    name="paddockLocation"
                    value={newCattleForm.paddockLocation}
                    onChange={(e) => setNewCattleForm({...newCattleForm, paddockLocation: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
                  <textarea
                    name="specialNotes"
                    value={newCattleForm.specialNotes}
                    onChange={(e) => setNewCattleForm({...newCattleForm, specialNotes: e.target.value})}
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
                  onChange={(e) => setVaccinationForm({...vaccinationForm, name: e.target.value})}
                  required
                />
                <input
                  type="date"
                  value={vaccinationForm.date}
                  onChange={(e) => setVaccinationForm({...vaccinationForm, date: e.target.value})}
                  required
                />
                <input
                  type="date"
                  placeholder="Next Due Date"
                  value={vaccinationForm.nextDueDate}
                  onChange={(e) => setVaccinationForm({...vaccinationForm, nextDueDate: e.target.value})}
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
    </div>
  );
};

export default CattleManagementDashboard;