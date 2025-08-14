#!/usr/bin/env python3
"""
Railway startup script for weather prediction app
"""
import os
import sys
import subprocess

def main():
    print("Starting Railway deployment...")
    print(f"Current directory: {os.getcwd()}")
    
    # Change to the API directory
    api_dir = os.path.join(os.getcwd(), 'backend', 'api')
    print(f"API directory: {api_dir}")
    
    if not os.path.exists(api_dir):
        print("ERROR: backend/api directory not found!")
        sys.exit(1)
    
    # Add backend to Python path
    backend_dir = os.path.join(os.getcwd(), 'backend')
    sys.path.insert(0, backend_dir)
    sys.path.insert(0, api_dir)
    
    # Change to API directory and run the app
    os.chdir(api_dir)
    print(f"Changed to directory: {os.getcwd()}")
    
    # Import and run the Flask app
    from app import app
    
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask app on port {port}")
    
    app.run(host='0.0.0.0', port=port, debug=False)

if __name__ == '__main__':
    main()
