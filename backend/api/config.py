# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY')
    MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models')