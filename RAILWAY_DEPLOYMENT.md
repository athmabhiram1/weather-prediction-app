# Railway Deployment Instructions

## 🚂 Backend Deployment to Railway

### Method 1: Railway Web Interface (Recommended)

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select: `athmabhiram1/Pet-Health-Vaccine-Tracker`

2. **Configure Project**
   - **Root Directory**: `backend/api`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 120 app:app`

3. **Set Environment Variables**
   ```
   OPENWEATHER_API_KEY=e9ab45b972f61aecd9b58dea4bd26897
   SECRET_KEY=a7d8f9b0c1e2d3f4a5b6c7d8e9f0a1b2
   FLASK_ENV=production
   FLASK_DEBUG=false
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Get your Railway URL

### Method 2: Railway CLI

```bash
cd backend/api
railway login
railway init
railway up
railway variables set OPENWEATHER_API_KEY=e9ab45b972f61aecd9b58dea4bd26897
railway variables set SECRET_KEY=a7d8f9b0c1e2d3f4a5b6c7d8e9f0a1b2
```

## ✅ Health Check

After deployment, test: `https://your-app.up.railway.app/health`

## 🔧 Troubleshooting

- **Build fails**: Check logs for missing dependencies
- **App crashes**: Verify environment variables are set
- **Timeout**: Increase worker timeout in Procfile
- **Memory issues**: Use single worker (`--workers 1`)
