#feat/danh-muc(05)


from typing import List
from fastapi import APIRouter, status
from app.schemas.category import CategoryResponse
from app.services.category import get_all_categories

router = APIRouter(prefix="/api/categories", tags=["Danh mục sản phẩm (Categories)"])

@router.get(
    "",
    response_model=List[CategoryResponse],
    status_code=status.HTTP_200_OK,
    summary="Lấy danh sách tất cả danh mục bánh",
    description="Truy vấn toàn bộ danh mục bánh từ Supabase kèm số lượng món bánh."
)
async def list_categories():
    return await get_all_categories()