#feat/danh-muc(05)

from typing import Optional
from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str
    slug: str

class CategoryResponse(CategoryBase):
    id: str
    created_at: Optional[str] = None
    product_count: Optional[int] = 0

    class Config:
        from_attributes = True