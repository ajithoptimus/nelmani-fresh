from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
import os

# We'll expect the Synthara Vision Brain to send this header
API_KEY_HEADER = APIKeyHeader(name="X-Synthara-Token", auto_error=True)

# In production, this should be in the .env file.
# We fallback to a default for local development.
SYNTHARA_WEBHOOK_SECRET = os.getenv("SYNTHARA_WEBHOOK_SECRET", "super_secret_synthara_token")

async def require_synthara_token(api_key: str = Security(API_KEY_HEADER)):
    """
    Validates that the incoming webhook request is genuinely from Synthara Vision.
    Bypasses standard JWT user auth since this is Machine-to-Machine.
    """
    if api_key != SYNTHARA_WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Synthara Webhook Token",
        )
    return True
