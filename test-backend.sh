#!/bin/bash
echo "Testing Backend Connection..."
echo ""

echo "1. Testing health endpoint:"
curl -s http://localhost:8000/api/health | python3 -m json.tool
echo ""

echo "2. Testing root endpoint:"
curl -s http://localhost:8000/ | python3 -m json.tool
echo ""

echo "3. Testing translation endpoint:"
curl -s -X POST http://localhost:8000/api/translate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"text":"hello","target_language":"hindi"}' | python3 -m json.tool
echo ""

echo "4. Checking CORS headers:"
curl -s -I -X OPTIONS http://localhost:8000/api/translate \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" | grep -i "access-control"
echo ""

echo "5. Checking if port 8000 is listening:"
lsof -i :8000 | head -3
echo ""

echo "Test complete!"

