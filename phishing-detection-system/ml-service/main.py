from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import re

app = FastAPI(title="Phishing Detection ML Service")

# Load model
MODEL_PATH = "models/phishing_model.pkl"
try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    # If model doesn't exist, we might be in a fresh build.
    # In a real scenario, we'd fail, but here we can handle it gracefully or warn.
    model = None
    print("Warning: Model file not found. Please run train_model.py first.")

class PredictionRequest(BaseModel):
    text: str
    type: str  # 'url' or 'email'

class PredictionResponse(BaseModel):
    is_phishing: bool
    confidence: float
    features: dict

def extract_features(text, text_type):
    features = {
        "length": len(text),
        "suspicious_keywords": []
    }
    
    suspicious_list = ["login", "verify", "update", "bank", "secure", "account", "confirm", "free", "lottery"]
    found_keywords = [word for word in suspicious_list if word in text.lower()]
    features["suspicious_keywords"] = found_keywords
    features["keyword_count"] = len(found_keywords)

    if text_type == "url":
        features["has_ip"] = bool(re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', text))
        features["num_dots"] = text.count('.')
        features["has_https"] = text.startswith("https")
    
    return features

@app.get("/")
def read_root():
    return {"status": "ML Service Running"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded. Please train the model first.")

    # Get probability
    # The model classes are likely ['legitimate', 'phishing']
    # We need to map this correctly.
    prediction_class = model.predict([request.text])[0]
    probabilities = model.predict_proba([request.text])[0]
    
    # Assuming classes_ order is sorted alphabetically: ['legitimate', 'phishing']
    # Check model.classes_ in training to be sure. 
    # For this snippet, we assume index 1 is phishing if classes are ['legitimate', 'phishing']
    
    phishing_index = 1 if 'phishing' in model.classes_ and model.classes_[1] == 'phishing' else 0
    if model.classes_[0] == 'phishing': phishing_index = 0
    
    phishing_prob = probabilities[phishing_index]
    
    # Heuristic override for obvious IP addresses in URL if not caught by ML
    if request.type == 'url' and re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', request.text):
        phishing_prob = max(phishing_prob, 0.85) # High suspicion for raw IPs

    is_phishing = phishing_prob > 0.5
    
    features = extract_features(request.text, request.type)

    return {
        "is_phishing": is_phishing,
        "confidence": float(phishing_prob),
        "features": features
    }
