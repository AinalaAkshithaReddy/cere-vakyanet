# How the Translation System Works

## Overview
This document explains how the CERE-VAKYANET translation system processes and translates documents.

## System Architecture

### 1. **Frontend (React)**
- **Location**: `frontend/src/App.jsx`
- **API Endpoint**: `https://vakyanet-backend.azurewebsites.net`
- **User Flow**:
  1. User uploads a PDF/DOCX/TXT file or enters text manually
  2. Frontend sends file to `/api/upload-pdf` endpoint
  3. Backend extracts text and returns it
  4. Frontend displays extracted text
  5. User selects target language and clicks "Translate"
  6. Frontend sends text to `/api/translate` endpoint
  7. Backend translates and returns result
  8. Frontend displays translated text

### 2. **Backend (FastAPI)**
- **Location**: `backend/main.py`
- **Port**: 8000 (local) or Azure App Service (production)

## Translation Flow (Step-by-Step)

### Step 1: File Upload (`/api/upload-pdf`)
```
User uploads PDF → Backend receives file → Extract text using pdfplumber/docx → Return extracted text
```

**Process**:
1. File is received as `UploadFile`
2. File bytes are read into memory
3. Text extraction based on file type:
   - **PDF**: Uses `pdfplumber` to extract text from each page
   - **DOCX**: Uses `python-docx` to extract paragraphs and tables
   - **TXT**: Decodes with UTF-8/UTF-16/Latin-1 encoding
4. Language is auto-detected using `langdetect`
5. Extracted text is returned to frontend

### Step 2: Language Detection
```
Extracted text → langdetect.detect() → Language code (e.g., "en", "hi", "te")
```

**Process**:
- Uses `langdetect` library (based on Google's language detection)
- Detects from first 1000 characters for performance
- Returns language display name (e.g., "English", "Hindi")

### Step 3: Translation (`/api/translate`)
```
Text + Target Language → Chunk if needed → Google Translate API → Combined result
```

**Process**:
1. **Input Validation**: Checks text is not empty
2. **Language Mapping**: Converts language name to code (e.g., "hindi" → "hi")
3. **Chunking (NEW - for large texts)**:
   - If text > 4500 characters, splits into chunks
   - Splits at sentence boundaries (`.`, `!`, `?`)
   - Each chunk ≤ 4500 characters (Google limit is ~5000)
4. **Translation**:
   - Uses `deep-translator` library (Google Translate API wrapper)
   - Source: `auto` (auto-detect)
   - Target: Selected language code
   - **For large texts**: Translates each chunk separately, then combines
5. **Error Handling**:
   - Retries up to 2 times on connection/timeout errors
   - Returns user-friendly error messages
6. **Result**: Returns translated text with confidence and provider info

## Key Components

### Translation Function (`translate_text`)
- **Input**: Text string, target language name
- **Output**: Dictionary with translated text, confidence, provider
- **Features**:
  - Automatic chunking for large texts (>4500 chars)
  - Retry logic for failed requests
  - Language detection
  - Error handling with specific error codes

### Text Chunking Function (`chunk_text`)
- **Purpose**: Split large texts into smaller pieces for Google Translate
- **Method**: 
  - Splits at sentence boundaries first
  - Falls back to paragraph boundaries if needed
  - Max chunk size: 4500 characters (safe limit below Google's 5000 limit)

### Google Translate Integration
- **Library**: `deep-translator`
- **API**: Google Translate (free tier, no API key required)
- **Limitations**:
  - ~5000 characters per request
  - Rate limiting may apply with heavy usage
  - Requires internet connection

## Supported Languages

The system supports 13 Indian languages:
- Hindi (hi)
- English (en)
- Urdu (ur)
- Assamese (as)
- Bengali (bn)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Marathi (mr)
- Odia (or)
- Punjabi (pa)
- Tamil (ta)
- Telugu (te)

## Recent Fix: Large PDF Support

### Problem
- Large PDFs extract thousands of characters
- Google Translate API has ~5000 character limit per request
- Trying to translate entire text in one request caused **503 Service Unavailable** errors

### Solution
- **Implemented text chunking**: Automatically splits large texts into chunks ≤4500 characters
- **Intelligent splitting**: Splits at sentence boundaries to preserve context
- **Sequential translation**: Translates each chunk separately, then combines results
- **Rate limiting protection**: Small delays between chunks to avoid API rate limits

### How It Works Now
1. Check text length
2. If > 4500 chars: Split into chunks
3. Translate each chunk separately
4. Combine all translated chunks
5. Return complete translated text

## Error Handling

The system handles various error scenarios:

1. **503 Service Unavailable**: 
   - Usually means text is too large (now fixed with chunking)
   - Or Google Translate service is down
   - System retries automatically

2. **429 Rate Limit**:
   - Too many requests too quickly
   - System waits and retries

3. **400 Bad Request**:
   - Invalid language selection
   - Empty text
   - Unsupported file type

4. **500 Server Error**:
   - Internal processing error
   - Detailed logs for debugging

## Performance Considerations

- **Small texts (<4500 chars)**: Single API call, fast response
- **Large texts (>4500 chars)**: Multiple API calls, longer processing time
- **Chunking overhead**: ~0.5 second delay between chunks to avoid rate limits
- **Example**: 20,000 character text = ~5 chunks = ~5-10 seconds total

## Future Improvements

1. **Parallel chunk translation**: Could translate multiple chunks simultaneously (with rate limit protection)
2. **Progress updates**: Frontend could show progress for large translations
3. **Caching**: Cache translations to avoid re-translating same content
4. **Alternative APIs**: Support for Azure Translator or other services for higher limits

