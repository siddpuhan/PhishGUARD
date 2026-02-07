# AI-Powered Phishing Detection System

A full-stack application that uses Machine Learning to detect whether a URL or Email content is phishing or legitimate.

## Project Structure

- `frontend/`: React + Vite + TailwindCSS
- `backend/`: Node.js + Express + MongoDB
- `ml-service/`: Python + FastAPI + Scikit-learn

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB (Local or Atlas)

## Setup Instructions

### 1. Database Setup
Ensure MongoDB is running locally on port 27017 or update `backend/.env` with your MongoDB URI.

### 2. ML Service Setup
Navigate to the `ml-service` directory:
```bash
cd ml-service
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Train the model (this will generate a sample dataset and save the model):
```bash
python train_model.py
```

Run the API:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Start the server:
```bash
npm run dev
# OR
node server.js
```
The backend runs on http://localhost:5000.

### 4. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
Open http://localhost:5173 to view the app.

## Usage

1.  Register a new account.
2.  Login to access the Dashboard.
3.  Select "URL Scan" or "Email Scan".
4.  Enter the content and click "Analyze Now".
5.  View the results, confidence score, and extracted features.
6.  Check "History" for past scans.
7.  (Optional) Manually set a user role to 'admin' in MongoDB to access the "Analytics" page.

## Deployment Guide

### Backend (Render/Vercel)
1.  **Render:** Create a new Web Service, connect your repo. Set Build Command: `npm install`, Start Command: `node server.js`. Add Environment Variables from `.env`.
2.  **Vercel:** Create a `vercel.json` for Express.

### Frontend (Vercel/Netlify)
1.  **Vercel:** Import project, framework preset "Vite". Deploy.
2.  **Env:** Update `src/services/api.js` `baseURL` to point to your deployed backend URL.

### ML Service (Render/Railway)
1.  **Render:** Create a Web Service, connect repo (ml-service folder). Build Command: `pip install -r requirements.txt`, Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.

## Security Features implemented
- JWT Authentication
- Password Hashing (Bcrypt)
- Rate Limiting
- Helmet (HTTP Headers)
- Input Validation
