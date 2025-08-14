#!/usr/bin/env python3
"""
Universal startup script for the Weather Prediction App on Railway.
Handles various deployment scenarios and path configurations.
"""
import os
import sys
import subprocess

def log(message):
    """Simple logging function."""
    print(f"[STARTUP] {message}")

def main():
    """Main startup logic."""
    log("Starting Weather Prediction App startup script...")
    
    # --- 1. Diagnostic Information ---
    log("--- Environment Diagnostics ---")
    log(f"Python executable: {sys.executable}")
    log(f"Python version: {sys.version}")
    log(f"Current working directory: {os.getcwd()}")
    log(f"PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not set')}")
    log(f"PORT environment variable: {os.environ.get('PORT', 'Not set (defaulting to 5000)')}")
    
    repo_root = os.getcwd()
    backend_api_path = os.path.join(repo_root, 'backend', 'api')
    log(f"Expected backend/api path: {backend_api_path}")
    log(f"backend/api exists: {os.path.exists(backend_api_path)}")

    # List contents of relevant directories for debugging
    try:
        log(f"Root directory contents: {os.listdir(repo_root)}")
    except Exception as e:
        log(f"Could not list root directory: {e}")

    if os.path.exists(backend_api_path):
        try:
            log(f"backend/api directory contents: {os.listdir(backend_api_path)}")
        except Exception as e:
            log(f"Could not list backend/api directory: {e}")
    else:
        log("CRITICAL: backend/api directory NOT FOUND!")
        # Sometimes the repo structure is different, e.g., if root_dir is set in Railway
        # Let's check if we are already inside backend/api
        current_dir = os.getcwd()
        if os.path.basename(current_dir) == 'api' and os.path.basename(os.path.dirname(current_dir)) == 'backend':
             log("It seems we are already inside backend/api. Proceeding...")
             backend_api_path = current_dir
        else:
             log("Cannot determine correct path. Exiting.")
             sys.exit(1)


    # --- 2. Ensure Dependencies are Installed ---
    # This is a safeguard. Ideally, Nixpacks/Railway should handle this,
    # but this can help if requirements.txt is in a non-standard place or if pip fallback is needed.
    # Note: This might still fail in a strict Nix environment.
    requirements_path = os.path.join(backend_api_path, 'requirements.txt')
    if os.path.exists(requirements_path):
        log(f"Found requirements.txt at {requirements_path}")
        # Attempt to install. This might be blocked by Nix.
        # A better way is to ensure Nixpacks installs them, but this is a fallback.
        # Comment this out if it causes issues.
        # log("Attempting to install/update dependencies with pip...")
        # try:
        #     subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', requirements_path])
        #     log("Dependencies installed/updated successfully.")
        # except subprocess.CalledProcessError as e:
        #     log(f"Warning: Failed to install dependencies via pip: {e}. This might be okay if Nix handled it.")
        # except FileNotFoundError:
        #     log("Warning: 'pip' command not found. Assuming dependencies are managed by Nix.")
    else:
        log(f"Warning: requirements.txt not found at {requirements_path}")


    # --- 3. Set up Python Path ---
    log("--- Setting up Python Path ---")
    # Add the backend/api directory to the Python path so modules can be imported.
    if backend_api_path not in sys.path:
        sys.path.insert(0, backend_api_path)
        log(f"Added {backend_api_path} to sys.path")
    else:
        log(f"{backend_api_path} already in sys.path")


    # --- 4. Change Working Directory ---
    log("--- Changing Working Directory ---")
    log(f"Changing directory to: {backend_api_path}")
    os.chdir(backend_api_path)
    log(f"New working directory: {os.getcwd()}")


    # --- 5. Import and Run the Application ---
    log("--- Importing and Running Flask App ---")
    try:
        log("Attempting to import 'app' module...")
        import app
        flask_app = getattr(app, 'app', None) # Get the 'app' object from the module
        if flask_app:
            log("✅ Successfully imported Flask app object.")
        else:
            log("❌ Could not find 'app' object in 'app' module. Checking for alternative names...")
            # Sometimes the WSGI app object has a different name
            # Check common names
            for attr_name in ['application', 'wsgi_app']:
                flask_app = getattr(app, attr_name, None)
                if flask_app:
                    log(f"✅ Found WSGI app object named '{attr_name}'.")
                    break
            if not flask_app:
                raise AttributeError("Could not find a Flask app object (tried 'app', 'application', 'wsgi_app').")

    except ModuleNotFoundError as e:
        log(f"❌ Failed to import 'app' module: {e}")
        log("This usually means the Python path is wrong or the module file is missing.")
        # Provide extensive debugging info
        log("--- DEBUG INFO ---")
        log(f"sys.path: {sys.path}")
        log(f"Contents of current directory ({os.getcwd()}): {os.listdir('.')}")
        log("------------------")
        sys.exit(1)
    except AttributeError as e:
        log(f"❌ {e}")
        sys.exit(1)
    except Exception as e:
        log(f"💥 Unexpected error during import: {e}")
        import traceback
        log(traceback.format_exc())
        sys.exit(1)

    # --- 6. Start the Server ---
    try:
        port = int(os.environ.get('PORT', 5000))
        log(f"🚀 Starting Flask development server on 0.0.0.0:{port}")
        # It's generally recommended to use a WSGI server like Gunicorn for production,
        # but for a simple Railway deployment, the built-in server can work.
        # Ensure debug=False for security.
        flask_app.run(host='0.0.0.0', port=port, debug=False)
    except KeyboardInterrupt:
        log("Received interrupt signal, shutting down gracefully.")
    except Exception as e:
        log(f"💥 Error starting Flask server: {e}")
        import traceback
        log(traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    main()