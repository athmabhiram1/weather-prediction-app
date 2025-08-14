# utils/predictor.py
import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import json
import os
from datetime import datetime
import requests
import warnings
import logging
from sklearn.exceptions import InconsistentVersionWarning

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure warnings
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

class WeatherPredictor:
    def __init__(self, model_path):
        """Initialize the weather predictor with model path"""
        logger.info("🚀 Initializing Weather Predictor...")
        self.model_path = model_path
        self.load_models()
        
    def load_models(self):
        """Load trained models and scalers"""
        try:
            logger.info(f"Loading models from {self.model_path}")
            
            # Load XGBoost model
            self.xgb_model = xgb.Booster()
            xgb_model_path = os.path.join(self.model_path, 'xgb_weather_combined.model')
            
            if not os.path.exists(xgb_model_path):
                raise FileNotFoundError(f"XGBoost model file not found: {xgb_model_path}")
            
            self.xgb_model.load_model(xgb_model_path)
            logger.info("Successfully loaded XGBoost model")
            
            # Load scalers
            scaler_x_path = os.path.join(self.model_path, 'scaler_X_combined.gz')
            scaler_y_path = os.path.join(self.model_path, 'scaler_y_combined.gz')
            
            if not os.path.exists(scaler_x_path):
                raise FileNotFoundError(f"Feature scaler file not found: {scaler_x_path}")
            if not os.path.exists(scaler_y_path):
                raise FileNotFoundError(f"Target scaler file not found: {scaler_y_path}")
            
            self.scaler_X = joblib.load(scaler_x_path)
            self.scaler_y = joblib.load(scaler_y_path)
            logger.info("Successfully loaded feature scalers")
            
            # Load feature list
            feature_list_path = os.path.join(self.model_path, 'feature_list_xgb.json')
            if not os.path.exists(feature_list_path):
                raise FileNotFoundError(f"Feature list file not found: {feature_list_path}")
                
            with open(feature_list_path, 'r') as f:
                self.features = json.load(f)
            logger.info(f"Loaded feature list with {len(self.features)} features")
            
            logger.info("✅ Weather prediction models loaded successfully")
            
        except FileNotFoundError as e:
            logger.error(f"❌ Model file not found: {e}")
            raise
        except Exception as e:
            logger.error(f"❌ Error loading models: {e}")
            raise
    
    def create_features(self, temp, humidity, pressure, feels_like, temp_lag1=None, temp_lag2=None, 
                       wind_speed=None, visibility=None):
        """Create features for prediction with validation"""
        try:
            # Validate numeric inputs
            numeric_inputs = [temp, humidity, pressure, feels_like]
            if not all(isinstance(x, (int, float)) and not np.isnan(float(x)) for x in numeric_inputs):
                raise ValueError("Core weather parameters must be valid numeric values")
            
            # Validate ranges
            if not (-50 <= temp <= 60):
                logger.warning(f"Temperature {temp}°C is outside typical range (-50°C to 60°C)")
            if not (0 <= humidity <= 100):
                raise ValueError(f"Humidity must be between 0-100%, got {humidity}%")
            if not (800 <= pressure <= 1100):
                logger.warning(f"Pressure {pressure}mb is outside typical range (800-1100mb)")
            
            # Use provided lags or simulate them
            lag1 = temp_lag1 if temp_lag1 is not None else temp - 0.5
            lag2 = temp_lag2 if temp_lag2 is not None else temp - 1.0
            
            # Get current day of year
            day_of_year = datetime.now().timetuple().tm_yday
            
            features = {
                'temperature_celsius_lag1': float(lag1),
                'temperature_celsius_lag2': float(lag2),
                'humidity': float(humidity),
                'pressure_mb': float(pressure),
                'feels_like_celsius': float(feels_like),
                'dayofyear': float(day_of_year),
                'sin_doy': np.sin(2 * np.pi * day_of_year / 365.0),
                'cos_doy': np.cos(2 * np.pi * day_of_year / 365.0)
            }
            
            # Add optional features if they exist in the feature list
            if 'wind_speed_mps' in self.features:
                features['wind_speed_mps'] = float(wind_speed) if wind_speed is not None else 5.0
            if 'visibility_km' in self.features:
                features['visibility_km'] = float(visibility) if visibility is not None else 10.0
            
            # Create feature array in correct order
            feature_values = [features[f] for f in self.features]
            return np.array(feature_values).reshape(1, -1)
            
        except KeyError as e:
            logger.error(f"Missing required feature in model: {e}")
            raise ValueError(f"Missing required feature in model: {e}")
        except ValueError as e:
            logger.error(f"Invalid input value: {e}")
            raise
        except Exception as e:
            logger.error(f"Error creating features: {e}")
            raise
    
    def predict_temperature(self, temp, humidity, pressure, feels_like, temp_lag1=None, temp_lag2=None,
                           wind_speed=None, visibility=None):
        """Make temperature prediction using XGBoost with enhanced validation and confidence estimation"""
        try:
            logger.info(f"Starting prediction with params: temp={temp}, humidity={humidity}, pressure={pressure}")
            
            # Validate input parameters
            required_params = [temp, humidity, pressure, feels_like]
            if not all(isinstance(x, (int, float)) for x in required_params):
                raise ValueError("All required parameters must be numbers")
            
            # Create features
            X = self.create_features(temp, humidity, pressure, feels_like, temp_lag1, temp_lag2,
                                   wind_speed, visibility)
            
            # Scale features
            X_scaled = self.scaler_X.transform(X)
            
            # Create DMatrix and predict
            dmatrix = xgb.DMatrix(X_scaled)
            prediction_scaled = self.xgb_model.predict(dmatrix)[0]
            
            # Inverse transform prediction
            prediction = self.scaler_y.inverse_transform([[prediction_scaled]])[0][0]
            
            # Calculate confidence based on prediction difference and input consistency
            temp_diff = abs(prediction - temp)
            feels_like_diff = abs(feels_like - temp)
            
            # Enhanced confidence calculation
            if temp_diff < 1.0 and feels_like_diff < 3.0:
                confidence = 'Very High'
            elif temp_diff < 2.0 and feels_like_diff < 5.0:
                confidence = 'High'
            elif temp_diff < 3.0:
                confidence = 'Medium'
            else:
                confidence = 'Low'
            
            result = {
                'predicted_temperature': round(float(prediction), 2),
                'current_temperature': float(temp),
                'temperature_difference': round(float(prediction - temp), 2),
                'confidence': confidence,
                'prediction_metadata': {
                    'model_type': 'XGBoost',
                    'features_used': len(self.features),
                    'timestamp': datetime.now().isoformat()
                }
            }
            
            logger.info(f"Prediction successful: {result['predicted_temperature']}°C (confidence: {confidence})")
            return result
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            return {
                'error': 'Prediction failed',
                'message': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_current_weather(self, city, api_key):
        """Fetch current weather data from OpenWeatherMap with enhanced error handling"""
        if not api_key:
            logger.error("API key not configured")
            return {'error': 'API key not configured'}
        
        if not city or not isinstance(city, str):
            logger.error(f"Invalid city parameter: {city}")
            return {'error': 'Invalid city name provided'}
            
        url = "http://api.openweathermap.org/data/2.5/weather"
        params = {
            'q': city.strip(),
            'appid': api_key,
            'units': 'metric'
        }
        
        try:
            logger.info(f"Fetching weather data for {city}")
            response = requests.get(url, params=params, timeout=10)
            
            # Handle different HTTP status codes
            if response.status_code == 401:
                logger.error("Invalid API key")
                return {'error': 'Invalid API key'}
            elif response.status_code == 404:
                logger.error(f"City not found: {city}")
                return {'error': f'City "{city}" not found'}
            elif response.status_code != 200:
                logger.error(f"API returned status {response.status_code}")
                return {'error': f'Weather API error: {response.status_code}'}
            
            response.raise_for_status()
            data = response.json()
            
            # Validate response structure
            required_keys = ['main', 'weather', 'sys', 'name']
            if not all(key in data for key in required_keys):
                logger.error("Invalid API response structure")
                return {'error': 'Invalid API response format'}
            
            # Extract sunrise and sunset times safely
            sunrise = sunset = 'N/A'
            try:
                if 'sunrise' in data['sys'] and 'sunset' in data['sys']:
                    sunrise = datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M')
                    sunset = datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M')
            except (KeyError, ValueError) as e:
                logger.warning(f"Could not parse sunrise/sunset times: {e}")
            
            weather_data = {
                'temperature': float(data['main']['temp']),
                'humidity': float(data['main']['humidity']),
                'pressure': float(data['main']['pressure']),
                'feels_like': float(data['main']['feels_like']),
                'description': data['weather'][0]['description'],
                'city': data['name'],
                'country': data['sys']['country'],
                'wind_speed': float(data.get('wind', {}).get('speed', 0)),
                'visibility': float(data.get('visibility', 10000)) / 1000,  # Convert to km
                'sunrise': sunrise,
                'sunset': sunset,
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"Weather data fetched successfully for {city}")
            return weather_data
            
        except requests.exceptions.Timeout:
            logger.error(f"Weather API request timed out for {city}")
            return {'error': 'Weather API request timed out'}
        except requests.exceptions.ConnectionError:
            logger.error(f"Connection error for {city}")
            return {'error': 'Unable to connect to weather service'}
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch weather data for {city}: {str(e)}")
            return {'error': 'Failed to fetch weather data', 'message': str(e)}
        except (KeyError, ValueError) as e:
            logger.error(f"Invalid API response format for {city}: {e}")
            return {'error': 'Invalid API response format', 'message': str(e)}
        except Exception as e:
            logger.error(f"Unexpected error fetching weather for {city}: {str(e)}")
            return {'error': 'Unexpected error occurred', 'message': str(e)}