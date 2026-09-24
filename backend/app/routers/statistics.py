#feat/admin-dashboard(12)

from fastapi import APIRouter, Depends, status
from app.schemas.statistics import RevenueStatsResponse
from app.services.statistics import get_revenue_statistics_service
from app.dependencies import require_admin

router = APIRouter(prefix="/api/statistics", tags=["Thống kê Doanh thu (Statistics)"])

@router.get(
    "/revenue",
    response_model=RevenueStatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Thống kê doanh thu và báo cáo KPI tổng quan",
    description=(
        "Tính năng 6.1: Truy vấn tổng hợp doanh thu từ các đơn hàng đã thanh toán (PAID/COMPLETED), "
        "gom nhóm theo ngày để vẽ biểu đồ và tính các chỉ số KPI. Yêu cầu quyền Quản trị viên (Admin)."
    )
)
async def get_revenue_statistics(
    admin_user: dict = Depends(require_admin)
):
    """
    Endpoint bảo vệ bằng require_admin trả về số liệu thống kê doanh thu toàn tiệm bánh.
    """
    return await get_revenue_statistics_service()
