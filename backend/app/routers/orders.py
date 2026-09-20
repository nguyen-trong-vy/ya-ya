#feat/dat-hang(07)

from fastapi import APIRouter, Depends, status
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order import create_order
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Đơn hàng (Orders)"])

@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Khách đặt đơn hàng mới (Thanh toán trực tiếp khi gặp mặt)",
    description="Nhận thông tin người nhận, ngày giao, khung giờ, thiệp chúc và mảng sản phẩm. Xác thực qua JWT và lưu vào bảng orders + order_items."
)
async def create_new_order(
    order_data: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user["id"])
    return await create_order(user_id=user_id, data=order_data)
