#!/bin/bash
echo "Starting Backend Server..."
cd backend

# Calculate upload limit from MAX_UPLOAD_SIZE_MB (default: 64MB)
MAX_MB=${MAX_UPLOAD_SIZE_MB:-64}
LIMIT_BYTES=$((MAX_MB * 1024 * 1024))

echo "Max upload size: ${MAX_MB}MB (${LIMIT_BYTES} bytes)"
uvicorn main:app --host 0.0.0.0 --port 8000 --limit-max-request-size ${LIMIT_BYTES}

