#feat/jwt-auth(02)


from fastapi import Header, HTTPException, status
from app.core.security import decode_access_token
from app.core.database import get_supabase

async def get_current_user(authorization: str = Header(None)) -> dict:
    """
    Dependency trích xuất và xác thực thông tin người dùng từ JWT Bearer Token.
    Được sử dụng để bảo vệ các Protected Routes.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Chưa đăng nhập hoặc thiếu Bearer Token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Tách tiền tố Bearer
    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Định dạng Authorization Header không hợp lệ (Phải là: Bearer <token>).",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không chứa thông tin định danh người dùng.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Truy vấn người dùng từ CSDL Supabase
    supabase = get_supabase()
    res = supabase.table("users").select("id, full_name, email, phone, role, created_at").eq("id", user_id).execute()
    if not res.data or len(res.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Người dùng không tồn tại hoặc đã bị khóa tài khoản.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return res.data[0]

async def require_admin(authorization: str = Header(None)) -> dict:
    """
    Dependency kiểm tra quyền Quản trị viên (Admin).
    """
    user = await get_current_user(authorization)
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện thao tác này (Yêu cầu quyền Quản trị viên)."
        )
    return user