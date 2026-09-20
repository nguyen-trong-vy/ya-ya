#feat/cau-hinh-nen-tang(00)
#khoi tao FastAPI va CORS
#feat/SPNB-CTSP(04)
#feat/danh-muc(05)
#feat/dat-hang(07)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import  products
from app.core.config import settings
from app.routers import auth
from app.routers import categories
from app.routers import orders
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hệ thống Backend API cho Tiệm Bánh Của Vy - FastAPI + Supabase",
    docs_url="/docs",
    redoc_url="/redoc",
)

#(04)
app.include_router(products.router)
#(05)
app.include_router(categories.router)
#(07)
app.include_router(orders.router)

# Cấu hình CORS cho phép Frontend React gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nạp router xác thực
app.include_router(auth.router)

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Chào mừng đến với API Tiệm Bánh Của Vy!",
        "docs_url": "/docs",
        "version": settings.VERSION
    }


