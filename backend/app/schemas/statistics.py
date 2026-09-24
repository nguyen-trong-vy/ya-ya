#feat/admin-dashboard(12)

from typing import List, Optional
from pydantic import BaseModel

class DailyRevenueItem(BaseModel):
    """
    Thống kê doanh thu theo từng ngày phục vụ vẽ biểu đồ cột
    """
    date: str  # Định dạng YYYY-MM-DD
    total_revenue: float
    order_count: int

class RecentOrderItem(BaseModel):
    """
    Thông tin tóm tắt của đơn hàng gần đây hiển thị trên Dashboard
    """
    id: str
    recipient_name: str
    recipient_phone: Optional[str] = None
    total_amount: float
    payment_status: str
    order_status: str
    created_at: str

class RevenueStatsResponse(BaseModel):
    """
    Phản hồi tổng hợp báo cáo doanh thu và KPI cho Admin Dashboard
    """
    total_revenue: float
    completed_orders: int
    pending_orders: int
    total_orders: int
    total_active_products: int
    daily_revenue: List[DailyRevenueItem]
    recent_orders: List[RecentOrderItem]
