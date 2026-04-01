from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # LLM
    llm_provider: str = "openai"  # openai | anthropic | google
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""
    openai_model: str = "gpt-4o"
    anthropic_model: str = "claude-sonnet-4-20250514"
    google_model: str = "gemini-1.5-pro"

    # Database
    database_url: str = "postgresql+asyncpg://faang_user:faang_pass_2024@localhost:5432/faang_prep"

    # YouTube
    youtube_api_key: str = ""

    # CORS
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
