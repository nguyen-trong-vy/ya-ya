#feat/dang-ky(01)
#feat/dang-nhap(03)

from fastapi import HTTPException, status
from app.core.database import get_supabase
from app.core.security import hash_password , verify_password , create_access_token
from app.schemas.user import UserRegister,UserLogin

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

async def login_user(data: UserLogin) -> dict:
    """
    Nghiệp vụ đăng nhập người dùng:
    1. Tìm kiếm người dùng theo email trong bảng users.
    2. Kiểm tra mật khẩu bằng verify_password().
    3. Nếu hợp lệ, sinh chuỗi JWT Token chứa sub (id), email, role.
    4. Trả về token và dữ liệu người dùng (đã loại bỏ password).
    """
    supabase = get_supabase()

    try:
        # 1. Tìm user theo email
        res = supabase.table("users").select("*").eq("email", data.email).execute()
        if not res.data or len(res.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email hoặc mật khẩu không chính xác.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = res.data[0]

        # 2. So khớp mật khẩu đã băm
        stored_password = user.get("password") or ""
        if not verify_password(data.password, stored_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email hoặc mật khẩu không chính xác.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # 3. Tạo JWT Token
        token_payload = {
            "sub": str(user["id"]),
            "email": user["email"],
            "role": user.get("role", "user"),
        }
        token = create_access_token(data=token_payload)

        # 4. Loại bỏ các trường nhạy cảm trước khi trả về
        user.pop("password", None)
        user.pop("reset_token", None)
        user.pop("reset_token_expiry", None)

        return {
            "token": token,
            "token_type": "bearer",
            "user": user,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR login_user] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống khi đăng nhập: {str(e)}"
        )



    