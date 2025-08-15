"""
Backend Configuration Utility
Centralized configuration management for environment variables
"""

import os
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Centralized configuration class for the backend application."""
    
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Server Configuration
    PORT = int(os.environ.get('PORT', 5000))
    HOST = os.environ.get('HOST', '0.0.0.0')
    
    # API Configuration
    OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY')
    
    # Model Configuration
    MODEL_PATH = os.environ.get('MODEL_PATH', 'models/')
    
    # CORS Configuration
    @staticmethod
    def get_cors_origins() -> List[str]:
        """Get all allowed CORS origins from environment variables."""
        # Default origins
        localhost_frontend = os.environ.get('LOCALHOST_FRONTEND_URL', 'http://localhost:3000')
        default_origins = [
            localhost_frontend,
            "https://your-vercel-app.vercel.app",
            "https://weatherai-yourusername.vercel.app", 
            "https://web-production-6d3e.up.railway.app"
        ]
        
        # Add production frontend URL
        frontend_url = os.environ.get('FRONTEND_URL')
        if frontend_url:
            frontend_url = frontend_url.rstrip('/')
            if frontend_url not in default_origins:
                default_origins.append(frontend_url)
        
        # Add additional origins
        additional_origins = os.environ.get('ADDITIONAL_CORS_ORIGINS', '')
        if additional_origins:
            for origin in additional_origins.split(','):
                origin = origin.strip().rstrip('/')
                if origin and origin not in default_origins:
                    default_origins.append(origin)
        
        return default_origins
    
    # Environment Detection
    @staticmethod
    def is_production() -> bool:
        """Check if running in production environment."""
        return bool(os.environ.get('RAILWAY_ENVIRONMENT')) or \
               bool(os.environ.get('VERCEL')) or \
               bool(os.environ.get('RENDER'))
    
    @staticmethod
    def is_development() -> bool:
        """Check if running in development environment."""
        return not Config.is_production()
    
    # Validation
    @staticmethod
    def validate_config() -> List[str]:
        """Validate configuration and return list of warnings/errors."""
        warnings = []
        
        if not Config.OPENWEATHER_API_KEY:
            warnings.append("OPENWEATHER_API_KEY is not set - weather fetching will not work")
            
        if Config.SECRET_KEY == 'dev-secret-key-change-in-production' and Config.is_production():
            warnings.append("SECRET_KEY is still using default value in production")
            
        return warnings

# Export default config instance
config = Config()
