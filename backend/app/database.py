from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .config import get_settings


def create_sessionmaker(database_url: str, pool_pre_ping: bool = True):
    engine = create_engine(
        database_url,
        pool_pre_ping=pool_pre_ping,
        # echo can be toggled via SQLAlchemy standard env var settings if desired.
    )
    return engine, sessionmaker(bind=engine, autocommit=False, autoflush=False)


# Module-level singletons for the app process.
settings = get_settings()
engine, SessionLocal = create_sessionmaker(
    settings.database_url,
    pool_pre_ping=settings.sqlalchemy_pool_pre_ping,
)

