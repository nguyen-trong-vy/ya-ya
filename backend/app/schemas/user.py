#feat/dang-ky(schemas)-01
#feat/dang-nhap(03)
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    """
    Schema kiểm tra dữ liệu đầu vào khi người dùng đăng ký tài khoản.
    """
    full_name: str = Field(..., min_length=2, max_length=100, description="Họ và tên đầy đủ")
    email: EmailStr = Field(..., description="Địa chỉ email hợp lệ")
    password: str = Field(..., min_length=6, max_length=100, description="Mật khẩu tối thiểu 6 ký tự")
    phone: Optional[str] = Field(None, max_length=15, description="Số điện thoại liên hệ")

class UserResponse(BaseModel):
    """
    Schema dữ liệu người dùng an toàn trả về cho Client (không chứa password)
    """
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str = "user"
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

# Schema phục vụ Đăng nhập & Xác thực JWT Token
class UserLogin(BaseModel):
    """Schema kiểm tra dữ liệu đầu vào khi người dùng đăng nhập."""
    email: EmailStr = Field(..., description="Email tài khoản")
    password: str = Field(..., min_length=1, description="Mật khẩu đăng nhập")

class LoginResponse(BaseModel):
    """Schema dữ liệu trả về sau khi đăng nhập thành công."""
    token: str = Field(..., description="JWT Bearer Token")
    token_type: str = Field(default="bearer", description="Loại token")
    user: UserResponse = Field(..., description="Thông tin người dùng")