const express = require('express');

const diseaseController = require('../controller/disease.controller');


const router = express.Router();
// Routes
router.get('/', diseaseController.getAllDiseases);
router.get('/search', diseaseController.searchDiseases);
router.get('/:diseaseId', diseaseController.getDiseaseById);





module.exports = router;