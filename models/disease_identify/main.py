import os
import io
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import uvicorn
from typing import List

# Create FastAPI app
app = FastAPI(title="MobileNet Model API", 
              description="API for image classification using MobileNet",
              version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure these variables
MODEL_PATH = 'model/cow_health_efficientnetb3_tuned.h5'
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
CLASS_NAMES = []  # Replace with your model's class names if available

# Setup upload folder
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global model variable
model = None

def load_model():
    global model
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully")
    
    # If your model has custom layers, you might need this instead:
    # model = tf.keras.models.load_model(
    #     MODEL_PATH,
    #     custom_objects={'CustomLayer': CustomLayer}
    # )
    
    # If your model outputs category indices, you might want to load class names
    # global CLASS_NAMES
    # with open('class_names.txt', 'r') as f:
    #     CLASS_NAMES = [line.strip() for line in f.readlines()]

def is_valid_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image: Image.Image, target_size=(224, 224)):
    # Resize image
    image = image.resize(target_size)
    
    # Convert to array and add batch dimension
    image_array = np.array(image)
    image_array = np.expand_dims(image_array, axis=0)
    
    # Preprocess based on MobileNet requirements
    # Convert to float and scale to [-1, 1]
    image_array = image_array.astype(np.float32)
    image_array = image_array / 127.5 - 1.0
    
    return image_array

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
def read_root():
    return {"message": "MobileNet Image Classification API"}

@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    # Validate file
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
        
    if not is_valid_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file format. Supported formats: PNG, JPG, JPEG")
    
    # Read and preprocess the image
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert grayscale to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(processed_image)
        
        # Get top prediction
        if len(CLASS_NAMES) > 0:
            # If we have class names
            predicted_class_idx = np.argmax(predictions[0])
            predicted_class = CLASS_NAMES[predicted_class_idx]
            confidence = float(predictions[0][predicted_class_idx])
            
            result = {
                "category": predicted_class,
                "confidence": confidence
            }
        else:
            # Return raw predictions if no class names
            # Get top 3 predictions
            top_indices = predictions[0].argsort()[-3:][::-1]
            result = {
                "categories": [{"class_id": int(idx), "confidence": float(predictions[0][idx])} 
                              for idx in top_indices]
            }
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# For local development only
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)