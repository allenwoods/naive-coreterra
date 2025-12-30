#!/bin/bash
# Start the FastAPI backend server

echo "Starting Coreterra Backend..."
uvicorn app.main:app --reload --port 8000

