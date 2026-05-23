import random
import string
def login_user(conn, username, password):
    with conn.cursor() as cursor:
        query = """
            SELECT UserID, Username, TrinhDo, VaiTro 
            FROM NGUOIDUNG 
            WHERE Username = %s AND MatKhau = %s
        """
        cursor.execute(query, (username, password))
        row = cursor.fetchone()
        
        if row:
            columns = [column[0] for column in cursor.description]
            return dict(zip(columns, row))
        
        return None 

def get_dashboard_info(conn,user_id):
    with conn.cursor() as cursor:
        query_view = """
            SELECT NgayHoc, SoLuongKanjiDaHoc, SoLuongTuVungDaHoc, HoanThanhMucTieu 
            FROM TienTrinhNguoiDung 
            WHERE UserID = %s AND NgayHoc = CURRENT_DATE
        """
        cursor.execute(query_view, (user_id,))
        today_progress = cursor.fetchone()

        cursor.execute("SELECT public.count_kanji(%s)", (user_id,))
        total_kanji = cursor.fetchone()[0]

        cursor.execute("SELECT public.count_tuvung(%s)", (user_id,))
        total_tuvung = cursor.fetchone()[0]

        return {
            "tien_do_hom_nay": {
                "ngay": today_progress[0] if today_progress else None,
                "kanji_da_hoc": today_progress[1] if today_progress else 0,
                "tu_vung_da_hoc": today_progress[2] if today_progress else 0,
                "hoan_thanh": today_progress[3] if today_progress else False
            },
            "tong_tich_luy": {
                "tong_kanji_da_thuoc": total_kanji,
                "tong_tuvung_da_thuoc": total_tuvung
            }
        }

def get_danh_sach_bai_hoc(conn, trinh_do=None):
    with conn.cursor() as cursor:
        if trinh_do:
            query = """
                SELECT BaiHocID, TenBai, Loai, TrinhDo 
                FROM BAIHOC 
                WHERE TrinhDo = %s 
                ORDER BY BaiHocID
            """
            cursor.execute(query, (trinh_do,))
        else:
            query = "SELECT BaiHocID, TenBai, Loai, TrinhDo FROM BAIHOC ORDER BY BaiHocID"
            cursor.execute(query)
            
        columns = [column[0] for column in cursor.description]
        results = cursor.fetchall()
        
        return [dict(zip(columns, row)) for row in results]
    
def get_chi_tiet_bai_hoc(conn, baihoc_id, user_id):

    with conn.cursor() as cursor:
        cursor.execute("SELECT Loai FROM BAIHOC WHERE BaiHocID = %s", (baihoc_id,))
        row = cursor.fetchone()
        
        if not row:
            return None 
            
        loai_bai_hoc = row[0]
        
        if loai_bai_hoc == 'Kanji':
            query = "SELECT * FROM public.get_kanji_of_lesson(%s, %s)"
        else:
            query = "SELECT * FROM public.get_vocab_of_lesson(%s, %s)"
            
        cursor.execute(query, (baihoc_id, user_id))
        
        columns = [column[0] for column in cursor.description]
        results = cursor.fetchall()
        
        return {
            "loai": loai_bai_hoc,
            "danh_sach": [dict(zip(columns, r)) for r in results]
        }

def generate_short_id(prefix, length=10):
    random_length = length - len(prefix)
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=random_length))
    return f"{prefix}{suffix}"

def update_learning_status(conn, user_id, item_id, loai, trang_thai):
    with conn.cursor() as cursor:
        tien_do_id = generate_short_id('TD')
        chi_tiet_id = generate_short_id('CT')

        try:
            if loai == 'Kanji':
                cursor.execute(
                    "CALL pr_GhiNhanHocKanji(%s::VARCHAR, %s::VARCHAR, %s::INT, %s::VARCHAR, %s::VARCHAR)",
                    (user_id, item_id, trang_thai, tien_do_id, chi_tiet_id)
                )
            elif loai == 'TuVung':
                cursor.execute(
                    "CALL pr_GhiNhanHocTuVung(%s::VARCHAR, %s::VARCHAR, %s::INT, %s::VARCHAR, %s::VARCHAR)",
                    (user_id, item_id, trang_thai, tien_do_id, chi_tiet_id)
                )
            else:
                return False

            conn.commit() 
            return True
        except Exception as e:
            conn.rollback()
            print("Lỗi khi ghi nhận trạng thái học:", e)
            return False
        
def get_danh_sach_cau_hoi(conn, baihoc_id):
    with conn.cursor() as cursor:
        query = """
            SELECT v.* 
            FROM BaiTapKiemTra v
            JOIN BAITAPONTAP bt ON v.BTOntapID = bt.BTOntapID
            WHERE bt.BaiHocID = %s
        """
        cursor.execute(query, (baihoc_id,))
        
        columns = [column[0] for column in cursor.description]
        results = cursor.fetchall()
        
        flat_data = [dict(zip(columns, row)) for row in results]
        
        grouped_data = {}
        for row in flat_data:
            cauhoi_id = row['cauhoiid']
            
            if cauhoi_id not in grouped_data:
                grouped_data[cauhoi_id] = {
                    "btontapid": row["btontapid"],
                    "tenbaitap": row["tenbaitap"],
                    "cauhoiid": row["cauhoiid"],
                    "noidungcauhoi": row["noidungcauhoi"],
                    "danh_sach_dap_an": [] 
                }
                
            grouped_data[cauhoi_id]["danh_sach_dap_an"].append({
                "luachonid": row["luachonid"],
                "noidungluachon": row["noidungluachon"],
                "dapandung": row["dapandung"]
            })
            
        return list(grouped_data.values())