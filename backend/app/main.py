from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers.analytics import router as analytics_router
from .routers.health import router as health_router
from .routers.rewards import router as rewards_router
from .routers.transactions import router as transactions_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Spendly Rewards Backend",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS: restrict to the local dev frontend origin.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url],
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(analytics_router)
    app.include_router(transactions_router)
    app.include_router(rewards_router)

    return app


app = create_app()

