// app.js
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv");
const path = require("path");
const axios = require("axios");

// Load environment variables
env.config();

// Initialize Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET, // Add this line
});

// Now you can get the storage bucket reference
const bucket = admin.storage().bucket();

// Make bucket available to the app
app.locals.bucket = bucket;

// Import all routes
const authRoutes = require("./Routes/auth.routes.js");
const productRoutes = require("./Routes/product.routes.js");
const orderRoutes = require("./Routes/order.routes.js");
const reviewRoutes = require("./Routes/review.routes.js");
const messageRoutes = require("./Routes/message.routes.js");
const notificationRoutes = require("./Routes/notification.routes.js");
const dashboardRoutes = require("./Routes/dashboard.routes.js");
const uploadRoutes = require("./Routes/upload.routes.js");
const articles = require("./Routes/article.routes.js");
const cattle = require("./Routes/cattle.routes.js");
const disease = require("./Routes/disease.routes.js");
const events = require("./Routes/event.routes.js");
const { chatWithGemini, getGreeting } = require("./ChatBot/geminiAiService.js");

// farmer specific imports
const farmerRoutes = require("./Routes/farmer.routes.js");

// Use routes
app.use("/gaupal/auth", authRoutes);
app.use("/gaupal/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/gaupal/article", articles);
app.use("/gaupal/events", events);
// chatbot
app.post("/gauguru/chat", chatWithGemini);
app.get("/gauguru/greeting", getGreeting);

// farmer specific routes
app.use("/gaupal/farmer", farmerRoutes);
app.use("/gaupal/farmer/cattle", cattle);
app.use("/gaupal/farmer/disease", disease);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Farmers Marketplace API" });
});

app.get("/gaupal/breeding-recommendations", async (req, res) => {
  try {
    const breed = req.query.breed;
    const response = await axios.get(
      `https://breeding-recommender-api-896191931404.us-central1.run.app/recommend?breed=${breed}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
