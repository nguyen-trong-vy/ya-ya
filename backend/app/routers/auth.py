from fastapi import APIRouter, status
from app.schemas.user import UserRegister
from app.services.auth import register_user

router = APIRouter(prefix="/api/auth", tags=["Xác thực (Auth)"])

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Đăng ký tài khoản khách hàng mới",
    description="Nhận thông tin người dùng, kiểm tra email trùng lặp, băm mật khẩu và tạo tài khoản mới."
)
async def register(user_data: UserRegister):
    user = await register_user(user_data)
    return {
        "success": True,
        "message": "Đăng ký tài khoản thành công!",
        "user": user
    }
