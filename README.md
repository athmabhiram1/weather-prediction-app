# Save the provided README content as a .txt file

readme_content = """# 🌦 Weather Prediction App

A full-stack weather prediction application that fetches real-time weather data and predicts future conditions using **LSTM** and **XGBoost** machine learning models. Powered by Flask, Next.js, and AI-driven forecasting.

🔗 **Live Demo**: https://weather-prediction-app-wt9d.onrender.com

---

## ✨ Features
- 🌐 Real-time weather data from **OpenWeatherMap API**
- 🤖 Dual ML models:
  - **LSTM** for time-series temperature forecasting
  - **XGBoost** for regression-based predictions
- 📊 Interactive UI with dynamic weather visualizations
- 🔍 Search by location with popular city suggestions (Mumbai, Delhi, Bangalore, etc.)
- 📱 Fully responsive design for mobile and desktop

---

## 📂 Project Structure
weather-prediction/
├── backend/ # Flask API with ML models
│   ├── api/ # Flask application (app.py)
│   ├── models/ # Trained LSTM & XGBoost model files (.pkl, .h5)
│   └── utils/ # Data preprocessing & prediction utilities
├── frontend/ # Next.js React application
│   ├── pages/ # UI routes
│   ├── components/ # Reusable React components
│   ├── public/ # Static assets
│   └── .env.local # Environment variables
└── README.md # This file

---

## 🛠 Prerequisites
- Node.js ≥ 16
- Python ≥ 3.8
- OpenWeatherMap API Key (free tier sufficient)

---

## 🚀 Local Development

### Frontend Setup
cd frontend
npm install
npm run dev
Visit http://localhost:3000

### Backend Setup
cd backend/api
pip install -r requirements.txt
python app.py
API runs on http://localhost:5000

---

## 🌐 Environment Variables

### Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
NEXT_PUBLIC_API_BASE_URL_FALLBACK=http://localhost:5000

### Backend (.env)
OPENWEATHER_API_KEY=your_api_key_here
SECRET_KEY=your_flask_secret_key
FRONTEND_URL=https://your-frontend-domain.com
LOCALHOST_FRONTEND_URL=http://localhost:3000
ADDITIONAL_CORS_ORIGINS=https://staging.yourdomain.com,https://another-domain.com

---

## 📡 API Endpoints
GET /health — Health check (returns 200 OK)
GET /current-weather/<city> — Fetch current weather for a city
POST /predict — Predict future temperature (requires JSON input)

---

## 🌍 Deployment
Frontend — Deployed via Vercel  
https://weather-prediction-app-wt9d.onrender.com  
Backend — Hosted on Render (free tier)  
⚠️ Note: May sleep after inactivity — wakes on first request.

---

## 🧪 Technologies Used
- **Frontend:** Next.js, React, Tailwind CSS, Chart.js
- **Backend:** Flask, Python
- **ML:** TensorFlow (LSTM), XGBoost, scikit-learn, pandas
- **Deployment:** Vercel (frontend), Render (backend)
- **APIs:** OpenWeatherMap

---

## 👨‍💻 Creator
Athmabhiram S J  
Developer & Machine Learning Engineer

---

## 📜 License
MIT License
"""

# Save as .txt
file_path = "/mnt/data/Weather_Prediction_App_README.txt"
with open(file_path, "w", encoding="utf-8") as f:
    f.write(readme_content)

file_path
