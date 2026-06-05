# Nelmani Fresh API — Dockerfile (Multi-stage)
# Stage 1: Builder
FROM python:3.11-slim AS builder

WORKDIR /app
RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Production
FROM python:3.11-slim AS production

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY src/ ./src/
COPY alembic/ ./alembic/
COPY alembic.ini .

# Create non-root user
RUN addgroup --system app && adduser --system --group app
USER app

EXPOSE 8000

# Run migrations then start server
CMD alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 2
