# Debugging Guide for Translation App

## Quick Start for Debugging

### 1. Enable Mock Mode (Recommended for Testing)

Create `backend/.env.local` file:
```env
USE_MOCK_TRANSLATION=true
```

This allows testing without internet connection or API calls.

### 2. Check Backend Logs

The backend logs all requests and errors to the console. Look for:
- Translation requests with text preview
- Error messages with full stack traces
- Provider information (mock/google)

### 3. Enable Frontend Developer Mode

1. Click the 🔧 icon in the header
2. View detailed error information:
   - HTTP status codes
   - Full error responses
   - Network diagnostics
   - API health status

### 4. Check Browser Console

Open Developer Tools (F12) and check:
- Network tab: See API requests and responses
- Console tab: See frontend errors and API responses

## Common Issues and Solutions

### Issue: "Translation failed. Please try again."

**Steps to debug:**
1. Check backend terminal for error logs
2. Enable developer mode in frontend (🔧 icon)
3. Check browser console for detailed error
4. Check Network tab for API response

**Common causes:**
- Backend not running (check port 8000)
- Network connectivity issues
- Google Translate API rate limiting
- Invalid language selection

**Solution:**
- Enable mock mode: `USE_MOCK_TRANSLATION=true`
- Check backend logs for specific error
- Verify backend is running: `curl http://localhost:8000/api/health`

### Issue: "Cannot connect to the translation server"

**Steps to debug:**
1. Verify backend is running: `curl http://localhost:8000/`
2. Check if port 8000 is available
3. Verify CORS settings in backend
4. Check browser console for CORS errors

**Solution:**
- Start backend: `cd backend && python main.py`
- Check if another process is using port 8000
- Verify frontend URL matches CORS allowed origins

### Issue: Rate Limit Errors

**Steps to debug:**
1. Check backend logs for 429 errors
2. Wait a few moments before retrying
3. Enable mock mode for testing

**Solution:**
- Enable mock mode: `USE_MOCK_TRANSLATION=true`
- Wait before retrying
- Consider using a Google API key for higher limits

### Issue: Translation Returns Empty or Wrong Results

**Steps to debug:**
1. Check backend logs for translation results
2. Verify source language detection
3. Check if text is empty or invalid
4. Enable developer mode to see confidence scores

**Solution:**
- Check backend logs for detected language
- Verify text is not empty
- Try with different text
- Check if source and target languages are the same

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend (check API health)
- [ ] Language detection works
- [ ] Translation works with simple text ("hello")
- [ ] Translation works with different languages
- [ ] Error messages are clear and helpful
- [ ] Mock mode works when enabled
- [ ] PDF upload works
- [ ] Developer mode shows detailed errors
- [ ] Backend logs show detailed information

## Network Debugging

### Check API Health
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "mock_mode": false,
  "provider": "google",
  "has_google_key": false,
  "has_azure_key": false
}
```

### Test Translation Endpoint
```bash
curl -X POST http://localhost:8000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "hello", "target_language": "hindi"}'
```

### Test with Mock Mode
1. Set `USE_MOCK_TRANSLATION=true` in `backend/.env.local`
2. Restart backend
3. Test translation - should return mock results

## Backend Log Examples

### Successful Translation
```
INFO - Translation request: 'hello...' -> hindi
INFO - Detected source language: en
INFO - Translating from en to hi
INFO - Translation successful: 'hello...' -> 'नमस्ते...'
```

### Error Translation
```
ERROR - Translation error (HTTPException): Translation service error: ...
ERROR - Traceback: [full stack trace]
```

### Mock Mode
```
INFO - MOCK: Translating 'hello...' to hi
```

## Frontend Console Examples

### Successful Request
```javascript
Translating: {text: "hello...", targetLanguage: "hindi"}
Translation successful: {translated_text: "नमस्ते", ...}
```

### Error Request
```javascript
API Error: {status: 502, detail: "Translation service error: ...", ...}
Translation failed: {userMessage: "...", detail: "...", ...}
```

## Environment Variables

Create `backend/.env.local`:
```env
# Enable mock mode for testing
USE_MOCK_TRANSLATION=false

# Optional API keys
GOOGLE_API_KEY=
AZURE_TRANSLATOR_KEY=
AZURE_TRANSLATOR_REGION=
```

## Next Steps

1. If translation fails, enable mock mode to test the flow
2. Check backend logs for specific error messages
3. Enable developer mode in frontend for detailed errors
4. Check browser console and network tab
5. Verify backend is running and accessible
6. Test with simple text first ("hello" → Hindi)
7. Check internet connection if using Google Translate
8. Verify language selection is correct

