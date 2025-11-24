FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# System packages required for PDF/Text processing and Unicode fonts
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libjpeg62-turbo-dev \
        zlib1g-dev \
        fonts-noto-core \
        fonts-noto-cjk \
        fonts-noto-unhinted && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy backend application code
COPY . .

# Use a non-root user for security
RUN addgroup --system app && adduser --system --ingroup app app
USER app

EXPOSE 8000

# Azure App Service honors the PORT env var; default to 8000 for local use
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
