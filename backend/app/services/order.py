#feat/dat-hang(07)
#feat/ho-so-va-lich-su-don(08)
#feat/quan-ly-don-hang(13)

from datetime import datetime, timezone
import uuid
from typing import List, Optional
from fastapi import HTTPException, status
from app.core.database import get_supabase
from app.schemas.order import OrderCreate

def is_valid_uuid(val: str) -> bool:
    try:
        uuid.UUID(str(val))
        return True
    except (ValueError, TypeError):
        return False

async def create_order(user_id: str, data: OrderCreate) -> dict:
    """
    Nghiệp vụ Tạo Đơn hàng mới (Thanh toán trực tiếp khi gặp mặt - DIRECT_MEETUP):
    1. Kiểm tra giỏ hàng có sản phẩm không.
    2. Tính tổng tiền đơn hàng (chấp nhận mọi đơn hàng có giá trị > 0đ).
    3. INSERT vào bảng public.orders (payment_method='DIRECT_MEETUP', status='PENDING', payment_status='UNPAID').
    4. Bulk INSERT các món bánh vào bảng public.order_items.
    5. Trả về thông tin đơn hàng hoàn chỉnh.
    """
    supabase = get_supabase()

    # 1. Kiểm tra danh sách món
    if not data.items or len(data.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Giỏ hàng của bạn đang trống, vui lòng chọn ít nhất 1 món bánh."
        )

    # 2. Tính tổng tiền
    total_amount = sum(item.unit_price * item.quantity for item in data.items)

    # Kiểm tra tổng giá trị đơn hàng hợp lệ
    if total_amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tổng giá trị đơn hàng phải lớn hơn 0đ."
        )

    try:
        # 3. Tạo bản ghi trong bảng public.orders
        order_payload = {
            "user_id": user_id,
            "recipient_name": data.recipient_name,
            "recipient_phone": data.recipient_phone,
            "recipient_email": data.recipient_email,
            "delivery_address": data.delivery_address,
            "delivery_date": data.delivery_date,
            "delivery_time_slot": data.delivery_time_slot,
            "greeting_card_message": data.greeting_card_message,
            "payment_method": "DIRECT_MEETUP",
            "payment_status": "UNPAID",
            "order_status": "PENDING",
            "total_amount": total_amount
        }

        order_res = supabase.table("orders").insert(order_payload).execute()
        if not order_res.data or len(order_res.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Không thể tạo đơn hàng trong cơ sở dữ liệu."
            )

        new_order = order_res.data[0]
        order_id = str(new_order["id"])

        # 4. Chuẩn bị dữ liệu cho bảng order_items
        order_items_payload = []
        for item in data.items:
            prod_id = str(item.product_id) if (item.product_id and is_valid_uuid(item.product_id)) else None

            # Nếu product_id chưa phải UUID hợp lệ, tra cứu qua slug
            if not prod_id and item.product_slug:
                try:
                    p_query = supabase.table("products").select("id").eq("slug", item.product_slug).execute()
                    if p_query.data and len(p_query.data) > 0:
                        prod_id = str(p_query.data[0]["id"])
                except Exception:
                    pass

            order_items_payload.append({
                "order_id": order_id,
                "product_id": prod_id,
                "product_name": item.product_name,
                "unit_price": item.unit_price,
                "quantity": item.quantity,
                "subtotal": item.unit_price * item.quantity
            })

        items_res = supabase.table("order_items").insert(order_items_payload).execute()
        new_order["items"] = items_res.data or []

        return new_order

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR create_order] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống khi tạo đơn hàng: {str(e)}"
        )

#feat/ho-so-va-lich-su-don(08)
async def get_user_orders(user_id: str) -> List[dict]:
    """
    Lấy danh sách các đơn hàng của khách hàng đang đăng nhập kèm chi tiết từng món.
    Sắp xếp theo thời gian tạo mới nhất lên đầu.
    """
    supabase = get_supabase()
    try:
        res = (
            supabase.table("orders")
            .select("*, items:order_items(*)")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return res.data or []
    except Exception as e:
        print(f"[ERROR get_user_orders] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lấy lịch sử đơn hàng: {str(e)}"
        )

#feat/quan-ly-don-hang(13)
async def get_admin_orders(
    order_status: Optional[str] = None,
    payment_status: Optional[str] = None
) -> List[dict]:
    """
    Tính năng 4.2: Admin xem toàn bộ danh sách đơn hàng kèm chi tiết các món,
    hỗ trợ lọc theo trạng thái đơn hàng và trạng thái thanh toán.
    """
    supabase = get_supabase()
    try:
        query = supabase.table("orders").select("*, items:order_items(*)")

        if order_status:
            query = query.eq("order_status", order_status)
        if payment_status:
            query = query.eq("payment_status", payment_status)

        res = query.order("created_at", desc=True).execute()
        return res.data or []
    except Exception as e:
        print(f"[ERROR get_admin_orders] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy vấn danh sách đơn hàng cho Admin: {str(e)}"
        )

async def confirm_order_payment_service(order_id: str) -> dict:
    """
    Tính năng 4.3: Xác nhận đã nhận tiền khi gặp mặt (DIRECT_MEETUP).
    Cập nhật: payment_status = 'PAID', order_status = 'COMPLETED', paid_at = NOW()
    """
    supabase = get_supabase()
    try:
        now_str = datetime.now(timezone.utc).isoformat()
        res = (
            supabase.table("orders")
            .update({
                "payment_status": "PAID",
                "order_status": "COMPLETED",
                "paid_at": now_str,
                "updated_at": now_str
            })
            .eq("id", order_id)
            .execute()
        )

        if not res.data or len(res.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy đơn hàng với mã ID: {order_id}"
            )

        # Lấy lại thông tin hoàn chỉnh kèm items
        full_order = (
            supabase.table("orders")
            .select("*, items:order_items(*)")
            .eq("id", order_id)
            .execute()
        )
        return full_order.data[0] if full_order.data else res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR confirm_order_payment_service] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi xác nhận thanh toán đơn hàng: {str(e)}"
        )

async def update_order_status_service(order_id: str, new_status: str) -> dict:
    """
    Tính năng 4.2: Cập nhật trạng thái đơn hàng (PENDING, CONFIRMED, DELIVERING, COMPLETED, CANCELLED).
    """
    valid_statuses = {"PENDING", "CONFIRMED", "DELIVERING", "COMPLETED", "CANCELLED"}
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trạng thái '{new_status}' không hợp lệ. Phải thuộc: {', '.join(valid_statuses)}"
        )

    supabase = get_supabase()
    try:
        now_str = datetime.now(timezone.utc).isoformat()
        res = (
            supabase.table("orders")
            .update({"order_status": new_status, "updated_at": now_str})
            .eq("id", order_id)
            .execute()
        )
        if not res.data or len(res.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy đơn hàng với mã ID: {order_id}"
            )

        full_order = (
            supabase.table("orders")
            .select("*, items:order_items(*)")
            .eq("id", order_id)
            .execute()
        )
        return full_order.data[0] if full_order.data else res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR update_order_status_service] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi cập nhật trạng thái đơn hàng: {str(e)}"
        )

