import React, { useState } from 'react';

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

const SymptomForm = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const handleSymptomChange = (e) => {
    const value = e.target.value;
    setSelectedSymptoms((prev) =>
      prev.includes(value)
        ? prev.filter((symptom) => symptom !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the API
    try {
      const response = await fetch('http://localhost:7000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      const data = await response.json();
      alert(`Prediction: ${data.prediction}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Cattle Disease Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Symptoms</label>
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-scroll">
            {symptomList.map((symptom, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`symptom-${index}`}
                  value={symptom}
                  onChange={handleSymptomChange}
                  className="mr-2"
                />
                <label htmlFor={`symptom-${index}`} className="text-gray-600 capitalize">
                  {symptom.replace(/_/g, ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Predict
        </button>
      </form>
    </div>
  );
};

export default SymptomForm;
