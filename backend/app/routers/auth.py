from fastapi import APIRouter,Depends, status
from app.schemas.user import UserRegister , UserResponse
from app.services.auth import register_user
from app.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/auth", tags=["Xác thực (Auth)"])
#feat/dang-ky(01)
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

#feat/jwt-auth(02)
# Endpoint lấy thông tin người dùng từ JWT Token
@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Lấy thông tin tài khoản đang đăng nhập",
    description="Sử dụng JWT Bearer Token để lấy thông tin chi tiết của người dùng hiện tại."
)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Endpoint kiểm tra phân quyền Quản trị viên
@router.get(
    "/admin-only",
    status_code=status.HTTP_200_OK,
    summary="Kiểm tra quyền Quản trị viên (Admin Only)",
    description="Chỉ chấp nhận token có role 'admin'. Nếu không sẽ trả về HTTP 403 Forbidden."
)
async def admin_only_test(admin_user: dict = Depends(require_admin)):
    return {
        "success": True,
        "message": "Xác thực thành công: Bạn có toàn quyền Quản trị viên!",
        "admin": admin_user
    }