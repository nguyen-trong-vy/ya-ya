#feat/dang-ky(security)-01
#feat/jwt-auth(02)
from datetime import datetime, timedelta, timezone
from typing import Optional
import bcrypt


try:
    from jose import jwt, JWTError
except ImportError:
    import jwt
    JWTError = jwt.PyJWTError

from app.core.config import settings
def hash_password(password: str) -> str:
    """
    Băm mật khẩu bằng thư viện bcrypt kèm salt ngẫu nhiên.
    """
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    So sánh mật khẩu thuần với chuỗi mật khẩu đã băm.
    """
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Tạo chuỗi JWT Bearer Token chứa payload (user_id, role, email) và thời hạn hết hạn.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """
    Giải mã và kiểm tra tính toàn vẹn của JWT Token.
    Trả về payload dict nếu token hợp lệ, ngược lại trả về None.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None