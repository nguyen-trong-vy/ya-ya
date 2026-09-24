#feat/admin-dashboard(12)

from collections import defaultdict
from typing import Dict, List, Any
from fastapi import HTTPException, status
from app.core.database import get_supabase
from app.schemas.statistics import RevenueStatsResponse, DailyRevenueItem, RecentOrderItem

async def get_revenue_statistics_service() -> dict:
    """
    Nghiệp vụ Thống kê Doanh thu & Báo cáo Quản trị:
    1. Truy vấn các đơn hàng từ Supabase (orders).
    2. Chỉ tính doanh thu các đơn hàng đã thanh toán (payment_status = 'PAID' hoặc order_status = 'COMPLETED').
    3. Gom nhóm doanh thu theo ngày (DATE(paid_at) hoặc DATE(created_at)).
    4. Đếm số sản phẩm đang mở bán (is_deleted = False).
    5. Trích xuất 5 đơn hàng gần nhất để hỗ trợ hiển thị nhanh trên Dashboard.
    """
    supabase = get_supabase()
    try:
        # 1. Lấy tất cả đơn hàng sắp xếp theo thời gian tạo mới nhất
        orders_res = (
            supabase.table("orders")
            .select("id, recipient_name, recipient_phone, total_amount, payment_status, order_status, paid_at, created_at")
            .order("created_at", desc=True)
            .execute()
        )
        orders: List[Dict[str, Any]] = orders_res.data or []

        # 2. Lấy số lượng bánh đang mở bán (chưa xóa mềm)
        products_res = (
            supabase.table("products")
            .select("id")
            .eq("is_deleted", False)
            .execute()
        )
        total_active_products = len(products_res.data) if products_res.data else 0

        total_revenue = 0.0
        completed_orders = 0
        pending_orders = 0
        total_orders = len(orders)

        daily_map: Dict[str, Dict[str, Any]] = defaultdict(lambda: {"total_revenue": 0.0, "order_count": 0})

        for o in orders:
            p_status = (o.get("payment_status") or "").upper()
            o_status = (o.get("order_status") or "").upper()
            amount = float(o.get("total_amount") or 0.0)

            # Đơn đang chờ xử lý
            if o_status == "PENDING":
                pending_orders += 1

            # Đơn đã thanh toán / hoàn thành -> ghi nhận doanh thu thực tế
            if p_status == "PAID" or o_status == "COMPLETED":
                completed_orders += 1
                total_revenue += amount

                # Lấy ngày theo paid_at nếu có, fallback về created_at
                date_field = o.get("paid_at") or o.get("created_at") or ""
                date_str = date_field[:10] if len(date_field) >= 10 else "Không rõ"

                daily_map[date_str]["total_revenue"] += amount
                daily_map[date_str]["order_count"] += 1

        # Chuyển đổi daily_map sang danh sách sắp xếp tăng dần theo ngày
        daily_revenue_list: List[dict] = []
        for date_key in sorted(daily_map.keys()):
            daily_revenue_list.append({
                "date": date_key,
                "total_revenue": daily_map[date_key]["total_revenue"],
                "order_count": daily_map[date_key]["order_count"]
            })

        # 5 đơn hàng mới nhất
        recent_orders_list: List[dict] = []
        for o in orders[:5]:
            recent_orders_list.append({
                "id": str(o.get("id")),
                "recipient_name": o.get("recipient_name") or "Khách hàng",
                "recipient_phone": o.get("recipient_phone"),
                "total_amount": float(o.get("total_amount") or 0.0),
                "payment_status": o.get("payment_status") or "UNPAID",
                "order_status": o.get("order_status") or "PENDING",
                "created_at": o.get("created_at") or ""
            })

        return {
            "total_revenue": total_revenue,
            "completed_orders": completed_orders,
            "pending_orders": pending_orders,
            "total_orders": total_orders,
            "total_active_products": total_active_products,
            "daily_revenue": daily_revenue_list,
            "recent_orders": recent_orders_list
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR get_revenue_statistics_service] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi trích xuất dữ liệu thống kê doanh thu: {str(e)}"
        )
