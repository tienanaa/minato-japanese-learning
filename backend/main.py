from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_db_connection
import repositories
from typing import Optional, List

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

class UpdateProgressRequest(BaseModel):
    item_id: str
    loai: str         
    trang_thai: int   

class ChiTietNopBai(BaseModel):
    cauhoiid: str
    luachonid: str

class NopBaiRequest(BaseModel):
    btontapid: str
    chi_tiet: List[ChiTietNopBai]

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

@app.get("/api/users/{user_id}/baihoc")
def get_baihoc(user_id: str, trinh_do: Optional[str] = None, db_conn = Depends(get_db_connection)):
    try:
        data = repositories.get_danh_sach_bai_hoc(db_conn,user_id, trinh_do)
        
        return {
            "status": "success",
            "message": "Lấy danh sách bài học thành công",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi: {str(e)}")

@app.get("/api/users/{user_id}/baihoc/{baihoc_id}")
def get_chitiet_baihoc(user_id: str, baihoc_id: str,  db_conn = Depends(get_db_connection)):
    try:
        data = repositories.get_chi_tiet_bai_hoc(db_conn, baihoc_id, user_id)
        
        if not data:
            raise HTTPException(status_code=404, detail="Không tìm thấy mã bài học này")
            
        return {
            "status": "success",
            "message": "Lấy chi tiết bài học thành công",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi truy xuất hệ thống: {str(e)}")

@app.post("/api/users/{user_id}/progress")
def update_progress(user_id: str, request: UpdateProgressRequest, db_conn = Depends(get_db_connection)):
    if request.loai not in ['Kanji', 'TuVung']:
        raise HTTPException(status_code=400, detail="Loại dữ liệu phải là 'Kanji' hoặc 'TuVung'")
        
    if request.trang_thai not in [0, 1, 2]:
        raise HTTPException(status_code=400, detail="Trạng thái không hợp lệ (0, 1, 2)")

    success = repositories.update_learning_status(
        db_conn,
        user_id,
        request.item_id,
        request.loai,
        request.trang_thai
    )

    if not success:
        raise HTTPException(status_code=500, detail="Lỗi hệ thống: Không thể cập nhật tiến độ học")

    return {
        "status": "success",
        "message": f"Đã cập nhật trạng thái {request.trang_thai} cho {request.item_id}"
    }

@app.get("/api/users/{user_id}/baihoc/{baihoc_id}/quiz")
def get_quiz_questions(baihoc_id: str, db_conn = Depends(get_db_connection)):
    try:
        data = repositories.get_danh_sach_cau_hoi(db_conn, baihoc_id)
        
        if not data:
            return {
                "status": "success",
                "message": "Bài học này hiện chưa có câu hỏi trắc nghiệm",
                "data": []
            }
            
        return {
            "status": "success",
            "message": "Lấy đề thi thành công",
            "tong_so_cau": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi truy xuất hệ thống: {str(e)}")

@app.post("/api/users/{user_id}/baihoc/{baihoc_id}/quiz/submit")
def nop_bai_kiem_tra(user_id: str, baihoc_id: str, request: NopBaiRequest, db_conn = Depends(get_db_connection)):
    try:
        ket_qua = repositories.submit_quiz(
            db_conn, 
            baihoc_id,
            user_id, 
            request.btontapid, 
            request.chi_tiet
        )
        
        if ket_qua:
            return {
                "status": "success",
                "message": "Nộp bài thành công!",
                "data": ket_qua 
            }
        else:
            raise HTTPException(status_code=400, detail="Không thể ghi nhận kết quả làm bài.")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống: {str(e)}")

@app.get("/api/users/{user_id}/quiz/{lambai_id}")
def xem_chi_tiet_lich_su(user_id: str, lambai_id: int, db_conn = Depends(get_db_connection)):
    try:
        data = repositories.get_chi_tiet_lich_su(db_conn, lambai_id)
        
        if not data:
            return {
                "status": "success",
                "message": "Không tìm thấy chi tiết cho lần làm bài này",
                "data": []
            }
            
        return {
            "status": "success",
            "message": "Lấy chi tiết làm bài thành công",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống: {str(e)}")

@app.get("/api/test-db")
def kiem_tra_danh_sach_bang(db_conn = Depends(get_db_connection)):
    try:
        with db_conn.cursor() as cursor:
            cursor.execute("""
                SELECT table_schema, table_name 
                FROM information_schema.tables 
                WHERE table_schema NOT IN ('information_schema', 'pg_catalog');
            """)
            tables = cursor.fetchall()
            
            danh_sach = [{"schema": row[0], "ten_bang": row[1]} for row in tables]
            
            return {
                "tong_so_bang": len(danh_sach),
                "danh_sach_bang_dang_co": danh_sach
            }
    except Exception as e:
        return {"lỗi": str(e)}