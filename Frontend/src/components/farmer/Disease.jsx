import React, { useState } from 'react';
import axios from 'axios';

const DiseasePrediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [diseaseDetails, setDiseaseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mapping of class_id to disease names
  const diseaseMap = {
    0: "Abscess",
    1: "Actinomycosis",
    2: "Bovine Dermatophilosis (Rain Rot)",
    3: "Bovine Warts",
    4: "Bovine spongiform encephalopathy (BSE)",
    5: "Dermatophytosis",
    6: "Digital Dermatitis(also causes lameness)",
    7: "Foot and Mouth Disease",
    8: "Hoof Rot",
    9: "Lumpy Skin Diseases",
    10: "Mange",
    11: "Mastititis",
    12: "Pediculosis",
    13: "Photosensitization",
    14: "Pink Eye",
    15: "Healthy Cows"
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
    setPrediction(null);
    setDiseaseDetails(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    setError(null);

    try {
      // Send image to prediction endpoint
      const predictionResponse = await axios.post('http://localhost:8000/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Find the most confident prediction
      const mostConfidentPrediction = predictionResponse.data.categories.reduce(
        (prev, current) => (prev.confidence > current.confidence) ? prev : current
      );

      const predictedDiseaseName = diseaseMap[mostConfidentPrediction.class_id];
      setPrediction({
        diseaseName: predictedDiseaseName,
        confidence: mostConfidentPrediction.confidence
      });

      // Fetch disease details 
      const diseaseDetailsResponse = await axios.get(`http://localhost:5000/gaupal/farmer/disease/${predictedDiseaseName}`);
      setDiseaseDetails(diseaseDetailsResponse.data);

    } catch (err) {
      setError('Error predicting disease: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cattle Disease Prediction</h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input 
          type="file" 
          onChange={handleFileChange}
          accept="image/*"
          className="mb-2"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Predicting...' : 'Predict Disease'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {prediction && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Prediction Result</h2>
          <p>Predicted Disease: {prediction.diseaseName}</p>
          <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
        </div>
      )}

      {diseaseDetails && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Disease Details</h2>
          
          <p className="mt-2"><strong>Symptoms:</strong></p>
          <ul className="list-disc pl-5">
            {diseaseDetails.symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
          
          <p className="mt-2"><strong>Details:</strong> {diseaseDetails.details}</p>
          
          <div className="mt-2">
            <strong>Precautions:</strong>
            <ul className="list-disc pl-5">
              {diseaseDetails.precautions.map((precaution, index) => (
                <li key={index}>{precaution}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-2">
            <strong>Solutions:</strong>
            <ul className="list-disc pl-5">
              {diseaseDetails.solutions.map((solution, index) => (
                <li key={index}>{solution}</li>
              ))}
            </ul>
          </div>
          
          {diseaseDetails.veterinaryImportance && (
            <div className="mt-2">
              <strong>Veterinary Importance:</strong>
              <p>{diseaseDetails.veterinaryImportance}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseasePrediction;