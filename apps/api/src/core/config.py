"""
Nelmani Fresh API — Application Settings
Uses pydantic-settings for type-safe environment variable management.
Provider-agnostic: works with Neon, Supabase, Railway PostgreSQL, or any standard PostgreSQL.
"""
from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ───────────────────────────────────────────────────────────
    APP_NAME: str = "Nelmani Fresh API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # ── Server ────────────────────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ── Security ──────────────────────────────────────────────────────────────
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # ── Database (Neon PostgreSQL) ────────────────────────────────────────────
    # Provider-agnostic: any postgresql+asyncpg:// URL works
    DATABASE_URL: str

    # Connection Pool settings (optimized for Neon serverless)
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800  # Recycle connections every 30 min (Neon idle timeout)

    # ── Cloudinary ────────────────────────────────────────────────────────────
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    CLOUDINARY_UPLOAD_PRESET: str = "nelmani_products"

    # ── Razorpay ─────────────────────────────────────────────────────────────
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""

    # ── CORS ─────────────────────────────────────────────────────────────────
    FRONTEND_URL: str = "http://localhost:3000"
    ADMIN_URL: str = "http://localhost:3000/admin"

    @property
    def CORS_ORIGINS(self) -> List[str]:
        origins = [self.FRONTEND_URL]
        if self.ENVIRONMENT == "development":
            origins.extend(["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"])
        return origins

    # ── Email ─────────────────────────────────────────────────────────────────
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "orders@nelmanifresh.com"
    EMAILS_FROM_NAME: str = "Nelmani Fresh"

    # ── WhatsApp ─────────────────────────────────────────────────────────────
    WHATSAPP_NUMBER: str = ""

    # ── Shiprocket (Future) ───────────────────────────────────────────────────
    SHIPROCKET_EMAIL: str = ""
    SHIPROCKET_PASSWORD: str = ""

    # ── Business Config ───────────────────────────────────────────────────────
    PROCESSING_DAYS: int = 3
    CURRENCY: str = "INR"
    FREE_SHIPPING_THRESHOLD: float = 999.0
    BASE_SHIPPING_FEE: float = 99.0


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — instantiated once per process."""
    return Settings()


settings = get_settings()
