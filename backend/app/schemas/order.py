#feat/dat-hang(07)

from typing import List, Optional
from pydantic import BaseModel, Field

class OrderItemCreate(BaseModel):
    product_id: Optional[str] = None
    product_slug: Optional[str] = None
    product_name: str = Field(..., min_length=1, max_length=200, description="Tên sản phẩm bánh")
    unit_price: float = Field(..., ge=0, description="Đơn giá bánh tại thời điểm đặt")
    quantity: int = Field(..., gt=0, description="Số lượng đặt mua")

class OrderCreate(BaseModel):
    recipient_name: str = Field(..., min_length=2, max_length=100, description="Họ tên người nhận bánh")
    recipient_phone: str = Field(..., min_length=8, max_length=15, description="Số điện thoại liên hệ")
    recipient_email: Optional[str] = Field(None, description="Email nhận thông báo đơn hàng")
    delivery_address: str = Field(..., min_length=5, max_length=300, description="Địa chỉ giao bánh chi tiết")
    delivery_date: str = Field(..., description="Ngày giao bánh (YYYY-MM-DD)")
    delivery_time_slot: str = Field(..., description="Khung giờ giao bánh")
    greeting_card_message: Optional[str] = Field(None, max_length=250, description="Lời chúc thiệp tặng kèm")
    items: List[OrderItemCreate] = Field(..., min_items=1, description="Danh sách các món bánh trong đơn")

class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    product_id: Optional[str] = None
    product_name: str
    unit_price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    recipient_name: str
    recipient_phone: str
    recipient_email: Optional[str] = None
    delivery_address: str
    delivery_date: str
    delivery_time_slot: str
    greeting_card_message: Optional[str] = None
    payment_method: str = "DIRECT_MEETUP"
    payment_status: str = "UNPAID"
    order_status: str = "PENDING"
    total_amount: float
    paid_at: Optional[str] = None
    created_at: Optional[str] = None
    items: Optional[List[OrderItemResponse]] = None

    class Config:
        from_attributes = True
