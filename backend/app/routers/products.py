#feat/SPNB-CTSP(04)



from typing import List
from fastapi import APIRouter, Query, status
from app.schemas.product import ProductResponse
from app.services.product import get_all_products

router = APIRouter(prefix="/api/products", tags=["Sản phẩm bánh (Products)"])

@router.get(
    "",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
    summary="Lấy danh sách sản phẩm bánh",
    description="Truy vấn danh sách bánh từ bảng public.products trên Supabase."
)
async def list_products():
    return await get_all_products()