# Troubleshooting: "Cannot connect to the translation server"

## ✅ Backend Status: RUNNING
The backend is confirmed working and accessible on port 8000.

## Quick Fixes

### 1. Refresh the Browser
- **Hard refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
- Or clear browser cache and refresh

### 2. Check Browser Console
1. Open Developer Tools (F12 or Cmd+Option+I)
2. Go to the **Console** tab
3. Look for error messages
4. Go to the **Network** tab
5. Try translating again
6. Check if requests to `http://localhost:8000` are being made
7. Check the status code of the requests

### 3. Verify Backend is Running
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Should return: {"status":"healthy",...}
```

### 4. Restart Frontend
```bash
# Stop the frontend (Ctrl+C)
# Then restart it:
cd frontend
npm run dev
```

### 5. Check Browser Security
- Some browsers block localhost connections
- Try a different browser (Chrome, Firefox, Safari)
- Disable browser extensions that might block requests

### 6. Verify Ports
```bash
# Backend should be on port 8000
lsof -i :8000

# Frontend should be on port 5173
lsof -i :5173
```

## Common Issues

### Issue: Browser shows "Cannot connect"
**Solution**: 
1. Check if backend is actually running: `curl http://localhost:8000/api/health`
2. If not running, start it: `cd backend && python3 main.py`
3. Refresh the browser

### Issue: CORS errors in console
**Solution**: 
- Backend CORS is configured correctly
- Make sure you're accessing frontend at `http://localhost:5173`
- Check browser console for specific CORS error

### Issue: Network timeout
**Solution**:
- Check your internet connection
- The backend might be slow to respond
- Try enabling mock mode for testing: `USE_MOCK_TRANSLATION=true`

### Issue: "Connection refused"
**Solution**:
- Backend is not running
- Start backend: `cd backend && python3 main.py`
- Check for port conflicts: `lsof -i :8000`

## Step-by-Step Debugging

1. **Verify Backend is Running**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Check Backend Logs**
   ```bash
   # If backend is running in terminal, check for errors
   # Or check log file if using nohup
   tail -f /tmp/backend.log
   ```

3. **Test Translation Directly**
   ```bash
   curl -X POST http://localhost:8000/api/translate \
     -H "Content-Type: application/json" \
     -d '{"text":"hello","target_language":"hindi"}'
   ```

4. **Check Frontend Console**
   - Open browser DevTools
   - Check Console for errors
   - Check Network tab for failed requests

5. **Enable Developer Mode in Frontend**
   - Click the 🔧 icon in the header
   - View detailed error information

## Still Not Working?

1. **Enable Mock Mode** (bypasses API calls):
   ```bash
   # Create backend/.env.local
   echo "USE_MOCK_TRANSLATION=true" > backend/.env.local
   # Restart backend
   ```

2. **Check Firewall/Security Software**
   - Some security software blocks localhost connections
   - Temporarily disable to test

3. **Try Different Browser**
   - Chrome, Firefox, Safari, Edge

4. **Check System Logs**
   - Look for any system-level blocking

## Test Script

Run the test script to verify everything:
```bash
./test-backend.sh
```

This will test all endpoints and verify CORS configuration.

