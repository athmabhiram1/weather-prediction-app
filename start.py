#!/usr/bin/env python3
"""
Enhanced Railway Startup Script for Weather Prediction App
- Robust path resolution
- Detailed logging
- Automatic production detection
- Multiple import fallbacks
- Health check endpoint
"""

import os
import sys
import logging
import traceback
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

class AppStarter:
    def __init__(self):
        self.port = int(os.environ.get('PORT', 5000))
        self.is_production = bool(os.environ.get('RAILWAY_ENVIRONMENT'))
        self.app = None

    def setup_paths(self):
        """Configure all required Python paths"""
        base_dir = os.getcwd()
        backend_dir = os.path.join(base_dir, 'backend')
        api_dir = os.path.join(backend_dir, 'api')
        
        logger.info("Current directory: %s", base_dir)
        logger.info("Directory contents: %s", os.listdir(base_dir))
        
        if not os.path.exists(backend_dir):
            logger.error("Backend directory not found at: %s", backend_dir)
            logger.error("Available directories: %s", 
                        [d for d in os.listdir(base_dir) if os.path.isdir(d)])
            return False
            
        if not os.path.exists(api_dir):
            logger.error("API directory not found at: %s", api_dir)
            logger.error("Backend contents: %s", 
                        os.listdir(backend_dir) if os.path.exists(backend_dir) else 'N/A')
            return False
        
        # Add to Python path (without duplicates)
        for path in [base_dir, backend_dir, api_dir]:
            if path not in sys.path:
                sys.path.insert(0, path)
        
        logger.info("Python path configured: %s", sys.path[:3])
        logger.info("API directory contents: %s", os.listdir(api_dir))
        
        # Change to API directory
        os.chdir(api_dir)
        logger.info("Working directory changed to: %s", api_dir)
        return True

    def import_app(self):
        """Attempt multiple ways to import the Flask app"""
        import_methods = [
            lambda: __import__('app').app,          # Standard import
            lambda: __import__('api.app').app,      # If nested differently
            lambda: __import__('backend.api.app').app  # Full path import
        ]
        
        for method in import_methods:
            try:
                self.app = method()
                logger.info("Successfully imported Flask app")
                return True
            except Exception as e:
                logger.debug("Import attempt failed: %s", str(e))
        
        logger.error("All import methods failed!")
        return False

    def add_health_check(self):
        """Add health check endpoint if not exists"""
        if not hasattr(self.app, 'health_checked'):
            @self.app.route('/health')
            def health_check():
                return {
                    'status': 'healthy',
                    'time': datetime.utcnow().isoformat(),
                    'version': sys.version.split()[0]
                }
            self.app.health_checked = True
            logger.info("Added health check endpoint")

    def run_production(self):
        """Run in production mode using gunicorn"""
        try:
            import gunicorn.app.base
            from gunicorn.six import iteritems
            
            class StandaloneApplication(gunicorn.app.base.BaseApplication):
                def __init__(self, app, options=None):
                    self.application = app
                    self.options = options or {}
                    super().__init__()
                
                def load_config(self):
                    config = {key: value for key, value in iteritems(self.options)
                             if key in self.cfg.settings and value is not None}
                    for key, value in iteritems(config):
                        self.cfg.set(key.lower(), value)
                
                def load(self):
                    return self.application
            
            options = {
                'bind': f'0.0.0.0:{self.port}',
                'workers': int(os.environ.get('WORKERS', 1)),
                'timeout': 120,
                'loglevel': 'info'
            }
            
            logger.info("Starting production server (gunicorn) with options: %s", options)
            StandaloneApplication(self.app, options).run()
            
        except ImportError:
            logger.warning("Gunicorn not found, falling back to Flask dev server")
            self.run_development()

    def run_development(self):
        """Run in development mode"""
        logger.info("Starting development server (Flask)")
        self.app.run(host='0.0.0.0', port=self.port, debug=False)

    def run(self):
        """Main execution flow"""
        logger.info("=== Starting Deployment ===")
        logger.info("Python version: %s", sys.version)
        logger.info("Production mode: %s", self.is_production)
        
        if not self.setup_paths():
            sys.exit(1)
            
        if not self.import_app():
            sys.exit(1)
            
        self.add_health_check()
        
        if self.is_production:
            self.run_production()
        else:
            self.run_development()

if __name__ == '__main__':
    try:
        starter = AppStarter()
        starter.run()
    except Exception as e:
        logger.critical("Fatal error: %s", str(e))
        logger.critical(traceback.format_exc())
        sys.exit(1)