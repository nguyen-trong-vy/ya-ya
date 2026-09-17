#feat/cau-hinh-nen-tang(00)
#ket noi supabase

from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

_supabase_client: Optional[Client] = None

def get_supabase() -> Client:
    """
    Lấy instance kết nối Supabase Client (Singleton).
    """
    global _supabase_client
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY or "your-project" in settings.SUPABASE_URL:
            print("[CẢNH BÁO] Chưa cấu hình SUPABASE_URL hoặc SUPABASE_KEY hợp lệ trong file backend/.env")
        try:
            _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        except Exception as e:
            print(f"[LỖI KẾT NỐI SUPABASE] {e}")
            raise e
    return _supabase_client