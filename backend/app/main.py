#feat/cau-hinh-nen-tang(00)
#khoi tao FastAPI va CORS
#feat/SPNB-CTSP(04)
#feat/danh-muc(05)
#feat/dat-hang(07)
#feat/admin-dashboard(12)
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routers import  products
from app.core.config import settings
from app.routers import auth
from app.routers import categories
from app.routers import orders
from app.routers import statistics
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hệ thống Backend API cho Tiệm Bánh Của Vy - FastAPI + Supabase",
    docs_url="/docs",
    redoc_url="/redoc",
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("=" * 60)
    print(f"[FASTAPI 422 VALIDATION ERROR]: {exc.errors()}")
    print("=" * 60)
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

#(04)
app.include_router(products.router)
#(05)
app.include_router(categories.router)
#(07)
app.include_router(orders.router)
#(12)
app.include_router(statistics.router)

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


