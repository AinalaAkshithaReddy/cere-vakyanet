@echo off
echo Starting Backend Server...
cd backend
REM Upload limit: 64MB (67108864 bytes)
REM To change, edit this file or use: uvicorn main:app --limit-max-request-size <bytes>
uvicorn main:app --host 0.0.0.0 --port 8000 --limit-max-request-size 67108864

