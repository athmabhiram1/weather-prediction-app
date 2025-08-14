🌦 Weather Prediction App

A full-stack weather prediction application that fetches real-time weather data and predicts future conditions using LSTM and XGBoost machine learning models.

📂 Project Structure
weather-prediction/
├── frontend/        # Next.js React app (UI)
├── backend/         # Flask API with ML models
├── models/          # Trained ML model files
└── README.md

✨ Features

Real-time weather data from OpenWeatherMap API

Dual ML models: LSTM for time-series forecasting & XGBoost for regression

Interactive UI with weather visualizations

Search by location & popular city suggestions

Fully responsive design for mobile and desktop

🛠 Prerequisites

Node.js ≥ 16

npm or yarn

Python ≥ 3.8

pip

OpenWeatherMap API Key (Get it here)

🚀 Local Development
1️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Create .env.local:

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000


Then open http://localhost:3000 in your browser.

2️⃣ Backend Setup
cd backend/api
pip install -r requirements.txt
python app.py


Create .env:

OPENWEATHER_API_KEY=your_api_key
SECRET_KEY=your_secret_key


Backend will be available at: http://localhost:5000

📡 API Endpoints
Method	Endpoint	Description
GET	/	API root info
GET	/health	Health check
GET	/current-weather/<city>	Get current weather for a city
POST	/predict	Get temperature prediction from models
🌍 Deployment
Frontend (Vercel)

Push your code to GitHub

Create a new Vercel project

Set NEXT_PUBLIC_API_BASE_URL in Vercel environment variables

Deploy

Backend (Railway / Render / Heroku)

Deploy backend/api/

Set environment variables:

OPENWEATHER_API_KEY

SECRET_KEY

Obtain backend URL and update NEXT_PUBLIC_API_BASE_URL in Vercel

🤝 Contributing

Fork this repo

Create your feature branch:

git checkout -b feature/MyFeature


Commit changes:

git commit -m "Add MyFeature"


Push to branch:

git push origin feature/MyFeature


Open a Pull Request

👨‍💻 Creator

Athmabhiram S J — Developer of the Weather Prediction App.

📜 License

This project is licensed under the MIT License.
See the LICENSE file for details.