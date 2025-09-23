import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TypewriterText = ({ text, delay = 30, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // Reset state when the text prop changes
    setDisplayText('');
    setIsTyping(true);
  }, [text]);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = displayText.length;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex + 1));
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  }, [displayText, delay, text, isTyping, onComplete]);

  return <span>{displayText}</span>;
};

const DiseasePrediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [diseaseDetails, setDiseaseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingComplete, setTypingComplete] = useState({
    prediction: false,
    symptoms: false,
    details: false,
    precautions: false,
    solutions: false,
    veterinary: false
  });

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
    9: "Lumpy Skin Disease",
    10: "Mange",
    11: "Mastititis",
    12: "Pediculosis",
    13: "Photosensitization",
    14: "Pink Eye",
    15: "Healthy Cows"
  };

  // Use callback to prevent recreation on every render
  const markTypingComplete = useCallback((section) => {
    setTypingComplete(prev => ({ ...prev, [section]: true }));
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check if file exists
    if (!file) {
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Check if file is jpg, png, or jpeg
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedFormats.includes(file.type)) {
      setError('Only JPG, PNG, and JPEG formats are allowed');
      return;
    }

    // File is valid, proceed
    setSelectedFile(file);
    setError(null);
    setPrediction(null);
    setDiseaseDetails(null);
    resetTypingState();
  };

  const resetTypingState = () => {
    setTypingComplete({
      prediction: false,
      symptoms: false,
      details: false,
      precautions: false,
      solutions: false,
      veterinary: false
    });
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
      const predictionResponse = await axios.post(`${import.meta.env.VITE_DISEASE_IDENTIFICATION_MODEL}/predict/`, formData, {
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
      const diseaseDetailsResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/farmer/disease/${predictedDiseaseName}`);
      setDiseaseDetails(diseaseDetailsResponse.data);

    } catch (err) {
      setError('Error predicting disease: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Memoize the symptom completion handler to avoid recreating on each render
  const handleSymptomComplete = useCallback((index) => {
    if (diseaseDetails && index === diseaseDetails.symptoms.length - 1) {
      markTypingComplete('symptoms');
    }
  }, [diseaseDetails, markTypingComplete]);

  // Memoize the precaution completion handler
  const handlePrecautionComplete = useCallback((index) => {
    if (diseaseDetails && index === diseaseDetails.precautions.length - 1) {
      markTypingComplete('precautions');
    }
  }, [diseaseDetails, markTypingComplete]);

  // Memoize the solution completion handler
  const handleSolutionComplete = useCallback((index) => {
    if (diseaseDetails && index === diseaseDetails.solutions.length - 1) {
      markTypingComplete('solutions');
    }
  }, [diseaseDetails, markTypingComplete]);

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Cattle Disease Prediction</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <div className="bg-green-100 rounded-lg p-6 mb-4">
                <h2 className="text-xl font-semibold text-green-700 mb-4">Upload Image</h2>
                <p className="text-green-700 text-sm mt-1">Accepted formats: JPG, PNG, JPEG</p>

                <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:bg-green-50 transition duration-300 mb-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="max-h-64 max-w-full mb-2 rounded-lg" />
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-green-600">Click to upload an image of your cattle</p>
                        <p className="text-green-400 text-sm mt-1">or drag and drop</p>
                      </>
                    )}
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !selectedFile}
                  className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition duration-300 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Predict Disease
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              {prediction && (
                <div className="bg-green-100 rounded-lg p-6 mb-4">
                  <h2 className="text-xl font-semibold text-green-700 mb-4">Prediction Result</h2>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-lg font-medium text-green-800">
                      <span className="mr-2">Predicted Disease:</span>
                      <TypewriterText
                        text={prediction.diseaseName}
                        onComplete={() => markTypingComplete('prediction')}
                      />
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-green-600">Confidence</span>
                        <span className="text-sm text-green-800">{(prediction.confidence * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(prediction.confidence * 100).toFixed(2)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {diseaseDetails && typingComplete.prediction && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-green-700 mb-4">Disease Details</h2>

                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-3">
                      <h3 className="text-lg font-medium text-green-800 mb-2">Symptoms</h3>
                      <ul className="list-disc pl-5 space-y-1 text-green-700">
                        {diseaseDetails.symptoms.map((symptom, index) => (
                          <li key={index}>
                            <TypewriterText
                              text={symptom}
                              onComplete={() => handleSymptomComplete(index)}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>

                    {typingComplete.symptoms && (
                      <div className="border-l-4 border-green-500 pl-3">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Details</h3>
                        <p className="text-green-700">
                          <TypewriterText
                            text={diseaseDetails.details}
                            onComplete={() => markTypingComplete('details')}
                          />
                        </p>
                      </div>
                    )}

                    {typingComplete.details && (
                      <div className="border-l-4 border-green-500 pl-3">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Precautions</h3>
                        <ul className="list-disc pl-5 space-y-1 text-green-700">
                          {diseaseDetails.precautions.map((precaution, index) => (
                            <li key={index}>
                              <TypewriterText
                                text={precaution}
                                onComplete={() => handlePrecautionComplete(index)}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {typingComplete.precautions && (
                      <div className="border-l-4 border-green-500 pl-3">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Solutions</h3>
                        <ul className="list-disc pl-5 space-y-1 text-green-700">
                          {diseaseDetails.solutions.map((solution, index) => (
                            <li key={index}>
                              <TypewriterText
                                text={solution}
                                onComplete={() => handleSolutionComplete(index)}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {diseaseDetails.veterinaryImportance && typingComplete.solutions && (
                      <div className="border-l-4 border-green-500 pl-3">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Veterinary Importance</h3>
                        <p className="text-green-700">
                          <TypewriterText
                            text={diseaseDetails.veterinaryImportance}
                            onComplete={() => markTypingComplete('veterinary')}
                          />
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-green-600 text-sm">
          <p>© 2025 GauPal - Cattle Health Monitoring System</p>
        </div>
      </div>
    </div>
  );
};

export default DiseasePrediction;