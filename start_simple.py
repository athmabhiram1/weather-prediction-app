#!/usr/bin/env python3
"""
Simple Railway startup script
"""
import os
import sys

# Add all possible paths
sys.path.insert(0, '/app')
sys.path.insert(0, '/app/backend')
sys.path.insert(0, '/app/backend/api')
sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))
sys.path.insert(0, os.path.join(os.getcwd(), 'backend', 'api'))

print(f"Python paths: {sys.path[:6]}")
print(f"Current directory: {os.getcwd()}")

# Change to API directory
api_path = os.path.join(os.getcwd(), 'backend', 'api')
if os.path.exists(api_path):
    os.chdir(api_path)
    print(f"Changed to: {os.getcwd()}")

# Import and run
try:
    # Try direct import first
    from app import app
    print("✅ Successfully imported Flask app")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("🔍 Trying alternative import methods...")
    
    # Try importing from current directory
    try:
        import app as app_module
        app = app_module.app
        print("✅ Successfully imported via app module")
    except ImportError:
        print("❌ Failed to import app")
        print(f"📁 Current directory contents: {os.listdir('.')}")
        print(f"🐍 Python path: {sys.path}")
        sys.exit(1)

try:
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Starting Flask app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
except Exception as e:
    print(f"💥 Error starting app: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)