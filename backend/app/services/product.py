#feat/SPNB-CTSP(04)
#feat/quan-ly-banh-danh-sach(14)

import math
from typing import List, Optional
from fastapi import HTTPException, status
from app.core.database import get_supabase

async def get_all_products() -> List[dict]:
    """
    Truy vấn danh sách sản phẩm từ bảng public.products (JOIN categories),
    chỉ lấy các món đang hoạt động (is_deleted = False).
    """
    supabase = get_supabase()
    try:
        query = supabase.table("products").select(
            "id, category_id, name, slug, description, price, image_url, is_deleted, created_at, categories(name, slug)"
        ).eq("is_deleted", False)

        res = query.order("created_at", desc=False).execute()
        products_raw = res.data or []

        result = []
        for p in products_raw:
            cat = p.get("categories") or {}
            c_name = cat.get("name") if isinstance(cat, dict) else None
            c_slug = cat.get("slug") if isinstance(cat, dict) else None

            item = {
                "id": str(p.get("id")),
                "category_id": str(p.get("category_id")) if p.get("category_id") else None,
                "category_name": c_name,
                "category_slug": c_slug,
                "name": p.get("name"),
                "slug": p.get("slug"),
                "description": p.get("description"),
                "price": float(p.get("price") or 0),
                "image_url": p.get("image_url"),
                "is_deleted": p.get("is_deleted", False),
                "created_at": str(p.get("created_at")) if p.get("created_at") else None
            }
            result.append(item)

        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR get_all_products] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy vấn sản phẩm từ Supabase: {str(e)}"
        )


#feat/danh-muc(05)
async def get_all_products(category_slug: Optional[str] = None) -> List[dict]:
    """
    Truy vấn danh sách sản phẩm từ bảng public.products (JOIN categories),
    chỉ lấy các món chưa bị xóa (is_deleted = False).
    Hỗ trợ lọc theo category_slug khi người dùng bấm chọn danh mục.
    """
    supabase = get_supabase()
    try:
        query = supabase.table("products").select(
            "id, category_id, name, slug, description, price, image_url, is_deleted, created_at, categories(name, slug)"
        ).eq("is_deleted", False)

        res = query.order("created_at", desc=False).execute()
        products_raw = res.data or []

        result = []
        for p in products_raw:
            cat = p.get("categories") or {}
            c_name = cat.get("name") if isinstance(cat, dict) else None
            c_slug = cat.get("slug") if isinstance(cat, dict) else None

            # Lọc theo slug danh mục nếu người dùng truyền param (bỏ qua nếu là 'all')
            if category_slug and category_slug != "all" and c_slug != category_slug:
                continue

            item = {
                "id": str(p.get("id")),
                "category_id": str(p.get("category_id")) if p.get("category_id") else None,
                "category_name": c_name,
                "category_slug": c_slug,
                "name": p.get("name"),
                "slug": p.get("slug"),
                "description": p.get("description"),
                "price": float(p.get("price") or 0),
                "image_url": p.get("image_url"),
                "is_deleted": p.get("is_deleted", False),
                "created_at": str(p.get("created_at")) if p.get("created_at") else None
            }
            result.append(item)

        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR get_all_products] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy vấn sản phẩm từ Supabase: {str(e)}"
        )


#feat/quan-ly-banh-danh-sach(14)
async def get_admin_products_paginated(
    page: int = 1,
    limit: int = 10,
    category_id: Optional[str] = None,
    search: Optional[str] = None
) -> dict:
    """
    Tính năng 5.1: Admin xem danh sách bánh kèm phân trang, tìm kiếm và lọc danh mục.
    """
    supabase = get_supabase()
    try:
        query = supabase.table("products").select(
            "id, category_id, name, slug, description, price, image_url, is_deleted, created_at, categories(name, slug)",
            count="exact"
        ).eq("is_deleted", False)

        if category_id and category_id.strip():
            query = query.eq("category_id", category_id.strip())

        if search and search.strip():
            query = query.ilike("name", f"%{search.strip()}%")

        offset = (page - 1) * limit
        res = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()

        total = res.count if res.count is not None else len(res.data or [])
        total_pages = max(1, math.ceil(total / limit))

        items = []
        for p in res.data or []:
            cat = p.get("categories") or {}
            c_name = cat.get("name") if isinstance(cat, dict) else None
            c_slug = cat.get("slug") if isinstance(cat, dict) else None

            items.append({
                "id": str(p.get("id")),
                "category_id": str(p.get("category_id")) if p.get("category_id") else None,
                "category_name": c_name,
                "category_slug": c_slug,
                "name": p.get("name"),
                "slug": p.get("slug"),
                "description": p.get("description"),
                "price": float(p.get("price") or 0),
                "image_url": p.get("image_url"),
                "is_deleted": p.get("is_deleted", False),
                "created_at": str(p.get("created_at")) if p.get("created_at") else None
            })

        return {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }
    except Exception as e:
        print(f"[ERROR get_admin_products_paginated] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy vấn danh sách bánh phân trang: {str(e)}"
        )