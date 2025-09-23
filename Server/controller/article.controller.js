// controllers/articleController.js
const admin = require("firebase-admin");

const db = admin.firestore();

// Controller to fetch article by article name
exports.getArticleById = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    // Validate article ID input
    if (!articleId) {
      return res.status(400).json({
        error: "Article ID is required",
        message: "Please provide a valid article ID",
      });
    }

    // Reference to the specific document using the Firestore auto-generated ID
    const articleRef = db.collection("articles").doc(articleId);

    // Fetch the document
    const doc = await articleRef.get();

    // Check if document exists
    if (!doc.exists) {
      return res.status(404).json({
        error: "Article Not Found",
        message: `No article found with ID: ${articleId}`,
        requestedId: articleId,
      });
    }

    // Return the document data with its ID
    res.status(200).json({
      message: "Article retrieved successfully",
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Unable to retrieve the article",
      details: error.message,
    });
  }
};

// Controller to fetch all breed articles
exports.getAllBreedArticles = async (req, res) => {
  try {
    // Get query parameters with defaults
    const category = req.query.category;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // Calculate starting index for pagination
    const startAt = (page - 1) * limit;

    // Create a query reference to the articles collection
    let query = db.collection("articles");

    // Apply category filter if provided
    if (category) {
      query = query.where("category", "==", category);
    }

    // Get the total count for pagination info
    const countSnapshot = await query.count().get();
    const totalArticles = countSnapshot.data().count;

    // Execute the query with pagination using limit and offset
    const snapshot = await query.limit(limit).offset(startAt).get();

    // Check if any articles exist
    if (snapshot.empty) {
      return res.status(404).json({
        error: "No Articles Found",
        message: category
          ? `No articles found with category: ${category}`
          : "No breed articles are currently available",
      });
    }

    // Map documents to an array
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return response with pagination details
    res.status(200).json({
      message: "Articles retrieved successfully",
      pagination: {
        total: totalArticles,
        currentPage: page,
        totalPages: Math.ceil(totalArticles / limit),
        perPage: limit,
      },
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Unable to retrieve articles",
      details: error.message,
    });
  }
};

// Controller to fetch 3 random breed articles
exports.getRandomArticles = async (req, res) => {
  try {
    // Fetch all documents from the articles collection
    const snapshot = await db.collection("articles").get();

    // Check if any articles exist
    if (snapshot.empty) {
      return res.status(404).json({
        error: "No Articles Found",
        message: "No breed articles are currently available",
      });
    }

    // Convert snapshot to array of articles
    const allArticles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Shuffle the articles array using Fisher-Yates algorithm
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Shuffle and slice to get 3 random articles
    const randomArticles = shuffleArray(allArticles).slice(0, 4);

    res.status(200).json({
      message: "Random articles retrieved successfully",
      count: randomArticles.length,
      data: randomArticles,
    });
  } catch (error) {
    console.error("Error fetching random articles:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Unable to retrieve random articles",
      details: error.message,
    });
  }
};

exports.getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Validate category parameter
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required",
      });
    }

    // Query articles collection for documents with the specified category
    const articlesSnapshot = await db
      .collection("articles")
      .where("category", "==", category)
      .get();

    // Check if no matching documents were found
    if (articlesSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: `No articles found with category: ${category}`,
      });
    }

    // Convert the query snapshot to an array of article objects
    const articles = [];
    articlesSnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Return the articles as JSON response
    return res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching articles",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//   breed specific

exports.getRandomBreeds = async (req, res) => {
  try {
    const firestore = admin.firestore();
    const breedsRef = firestore.collection("cow-breeds");

    // Get all breed documents
    const snapshot = await breedsRef.get();
    const breeds = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Randomly select 3 breeds
    const randomBreeds = breeds.sort(() => 0.5 - Math.random()).slice(0, 3);

    res.status(200).json({
      status: "success",
      data: randomBreeds,
    });
  } catch (error) {
    console.error("Error fetching random breeds:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to fetch random breeds",
    });
  }
};

exports.getAllBreeds = async (req, res) => {
  try {
    const firestore = admin.firestore();
    const breedsRef = firestore.collection("cow-breeds");

    // Get all breed documents
    const snapshot = await breedsRef.get();
    const breeds = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      status: "success",
      count: breeds.length,
      data: breeds,
    });
  } catch (error) {
    console.error("Error fetching all breeds:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to fetch breeds",
    });
  }
};

exports.getBreedByName = async (req, res) => {
  try {
    const { breedName } = req.params;

    if (!breedName) {
      return res.status(400).json({
        status: "error",
        message: "Breed name is required",
      });
    }

    const firestore = admin.firestore();
    const breedRef = firestore
      .collection("cow-breeds")
      .doc(breedName.toLowerCase());

    const doc = await breedRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: "error",
        message: "Breed not found",
      });
    }

    const breedData = {
      id: doc.id,
      ...doc.data(),
    };

    res.status(200).json({
      status: "success",
      data: breedData,
    });
  } catch (error) {
    console.error("Error fetching breed details:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to fetch breed details",
    });
  }
};

exports.searchBreeds = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }

    const firestore = admin.firestore();
    const breedsRef = firestore.collection("cow-breeds");

    // Perform case-insensitive search across multiple fields
    const snapshot = await breedsRef.get();
    const breeds = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (breed) =>
          breed.breed.toLowerCase().includes(query.toLowerCase()) ||
          breed.introduction.content
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          breed.headings.some((heading) =>
            heading.content.toLowerCase().includes(query.toLowerCase())
          )
      );

    res.status(200).json({
      status: "success",
      count: breeds.length,
      data: breeds,
    });
  } catch (error) {
    console.error("Error searching breeds:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to search breeds",
    });
  }
};

// Add new breed
exports.addNewBreed = async (req, res) => {
  try {
    const breedData = req.body;

    // Validate required fields
    if (
      !breedData.breed ||
      !breedData.title ||
      !breedData.introduction?.content
    ) {
      return res.status(400).json({
        status: "error",
        message: "Breed name, title, and introduction content are required",
      });
    }

    const firestore = admin.firestore();

    // Add the breed to the cow-breeds collection
    const breedRef = firestore.collection("cow-breeds");
    const docRef = await breedRef.add({
      ...breedData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Get the created document
    const createdDoc = await docRef.get();
    const createdBreed = {
      id: createdDoc.id,
      ...createdDoc.data(),
    };

    res.status(201).json({
      status: "success",
      message: "Breed added successfully",
      data: createdBreed,
    });
  } catch (error) {
    console.error("Error adding new breed:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to add new breed",
      details: error.message,
    });
  }
};
