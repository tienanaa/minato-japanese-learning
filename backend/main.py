from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_db_connection
import repositories
from typing import Optional

app = FastAPI(title="Minato - Hệ thống học Từ vựng và Hán tự Tiếng Nhật")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/auth/login")
def login(request: LoginRequest, db_conn = Depends(get_db_connection)):
    user = repositories.login_user(db_conn, request.username, request.password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
        
    return {
        "status": "success",
        "message": "Đăng nhập thành công",
        "data": user
    }

@app.get("/api/dashboard/{user_id}")
def get_dashboard(user_id: str, db_conn = Depends(get_db_connection)):
    try:
        data = repositories.get_dashboard_info(db_conn, user_id)
        
        return {
            "status": "success",
            "message": "Lấy dữ liệu Dashboard thành công",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi truy xuất dữ liệu: {str(e)}")

@app.get("/api/baihoc")
def get_baihoc(trinh_do: Optional[str] = None, db_conn = Depends(get_db_connection)):
    try:
        data = repositories.get_danh_sach_bai_hoc(db_conn, trinh_do)
        
        return {
            "status": "success",
            "message": "Lấy danh sách bài học thành công",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi: {str(e)}")