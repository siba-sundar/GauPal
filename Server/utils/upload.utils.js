// utils/upload.util.js
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 5MB
  },
  fileFilter: fileFilter,
});

// Export different upload configurations for various use cases
module.exports = {
  // For product images (up to 5)
  productImages: upload.array('images', 5),
  
  // For single image uploads (like profile pictures)
  singleImage: upload.single('image'),
  
  // Add more configurations as needed
};