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