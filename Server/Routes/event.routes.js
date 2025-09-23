const express = require('express');
const router = express.Router();
const eventsController = require('../controller/events.controller.js');

// Route to get all events with pagination
router.get('/', eventsController.getAllEvents);

// Route to get event by ID
router.get('/:eventId', eventsController.getEventById);

module.exports = router;