#feat/dat-hang(07)
#feat/ho-so-va-lich-su-don(08)

from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order import create_order, get_user_orders
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

#feat/ho-so-va-lich-su-don(08)
@router.get(
    "/my-orders",
    response_model=List[OrderResponse],
    status_code=status.HTTP_200_OK,
    summary="Lấy danh sách lịch sử đơn hàng của khách hàng",
    description="Truy vấn toàn bộ các đơn hàng đã đặt của người dùng đang đăng nhập kèm chi tiết các món bánh."
)
async def list_my_orders(
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user["id"])
    return await get_user_orders(user_id=user_id)

