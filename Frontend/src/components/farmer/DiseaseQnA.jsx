import React, { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

// Symptom list provided
const symptomList = [
  'anorexia', 'abdominal_pain', 'anaemia', 'abortions', 'acetone', 'aggression', 'arthrogyposis',
  'ankylosis', 'anxiety', 'bellowing', 'blood_loss', 'blood_poisoning', 'blisters', 'colic', 'Condemnation_of_livers',
  'coughing', 'depression', 'discomfort', 'dyspnea', 'dysentery', 'diarrhoea', 'dehydration', 'drooling',
  'dull', 'decreased_fertility', 'diffculty_breath', 'emaciation', 'encephalitis', 'fever', 'facial_paralysis',
  'frothing_of_mouth', 'frothing', 'gaseous_stomach', 'highly_diarrhoea', 'high_pulse_rate', 'high_temp', 
  'high_proportion', 'hyperaemia', 'hydrocephalus', 'isolation_from_herd', 'infertility', 'intermittent_fever', 
  'jaundice', 'ketosis', 'loss_of_appetite', 'lameness', 'lack_of-coordination', 'lethargy', 'lacrimation', 
  'milk_flakes', 'milk_watery', 'milk_clots', 'mild_diarrhoea', 'moaning', 'mucosal_lesions', 'milk_fever', 
  'nausea', 'nasel_discharges', 'oedema', 'pain', 'painful_tongue', 'pneumonia', 'photo_sensitization', 
  'quivering_lips', 'reduction_milk_vields', 'rapid_breathing', 'rumenstasis', 'reduced_rumination', 
  'reduced_fertility', 'reduced_fat', 'reduces_feed_intake', 'raised_breathing', 'stomach_pain', 'salivation', 
  'stillbirths', 'shallow_breathing', 'swollen_pharyngeal', 'swelling', 'saliva', 'swollen_tongue', 'tachycardia',
  'torticollis', 'udder_swelling', 'udder_heat', 'udder_hardeness', 'udder_redness', 'udder_pain', 'unwillingness_to_move',
  'ulcers', 'vomiting', 'weight_loss', 'weakness'
];

// Disease mapping
const diseaseMapping = {
  0: 'Mastitis',
  1: 'Blackleg',
  2: 'Bloat',
  3: 'Coccidiosis',
  4: 'Cryptosporidiosis',
  5: 'Displaced Abomasum',
  6: 'Gut Worms',
  7: 'Listeriosis',
  8: 'Liver Fluke',
  9: 'Necrotic Enteritis',
  10: 'Peri Weaning Diarrhoea',
  11: 'Rift Valley Fever',
  12: 'Rumen Acidosis',
  13: 'Traumatic Reticulitis',
  14: 'Calf Diphtheria',
  15: 'Foot Rot',
  16: 'Foot and Mouth',
  17: 'Ragwort Poisoning',
  18: 'Wooden Tongue',
  19: 'Infectious Bovine Rhinotracheitis',
  20: 'Acetonaemia',
  21: 'Fatty Liver Syndrome',
  22: 'Calf Pneumonia',
  23: 'Schmallenberg Virus',
  24: 'Trypanosomosis',
  25: 'Fog Fever'
};

const SymptomForm = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_DISEASE_QNA}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      const data = await response.json();
      
      // Handle the prediction result (which is a number)
      if (data.prediction !== undefined && diseaseMapping[data.prediction]) {
        setPrediction({
          id: data.prediction,
          name: diseaseMapping[data.prediction]
        });
      } else {
        console.error('Unknown prediction:', data.prediction);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Cattle Disease Prediction</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-3">Select Symptoms</label>
          <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto p-2">
            {symptomList.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <button
                  type="button"
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`flex items-center px-4 py-2 rounded-full border transition-colors ${
                    isSelected 
                      ? 'bg-green-500 text-white border-green-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">
                    {isSelected ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Circle size={16} />
                    )}
                  </span>
                  <span className="capitalize">{symptom.replace(/_/g, ' ')}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="text-sm text-gray-600 mr-4">
            {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
          </div>
          {selectedSymptoms.length > 0 && (
            <button 
              type="button"
              onClick={() => setSelectedSymptoms([])}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>
        
        <button 
          type="submit" 
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            selectedSymptoms.length === 0 || isLoading
              ? 'bg-blue-300 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={selectedSymptoms.length === 0 || isLoading}
        >
          {isLoading ? 'Predicting...' : 'Predict Disease'}
        </button>
      </form>

      {prediction && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Prediction Result</h3>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <span className="text-blue-800 font-bold">{prediction.id}</span>
            </div>
            <div>
              <div className="text-xl font-semibold text-blue-800">{prediction.name}</div>
              <div className="text-sm text-gray-600">Disease ID: {prediction.id}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomForm;
