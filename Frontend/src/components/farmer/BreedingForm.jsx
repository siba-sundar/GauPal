import { useState } from 'react';

export default function CattlePairForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    cow: {
      Breed: '',
      Age: '',
      Weight: '',
      Height: '',
      Milk_Yield: '',
      Health_Status: 0,
      Drought_Resistance: '',
      Temperament: 'Calm'
    },
    bull: {
      Breed: '',
      Age: '',
      Weight: '',
      Height: '',
      Health_Status: 0,
      Mother_Milk_Yield: '',
      Drought_Resistance: '',
      Temperament: 'Calm'
    },
    // Additional top-level fields
    Same_Parents: 0,
    Trait_Difference: '',
    Genetic_Diversity: '',
    Fertility_Rate: '',
    Breeding_Success_Rate: '',
    Disease_Resistance_Score: '',
    Market_Value: '',
    Past_Breeding_Success: 'Medium'
  });

  const handleInputChange = (section, field, value) => {
    if (section === 'cow' || section === 'bull') {
      setFormData(prevData => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: value
        }
      }));
    } else {
      // For top-level fields
      setFormData(prevData => ({
        ...prevData,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Format the data for the API
      const apiData = {
        Cow: formData.cow,
        Bull: formData.bull,
        Same_Parents: parseInt(formData.Same_Parents) || 0,
        Trait_Difference: formData.Trait_Difference ? parseInt(formData.Trait_Difference) : null,
        Genetic_Diversity: formData.Genetic_Diversity ? parseInt(formData.Genetic_Diversity) : null,
        Fertility_Rate: formData.Fertility_Rate ? parseInt(formData.Fertility_Rate) : null,
        Breeding_Success_Rate: formData.Breeding_Success_Rate ? parseInt(formData.Breeding_Success_Rate) : null,
        Disease_Resistance_Score: formData.Disease_Resistance_Score ? parseFloat(formData.Disease_Resistance_Score) : null,
        Market_Value: formData.Market_Value ? parseInt(formData.Market_Value) : null,
        Past_Breeding_Success: formData.Past_Breeding_Success || null
      };
      
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to get prediction' });
    } finally {
      setLoading(false);
    }
  };

  const temperamentOptions = ['Calm', 'Docile', 'Aggressive', 'Nervous'];
  const successLevelOptions = ['Low', 'Medium', 'High'];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Cattle Breeding Pair Compatibility</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cow Section */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h2 className="text-xl font-semibold mb-4">Cow Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Breed</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={formData.cow.Breed}
                  onChange={(e) => handleInputChange('cow', 'Breed', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age (years)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.cow.Age}
                    onChange={(e) => handleInputChange('cow', 'Age', Number(e.target.value))}
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.cow.Weight}
                    onChange={(e) => handleInputChange('cow', 'Weight', Number(e.target.value))}
                    required
                    min="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.cow.Height}
                    onChange={(e) => handleInputChange('cow', 'Height', Number(e.target.value))}
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Milk Yield (liters/day)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.cow.Milk_Yield}
                    onChange={(e) => handleInputChange('cow', 'Milk_Yield', Number(e.target.value))}
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Health Status</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.cow.Health_Status}
                    onChange={(e) => handleInputChange('cow', 'Health_Status', Number(e.target.value))}
                    required
                  >
                    <option value="0">Healthy (0)</option>
                    <option value="1">Sick (1)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Drought Resistance (%)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.cow.Drought_Resistance}
                    onChange={(e) => handleInputChange('cow', 'Drought_Resistance', Number(e.target.value))}
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperament</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={formData.cow.Temperament}
                  onChange={(e) => handleInputChange('cow', 'Temperament', e.target.value)}
                  required
                >
                  {temperamentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Bull Section */}
          <div className="border rounded-lg p-4 bg-green-50">
            <h2 className="text-xl font-semibold mb-4">Bull Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Breed</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={formData.bull.Breed}
                  onChange={(e) => handleInputChange('bull', 'Breed', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age (years)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.bull.Age}
                    onChange={(e) => handleInputChange('bull', 'Age', Number(e.target.value))}
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.bull.Weight}
                    onChange={(e) => handleInputChange('bull', 'Weight', Number(e.target.value))}
                    required
                    min="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.bull.Height}
                    onChange={(e) => handleInputChange('bull', 'Height', Number(e.target.value))}
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mother's Milk Yield (liters/day)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.bull.Mother_Milk_Yield}
                    onChange={(e) => handleInputChange('bull', 'Mother_Milk_Yield', Number(e.target.value))}
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Health Status</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.bull.Health_Status}
                    onChange={(e) => handleInputChange('bull', 'Health_Status', Number(e.target.value))}
                    required
                  >
                    <option value="0">Healthy (0)</option>
                    <option value="1">Sick (1)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Drought Resistance (%)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={formData.bull.Drought_Resistance}
                    onChange={(e) => handleInputChange('bull', 'Drought_Resistance', Number(e.target.value))}
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperament</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  value={formData.bull.Temperament}
                  onChange={(e) => handleInputChange('bull', 'Temperament', e.target.value)}
                  required
                >
                  {temperamentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Parameters Section */}
        <div className="border rounded-lg p-4 bg-yellow-50">
          <h2 className="text-xl font-semibold mb-4">Breeding Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Same Parents</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={formData.Same_Parents}
                onChange={(e) => handleInputChange('top', 'Same_Parents', Number(e.target.value))}
              >
                <option value="0">No (0)</option>
                <option value="1">Yes (1)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Trait Difference</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={formData.Trait_Difference}
                onChange={(e) => handleInputChange('top', 'Trait_Difference', e.target.value)}
                placeholder="Auto-calculated if empty"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Genetic Diversity (1-10)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={formData.Genetic_Diversity}
                onChange={(e) => handleInputChange('top', 'Genetic_Diversity', e.target.value)}
                min="1"
                max="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fertility Rate (%)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={formData.Fertility_Rate}
                onChange={(e) => handleInputChange('top', 'Fertility_Rate', e.target.value)}
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Breeding Success Rate (%)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={formData.Breeding_Success_Rate}
                onChange={(e) => handleInputChange('top', 'Breeding_Success_Rate', e.target.value)}
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Disease Resistance (1-10)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={formData.Disease_Resistance_Score}
                onChange={(e) => handleInputChange('top', 'Disease_Resistance_Score', e.target.value)}
                min="1"
                max="10"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Market Value ($)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={formData.Market_Value}
                onChange={(e) => handleInputChange('top', 'Market_Value', e.target.value)}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Past Breeding Success</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={formData.Past_Breeding_Success}
                onChange={(e) => handleInputChange('top', 'Past_Breeding_Success', e.target.value)}
              >
                {successLevelOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Predicting...' : 'Predict Compatibility'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Prediction Result:</h3>
          <div className="flex items-center">
            <div className={`text-xl font-bold ${result.prediction === 'Good Pair' ? 'text-green-600' : 'text-red-600'}`}>
              {result.prediction}
            </div>
            {result.probability && (
              <div className="ml-4 text-gray-600">
                Confidence: {(result.probability * 100).toFixed(2)}%
              </div>
            )}
          </div>
          {result.error && (
            <div className="text-red-600 mt-2">{result.error}</div>
          )}
        </div>
      )}
    </div>
  );
}