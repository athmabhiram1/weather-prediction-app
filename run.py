#!/bin/bash
# Simple startup script for Render
echo "Starting Flask application..."
cd backend/api
export PYTHONPATH=$PYTHONPATH:/opt/render/project/src:/opt/render/project/src/backend
python app.py
