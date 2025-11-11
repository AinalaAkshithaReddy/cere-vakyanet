# Multi-Language Translation App

A full-stack web application for translating text and PDF documents to 13 Indian languages using FastAPI (backend) and React with Vite + TailwindCSS (frontend).

## Features

- 📝 Manual text input or PDF file upload
- 🔍 Automatic language detection
- 🌐 Translation to 13 languages:
  - Hindi, English, Urdu, Assamese, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu
- 📄 PDF text extraction and generation
- 📥 Support for PDF, DOCX, and TXT file uploads
- 📤 Download translated text as PDF
- 🔤 Enhanced Telugu font rendering with proper Unicode fonts
- 🎨 Modern, responsive UI with TailwindCSS
- ⚡ Fast and efficient translation using Google Translate API
- 🐛 Enhanced error handling with detailed error messages
- 🧪 Mock translation mode for testing (no API calls required)
- 📊 Confidence scores and provider information
- 🔧 Developer mode for debugging
- 📝 Comprehensive logging and error tracking

## Tech Stack

### Backend
- Python 3.8+
- FastAPI
- Deep Translator (Google Translate API)
- pdfplumber (PDF text extraction)
- langdetect (Language detection)

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
# On macOS/Linux, use pip3 if pip is not available
pip3 install -r requirements.txt
# Or if pip works:
pip install -r requirements.txt
```

4. (Optional) Configure environment variables:
```bash
# Create .env.local file in the backend directory
cp .env.local.example .env.local
# Edit .env.local to configure:
# - USE_MOCK_TRANSLATION: Set to "true" for mock mode (no API calls)
# - GOOGLE_API_KEY: Optional Google API key
# - AZURE_TRANSLATOR_KEY: Optional Azure Translator key
```

5. Run the FastAPI server:
```bash
python main.py
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Start the backend server (port 8000)
2. Start the frontend development server (port 5173)
3. Open your browser and navigate to `http://localhost:5173`
4. Enter text in the input box or upload a PDF file
5. The app will automatically detect the language
6. Select your target language from the dropdown
7. Click "Translate" to get the translated text

## API Endpoints

- `GET /` - Health check
- `GET /api/health` - Detailed health check with configuration status
- `POST /api/detect-language` - Detect language of input text
- `POST /api/translate` - Translate text to target language
- `POST /api/translate-paragraphs` - Translate multiple paragraphs with IDs and confidence scores
- `POST /api/upload-pdf` - Upload and extract text from PDF, DOCX, or TXT files
- `POST /api/translate-pdf` - Upload PDF, DOCX, or TXT and translate directly
- `POST /api/download-pdf` - Generate and download translated text as PDF

## Project Structure

```
cerevakya/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # TailwindCSS styles
│   ├── index.html
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # TailwindCSS configuration
│   └── postcss.config.js
└── README.md
```

## Configuration

### Environment Variables

Create a `.env.local` file in the `backend/` directory with the following options:

```env
# Enable mock translation mode for testing (true/false)
USE_MOCK_TRANSLATION=false

# Google Translate API Key (optional - deep-translator works without it)
GOOGLE_API_KEY=

# Azure Translator API Key (optional - for future Azure integration)
AZURE_TRANSLATOR_KEY=
AZURE_TRANSLATOR_REGION=
```

### Mock Mode

Set `USE_MOCK_TRANSLATION=true` in `.env.local` to enable mock translation mode. This is useful for:
- Testing without internet connection
- Avoiding API rate limits
- Development and debugging

## Error Handling & Debugging

### Frontend Developer Mode

Click the 🔧 icon in the header to enable developer mode. This shows:
- Detailed error messages from the backend
- HTTP status codes
- Full error responses
- Network error diagnostics
- API health status

### Backend Logging

The backend logs all requests and errors to the console with:
- Request details (text, target language)
- Translation status and results
- Detailed error messages and stack traces
- Provider information (mock/google)

### Common Errors

1. **"Cannot connect to the translation server"**
   - Ensure the backend is running on port 8000
   - Check if the backend process is running: `ps aux | grep python`
   - Verify CORS settings if accessing from a different origin

2. **"Translation rate limit exceeded"**
   - Wait a few moments before trying again
   - Enable mock mode for testing: `USE_MOCK_TRANSLATION=true`

3. **"Translation service is temporarily unavailable"**
   - Check your internet connection
   - The Google Translate service may be down
   - Try enabling mock mode for testing

4. **"Translation service error"**
   - Check backend logs for detailed error information
   - Verify the text is not empty
   - Ensure the target language is supported

## Troubleshooting

- **Frontend can't connect to backend**: Ensure the backend is running on port 8000
- **PDF upload fails**: Ensure the file is a valid PDF
- **Translation fails**: 
  - Check your internet connection (Google Translate API requires internet)
  - Enable mock mode for testing: `USE_MOCK_TRANSLATION=true`
  - Check browser console and backend logs for detailed error messages
  - Enable developer mode in the frontend (🔧 icon) to see detailed errors
- **Rate limiting issues**: Enable mock mode or wait before retrying
- **Missing environment variables**: Create `.env.local` file in the backend directory

## Telugu Font Support & PDF Generation

The application includes enhanced support for Telugu text rendering in generated PDFs:

### Font Support
- **Automatic Detection**: Telugu text is automatically detected in translated content
- **Font Priority**:
  1. Noto Sans Telugu Bold (if available)
  2. Noto Sans Telugu Regular (if available)
  3. Arial Unicode MS (default on macOS - excellent Telugu support)
  4. Other system Unicode fonts

### Enhanced Styling for Telugu
- **Font Size**: 13pt (larger than default 11pt for better readability)
- **Line Spacing**: 18pt (increased for clarity)
- **Font Weight**: Bold styling when available

### Installing Noto Sans Telugu (Optional)

If you prefer Noto Sans Telugu over Arial Unicode MS:

1. **Automatic Download** (may not work due to CDN restrictions):
   ```bash
   cd backend
   python3 download_telugu_fonts.py
   ```

2. **Manual Download**:
   - Visit: https://fonts.google.com/noto/specimen/Noto+Sans+Telugu
   - Download Regular and Bold variants
   - Place fonts in: `backend/fonts/`
     - `NotoSansTelugu-Regular.ttf`
     - `NotoSansTelugu-Bold.ttf`
   - Restart the backend server

### PDF Generation Features
- Unicode-compatible fonts for all Indian scripts
- Proper text encoding and character rendering
- Support for Telugu, Hindi, Tamil, and other Indian languages
- Clean, readable PDF output with proper formatting

## Notes

- The app uses Google Translate API via the `deep-translator` library (free, no API key required for basic usage)
- PDF files are processed using `pdfplumber` for text extraction
- DOCX files are processed using `python-docx` for text extraction
- TXT files support multiple encodings (UTF-8, Latin-1, etc.)
- PDFs are generated using `reportlab` with Unicode font support
- Language detection uses the `langdetect` library
- CORS is configured to allow frontend-backend communication
- All errors are logged with detailed information for debugging
- Mock mode allows testing without external API calls
- Telugu text is rendered with enhanced styling (larger font, increased spacing) for optimal readability

