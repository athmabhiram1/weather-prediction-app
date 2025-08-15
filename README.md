🌦 Weather Prediction App

A full-stack weather prediction application that fetches real-time weather data and predicts future conditions using LSTM and XGBoost machine learning models.

📂 Project Structure
```
weather-prediction/
├── backend/         # Flask API with ML models
│   ├── api/         # Flask application
│   ├── models/      # Trained ML model files
│   └── utils/       # Prediction utilities
├── frontend/        # Next.js React app
└── README.md
```

✨ Features
- Real-time weather data from OpenWeatherMap API
- Dual ML models: LSTM for time-series forecasting & XGBoost for regression
- Interactive UI with weather visualizations
- Search by location & popular city suggestions
- Fully responsive design for mobile and desktop

🛠 Prerequisites
- Node.js ≥ 16
- Python ≥ 3.8
- OpenWeatherMap API Key

🚀 Local Development

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

**Backend Setup:**
```bash
cd backend/api
pip install -r requirements.txt
python app.py
```

**Environment Variables:**

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
NEXT_PUBLIC_API_BASE_URL_FALLBACK=http://localhost:5000
```

**Backend (.env):**
```env
OPENWEATHER_API_KEY=your_api_key
SECRET_KEY=your_secret_key
FRONTEND_URL=https://your-frontend-domain.com
LOCALHOST_FRONTEND_URL=http://localhost:3000
ADDITIONAL_CORS_ORIGINS=https://staging.yourdomain.com,https://another-domain.com
```

📡 API Endpoints
- `GET /health` - Health check
- `GET /current-weather/<city>` - Get current weather
- `POST /predict` - Get temperature prediction

🌍 Deployment
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway using the included configuration

👨‍💻 Creator
Athmabhiram S J — Developer of the Weather Prediction App.

📜 License
MIT License