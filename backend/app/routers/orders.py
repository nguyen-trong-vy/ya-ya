#feat/dat-hang(07)
#feat/ho-so-va-lich-su-don(08)
#feat/quan-ly-don-hang(13)

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from app.services.order import (
    create_order,
    get_user_orders,
    get_admin_orders,
    confirm_order_payment_service,
    update_order_status_service
)
from app.dependencies import get_current_user, require_admin

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

#feat/quan-ly-don-hang(13)
@router.get(
    "",
    response_model=List[OrderResponse],
    status_code=status.HTTP_200_OK,
    summary="Tính năng 4.2: Admin xem toàn bộ danh sách đơn hàng",
    description="Yêu cầu quyền Quản trị viên (admin). Hỗ trợ lọc theo order_status và payment_status."
)
async def list_admin_orders(
    order_status: Optional[str] = Query(None, description="Lọc theo trạng thái đơn: PENDING, CONFIRMED, DELIVERING, COMPLETED, CANCELLED"),
    payment_status: Optional[str] = Query(None, description="Lọc theo trạng thái thanh toán: UNPAID, PAID"),
    current_admin: dict = Depends(require_admin)
):
    return await get_admin_orders(order_status=order_status, payment_status=payment_status)

#feat/quan-ly-don-hang(13)
@router.patch(
    "/{order_id}/status",
    response_model=OrderResponse,
    status_code=status.HTTP_200_OK,
    summary="Tính năng 4.2: Admin cập nhật trạng thái đơn hàng",
    description="Yêu cầu quyền Quản trị viên. Cập nhật order_status (PENDING, CONFIRMED, DELIVERING, COMPLETED, CANCELLED)."
)
async def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    current_admin: dict = Depends(require_admin)
):
    return await update_order_status_service(order_id=order_id, new_status=payload.order_status)

#feat/quan-ly-don-hang(13)
@router.put(
    "/{order_id}/confirm-payment",
    response_model=OrderResponse,
    status_code=status.HTTP_200_OK,
    summary="Tính năng 4.3: Admin xác nhận đã nhận tiền khi gặp mặt (Confirm Payment)",
    description="Yêu cầu quyền Quản trị viên. Đánh dấu payment_status='PAID', order_status='COMPLETED', paid_at=NOW(). Đơn hàng chính thức ghi nhận doanh thu."
)
async def confirm_payment(
    order_id: str,
    current_admin: dict = Depends(require_admin)
):
    return await confirm_order_payment_service(order_id=order_id)

