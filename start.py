#!/usr/bin/env python3
"""
Railway startup script for weather prediction app
"""
import os
import sys
import traceback

def main():
    try:
        print("=== RAILWAY DEPLOYMENT START ===")
        print(f"Python version: {sys.version}")
        print(f"Current directory: {os.getcwd()}")
        print(f"Contents: {os.listdir('.')}")
        
        # Add backend directories to Python path
        backend_dir = os.path.join(os.getcwd(), 'backend')
        api_dir = os.path.join(backend_dir, 'api')
        
        print(f"Backend directory: {backend_dir}")
        print(f"API directory: {api_dir}")
        
        # Check if directories exist
        if not os.path.exists(backend_dir):
            print("ERROR: backend directory not found!")
            print(f"Available directories: {[d for d in os.listdir('.') if os.path.isdir(d)]}")
            sys.exit(1)
            
        if not os.path.exists(api_dir):
            print("ERROR: backend/api directory not found!")
            print(f"Backend contents: {os.listdir(backend_dir) if os.path.exists(backend_dir) else 'N/A'}")
            sys.exit(1)
        
        # Add to Python path
        sys.path.insert(0, os.getcwd())  # Root directory
        sys.path.insert(0, backend_dir)  # Backend directory  
        sys.path.insert(0, api_dir)      # API directory
        
        print(f"Python path updated: {sys.path[:4]}")
        print(f"API directory contents: {os.listdir(api_dir)}")
        
        # Change working directory to API
        os.chdir(api_dir)
        print(f"Working directory changed to: {os.getcwd()}")
        
        # Import Flask app
        print("Importing Flask app...")
        try:
            from app import app
            print("Flask app imported successfully!")
        except ImportError as e:
            print(f"Failed to import Flask app: {e}")
            print("Trying alternative import...")
            import app as app_module
            app = app_module.app
            print("Flask app imported via alternative method!")
        
        # Get port from environment
        port = int(os.environ.get('PORT', 5000))
        print(f"Starting Flask app on 0.0.0.0:{port}")
        
        # Check if we're in production (Railway sets this)
        if os.environ.get('RAILWAY_ENVIRONMENT'):
            print("Production environment detected - using gunicorn")
            import subprocess
            cmd = f"gunicorn --bind 0.0.0.0:{port} --workers 1 --timeout 120 app:app"
            subprocess.run(cmd.split())
        else:
            print("Development environment - using Flask dev server")
            app.run(host='0.0.0.0', port=port, debug=False)
        
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        sys.exit(1)

if __name__ == '__main__':
    main()
