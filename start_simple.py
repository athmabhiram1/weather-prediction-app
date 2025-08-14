#!/usr/bin/env python3
"""
SIMPLIFIED Railway startup script - NO directory changes
"""
import os
import sys

# Add ALL paths to Python path
sys.path.insert(0, '/app')
sys.path.insert(0, '/app/backend') 
sys.path.insert(0, '/app/backend/api')
sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))
sys.path.insert(0, os.path.join(os.getcwd(), 'backend', 'api'))

print(f"Python paths: {sys.path[:6]}")
print(f"Current working directory: {os.getcwd()}")

# Change to the API directory
api_path = os.path.join(os.getcwd(), 'backend', 'api')
if os.path.exists(api_path):
    os.chdir(api_path)
    print(f"Changed to: {os.getcwd()}")
else:
    print(f"Warning: {api_path} not found, staying in {os.getcwd()}")

# Import and run
try:
    from app import app
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
