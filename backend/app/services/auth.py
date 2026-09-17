#feat/dang-ky(01)

from fastapi import HTTPException, status
from app.core.database import get_supabase
from app.core.security import hash_password
from app.schemas.user import UserRegister

async def register_user(data: UserRegister) -> dict:
    supabase = get_supabase()

    try:
        # 1. Kiểm tra email đã tồn tại hay chưa
        check_email = supabase.table("users").select("id").eq("email", data.email).execute()
        if check_email.data and len(check_email.data) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập."
            )

        # 2. Băm mật khẩu bảo mật
        hashed_pw = hash_password(data.password)

        # 3. Chèn bản ghi mới vào bảng users
        user_payload = {
            "full_name": data.full_name,
            "email": data.email,
            "password": hashed_pw,
            "phone": data.phone,
            "role": "user"
        }

        result = supabase.table("users").insert(user_payload).execute()

        if not result.data or len(result.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Không thể tạo tài khoản người dùng trong cơ sở dữ liệu."
            )

        created_user = result.data[0]
        # Loại bỏ trường password trước khi trả kết quả về client
        created_user.pop("password", None)
        return created_user

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống khi đăng ký tài khoản: {str(e)}"
        )