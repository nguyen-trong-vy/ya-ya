#feat/cau-hinh-nen-tang(00)
#khoi tao FastAPI va CORS
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hệ thống Backend API cho Tiệm Bánh Của Vy - FastAPI + Supabase",
    docs_url="/docs",
    redoc_url="/redoc",
)

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