// routes/articleRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware.js');
const articleController = require('../controller/article.controller.js');


// article routes
router.get('/:article-name',verifyToken, articleController.getArticleByName);
router.get('/random/article',verifyToken, articleController.getRandomArticles);
router.get('/all-article',verifyToken, articleController.getAllBreedArticles);

// breed details 

router.get('/random/breed', verifyToken, articleController.getRandomBreeds);
// Get all breeds
router.get('/all-breed', verifyToken, articleController.getAllBreeds);

// Get a specific breed by name
router.get('/breed/:breedName', verifyToken, articleController.getBreedByName);

// Search breeds
router.get('/breed/search', verifyToken, articleController.searchBreeds);

module.exports = router;