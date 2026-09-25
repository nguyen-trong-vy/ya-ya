#feat/SPNB-CTSP(04)
#->feat/danh-muc(05)
#feat/quan-ly-banh-danh-sach(14)
#feat/quan-ly-banh-them-moi(15)

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Form, File, UploadFile, status
from app.schemas.product import ProductResponse, ProductPaginatedResponse
from app.services.product import get_all_products, get_admin_products_paginated, create_product_service
from app.dependencies import require_admin

router = APIRouter(prefix="/api/products", tags=["Sản phẩm bánh (Products)"])

@router.get(
    "",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
    summary="Lấy danh sách sản phẩm bánh",
    description="Truy vấn danh sách bánh từ bảng public.products trên Supabase."
)
async def list_products(category: Optional[str] = Query(None, description="Lọc theo slug danh mục (ví dụ: banh-donut, banh-sinh-nhat)")):
    return await get_all_products(category_slug=category)


#feat/quan-ly-banh-danh-sach(14)
@router.get(
    "/admin-list",
    response_model=ProductPaginatedResponse,
    status_code=status.HTTP_200_OK,
    summary="Tính năng 5.1: Admin xem danh sách bánh có phân trang",
    description="Yêu cầu quyền Quản trị viên (admin). Hỗ trợ phân trang, lọc theo category_id và tìm kiếm theo tên."
)
async def list_admin_products(
    page: int = Query(1, ge=1, description="Số trang (bắt đầu từ 1)"),
    limit: int = Query(10, ge=1, le=50, description="Số lượng mỗi trang"),
    category_id: Optional[str] = Query(None, description="Lọc theo ID danh mục"),
    search: Optional[str] = Query(None, description="Tìm kiếm theo tên bánh"),
    current_admin: dict = Depends(require_admin)
):
    return await get_admin_products_paginated(
        page=page,
        limit=limit,
        category_id=category_id,
        search=search
    )


#feat/quan-ly-banh-them-moi(15)
@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    name: str = Form(..., description="Tên bánh kem"),
    price: float = Form(..., description="Đơn giá (VNĐ)"),
    category_id: str = Form(..., description="ID danh mục bánh"),
    description: Optional[str] = Form(None, description="Mô tả chi tiết"),
    image: Optional[UploadFile] = File(None, description="File ảnh đại diện"),
    current_admin: dict = Depends(require_admin)
):
    """
    [ADMIN ONLY] Thêm món bánh mới vào thực đơn tiệm Yuu Cake:
    - Bắt buộc đăng nhập tài khoản có role='admin'.
    - Tự động chuyển đổi slug tiếng Việt, tải ảnh lên Supabase Storage bucket 'cakes'.
    """
    return await create_product_service(
        name=name,
        price=price,
        category_id=category_id,
        description=description,
        file=image
    )