from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware  # Import the CORS middleware

# Load the trained model from the .pkl file
model = joblib.load("model/ensemble_model_cattle_disease_prediction.pkl")

# Define a FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the symptom list (same order as used during model training)
symptom_list = ['anorexia', 'abdominal_pain', 'anaemia', 'abortions', 'acetone', 'aggression', 'arthrogyposis',
    'ankylosis', 'anxiety', 'bellowing', 'blood_loss', 'blood_poisoning', 'blisters', 'colic', 'Condemnation_of_livers',
    'coughing', 'depression', 'discomfort', 'dyspnea', 'dysentery', 'diarrhoea', 'dehydration', 'drooling',
    'dull', 'decreased_fertility', 'diffculty_breath', 'emaciation', 'encephalitis', 'fever', 'facial_paralysis',
    'frothing_of_mouth', 'frothing', 'gaseous_stomach', 'highly_diarrhoea', 'high_pulse_rate', 'high_temp', 
    'high_proportion', 'hyperaemia', 'hydrocephalus', 'isolation_from_herd', 'infertility', 'intermittent_fever', 
    'jaundice', 'ketosis', 'loss_of_appetite', 'lameness', 'lack_of-coordination', 'lethargy', 'lacrimation', 
    'milk_flakes', 'milk_watery', 'milk_clots', 'mild_diarrhoea', 'moaning', 'mucosal_lesions', 'milk_fever', 
    'nausea', 'nasel_discharges', 'oedema', 'pain', 'painful_tongue', 'pneumonia', 'photo_sensitization', 
    'quivering_lips', 'reduction_milk_vields', 'rapid_breathing', 'rumenstasis', 'reduced_rumination', 
    'reduced_fertility', 'reduced_fat', 'reduces_feed_intake', 'raised_breathing', 'stomach_pain', 'salivation', 
    'stillbirths', 'shallow_breathing', 'swollen_pharyngeal', 'swelling', 'saliva', 'swollen_tongue', 'tachycardia',
    'torticollis', 'udder_swelling', 'udder_heat', 'udder_hardeness', 'udder_redness', 'udder_pain', 'unwillingness_to_move',
    'ulcers', 'vomiting', 'weight_loss', 'weakness']

# Create a Pydantic model to handle incoming data
class SymptomInput(BaseModel):
    symptoms: List[str]



@app.post("/predict")
def predict_disease(input_data: SymptomInput):
    symptoms = input_data.symptoms
    
    # Initialize an input vector for prediction (all zeros)
    input_vector = np.zeros(len(symptom_list))
    
    # Fill the input vector based on the symptoms provided
    for symptom in symptoms:
        if symptom in symptom_list:
            input_vector[symptom_list.index(symptom)] = 1
    
    # Predict the disease (using the trained model)
    prediction = model.predict([input_vector])
    disease = int(prediction[0])  # Convert numpy.int64 to Python int
    
    return {"prediction": disease}


# Health check endpoint
@app.get("/")
def read_root():
    return {"status": "Cattle Disease Prediction API is running"}

if __name__ == "__main__":
    
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)