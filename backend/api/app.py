# backend/api/app.py
import sys
import os
import warnings
import logging
from datetime import datetime  # Added back - needed for health_check
from sklearn.exceptions import InconsistentVersionWarning
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure warnings
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

# Load environment variables from .env file
load_dotenv()

# Add the parent directory to Python path for relative imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(parent_dir)
sys.path.append(os.path.dirname(current_dir))

# Also add the current directory to handle relative imports
sys.path.append(current_dir)

from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from utils.predictor import WeatherPredictor

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Load API key from environment variables as a fallback
app.config['OPENWEATHER_API_KEY'] = os.getenv('OPENWEATHER_API_KEY', app.config.get('OPENWEATHER_API_KEY'))

# Enable CORS for frontend integration
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://your-vercel-app.vercel.app",
            "https://weatherai-yourusername.vercel.app"
        ]
    }
})

# Initialize predictor
predictor = None
try:
    predictor = WeatherPredictor(app.config['MODEL_PATH'])
    logger.info("✅ Weather models loaded successfully")
except Exception as e:
    logger.error(f"❌ Could not load models: {e}")

# --- API Routes ---

@app.route('/')
def home():
    """Root endpoint providing API information."""
    return jsonify({
        'message': 'Weather Prediction API',
        'status': 'running',
        'version': '1.0',
        'endpoints': {
            'predict': '/predict (POST)',
            'current_weather': '/current-weather/<city> (GET)',
            'health': '/health (GET)'
        },
        'api_key_configured': bool(app.config.get('OPENWEATHER_API_KEY'))
    })

@app.route('/health')
def health_check():
    """Health check endpoint to verify API status."""
    return jsonify({
        'status': 'healthy' if predictor else 'degraded',
        'models_loaded': predictor is not None,
        'api_key_configured': bool(app.config.get('OPENWEATHER_API_KEY')),
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predicts temperature based on provided weather data.
    Expects JSON with 'temperature', 'humidity', 'pressure', 'feels_like'.
    Returns JSON with prediction results.
    """
    if not predictor:
        logger.error("Prediction attempt with unloaded models")
        return jsonify({'error': 'Models not loaded. Service unavailable.'}), 503

    try:
        data = request.get_json()

        if not data:
            logger.warning("Empty prediction request received")
            return jsonify({'error': 'No JSON data provided in request body.'}), 400

        # Required fields validation
        required_fields = ['temperature', 'humidity', 'pressure', 'feels_like']
        for field in required_fields:
            if field not in data:
                logger.warning(f"Missing required field in prediction request: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
            if not isinstance(data[field], (int, float)):
                logger.warning(f"Invalid type for required field {field}: {type(data[field])}")
                return jsonify({'error': f'Invalid type for {field}. Must be a number (int or float).'}), 400

        # Validate optional fields if provided
        optional_numeric_fields = ['temperature_lag1', 'temperature_lag2', 'wind_speed', 'visibility']
        for field in optional_numeric_fields:
            if field in data and not isinstance(data[field], (int, float)):
                logger.warning(f"Invalid type for optional field {field}: {type(data[field])}")
                return jsonify({'error': f'Invalid type for {field}. Must be a number (int or float).'}), 400

        # Optional lag fields with defaults based on current temp
        temp_lag1 = data.get('temperature_lag1', data['temperature'] - 0.5)
        temp_lag2 = data.get('temperature_lag2', data['temperature'] - 1.0)
        wind_speed = data.get('wind_speed')
        visibility = data.get('visibility')

        logger.info(f"Processing prediction request: temp={data['temperature']}, "
                    f"humidity={data['humidity']}, pressure={data['pressure']}")

        # Call the predictor method
        result = predictor.predict_temperature(
            temp=data['temperature'],
            humidity=data['humidity'],
            pressure=data['pressure'],
            feels_like=data['feels_like'],
            temp_lag1=temp_lag1,
            temp_lag2=temp_lag2,
            wind_speed=wind_speed,
            visibility=visibility
        )

        # Check if predictor returned an error object
        if 'error' in result:
            logger.error(f"Prediction model error: {result['error']}")
            return jsonify(result), 500

        logger.info(f"Prediction successful: {result.get('predicted_temperature', 'N/A')}°C")
        return jsonify(result)

    except Exception as e:
        logger.exception("Unexpected error during prediction")
        return jsonify({
            'error': 'An internal error occurred during prediction.', 
            'message': str(e)
        }), 500

@app.route('/current-weather/<city>')
def current_weather(city):
    """
    Fetches current weather data for a given city using OpenWeatherMap API.
    Returns JSON with weather data.
    """
    api_key = app.config.get('OPENWEATHER_API_KEY')
    if not api_key:
        logger.error("OpenWeatherMap API key is missing")
        return jsonify({
            'error': 'OpenWeatherMap API key not configured on the server.',
            'solution': 'Please configure OPENWEATHER_API_KEY in the backend .env file.'
        }), 500

    if not predictor:
        logger.error("Weather fetch attempt with unloaded predictor")
        return jsonify({'error': 'Weather service temporarily unavailable.'}), 503

    try:
        logger.info(f"Fetching current weather data for city: {city}")

        # Fetch weather data using the predictor's method
        weather_data = predictor.get_current_weather(city, api_key)

        if not weather_data:
            logger.error("Predictor returned no weather data")
            return jsonify({'error': 'Weather service is temporarily unavailable.'}), 503

        # Check if the predictor's method returned an error object
        if 'error' in weather_data:
            error_msg = weather_data['error']
            logger.error(f"Weather API error for {city}: {error_msg}")
            
            # Differentiate error types
            if "API key" in error_msg:
                return jsonify(weather_data), 500
            elif "timed out" in error_msg:
                return jsonify(weather_data), 504
            else:
                return jsonify(weather_data), 502

        logger.info(f"Successfully fetched weather data for {city}")
        return jsonify(weather_data)

    except Exception as e:
        logger.exception(f"Unexpected error fetching weather for {city}")
        return jsonify({
            'error': 'An internal error occurred while fetching weather data.',
            'message': str(e)
        }), 500

# --- Main Execution ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Force debug to False in production
    if os.environ.get('RAILWAY_ENVIRONMENT'):
        debug_mode = False
        
    logger.info(f"Starting Flask server on port {port} (debug={debug_mode})")
    logger.info(f"Environment: {'Railway' if os.environ.get('RAILWAY_ENVIRONMENT') else 'Local'}")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)