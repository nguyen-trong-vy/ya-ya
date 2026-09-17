#feat/dang-ky(security)-01

import bcrypt

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