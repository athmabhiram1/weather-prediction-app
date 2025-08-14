#!/bin/bash
echo "Starting Weather Prediction API..."
cd backend/api
export PYTHONPATH="${PYTHONPATH}:$(pwd):$(pwd)/..:$(pwd)/../.."
exec gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120
