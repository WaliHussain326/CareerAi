from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Project Info
    PROJECT_NAME: str = "AI Career Counselling Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database - check environment first
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:090078601@localhost:5432/career_counselling")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production-min-32-chars")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Google Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Application
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        # Ensure environment variables take precedence
        extra = "ignore"

settings = Settings()
