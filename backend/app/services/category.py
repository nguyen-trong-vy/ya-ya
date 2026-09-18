#feat/SPNB-CTSP(04)


from typing import List
from fastapi import HTTPException, status
from app.core.database import get_supabase

async def get_all_categories() -> List[dict]:
    """
    Truy vấn danh sách toàn bộ danh mục từ bảng public.categories,
    kèm theo số lượng sản phẩm đang có trong từng danh mục.
    """
    supabase = get_supabase()
    try:
        # 1. Lấy danh sách categories
        res = supabase.table("categories").select("*").order("name").execute()
        categories = res.data or []

        # 2. Đếm số lượng sản phẩm chưa xóa cho từng danh mục
        prod_res = supabase.table("products").select("category_id").eq("is_deleted", False).execute()
        prods = prod_res.data or []

        count_map = {}
        for p in prods:
            cid = str(p.get("category_id"))
            count_map[cid] = count_map.get(cid, 0) + 1

        for cat in categories:
            cid = str(cat.get("id"))
            cat["product_count"] = count_map.get(cid, 0)

        return categories
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR get_all_categories] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy vấn danh mục từ Supabase: {str(e)}"
        )