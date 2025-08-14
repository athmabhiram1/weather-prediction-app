#!/usr/bin/env python3
"""
Enhanced Railway startup script with:
- Better path resolution
- Configurable logging
- Health check endpoint
- Worker count configuration
"""
import os
import sys
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def configure_paths():
    """Configure all possible Python paths"""
    base_paths = [
        '/app',
        '/app/backend',
        '/app/backend/api',
        os.getcwd(),
        os.path.join(os.getcwd(), 'backend'),
        os.path.join(os.getcwd(), 'backend', 'api')
    ]
    
    for path in base_paths:
        if path not in sys.path and os.path.exists(path):
            sys.path.insert(0, path)
    
    logger.info("Configured Python paths: %s", sys.path[:6])

def change_to_api_dir():
    """Change to API directory if exists"""
    api_path = os.path.join(os.getcwd(), 'backend', 'api')
    if os.path.exists(api_path):
        os.chdir(api_path)
        logger.info("Changed working directory to: %s", api_path)
    else:
        logger.warning("API directory not found at: %s", api_path)

def run_application():
    """Run the Flask application"""
    try:
        from app import app
        
        # Add health check endpoint if not exists
        if not hasattr(app, 'health_checked'):
            @app.route('/health')
            def health_check():
                return {'status': 'healthy', 'time': datetime.utcnow().isoformat()}
            app.health_checked = True
        
        port = int(os.environ.get('PORT', 5000))
        workers = int(os.environ.get('WORKERS', 1))
        
        logger.info("Starting application on port %d with %d workers", port, workers)
        app.run(host='0.0.0.0', port=port, debug=False)
        
    except Exception as e:
        logger.error("Failed to start application: %s", str(e))
        logger.error(traceback.format_exc())
        sys.exit(1)

if __name__ == '__main__':
    logger.info("Starting application at %s", datetime.utcnow().isoformat())
    configure_paths()
    change_to_api_dir()
    run_application()