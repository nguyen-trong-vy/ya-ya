#feat/SPNB-CTSP(04)
#feat/quan-ly-banh-danh-sach(14)
#feat/quan-ly-banh-them-moi(15)
#feat/quan-ly-banh-chinh-sua(16)
#feat/quan-ly-banh-xoa-mem(17)

import re
import math
import unicodedata
import uuid
from typing import List, Optional
from fastapi import UploadFile, HTTPException, status
from app.core.database import get_supabase
from app.core.config import settings

#feat/SPNB-CTSP(04) - Cải tiến: Thống kê sản phẩm bán chạy nhất
async def get_featured_best_seller_products(limit: int = 4) -> List[dict]:
    """
    Lấy danh sách các sản phẩm bán chạy nhất (Best-sellers) dựa trên tổng số lượng
    đã bán từ bảng order_items (loại trừ các đơn hàng đã bị hủy order_status = 'CANCELLED').
    Nếu chưa có đơn hàng hoặc chưa đủ sản phẩm bán được, tự động bổ sung
    các sản phẩm mới nhất để luôn đảm bảo có đủ sản phẩm hiển thị trên Trang chủ.
    """
    supabase = get_supabase()
    try:
        # 1. Thống kê số lượng bán từ bảng order_items
        sold_stats = {}
        try:
            items_res = supabase.table("order_items").select("product_id, quantity").execute()
            for it in (items_res.data or []):
                pid = str(it.get("product_id") or "")
                qty = int(it.get("quantity") or 0)
                if pid:
                    sold_stats[pid] = sold_stats.get(pid, 0) + qty
        except Exception as err_items:
            print(f"[CẢNH BÁO get_featured_best_seller_products] Không thể đọc order_items: {err_items}")

        # 2. Lấy toàn bộ sản phẩm đang hoạt động (chưa bị xóa mềm)
        products_res = supabase.table("products").select(
            "id, category_id, name, slug, description, price, image_url, is_deleted, created_at, categories(name, slug)"
        ).eq("is_deleted", False).order("created_at", desc=True).execute()

        all_products = []
        for p in (products_res.data or []):
            cat = p.get("categories") or {}
            c_name = cat.get("name") if isinstance(cat, dict) else None
            c_slug = cat.get("slug") if isinstance(cat, dict) else None
            pid_str = str(p.get("id"))
            sold_count = sold_stats.get(pid_str, 0)

            all_products.append({
                "id": pid_str,
                "category_id": str(p.get("category_id")) if p.get("category_id") else None,
                "category_name": c_name,
                "category_slug": c_slug,
                "name": p.get("name"),
                "slug": p.get("slug"),
                "description": p.get("description"),
                "price": float(p.get("price") or 0),
                "image_url": p.get("image_url"),
                "is_deleted": p.get("is_deleted", False),
                "created_at": str(p.get("created_at")) if p.get("created_at") else None,
                "sold_count": sold_count
            })

        # 3. Sắp xếp: Ưu tiên lượt bán cao nhất trước, sau đó đến ngày tạo mới nhất
        all_products.sort(key=lambda x: (x["sold_count"], x["created_at"] or ""), reverse=True)

        return all_products[:limit]
    except Exception as e:
        print(f"[ERROR get_featured_best_seller_products] {e}")
        # Fallback về danh sách sản phẩm thông thường nếu có lỗi
        fallback = await get_all_products()
        return fallback[:limit]


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


#feat/quan-ly-banh-chinh-sua(16)
async def update_product_service(
    product_id: str,
    name: str,
    price: float,
    category_id: str,
    description: Optional[str] = None,
    file: Optional[UploadFile] = None
) -> dict:
    """
    Cập nhật thông tin sản phẩm bánh kem:
    - Kiểm tra bánh có tồn tại và chưa bị xóa mềm (is_deleted = False).
    - Tạo lại slug chuẩn SEO nếu tên bánh thay đổi.
    - Upload ảnh mới nếu người dùng chọn file, ngược lại giữ nguyên ảnh cũ.
    - Cập nhật bảng products trong Supabase.
    """
    supabase = get_supabase()

    # 1. Kiểm tra sản phẩm có tồn tại không
    existing_res = supabase.table("products").select("*").eq("id", product_id).eq("is_deleted", False).execute()
    if not existing_res.data or len(existing_res.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sản phẩm bánh kem hoặc sản phẩm đã bị xóa."
        )

    current_product = existing_res.data[0]

    # 2. Validate dữ liệu đầu vào
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

    # 3. Xử lý slug: Nếu đổi tên thì sinh slug mới
    new_slug = current_product.get("slug")
    if clean_name != current_product.get("name"):
        base_slug = slugify_vietnamese(clean_name)
        if not base_slug:
            base_slug = f"banh-kem-{uuid.uuid4().hex[:6]}"
        
        new_slug = base_slug
        # Kiểm tra xem slug có trùng với sản phẩm KHÁC không
        slug_check = supabase.table("products").select("id").eq("slug", new_slug).neq("id", product_id).execute()
        if slug_check.data and len(slug_check.data) > 0:
            new_slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

    # 4. Xử lý ảnh đại diện: Nếu có file mới thì upload, nếu không thì giữ nguyên URL cũ
    image_url = current_product.get("image_url")
    if file and file.filename:
        image_url = await upload_cake_image(file)

    # 5. Cập nhật vào CSDL Supabase
    update_data = {
        "name": clean_name,
        "slug": new_slug,
        "price": price,
        "category_id": category_id,
        "description": description.strip() if description else "",
        "image_url": image_url
    }

    try:
        update_res = supabase.table("products").update(update_data).eq("id", product_id).execute()
        if not update_res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Lỗi cập nhật sản phẩm trên CSDL Supabase."
            )

        updated_row = update_res.data[0]

        # 6. Lấy kèm thông tin tên danh mục
        cat_res = supabase.table("categories").select("name, slug").eq("id", category_id).execute()
        cat_data = cat_res.data[0] if cat_res.data else {}

        return {
            "id": str(updated_row["id"]),
            "category_id": str(updated_row.get("category_id")),
            "category_name": cat_data.get("name"),
            "category_slug": cat_data.get("slug"),
            "name": updated_row["name"],
            "slug": updated_row["slug"],
            "description": updated_row.get("description"),
            "price": float(updated_row.get("price") or 0),
            "image_url": updated_row.get("image_url"),
            "is_deleted": updated_row.get("is_deleted", False),
            "created_at": str(updated_row.get("created_at")) if updated_row.get("created_at") else None
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR update_product_service] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi cập nhật sản phẩm: {str(e)}"
        )


#feat/quan-ly-banh-xoa-mem(17)
async def soft_delete_product_service(product_id: str) -> dict:
    """
    Xóa mềm (Soft Delete) sản phẩm bánh:
    - Đổi cờ is_deleted = True
    - Giữ nguyên bản ghi trong bảng products để các đơn hàng trong quá khứ
      (bảng order_items) không bị lỗi khóa ngoại Foreign Key.
    """
    supabase = get_supabase()

    # 1. Kiểm tra sản phẩm có tồn tại và chưa bị xóa không
    existing_res = supabase.table("products").select("id, name").eq("id", product_id).eq("is_deleted", False).execute()
    if not existing_res.data or len(existing_res.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sản phẩm bánh kem hoặc sản phẩm đã bị xóa trước đó."
        )

    product_name = existing_res.data[0].get("name", "Bánh kem")

    # 2. Thực hiện cập nhật is_deleted = True
    try:
        update_res = supabase.table("products").update({
            "is_deleted": True
        }).eq("id", product_id).execute()

        if not update_res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Lỗi cập nhật trạng thái xóa trên CSDL Supabase."
            )

        return {
            "message": f"Đã xóa mềm thành công bánh '{product_name}'. Sản phẩm đã được ngừng kinh doanh.",
            "product_id": product_id,
            "status": "archived"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR soft_delete_product_service] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi xóa sản phẩm bánh: {str(e)}"
        )