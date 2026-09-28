#feat/cau-hinh-nen-tang(00)
#feat/SPNB-CTSP(04)
#feat/danh-muc(05)
#feat/dat-hang(07)
#feat/admin-dashboard(12)

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, categories, products, orders, statistics

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

# Exception handler cho lỗi validation request
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("=" * 60)
    print(f"[FASTAPI 422 VALIDATION ERROR]: {exc.errors()}")
    print("=" * 60)
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

# Nạp danh sách các routers của hệ thống
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(statistics.router)

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Chào mừng đến với API Tiệm Bánh Của Vy!",
        "docs_url": "/docs",
        "version": settings.VERSION
    }


