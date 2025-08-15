#!/bin/bash
echo "Starting Weather Prediction API..."
echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"
echo "Files in current directory:"
ls -la

# Set Python path to include our project directories
export PYTHONPATH="/opt/render/project/src:/opt/render/project/src/backend:/opt/render/project/src/backend/api:$PYTHONPATH"

# Change to the API directory
cd backend/api

echo "Changed to: $(pwd)"
echo "Files in API directory:"
ls -la

# Start the application
exec gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120 --log-level info
