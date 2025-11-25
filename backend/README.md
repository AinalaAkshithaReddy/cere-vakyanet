# Translation API Backend

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --port 8000 \
  --limit-max-request-size $((${MAX_UPLOAD_SIZE_MB:-64} * 1024 * 1024))
```

The API will be available at `http://localhost:8000`

## Configuration

- `MAX_UPLOAD_SIZE_MB` (default: 64)  
  Sets the maximum request size Uvicorn will accept, which directly controls
  how large a PDF/DOCX/TXT you can upload. Increase this value if you need to
  support larger source documents both locally (`python main.py`) and in Docker
  deployments (the Dockerfile reads the same variable).

