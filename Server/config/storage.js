// config/storage.js
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);

// Configure multer for memory storage
const multerStorage = multer.memoryStorage();

// Create file filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
  fileFilter: fileFilter
});

// Function to upload file to Google Cloud Storage
const uploadToGcs = (folderName) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }

    // Create a unique filename
    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const filePath = `${folderName}/${fileName}`;
    
    // Create a file object in the bucket
    const file = bucket.file(filePath);
    
    // Create a stream to write the file
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    // Handle errors
    stream.on('error', (err) => {
      req.file.cloudStorageError = err;
      next(err);
    });

    // Handle completion
    stream.on('finish', () => {
      // Make the file public
      file.makePublic().then(() => {
        // Get public URL
        req.file.cloudStorageObject = fileName;
        req.file.cloudStoragePublicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        next();
      });
    });

    // Write the file
    stream.end(req.file.buffer);
  };
};

module.exports = { upload, uploadToGcs };