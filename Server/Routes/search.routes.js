

// routes/search.routes.js
const express = require('express');
const { search } = require('../controller/search.controller');

const router = express.Router();

// Public routes
router.get('/', search);

module.exports = router;