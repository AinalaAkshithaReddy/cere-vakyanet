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
RUN pip install --upgrade --no-cache-dir -r requirements.txt

# Copy backend application code
COPY . .

# Use a non-root user for security and ensure writable application directories
RUN addgroup --system app && adduser --system --ingroup app app && chown -R app:app /app
USER app

EXPOSE 8000

# Azure App Service honors the PORT env var; default to 8000 for local use
# Allow overriding max upload size via MAX_UPLOAD_SIZE_MB (defaults to 64MB)
# CMD ["sh", "-c", "MAX_MB=${MAX_UPLOAD_SIZE_MB:-64}; case \"${MAX_MB}\" in ''|*[!0-9]*) echo \"Invalid MAX_UPLOAD_SIZE_MB '${MAX_MB}', defaulting to 64\" >&2; MAX_MB=64;; esac; LIMIT_BYTES=$((MAX_MB * 1024 * 1024)); uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --limit-max-request-size ${LIMIT_BYTES}"]
CMD ["sh", "-c", \
"if uvicorn --help | grep -q limit-max-request-size; then \
    EXTRA_FLAG=\"--limit-max-request-size $LIMIT_BYTES\"; \
else \
    EXTRA_FLAG=\"\"; \
fi; \
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} $EXTRA_FLAG"]
