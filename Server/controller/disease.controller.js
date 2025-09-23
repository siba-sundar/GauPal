const express = require('express');
const multer = require('multer');
const axios = require('axios');
const admin = require('firebase-admin');

// Initialize Firestore
const db = admin.firestore();

// Create router
const router = express.Router();

// Multer configuration for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Disease Prediction Controller
/* const diseasePredictionController = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Prepare form data for prediction service
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Send image to prediction service
    const predictionResponse = await axios.post('http://localhost:8000/predict/', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    // Disease name mapping
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
      15: "healthycows"
    };

    // Find most confident prediction
    const mostConfidentPrediction = predictionResponse.data.categories.reduce(
      (prev, current) => (prev.confidence > current.confidence) ? prev : current
    );

    const predictedDiseaseName = diseaseMap[mostConfidentPrediction.class_id];

    // Fetch disease details from Firestore
    const diseaseRef = db.collection('diseases').doc(predictedDiseaseName);
    const diseaseDoc = await diseaseRef.get();

    // Prepare response
    const responseData = {
      prediction: {
        diseaseName: predictedDiseaseName,
        confidence: mostConfidentPrediction.confidence
      },
      details: diseaseDoc.exists ? diseaseDoc.data() : null
    };

    res.json(responseData);
  } catch (error) {
    console.error('Disease prediction error:', error);
    res.status(500).json({ 
      error: 'Failed to predict disease', 
      details: error.message 
    });
  }
};

// Routes
router.post('/predict-disease', 
    upload.single('file'), 
    diseasePredictionController
);

module.exports = router;

 */



// Controller to get a single disease by ID
exports.getDiseaseById = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    
    // Reference to the specific disease document
    const diseaseRef = db.collection('diseases').doc(diseaseId);
    
    // Get the document
    const diseaseDoc = await diseaseRef.get();
    
    // Check if document exists
    if (!diseaseDoc.exists) {
      return res.status(404).json({ 
        error: 'Disease not found', 
        message: `No disease found with ID: ${diseaseId}` 
      });
    }
    
    // Return the disease data
    res.json({
      id: diseaseDoc.id,
      ...diseaseDoc.data()
    });
  } catch (error) {
    console.error('Error fetching disease details:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve disease details', 
      message: error.message 
    });
  }
};

// Controller to list all diseases
exports.getAllDiseases = async (req, res) => {
  try {
    // Get all documents from diseases collection
    const diseasesSnapshot = await db.collection('diseases').get();
    
    // Map documents to an array
    const diseases = diseasesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      total: diseases.length,
      diseases: diseases
    });
  } catch (error) {
    console.error('Error fetching all diseases:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve diseases', 
      message: error.message 
    });
  }
};

// Controller to search diseases by symptoms or name
exports.searchDiseases = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    // Perform case-insensitive search
    const diseasesSnapshot = await db.collection('diseases')
      .where('name', '>=', query)
      .where('name', '<=', query + '\uf8ff')
      .get();

    const symptomMatchedDiseases = await db.collection('diseases')
      .where('symptoms', 'array-contains', query)
      .get();

    // Combine and deduplicate results
    const combinedResults = new Map();
    
    diseasesSnapshot.docs.forEach(doc => {
      combinedResults.set(doc.id, {
        id: doc.id,
        ...doc.data(),
        matchType: 'name'
      });
    });

    symptomMatchedDiseases.docs.forEach(doc => {
      if (!combinedResults.has(doc.id)) {
        combinedResults.set(doc.id, {
          id: doc.id,
          ...doc.data(),
          matchType: 'symptom'
        });
      }
    });

    const results = Array.from(combinedResults.values());

    res.json({
      total: results.length,
      results: results
    });
  } catch (error) {
    console.error('Error searching diseases:', error);
    res.status(500).json({ 
      error: 'Failed to search diseases', 
      message: error.message 
    });
  }
};

