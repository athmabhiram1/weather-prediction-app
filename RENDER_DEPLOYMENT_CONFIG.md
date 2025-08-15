# Render Deployment Configuration Guide

## ✅ Fixing the Frontend Connection Issue

Your backend is deployed at: `https://weather-prediction-app-1-gmxl.onrender.com`

The frontend needs to be configured to connect to this URL instead of localhost.

### Frontend Environment Variables in Render

When deploying your frontend to Render, make sure to set these environment variables in your Render service:

```
NEXT_PUBLIC_API_BASE_URL=https://weather-prediction-app-1-gmxl.onrender.com
NEXT_PUBLIC_DEBUG=true
```

### How to Set Environment Variables in Render

1. Go to your Render dashboard
2. Click on your frontend service
3. Go to "Environment" tab
4. Add the environment variables above
5. Redeploy your service

### Backend CORS Configuration

Your backend should also be configured to accept requests from your frontend URL. Set these environment variables in your backend Render service:

```
FRONTEND_URL=https://your-frontend-app.onrender.com
ADDITIONAL_CORS_ORIGINS=https://your-frontend-app.onrender.com
OPENWEATHER_API_KEY=your_api_key_here
```

Replace `your-frontend-app.onrender.com` with your actual frontend URL.

### Local Testing

For local development, your `.env.local` file in the frontend folder should have:

```
NEXT_PUBLIC_API_BASE_URL=https://weather-prediction-app-1-gmxl.onrender.com
NEXT_PUBLIC_DEBUG=true
```

This will allow you to test your local frontend against the production backend.

### Verification Steps

1. **Check Configuration**: The frontend will now log configuration details to the browser console
2. **Error Messages**: Error messages will show the actual API URL being used
3. **Network Tab**: Check browser Network tab to see if requests are going to the correct URL

### Common Issues

1. **CORS Errors**: Make sure backend has your frontend URL in CORS origins
2. **Environment Variables**: Ensure they start with `NEXT_PUBLIC_` for frontend
3. **Trailing Slashes**: The configuration utility automatically handles trailing slashes
4. **SSL Issues**: Make sure both frontend and backend use HTTPS in production

### Testing the Fix

After setting the environment variables and redeploying:

1. Open browser developer tools
2. Go to Console tab
3. Look for "🔧 Frontend Configuration:" logs
4. Verify the API Base URL shows your backend URL
5. Try searching for a city
6. Check Network tab to see requests going to the correct backend URL

If you see warnings about localhost in production, it means the environment variables weren't set correctly.
