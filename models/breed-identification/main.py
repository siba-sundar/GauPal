import os
import io
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import uvicorn
from typing import List
import logging
import h5py

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Cow Identification API", 
              description="API for cow identification using a trained model",
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
MODEL_PATH = 'model/cowidentification.h5'
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
CLASS_NAMES = []  # Replace with your model's class names if available

# Setup upload folder
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global model variable
model = None

def inspect_h5_model(model_path):
    """Inspect the H5 file to understand its structure"""
    try:
        with h5py.File(model_path, 'r') as f:
            logger.info("H5 file structure:")
            
            def print_structure(name, obj):
                logger.info(f"  {name}: {type(obj)}")
                if isinstance(obj, h5py.Group):
                    for key in obj.keys():
                        logger.info(f"    - {key}")
            
            f.visititems(print_structure)
            
            # Check if it's a full model or just weights
            if 'model_config' in f.attrs:
                logger.info("Full model found with config")
                return 'full_model'
            elif 'model_weights' in f or 'layer_names' in f.attrs:
                logger.info("Weights-only file detected")
                return 'weights_only'
            else:
                logger.info("Unknown H5 structure")
                return 'unknown'
                
    except Exception as e:
        logger.error(f"Error inspecting H5 file: {e}")
        return 'error'

def create_flexible_model(input_shape=(224, 224, 3), num_classes=None):
    """Create a flexible model that can adapt to different architectures"""
    
    # Try to determine number of classes from the H5 file
    if num_classes is None:
        try:
            with h5py.File(MODEL_PATH, 'r') as f:
                # Look for output layer information
                if 'model_weights' in f:
                    layer_names = f.attrs.get('layer_names', [])
                    for layer_name in layer_names:
                        if b'dense' in layer_name.lower() or b'classifier' in layer_name.lower():
                            try:
                                layer_group = f['model_weights'][layer_name]
                                for weight_name in layer_group:
                                    weight = layer_group[weight_name]
                                    if 'bias' in weight_name:
                                        num_classes = weight.shape[0]
                                        logger.info(f"Detected {num_classes} classes from bias shape")
                                        break
                            except:
                                continue
                        if num_classes:
                            break
        except Exception as e:
            logger.warning(f"Could not determine number of classes: {e}")
    
    if num_classes is None:
        num_classes = 10  # Default fallback
        logger.warning(f"Using default {num_classes} classes")
    
    # Create different model architectures to try
    models_to_try = []
    
    # Model 1: Simple sequential with MobileNetV2
    base_model1 = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights=None  # Don't load pretrained weights
    )
    model1 = tf.keras.Sequential([
        base_model1,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(num_classes, activation='softmax')
    ])
    models_to_try.append(("MobileNetV2 Sequential", model1))
    
    # Model 2: Functional API approach
    inputs = tf.keras.Input(shape=input_shape)
    base_model2 = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights=None
    )(inputs)
    x = tf.keras.layers.GlobalAveragePooling2D()(base_model2)
    x = tf.keras.layers.Dropout(0.2)(x)
    x = tf.keras.layers.Dense(128, activation='relu')(x)
    outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(x)
    model2 = tf.keras.Model(inputs, outputs)
    models_to_try.append(("MobileNetV2 Functional", model2))
    
    # Model 3: ResNet50 approach
    try:
        base_model3 = tf.keras.applications.ResNet50(
            input_shape=input_shape,
            include_top=False,
            weights=None
        )
        model3 = tf.keras.Sequential([
            base_model3,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(num_classes, activation='softmax')
        ])
        models_to_try.append(("ResNet50", model3))
    except:
        pass
    
    # Model 4: Simple CNN
    model4 = tf.keras.Sequential([
        tf.keras.layers.Conv2D(32, 3, activation='relu', input_shape=input_shape),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Conv2D(64, 3, activation='relu'),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Conv2D(128, 3, activation='relu'),
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(num_classes, activation='softmax')
    ])
    models_to_try.append(("Simple CNN", model4))
    
    return models_to_try

def load_model():
    global model
    
    try:
        logger.info(f"Loading model from: {MODEL_PATH}")
        
        # First, inspect the H5 file
        h5_type = inspect_h5_model(MODEL_PATH)
        
        # Method 1: Try loading complete model with different compile options
        for compile_option in [False, True]:
            try:
                logger.info(f"Attempting to load full model with compile={compile_option}")
                model = tf.keras.models.load_model(MODEL_PATH, compile=compile_option)
                logger.info("Model loaded successfully as full model")
                return
            except Exception as e:
                logger.warning(f"Failed to load full model with compile={compile_option}: {e}")
        
        # Method 2: Try with different safe_mode options
        for safe_mode in [False, True]:
            try:
                logger.info(f"Attempting to load with safe_mode={safe_mode}")
                model = tf.keras.models.load_model(
                    MODEL_PATH, 
                    custom_objects=None,
                    safe_mode=safe_mode,
                    compile=False
                )
                logger.info("Model loaded successfully with safe_mode approach")
                return
            except Exception as e:
                logger.warning(f"Failed to load with safe_mode={safe_mode}: {e}")
        
        # Method 3: Try to load architecture from JSON if available
        json_path = MODEL_PATH.replace('.h5', '_architecture.json')
        if os.path.exists(json_path):
            try:
                logger.info("Attempting to load from JSON architecture file")
                with open(json_path, 'r') as f:
                    model_json = f.read()
                    model = tf.keras.models.model_from_json(model_json)
                    model.load_weights(MODEL_PATH)
                    logger.info("Model loaded from JSON architecture and H5 weights")
                    return
            except Exception as e:
                logger.warning(f"Failed to load from JSON: {e}")
        
        # Method 4: Try flexible model creation and weight loading
        logger.info("Attempting flexible model creation and weight matching...")
        
        models_to_try = create_flexible_model()
        
        for model_name, candidate_model in models_to_try:
            try:
                logger.info(f"Trying {model_name} architecture")
                candidate_model.load_weights(MODEL_PATH)
                model = candidate_model
                logger.info(f"Successfully loaded weights with {model_name} architecture")
                return
            except Exception as e:
                logger.warning(f"Failed to load weights with {model_name}: {e}")
        
        # Method 5: Load weights manually by matching layer names
        logger.info("Attempting manual weight loading by layer matching...")
        
        try:
            # Use the first model architecture as base
            model = models_to_try[0][1]
            
            with h5py.File(MODEL_PATH, 'r') as f:
                if 'model_weights' in f:
                    saved_layer_names = f.attrs.get('layer_names', [])
                    model_layer_names = [layer.name for layer in model.layers]
                    
                    logger.info(f"Saved layers: {[name.decode() if isinstance(name, bytes) else name for name in saved_layer_names]}")
                    logger.info(f"Model layers: {model_layer_names}")
                    
                    # Try to match layers by name patterns
                    for model_layer in model.layers:
                        for saved_layer_name in saved_layer_names:
                            saved_name = saved_layer_name.decode() if isinstance(saved_layer_name, bytes) else saved_layer_name
                            
                            # Match by similar names or patterns
                            if (saved_name in model_layer.name or 
                                model_layer.name in saved_name or
                                ('dense' in saved_name.lower() and 'dense' in model_layer.name.lower()) or
                                ('conv' in saved_name.lower() and 'conv' in model_layer.name.lower())):
                                
                                try:
                                    layer_weights = []
                                    layer_group = f['model_weights'][saved_layer_name]
                                    
                                    for weight_name in layer_group:
                                        weight_data = np.array(layer_group[weight_name])
                                        layer_weights.append(weight_data)
                                    
                                    if layer_weights and len(layer_weights) == len(model_layer.get_weights()):
                                        model_layer.set_weights(layer_weights)
                                        logger.info(f"Loaded weights for layer: {model_layer.name} from {saved_name}")
                                    break
                                except Exception as e:
                                    logger.warning(f"Failed to load weights for {model_layer.name}: {e}")
                    
                    logger.info("Manual weight loading completed")
                    return
                    
        except Exception as e:
            logger.error(f"Manual weight loading failed: {e}")
        
        # If all methods fail, create a dummy model for testing
        logger.warning("All loading methods failed. Creating dummy model for API testing.")
        logger.warning("This model will not provide accurate predictions!")
        
        model = tf.keras.Sequential([
            tf.keras.layers.Conv2D(32, 3, activation='relu', input_shape=(224, 224, 3)),
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(10, activation='softmax')
        ])
        
        logger.info("Dummy model created. API will run but predictions will be random.")
        
    except Exception as e:
        logger.error(f"Critical error in model loading: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to load model. Please check model file and compatibility. Error: {str(e)}"
        )
    
    # Compile the model if it was loaded without compilation
    if model is not None:
        try:
            model.compile(
                optimizer='adam',
                loss='categorical_crossentropy',
                metrics=['accuracy']
            )
            logger.info("Model compiled successfully")
        except Exception as e:
            logger.warning(f"Failed to compile model: {e}")
    
    # Log model information
    if model is not None:
        logger.info(f"Model input shape: {model.input_shape}")
        logger.info(f"Model output shape: {model.output_shape}")
        logger.info(f"Total parameters: {model.count_params()}")

def is_valid_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image: Image.Image, target_size=(224, 224)):
    """
    Preprocess image for model prediction.
    Adjust this function based on how your model was trained.
    """
    # Resize image
    image = image.resize(target_size)
    
    # Convert to array and add batch dimension
    image_array = np.array(image)
    image_array = np.expand_dims(image_array, axis=0)
    
    # Normalize based on your training preprocessing
    # Common preprocessing options:
    
    # Option 1: MobileNet preprocessing (scale to [-1, 1])
    image_array = image_array.astype(np.float32)
    image_array = image_array / 127.5 - 1.0
    
    # Option 2: Standard normalization (scale to [0, 1])
    # image_array = image_array.astype(np.float32) / 255.0
    
    # Option 3: ImageNet preprocessing
    # image_array = tf.keras.applications.mobilenet_v2.preprocess_input(image_array)
    
    return image_array

@app.on_event("startup")
async def startup_event():
    """Load the model on startup"""
    try:
        load_model()
        if model is None:
            logger.error("Model failed to load during startup")
        else:
            logger.info("Startup completed successfully")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise

@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Cow Identification API",
        "model_loaded": model is not None,
        "tensorflow_version": tf.__version__
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None
    }

@app.get("/model-info")
def model_info():
    """Get model information"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "input_shape": str(model.input_shape),
        "output_shape": str(model.output_shape),
        "total_parameters": int(model.count_params()),
        "layers": len(model.layers),
        "layer_names": [layer.name for layer in model.layers[:5]]  # First 5 layers
    }

@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    """Predict cow identification from uploaded image"""
    
    # Check if model is loaded
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please check server logs.")
    
    # Validate file
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
        
    if not is_valid_file(file.filename):
        raise HTTPException(
            status_code=400, 
            detail="Invalid file format. Supported formats: PNG, JPG, JPEG"
        )
    
    # Read and preprocess the image
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert grayscale to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        
        # Process results
        if len(CLASS_NAMES) > 0:
            # If we have class names
            predicted_class_idx = np.argmax(predictions[0])
            predicted_class = CLASS_NAMES[predicted_class_idx]
            confidence = float(predictions[0][predicted_class_idx])
            
            # Get top 3 predictions
            top_indices = predictions[0].argsort()[-3:][::-1]
            top_predictions = [
                {
                    "class": CLASS_NAMES[idx],
                    "confidence": float(predictions[0][idx])
                }
                for idx in top_indices
            ]
            
            result = {
                "success": True,
                "prediction": {
                    "class": predicted_class,
                    "confidence": confidence
                },
                "top_predictions": top_predictions
            }
        else:
            # Return raw predictions if no class names
            # Get top 5 predictions
            top_indices = predictions[0].argsort()[-5:][::-1]
            result = {
                "success": True,
                "predictions": [
                    {
                        "class_id": int(idx), 
                        "confidence": float(predictions[0][idx])
                    } 
                    for idx in top_indices
                ]
            }
            
        return result
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing image: {str(e)}"
        )

# For local development only
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)