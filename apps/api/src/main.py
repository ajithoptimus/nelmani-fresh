"""
Nelmani Fresh API — FastAPI Application Factory
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import logging

from src.core.config import settings
from src.auth.router import router as auth_router
from src.products.router import router as products_router
from src.orders.router import router as orders_router
from src.payments.router import router as payments_router
from src.routers import (
    cart_router,
    address_router,
    review_router,
    blog_router,
    uploads_router,
    admin_router,
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown lifecycle."""
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    yield
    logger.info("🛑 Shutting down Nelmani Fresh API")


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Nelmani Fresh — Freshly Processed Kerala Heritage Rice",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # ── Middleware ─────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Total-Count"],
    )

    # ── Static Files ───────────────────────────────────────────────────────────
    uploads_dir = Path("public/uploads")
    uploads_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/api/v1/uploads", StaticFiles(directory="public/uploads"), name="uploads")

    # ── Health Check ───────────────────────────────────────────────────────────
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"status": "healthy", "version": settings.APP_VERSION}

    @app.get("/", tags=["Root"])
    async def root():
        return {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "tagline": "Freshly Processed Kerala Heritage Rice",
        }

    # ── API v1 Routers ─────────────────────────────────────────────────────────
    API_PREFIX = "/api/v1"

    app.include_router(auth_router, prefix=API_PREFIX)
    app.include_router(products_router, prefix=API_PREFIX)
    app.include_router(orders_router, prefix=API_PREFIX)
    app.include_router(payments_router, prefix=API_PREFIX)
    app.include_router(cart_router, prefix=API_PREFIX)
    app.include_router(address_router, prefix=API_PREFIX)
    app.include_router(review_router, prefix=API_PREFIX)
    app.include_router(blog_router, prefix=API_PREFIX)
    app.include_router(uploads_router, prefix=API_PREFIX)
    app.include_router(admin_router, prefix=API_PREFIX)

    return app


app = create_application()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
