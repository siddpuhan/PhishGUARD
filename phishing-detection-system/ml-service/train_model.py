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
    # Comprehensive dataset with 120 examples (60 phishing, 60 legitimate)
    phishing_examples = [
        # Banking phishing
        'URGENT: Your bank account will be closed. Verify now',
        'Your PayPal account has been limited. Click here to restore',
        'Alert: Unusual activity detected. Confirm your identity immediately',
        'Your account will be suspended. Update your information',
        'Security alert: Verify your credit card details now',
        'http://secure-paypal-verify.com/login',
        'http://chase-bank-security.net/update',
        'http://wellsfargo-alert.com/verify',
        'http://192.168.1.100/admin/login',
        'http://bankofamerica-secure.org/signin',
        # Tech company phishing
        'Your Apple ID has been locked. Verify immediately',
        'Microsoft account security alert. Click to verify',
        'Your Amazon order failed. Update payment method',
        'Google account suspended. Confirm your identity',
        'Netflix payment declined. Update billing information',
        'http://apple-id-verify-account.com/login',
        'http://microsoft-account-recovery.net/reset',
        'http://amazon-security-check.com/update',
        'http://google-account-suspended.com/verify',
        'http://netflix-payment-update.net/billing',
        # Lottery/Prize scams
        'Congratulations! You won $1,000,000. Claim now',
        'You are our lucky winner. Click to claim your prize',
        'FREE iPhone 15 Pro. Limited offer. Click here',
        'You won a $5000 Amazon gift card. Confirm details',
        'WINNER: Claim your lottery prize before it expires',
        # Urgency tactics
        'IMMEDIATE ACTION REQUIRED: Your account at risk',
        'WARNING: Suspicious login attempt detected',
        'Final notice: Your password expired. Reset now',
        'Account will be deleted in 24 hours. Act now',
        'Your data has been compromised. Verify immediately',
        # More phishing URLs
        'http://secure-login-update-verify.com',
        'http://account-security-alert.net',
        'http://verify-identity-now.com',
        'http://confirm-account-details.org',
        'http://10.0.0.1/secure/bank',
        'http://172.16.0.50/verify/account',
        'http://payment-update.com/verify',
        'http://account-confirm.net/secure',
        # IRS/Tax scams
        'IRS: You have unclaimed tax refund. Verify SSN',
        'Tax refund of $3,847 pending. Click to claim',
        # More urgency emails
        'Your package delivery failed. Update address now',
        'Payment authorization required. Click immediately',
        'Your subscription expires today. Renew now',
        'Account verification needed within 2 hours',
        'Confirm your email or lose access forever',
        'Security breach detected. Change password now',
        'Your account has been hacked. Reset credentials',
        'Final warning: Verify account or be deleted',
        'Urgent security update required. Download now',
        'Your computer has a virus. Click to remove',
        'Credit card declined. Update payment info',
        'Invoice overdue. Pay immediately to avoid penalty',
        'Package held at customs. Pay fee to release',
        'Your refund is ready. Claim within 48 hours',
        'Account locked due to suspicious activity',
        'Verify your identity to prevent account closure',
        'Update required: Your account is outdated',
        'Confirm your phone number immediately',
        'Your email will be deleted. Click to prevent',
        'Security code needed. Reply with your password'
    ]
    
    legitimate_examples = [
        # Normal business emails
        'Hi team, reminder about meeting tomorrow at 3 PM',
        'Thank you for your purchase. Order shipped successfully',
        'Your project deadline is next Friday',
        'Meeting notes from today are attached',
        'Please review the quarterly report',
        'Lunch meeting scheduled for Thursday',
        'Your subscription has been confirmed',
        'Conference registration successful',
        'Your report was submitted successfully',
        'Appointment reminder: March 15 at 2:30 PM',
        # Personal messages
        'Hey! Want to grab coffee this weekend',
        'Happy birthday! Hope you have a great day',
        'Looking forward to seeing you next month',
        'Thanks for the help with the project',
        'Can we reschedule our meeting to Monday',
        'Great job on the presentation today',
        'Dinner plans for Saturday evening',
        'Movie night this Friday, are you free',
        'Book club meeting next Tuesday',
        'Yoga class starts at 7 AM tomorrow',
        # Legitimate URLs
        'https://github.com',
        'https://google.com',
        'https://amazon.com',
        'https://microsoft.com',
        'https://apple.com',
        'https://facebook.com',
        'https://twitter.com',
        'https://linkedin.com',
        'https://stackoverflow.com',
        'https://reddit.com',
        'https://wikipedia.org',
        'https://youtube.com',
        'https://netflix.com',
        'https://spotify.com',
        'https://github.com/trending',
        # Normal notifications
        'Your order has been delivered',
        'Flight check-in is now available',
        'Reminder: Dentist appointment tomorrow',
        'Your package will arrive in 2 days',
        'Welcome to our newsletter',
        'Recipe of the week: Pasta carbonara',
        'Weather forecast: Sunny tomorrow',
        'Your gym membership renewed successfully',
        'Library book due next Monday',
        'Prescription ready for pickup',
        # Professional updates
        'Team building event next month',
        'New company policy effective January',
        'Office will be closed on holidays',
        'Performance review scheduled',
        'Training session on Friday afternoon',
        'Welcome aboard! First day orientation',
        'Expense report approved',
        'Vacation request approved',
        'Congratulations on your promotion',
        'Employee of the month announcement',
        # Informational
        'Blog post published: 10 productivity tips',
        'New feature released in latest update',
        'Server maintenance scheduled for weekend',
        'Survey: Help us improve our service',
        'Community event this Saturday',
        'Webinar recording now available',
        'Product demo scheduled for Tuesday',
        'Monthly newsletter: Industry insights',
        'New course available on platform',
        'Updated terms of service'
    ]
    
    # Combine datasets
    texts = phishing_examples + legitimate_examples
    labels = ['phishing'] * len(phishing_examples) + ['legitimate'] * len(legitimate_examples)
    
    data = {'text': texts, 'label': labels}
    df = pd.DataFrame(data)
    
    # Shuffle the data
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    df.to_csv('data/phishing_sample.csv', index=False)
    print(f"Enhanced dataset created with {len(df)} examples at data/phishing_sample.csv")
    print(f"Phishing: {len(phishing_examples)}, Legitimate: {len(legitimate_examples)}")
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
