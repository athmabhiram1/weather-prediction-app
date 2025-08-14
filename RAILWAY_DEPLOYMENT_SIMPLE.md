# 🚀 Railway Deployment Guide

## Quick Setup

### 1. Railway Dashboard Settings
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --workers 1 --chdir backend/api app:app`
- **Root Directory**: `.` (project root)

### 2. Environment Variables
```
OPENWEATHER_API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here
```

### 3. Deploy
1. Push to GitHub
2. Connect repository to Railway
3. Deploy automatically

### 4. Test Endpoints
- Health check: `/health`
- Weather API: `/current-weather/London`
- Prediction: `/predict` (POST)

That's it! 🎉
