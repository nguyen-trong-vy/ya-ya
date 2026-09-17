#feat/cau-hinh-nen-tang(00)


import os
import json
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE)

class Settings:
    PROJECT_NAME: str = "Tiệm Bánh Của Vy API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Supabase credentials
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_STORAGE_BUCKET: str = os.getenv("SUPABASE_STORAGE_BUCKET", "cake-images")
    
    # JWT Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_jwt_key_yuu_cake_2026_change_me")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    
    # CORS Origins
    _cors_raw = os.getenv("CORS_ORIGINS", '["http://localhost:5173", "http://127.0.0.1:5173"]')
    try:
        CORS_ORIGINS: list = json.loads(_cors_raw)
    except Exception:
        CORS_ORIGINS: list = ["http://localhost:5173", "http://127.0.0.1:5173"]

settings = Settings()