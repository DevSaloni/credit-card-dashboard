from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables.
    """

    database_url: str = Field(..., alias="DATABASE_URL")
    frontend_url: str = Field("http://localhost:3000", alias="FRONTEND_URL")

    demo_user_id: int = 1

    # Connection / pool tuning
    sqlalchemy_pool_pre_ping: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


def get_settings() -> Settings:
    # Keep this as a function so tests can re-import after env var changes.
    return Settings()

