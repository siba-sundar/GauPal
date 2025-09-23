const express = require('express');
const router = express.Router();
const farmerDashboardController = require('../controller/cattle.controller.js');

// Dashboard metrics
router.get('/farmers/:farmerId/dashboard', farmerDashboardController.getDashboardMetrics);

// Cattle management routes
router.get('/farmers/:farmerId/cattle', farmerDashboardController.getAllCattle);
router.get('/cattle/:cattleId', farmerDashboardController.getCattleDetails);
router.post('/farmers/:farmerId/cattle', farmerDashboardController.addCattle);
router.put('/cattle/:cattleId', farmerDashboardController.updateCattle);
router.delete('/cattle/:cattleId', farmerDashboardController.deleteCattle);

// Vaccination management
router.post('/cattle/:cattleId/vaccinations', farmerDashboardController.addVaccination);

module.exports = router;