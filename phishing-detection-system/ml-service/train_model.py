import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Create data directory if it doesn't exist
os.makedirs("data", exist_ok=True)
os.makedirs("models", exist_ok=True)

# Generate a small sample dataset for demonstration if actual file is missing
# In production, you would load a real CSV like 'phishing_data.csv'
def generate_sample_data():
    data = {
        'text': [
            'http://google.com', 'http://secure-login-apple.com',
            'Verify your account now', 'Your account has been compromised',
            'http://example.com/login', 'http://192.168.1.1/admin',
            'Congratulations you won a lottery', 'Meeting at 3pm tomorrow',
            'Update your password immediately', 'http://amazon-security-check.com',
            'https://github.com', 'https://stackoverflow.com'
        ],
        'label': [
            'legitimate', 'phishing',
            'phishing', 'phishing',
            'legitimate', 'phishing',
            'phishing', 'legitimate',
            'phishing', 'phishing',
            'legitimate', 'legitimate'
        ]
    }
    df = pd.DataFrame(data)
    df.to_csv('data/phishing_sample.csv', index=False)
    print("Sample dataset created at data/phishing_sample.csv")
    return df

def train_model():
    print("Loading data...")
    # Try loading real data, fallback to sample
    try:
        # Assuming a dataset with 'text' (URL or email body) and 'label' columns
        df = pd.read_csv('data/phishing_data.csv')
    except FileNotFoundError:
        print("phishing_data.csv not found, generating sample data...")
        df = generate_sample_data()

    # Preprocessing
    X = df['text']
    y = df['label']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create Pipeline
    # 1. TF-IDF for text feature extraction
    # 2. Logistic Regression for classification
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('clf', LogisticRegression(random_state=42))
    ])

    print("Training model...")
    pipeline.fit(X_train, y_train)

    # Evaluation
    predictions = pipeline.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, predictions))
    print("\nClassification Report:\n", classification_report(y_test, predictions))

    # Save model
    joblib.dump(pipeline, 'models/phishing_model.pkl')
    print("Model saved to models/phishing_model.pkl")

if __name__ == "__main__":
    train_model()
