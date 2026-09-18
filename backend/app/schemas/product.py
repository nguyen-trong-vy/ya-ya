#feat/SPNB-CTSP(04)

from typing import List, Optional
from pydantic import BaseModel

class ProductResponse(BaseModel):
    id: str
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    category_slug: Optional[str] = None
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_deleted: bool = False
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

class ProductPaginatedResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int