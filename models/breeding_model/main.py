from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import pickle
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Optional

# Define the FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model path
MODEL_PATH = "model/cattle_predictor_v5.pkl"

# Load model at startup
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    print(f"Model file not found at {MODEL_PATH}")
    model = None

def calculate_derived_features(data: Dict) -> Dict:
    """Calculate feature engineered columns with safety checks for zero values"""
    derived = data.copy()
    
    # Calculate differences and ratios with safety checks
    derived['FE_Age_Diff'] = abs(data['Bull_Age'] - data['Cow_Age'])
    
    # Safe weight difference calculation
    derived['FE_Weight_Diff_Pct'] = (
        abs(data['Bull_Weight'] - data['Cow_Weight']) / data['Cow_Weight'] * 100 
        if data['Cow_Weight'] != 0 else 0
    )
    
    # Safe height difference calculation
    derived['FE_Height_Diff_Pct'] = (
        abs(data['Bull_Height'] - data['Cow_Height']) / data['Cow_Height'] * 100
        if data['Cow_Height'] != 0 else 0
    )
    
    derived['FE_Drought_Diff'] = abs(data['Bull_Drought_Resistance'] - data['Cow_Drought_Resistance'])
    derived['FE_Milk_Sum'] = data['Cow_Milk_Yield'] + data['Bull_Mother_Milk_Yield']
    derived['FE_Combined_Health'] = data['Bull_Health_Status'] + data['Cow_Health_Status']
    derived['FE_Temperament_Combo'] = 1 if data['Bull_Temperament'] == data['Cow_Temperament'] else 0
    
    # Copy disease and health related fields
    derived['Bull_Disease_Resistance_Score'] = data['Disease_Resistance_Score']
    derived['Cow_Disease_Resistance_Score'] = data['Disease_Resistance_Score']
    derived['Bull_Disease'] = data['Bull_Health_Status']
    derived['Cow_Disease'] = data['Cow_Health_Status']
    derived['Bull_Past_Breeding_Success'] = data['Past_Breeding_Success']
    derived['Cow_Past_Breeding_Success'] = data['Past_Breeding_Success']
    
    return derived

class BreedingInput(BaseModel):
    Cow_Breed: str
    Cow_Age: int
    Cow_Weight: float
    Cow_Height: float
    Cow_Milk_Yield: float
    Cow_Health_Status: int
    Cow_Drought_Resistance: float
    Cow_Temperament: str
    Bull_Breed: str
    Bull_Age: int
    Bull_Weight: float
    Bull_Height: float
    Bull_Health_Status: int
    Bull_Mother_Milk_Yield: float
    Bull_Drought_Resistance: float
    Bull_Temperament: str
    Same_Parents: int
    Trait_Difference: float
    Genetic_Diversity: float
    Fertility_Rate: float
    Breeding_Success_Rate: float
    Disease_Resistance_Score: float
    Market_Value: float
    Past_Breeding_Success: str
    Bull_Disease_Resistance_Score: float = 0.0
    Cow_Disease_Resistance_Score: float = 0.0
    Bull_Genetic_Diversity_Score: float = 0.0
    Cow_Genetic_Diversity_Score: float = 0.0
    Bull_Disease: int = 0
    Cow_Disease: int = 0
    Bull_Same_Parents: int = 0
    Cow_Same_Parents: int = 0
    Bull_Fertility_Rate: float
    Cow_Fertility_Rate: float
    Bull_Breeding_Success_Rate: float
    Cow_Breeding_Success_Rate: float
    Bull_Past_Breeding_Success: str
    Cow_Past_Breeding_Success: str
    Bull_Market_Value: float
    Cow_Market_Value: float
    Bull_Milk_Yield: float = 0.0
    Cow_Mother_Milk_Yield: float

def convert_ccs_to_percentage(ccs_score, min_ccs=-50, max_ccs=85):
    if max_ccs == min_ccs:
        return 50.0
    clipped_score = np.clip(ccs_score, min_ccs, max_ccs)
    percentage = ((clipped_score - min_ccs) / (max_ccs - min_ccs)) * 100
    return percentage

@app.post("/predict")
async def predict_breeding(input_data: BreedingInput):
    if model is None:
        return {"error": "Model not loaded"}
    
    try:
        # Convert input to dict and calculate derived features
        data_dict = input_data.dict()
        derived_data = calculate_derived_features(data_dict)
        
        # Convert to DataFrame
        data_df = pd.DataFrame([derived_data])
        
        # Extract components
        preprocessor = model['preprocessor']
        selected_indices = model['selected_feature_indices']
        classifier = model['classifier']
        regressor = model['regressor']
        min_ccs = model['min_ccs']
        max_ccs = model['max_ccs']

        # Preprocess data
        X_new_processed = preprocessor.transform(data_df)
        X_new_selected = X_new_processed[:, selected_indices]

        # Make predictions
        class_prediction = classifier.predict(X_new_selected)[0]
        ccs_prediction = regressor.predict(X_new_selected)[0]
        
        # Format results
        prediction_label = "Yes" if class_prediction == 1 else "No"
        percentage = convert_ccs_to_percentage(ccs_prediction, min_ccs, max_ccs)
        
        return {
            "compatible": prediction_label,
            "confidence_score": round(percentage, 2),
            "raw_ccs_score": round(ccs_prediction, 2)
        }
    
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def read_root():
    return {"status": "Breeding Prediction API is running"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
