// routes/articleRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware.js");
const articleController = require("../controller/article.controller.js");

// article routes
router.get(
  "/article/:articleId",
  verifyToken,
  articleController.getArticleById
);
router.get("/random/article", verifyToken, articleController.getRandomArticles);
router.get("/all-article", verifyToken, articleController.getAllBreedArticles);
router.get(
  "/category/:category",
  verifyToken,
  articleController.getArticlesByCategory
);

// breed details

router.get("/random/breed", verifyToken, articleController.getRandomBreeds);
// Get all breeds
router.get("/all-breed", verifyToken, articleController.getAllBreeds);

// Get a specific breed by name
router.get("/breed/:breedName", verifyToken, articleController.getBreedByName);

// Search breeds
router.get("/breed/search", verifyToken, articleController.searchBreeds);

// Add new breed
router.post("/breed", verifyToken, articleController.addNewBreed);

module.exports = router;
