import { useState } from "react"

export default function ImprovedBreedingForm({ onSubmit }) {
  // Define the default values that will be used if no input is provided
  const defaultValues = {
    // Cow Details
    Cow_Breed: "Gir",
    Cow_Age: 4,
    Cow_Weight: 450.0,
    Cow_Height: 140.0,
    Cow_Milk_Yield: 15.0,
    Cow_Health_Status: 1,
    Cow_Drought_Resistance: 75.0,
    Cow_Temperament: "Calm",
    Cow_Mother_Milk_Yield: 16.0,
    Cow_Past_Breeding_Success: "High",
    Cow_Fertility_Rate: 80.0,
    Cow_Breeding_Success_Rate: 70.0,
    Cow_Market_Value: 50000.0,
    
    // Bull Details
    Bull_Breed: "Gir",
    Bull_Age: 5,
    Bull_Weight: 750.0,
    Bull_Height: 160.0,
    Bull_Health_Status: 1,
    Bull_Mother_Milk_Yield: 18.0,
    Bull_Drought_Resistance: 80.0,
    Bull_Temperament: "Calm",
    Bull_Past_Breeding_Success: "High",
    Bull_Fertility_Rate: 85.0,
    Bull_Breeding_Success_Rate: 75.0,
    Bull_Market_Value: 75000.0,
    
    // Breeding Parameters
    Same_Parents: 0,
    Trait_Difference: 15.0,
    Genetic_Diversity: 8.0,
    Fertility_Rate: 85.0,
    Breeding_Success_Rate: 75.0,
    Disease_Resistance_Score: 8.0,
    Market_Value: 50000.0,
    Past_Breeding_Success: "High"
  };

  // Initialize formData as empty object (or minimal required structure)
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    
    // Convert numeric fields to numbers
    if (type === "number" || type === "range") {
      processedValue = value === "" ? "" : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Merge the formData with defaultValues for any missing fields
    const submissionData = { ...defaultValues, ...formData };
    onSubmit(submissionData);
  };

  // Update breed options from dataset
  const breedOptions = [
    "Alambadi", "Amritmahal", "Ayrshire", "Banni", "Bargur", "Bhadawari", 
    "Brown_Swiss", "Dangi", "Deoni", "Gir", "Guernsey", "Hallikar", "Hariana", 
    "Holstein_Friesian", "Jaffrabadi", "Jersey", "Kangayam", "Kankrej", 
    "Kasargod", "Kenkatha", "Kherigarh", "Khillari", "Krishna_Valley", 
    "Malnad_gidda", "Mehsana", "Murrah", "Nagori", "Nagpuri", "Nili_Ravi", 
    "Nimari", "Ongole", "Pulikulam", "Rathi", "Red_Dane", "Red_Sindhi", 
    "Sahiwal", "Surti", "Tharparkar", "Toda", "Umblachery", "Vechur"
  ].sort();

  const diseaseOptions = [
    "Bovine Viral Diarrhea (BVD)", "Brucellosis", "Ketosis", "Foot and Mouth Disease (FMD)",
    "Leptospirosis", "Milk Fever (Hypocalcemia)", "Mastitis", "Lumpy Skin Disease",
    "Theileriosis", "Infectious Bovine Rhinotracheitis (IBR)", "Anaplasmosis",
    "Grass Tetany (Hypomagnesemia)", "Neosporosis", "Trypanosomiasis (Surra)"
  ].sort();

  const temperamentOptions = ["Calm", "Aggressive"];
  const breedingSuccessOptions = ["High", "Moderate", "Low"];
  const healthOptions = [
    { value: 2, label: "Excellent" },
    { value: 1, label: "Good" },
    { value: 0, label: "Poor" }
  ];

  // Field constraints from dataset
  const constraints = {
    age: { min: 3, max: 10 },
    weight: { min: 300, max: 700 },
    height: { min: 110, max: 160 },
    milk_yield: { min: 3, max: 12 },
    drought_resistance: { min: 0, max: 100 },
    fertility_rate: { min: 40, max: 80 },
    market_value: { min: 10000, max: 30000 }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Cattle Breeding Data Form</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cow Section */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-300 pb-2">Cow Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="Cow_Breed" className="text-sm font-medium text-green-700 mb-1">Breed</label>
              <select
                id="Cow_Breed"
                name="Cow_Breed"
                value={formData.Cow_Breed || ""}
                onChange={handleChange}
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Select breed (e.g. Gir)</option>
                {breedOptions.map(option => (
                  <option key={`cow-${option}`} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Age" className="text-sm font-medium text-green-700 mb-1">Age (years)</label>
              <input
                type="number"
                id="Cow_Age"
                name="Cow_Age"
                value={formData.Cow_Age || ""}
                onChange={handleChange}
                min={constraints.age.min}
                max={constraints.age.max}
                step="0.5"
                placeholder="4"
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Weight" className="text-sm font-medium text-green-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                id="Cow_Weight"
                name="Cow_Weight"
                value={formData.Cow_Weight || ""}
                onChange={handleChange}
                min={constraints.weight.min}
                max={constraints.weight.max}
                step="10"
                placeholder="450"
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Height" className="text-sm font-medium text-green-700 mb-1">Height (cm)</label>
              <input
                type="number"
                id="Cow_Height"
                name="Cow_Height"
                value={formData.Cow_Height || ""}
                onChange={handleChange}
                min={constraints.height.min}
                max={constraints.height.max}
                step="5"
                placeholder="140"
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Milk_Yield" className="text-sm font-medium text-green-700 mb-1">Daily Milk Yield (L)</label>
              <input
                type="number"
                id="Cow_Milk_Yield"
                name="Cow_Milk_Yield"
                value={formData.Cow_Milk_Yield || ""}
                onChange={handleChange}
                min={constraints.milk_yield.min}
                max={constraints.milk_yield.max}
                step="0.5"
                placeholder="15"
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Mother_Milk_Yield" className="text-sm font-medium text-green-700 mb-1">Mother's Milk Yield (L)</label>
              <input
                type="number"
                id="Cow_Mother_Milk_Yield"
                name="Cow_Mother_Milk_Yield"
                value={formData.Cow_Mother_Milk_Yield || ""}
                onChange={handleChange}
                min="0"
                max="40"
                step="0.5"
                placeholder="16"
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Health_Status" className="text-sm font-medium text-green-700 mb-1">Health Status</label>
              <select
                id="Cow_Health_Status"
                name="Cow_Health_Status"
                value={formData.Cow_Health_Status || ""}
                onChange={handleChange}
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Select status (e.g. Excellent)</option>
                {healthOptions.map(option => (
                  <option key={`cow-health-${option.value}`} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Drought_Resistance" className="text-sm font-medium text-green-700 mb-1">
                Drought Resistance (0-100)
              </label>
              <input
                type="range"
                id="Cow_Drought_Resistance"
                name="Cow_Drought_Resistance"
                value={formData.Cow_Drought_Resistance || 75}
                onChange={handleChange}
                min={constraints.drought_resistance.min}
                max={constraints.drought_resistance.max}
                step="5"
                className="p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-center">{formData.Cow_Drought_Resistance || 75}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Temperament" className="text-sm font-medium text-green-700 mb-1">Temperament</label>
              <select
                id="Cow_Temperament"
                name="Cow_Temperament"
                value={formData.Cow_Temperament || ""}
                onChange={handleChange}
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Select temperament (e.g. Calm)</option>
                {temperamentOptions.map(option => (
                  <option key={`cow-temp-${option}`} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Fertility_Rate" className="text-sm font-medium text-green-700 mb-1">
                Fertility Rate (%)
              </label>
              <input
                type="number"
                id="Cow_Fertility_Rate"
                name="Cow_Fertility_Rate"
                value={formData.Cow_Fertility_Rate || ""}
                onChange={handleChange}
                min={constraints.fertility_rate.min}
                max={constraints.fertility_rate.max}
                step="5"
                placeholder="80"
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Breeding_Success_Rate" className="text-sm font-medium text-green-700 mb-1">
                Breeding Success Rate (%)
              </label>
              <input
                type="number"
                id="Cow_Breeding_Success_Rate"
                name="Cow_Breeding_Success_Rate"
                value={formData.Cow_Breeding_Success_Rate || ""}
                onChange={handleChange}
                min="0"
                max="100"
                step="5"
                placeholder="70"
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Past_Breeding_Success" className="text-sm font-medium text-green-700 mb-1">
                Past Breeding Success
              </label>
              <select
                id="Cow_Past_Breeding_Success"
                name="Cow_Past_Breeding_Success"
                value={formData.Cow_Past_Breeding_Success || ""}
                onChange={handleChange}
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Select success rate (e.g. High)</option>
                {breedingSuccessOptions.map(option => (
                  <option key={`cow-success-${option}`} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Cow_Market_Value" className="text-sm font-medium text-green-700 mb-1">
                Market Value (₹)
              </label>
              <input
                type="number"
                id="Cow_Market_Value"
                name="Cow_Market_Value"
                value={formData.Cow_Market_Value || ""}
                onChange={handleChange}
                min={constraints.market_value.min}
                max={constraints.market_value.max}
                step="5000"
                placeholder="50000"
                className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Bull Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b border-blue-300 pb-2">Bull Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="Bull_Breed" className="text-sm font-medium text-blue-700 mb-1">Breed</label>
              <select
                id="Bull_Breed"
                name="Bull_Breed"
                value={formData.Bull_Breed || ""}
                onChange={handleChange}
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select breed (e.g. Gir)</option>
                {breedOptions.map(option => (
                  <option key={`bull-${option}`} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Age" className="text-sm font-medium text-blue-700 mb-1">Age (years)</label>
              <input
                type="number"
                id="Bull_Age"
                name="Bull_Age"
                value={formData.Bull_Age || ""}
                onChange={handleChange}
                min={constraints.age.min}
                max={constraints.age.max}
                step="0.5"
                placeholder="5"
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Weight" className="text-sm font-medium text-blue-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                id="Bull_Weight"
                name="Bull_Weight"
                value={formData.Bull_Weight || ""}
                onChange={handleChange}
                min={constraints.weight.min}
                max={constraints.weight.max}
                step="10"
                placeholder="750"
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Height" className="text-sm font-medium text-blue-700 mb-1">Height (cm)</label>
              <input
                type="number"
                id="Bull_Height"
                name="Bull_Height"
                value={formData.Bull_Height || ""}
                onChange={handleChange}
                min={constraints.height.min}
                max={constraints.height.max}
                step="5"
                placeholder="160"
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Mother_Milk_Yield" className="text-sm font-medium text-blue-700 mb-1">Mother's Milk Yield (L)</label>
              <input
                type="number"
                id="Bull_Mother_Milk_Yield"
                name="Bull_Mother_Milk_Yield"
                value={formData.Bull_Mother_Milk_Yield || ""}
                onChange={handleChange}
                min="0"
                max="40"
                step="0.5"
                placeholder="18"
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Health_Status" className="text-sm font-medium text-blue-700 mb-1">Health Status</label>
              <select
                id="Bull_Health_Status"
                name="Bull_Health_Status"
                value={formData.Bull_Health_Status || ""}
                onChange={handleChange}
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select status (e.g. Excellent)</option>
                {healthOptions.map(option => (
                  <option key={`bull-health-${option.value}`} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Drought_Resistance" className="text-sm font-medium text-blue-700 mb-1">
                Drought Resistance (0-100)
              </label>
              <input
                type="range"
                id="Bull_Drought_Resistance"
                name="Bull_Drought_Resistance"
                value={formData.Bull_Drought_Resistance || 80}
                onChange={handleChange}
                min={constraints.drought_resistance.min}
                max={constraints.drought_resistance.max}
                step="5"
                className="p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-center">{formData.Bull_Drought_Resistance || 80}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Temperament" className="text-sm font-medium text-blue-700 mb-1">Temperament</label>
              <select
                id="Bull_Temperament"
                name="Bull_Temperament"
                value={formData.Bull_Temperament || ""}
                onChange={handleChange}
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select temperament (e.g. Calm)</option>
                {temperamentOptions.map(option => (
                  <option key={`bull-temp-${option}`} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Fertility_Rate" className="text-sm font-medium text-blue-700 mb-1">
                Fertility Rate (%)
              </label>
              <input
                type="number"
                id="Bull_Fertility_Rate"
                name="Bull_Fertility_Rate"
                value={formData.Bull_Fertility_Rate || ""}
                onChange={handleChange}
                min={constraints.fertility_rate.min}
                max={constraints.fertility_rate.max}
                step="5"
                placeholder="85"
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Breeding_Success_Rate" className="text-sm font-medium text-blue-700 mb-1">
                Breeding Success Rate (%)
              </label>
              <input
                type="number"
                id="Bull_Breeding_Success_Rate"
                name="Bull_Breeding_Success_Rate"
                value={formData.Bull_Breeding_Success_Rate || ""}
                onChange={handleChange}
                min="0"
                max="100"
                step="5"
                placeholder="75"
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Past_Breeding_Success" className="text-sm font-medium text-blue-700 mb-1">
                Past Breeding Success
              </label>
              <select
                id="Bull_Past_Breeding_Success"
                name="Bull_Past_Breeding_Success"
                value={formData.Bull_Past_Breeding_Success || ""}
                onChange={handleChange}
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select success rate (e.g. High)</option>
                {breedingSuccessOptions.map(option => (
                  <option key={`bull-success-${option}`} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="Bull_Market_Value" className="text-sm font-medium text-blue-700 mb-1">
                Market Value (₹)
              </label>
              <input
                type="number"
                id="Bull_Market_Value"
                name="Bull_Market_Value"
                value={formData.Bull_Market_Value || ""}
                onChange={handleChange}
                min={constraints.market_value.min}
                max={constraints.market_value.max}
                step="5000"
                placeholder="75000"
                className="p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breeding Parameters Section */}
      <div className="mt-8 bg-amber-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-amber-300 pb-2">Breeding Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="Same_Parents" className="text-sm font-medium text-amber-700 mb-1">Same Parents?</label>
            <select
              id="Same_Parents"
              name="Same_Parents"
              value={formData.Same_Parents || ""}
              onChange={handleChange}
              className="p-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="" disabled>Select (default: No)</option>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="Trait_Difference" className="text-sm font-medium text-amber-700 mb-1">
              Trait Difference (%)
            </label>
            <input
              type="number"
              id="Trait_Difference"
              name="Trait_Difference"
              value={formData.Trait_Difference || ""}
              onChange={handleChange}
              min="0"
              max="100"
              step="5"
              placeholder="15"
              className="p-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="Genetic_Diversity" className="text-sm font-medium text-amber-700 mb-1">
              Genetic Diversity (1-10)
            </label>
            <input
              type="range"
              id="Genetic_Diversity"
              name="Genetic_Diversity"
              value={formData.Genetic_Diversity || 8}
              onChange={handleChange}
              min="1"
              max="10"
              step="0.5"
              className="p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-sm text-center">{formData.Genetic_Diversity || 8}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="Fertility_Rate" className="text-sm font-medium text-amber-700 mb-1">
              Combined Fertility Rate (%)
            </label>
            <input
              type="number"
              id="Fertility_Rate"
              name="Fertility_Rate"
              value={formData.Fertility_Rate || ""}
              onChange={handleChange}
              min="0"
              max="100"
              step="5"
              placeholder="85"
              className="p-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="Breeding_Success_Rate" className="text-sm font-medium text-amber-700 mb-1">
              Breeding Success Rate (%)
            </label>
            <input
              type="number"
              id="Breeding_Success_Rate"
              name="Breeding_Success_Rate"
              value={formData.Breeding_Success_Rate || ""}
              onChange={handleChange}
              min="0"
              max="100"
              step="5"
              placeholder="75"
              className="p-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="Disease_Resistance_Score" className="text-sm font-medium text-amber-700 mb-1">
              Disease Resistance (1-10)
            </label>
            <input
              type="range"
              id="Disease_Resistance_Score"
              name="Disease_Resistance_Score"
              value={formData.Disease_Resistance_Score || 8}
              onChange={handleChange}
              min="1"
              max="10"
              step="0.5"
              className="p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-sm text-center">{formData.Disease_Resistance_Score || 8}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="Market_Value" className="text-sm font-medium text-amber-700 mb-1">
              Expected Offspring Value (₹)
            </label>
            <input
              type="number"
              id="Market_Value"
              name="Market_Value"
              value={formData.Market_Value || ""}
              onChange={handleChange}
              min="10000"
              max="200000"
              step="5000"
              placeholder="50000"
              className="p-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="Past_Breeding_Success" className="text-sm font-medium text-amber-700 mb-1">
              Overall Past Breeding Success
            </label>
            <select
              id="Past_Breeding_Success"
              name="Past_Breeding_Success"
              value={formData.Past_Breeding_Success || ""}
              onChange={handleChange}
              className="p-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="" disabled>Select success rate (e.g. High)</option>
              {breedingSuccessOptions.map(option => (
                <option key={`overall-success-${option}`} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all text-lg font-medium"
      >
        Submit Breeding Data
      </button>
    </form>
  );
}