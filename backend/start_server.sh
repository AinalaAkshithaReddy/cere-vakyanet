#!/bin/bash
# Helper script to start the backend server
# This script will kill any existing process on port 8000 and start a fresh server

echo "🚀 Starting CERE-VAKYANET Backend Server..."

# Kill any existing process on port 8000
if lsof -ti :8000 > /dev/null 2>&1; then
    echo "⚠️  Port 8000 is in use. Killing existing process..."
    kill -9 $(lsof -ti :8000) 2>/dev/null
    sleep 1
    echo "✅ Port 8000 is now free"
fi

# Start the server
echo "📍 Starting server on http://localhost:8000"
echo "   Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")"
python3 main.py

