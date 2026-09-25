#feat/SPNB-CTSP(04)
#feat/quan-ly-banh-danh-sach(14)
#feat/quan-ly-banh-them-moi(15)

import re
import math
import unicodedata
import uuid
from typing import List, Optional
from fastapi import UploadFile, HTTPException, status
from app.core.database import get_supabase
from app.core.config import settings

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


#feat/quan-ly-banh-them-moi(15)
def slugify_vietnamese(text: str) -> str:
    """
    Chuyển đổi chuỗi tiếng Việt có dấu thành slug không dấu chuẩn SEO URL.
    Ví dụ: 'Bánh Kem Bắp Phô Mai' -> 'banh-kem-bap-pho-mai'
    """
    if not text:
        return ""
    # Chuyển chữ hoa thành chữ thường
    text = text.lower().strip()
    
    # Thay thế các ký tự đặc biệt tiếng Việt sang không dấu
    vietnamese_map = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'đ': 'd',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
    }
    for vn_char, en_char in vietnamese_map.items():
        text = text.replace(vn_char, en_char)
        
    # Loại bỏ các ký tự dấu thanh phụ còn sót lại
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    # Thay khoảng trắng và ký tự không phải chữ/số thành gạch ngang
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Loại bỏ gạch ngang ở đầu và cuối chuỗi
    return text.strip('-')


async def upload_cake_image(file: UploadFile) -> str:
    """
    Tải file hình ảnh lên Supabase Storage bucket 'cakes'.
    Trả về đường dẫn Public URL của file ảnh.
    """
    # 1. Kiểm tra định dạng file
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng ảnh không hợp lệ. Chỉ chấp nhận các định dạng JPG, PNG, WEBP."
        )

    # 2. Đọc nội dung file và kiểm tra dung lượng tối đa (5MB)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 5MB)."
        )

    # 3. Tạo tên file ngẫu nhiên để tránh trùng lặp
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else "jpg"
    unique_filename = f"cake_{uuid.uuid4().hex[:12]}.{ext}"

    # 4. Upload lên bucket 'cake-images'
    supabase = get_supabase()
    bucket_name = settings.SUPABASE_STORAGE_BUCKET or "cake-images"
    try:
        supabase.storage.from_(bucket_name).upload(
            path=unique_filename,
            file=content,
            file_options={"content-type": file.content_type}
        )
        
        # 5. Lấy Public URL của ảnh vừa upload
        public_url = supabase.storage.from_(bucket_name).get_public_url(unique_filename)
        return public_url
    except Exception as e:
        print(f"[CẢNH BÁO upload_cake_image] Không thể tải ảnh lên bucket '{bucket_name}': {e}")
        # Fallback về ảnh đại diện mặc định để không làm gián đoạn việc tạo sản phẩm
        return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop"


async def create_product_service(
    name: str,
    price: float,
    category_id: str,
    description: Optional[str] = None,
    file: Optional[UploadFile] = None
) -> dict:
    """
    Tạo sản phẩm bánh mới:
    - Validate giá tiền > 0
    - Tự động sinh slug độc nhất
    - Upload ảnh đại diện lên Supabase Storage (nếu có file)
    - Chèn bản ghi vào bảng products
    """
    supabase = get_supabase()

    # 1. Validate dữ liệu đầu vào
    clean_name = name.strip()
    if not clean_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên bánh kem không được để trống."
        )

    if price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Đơn giá sản phẩm phải lớn hơn 0 VNĐ."
        )

    # 2. Sinh slug độc nhất
    base_slug = slugify_vietnamese(clean_name)
    if not base_slug:
        base_slug = f"banh-kem-{uuid.uuid4().hex[:6]}"

    slug = base_slug
    # Kiểm tra xem slug đã bị trùng trong CSDL chưa
    check_slug = supabase.table("products").select("id").eq("slug", slug).execute()
    if check_slug.data and len(check_slug.data) > 0:
        slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

    # 3. Xử lý ảnh đại diện
    image_url = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop" # Ảnh fallback mặc định
    if file and file.filename:
        image_url = await upload_cake_image(file)

    # 4. Insert vào bảng products
    product_data = {
        "name": clean_name,
        "slug": slug,
        "price": price,
        "category_id": category_id,
        "description": description.strip() if description else "",
        "image_url": image_url,
        "is_deleted": False
    }

    try:
        insert_res = supabase.table("products").insert(product_data).execute()
        if not insert_res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Lỗi tạo sản phẩm bánh mới trên CSDL Supabase."
            )

        new_product = insert_res.data[0]

        # 5. Lấy kèm thông tin tên danh mục
        cat_res = supabase.table("categories").select("name, slug").eq("id", category_id).execute()
        cat_data = cat_res.data[0] if cat_res.data else {}

        return {
            "id": str(new_product["id"]),
            "category_id": str(new_product.get("category_id")),
            "category_name": cat_data.get("name"),
            "category_slug": cat_data.get("slug"),
            "name": new_product["name"],
            "slug": new_product["slug"],
            "description": new_product.get("description"),
            "price": float(new_product.get("price") or 0),
            "image_url": new_product.get("image_url"),
            "is_deleted": new_product.get("is_deleted", False),
            "created_at": str(new_product.get("created_at")) if new_product.get("created_at") else None
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"[ERROR create_product_service] {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi thêm bánh mới: {str(e)}"
        )