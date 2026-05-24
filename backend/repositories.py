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
            SELECT CURRENT_DATE AS Ngay, U.TrinhDo, U.MucTieuK, U.MucTieuTV, T.SoLuongKanjiDaHoc, T.SoLuongTuVungDaHoc, T.HoanThanhMucTieu 
            FROM NGUOIDUNG U LEFT JOIN TienTrinhNguoiDung T on T.userID=U.userID and T.NgayHoc = CURRENT_DATE
            WHERE U.UserID = %s 
        """
        cursor.execute(query_view, (user_id,))
        today_progress = cursor.fetchone()

        if not today_progress:
            return None

        cursor.execute("SELECT public.count_kanji(%s)", (user_id,))
        total_kanji = cursor.fetchone()[0]

        cursor.execute("SELECT public.count_tuvung(%s)", (user_id,))
        total_tuvung = cursor.fetchone()[0]

        return { 
            "tien_do_hom_nay": {
                "ngay": today_progress[0],
                "trinh_do":today_progress[1],
                "muc_tieu_Kanji":today_progress[2],
                "muc_tieu_tu_vung":today_progress[3],
                "kanji_da_hoc": today_progress[4] if today_progress else 0,
                "tu_vung_da_hoc": today_progress[5] if today_progress else 0,
                "hoan_thanh": today_progress[6] if today_progress else False
            },
            "tong_tich_luy": {
                "tong_kanji_da_thuoc": total_kanji,
                "tong_tuvung_da_thuoc": total_tuvung
            }
        }

def get_danh_sach_bai_hoc(conn, user_id,trinh_do=None):
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
        
        return { "so_luong_bai_hoc": len(results),
            "danh_sach_bai_hoc": [dict(zip(columns, row)) for row in results]
        }
    
def get_chi_tiet_bai_hoc(conn, baihoc_id, user_id):

    with conn.cursor() as cursor:
        cursor.execute("SELECT loai FROM public.baihoc WHERE baihocid = %s", (baihoc_id,))
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
            "so_luong_chi_tiet":len(results),
            "danh_sach_chi_tiet": [dict(zip(columns, r)) for r in results]
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

def get_lich_su_tong_quan(conn, user_id, baihoc_id):
    with conn.cursor() as cursor:
        query = """
            SELECT LamBaiID, BTOntapID, TenBaiTap, NgayLam, Diem, SoLanLamBai 
            FROM LichSuLamBai 
            WHERE UserID = %s AND BaiHocID = %s
            ORDER BY NgayLam DESC;
        """
        cursor.execute(query, (user_id, baihoc_id))
        
        columns = [column[0] for column in cursor.description]
        results = cursor.fetchall()
        return [dict(zip(columns, row)) for row in results]
 
def submit_quiz(conn, baihoc_id, user_id, btontapid, chi_tiet):
    with conn.cursor() as cursor:
        try:
            query_nhatky = """
                INSERT INTO NHATKYLAMBAI (UserID, BTOntapID, SoLanLamBai, Diem)
                VALUES (%s, %s, 0, 0)
                RETURNING LamBaiID;
            """
            cursor.execute(query_nhatky, (user_id, btontapid))
            lambai_id = cursor.fetchone()[0]

            query_chitiet = """
                INSERT INTO CHITIETLAMBAI (LamBaiID, CauHoiID, LuaChonID, LaDung)
                VALUES (%s, %s, %s, (SELECT DapAnDung FROM CACLUACHON WHERE LuaChonID = %s));
            """
            for ct in chi_tiet:
                cursor.execute(query_chitiet, (lambai_id, ct.cauhoiid, ct.luachonid, ct.luachonid))

            cursor.execute("CALL pr_GhiNhanKetQuaLamBai(%s, %s, %s)", (user_id, btontapid, lambai_id))
            
            cursor.execute("""
                SELECT Diem, SoLanLamBai, 
                       (SELECT COUNT(*) FROM CHITIETLAMBAI WHERE LamBaiID = %s AND LaDung = TRUE) AS SoCauDung
                FROM NHATKYLAMBAI 
                WHERE LamBaiID = %s;
            """, (lambai_id, lambai_id))
            
            row = cursor.fetchone()
            diem = row[0]
            so_lan_lam_bai = row[1]
            so_cau_dung = row[2]

            conn.commit() 
            
            lich_su_tong_quan = get_lich_su_tong_quan(conn, user_id, baihoc_id)

            return {
                "ket_qua_hien_tai": {
                    "lambai_id": lambai_id,
                    "diem_so": float(diem) if diem else 0.0,
                    "so_cau_dung": so_cau_dung,
                    "tong_so_cau": len(chi_tiet),
                    "so_lan_lam_bai": so_lan_lam_bai
                },
                "lich_su_lam_bai": lich_su_tong_quan
            }
        except Exception as e:
            conn.rollback()
            print("Lỗi khi nộp bài:", e)
            return None
        
def get_chi_tiet_lich_su(conn, lambai_id):
    with conn.cursor() as cursor:
        query = """
            SELECT CauHoi, DapAnNguoiDungChon, LaDung, DapAnDungChinhXac 
            FROM ChiTietLichSuLamBai 
            WHERE LamBaiID = %s;
        """
        cursor.execute(query, (lambai_id,))
        
        columns = [column[0] for column in cursor.description]
        results = cursor.fetchall()
        return [dict(zip(columns, row)) for row in results]