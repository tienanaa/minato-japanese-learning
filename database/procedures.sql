--PROCEDURE 1: PROCEDURE + CURSOR cho TongKetTienDoNgay

CREATE OR REPLACE PROCEDURE pr_TongKetTienDoNgay()
LANGUAGE plpgsql
AS $$
DECLARE
    
    v_UserID VARCHAR(10);
    v_MucTieuK INT;
    v_MucTieuTV INT;
    v_DaHocK INT;
    v_DaHocTV INT;

    -- [CURSOR] - Tạo một bộ lọc chứa danh sách tất cả người dùng và mục tiêu của họ
    user_cursor CURSOR FOR 
        SELECT UserID, MucTieuK, MucTieuTV 
        FROM NGUOIDUNG;
BEGIN
    -- [MỞ CURSOR] - Bắt đầu đọc danh sách người dùng
    OPEN user_cursor;

    LOOP
        -- [FETCH] - Lấy thông tin của người dùng tiếp theo ra các biến tạm
        FETCH user_cursor INTO v_UserID, v_MucTieuK, v_MucTieuTV;
        
        -- [THOÁT VÒNG LẶP] - Nếu không còn người dùng nào nữa thì dừng lại
        EXIT WHEN NOT FOUND;

        -- [XỬ LÝ DỮ LIỆU] - Lấy số lượng thực tế đã học của người này trong ngày hôm nay
        SELECT SoLuongKanjiDaHoc, SoLuongTuVungDaHoc 
        INTO v_DaHocK, v_DaHocTV
        FROM TIENDOHANGNGAY 
        WHERE UserID = v_UserID AND NgayHoc = CURRENT_DATE;

        -- [LOGIC KIỂM TRA] - So sánh thực tế với mục tiêu
        IF (v_DaHocK >= v_MucTieuK AND v_DaHocTV >= v_MucTieuTV) THEN
            -- Nếu đạt mục tiêu: Cập nhật Trạng thái thành Hoàn thành (1)
            UPDATE TIENDOHANGNGAY 
            SET TrangThai = TRUE 
            WHERE UserID = v_UserID AND NgayHoc = CURRENT_DATE;
        ELSE
            -- Nếu chưa đạt: Cập nhật Trạng thái thành Chưa hoàn thành (0)
            UPDATE TIENDOHANGNGAY 
            SET TrangThai = FALSE 
            WHERE UserID = v_UserID AND NgayHoc = CURRENT_DATE;
        END IF;
    END LOOP;

    -- [ĐÓNG CURSOR] - Giải phóng bộ nhớ sau khi xử lý xong
    CLOSE user_cursor;
END;
$$;

--PROCEDURE 2 cập nhật nhật ký làm bài, thêm điểm số
CREATE OR REPLACE PROCEDURE pr_GhiNhanKetQuaLamBai(
    p_UserID VARCHAR(10),
    p_BTOntapID VARCHAR(10),
    p_LamBaiID INT 
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_Diem NUMERIC(4,1);
    v_SoLan INT;
BEGIN
    v_Diem := CAL_SCORE(p_BTOntapID, p_UserID, p_LamBaiID);

    UPDATE NHATKYLAMBAI 
    SET Diem = v_Diem
    WHERE LamBaiID = p_LamBaiID;

    RAISE NOTICE 'Người dùng % đã hoàn thành bài tập. Điểm: %', p_UserID, v_Diem;
END;
$$;


--Procedure 3 Cập nhật mục tiêu Ngày 

CREATE OR REPLACE PROCEDURE pr_CapNhatMucTieuNgay(p_UserID VARCHAR, p_MucTieuK SMALLINT, p_MucTieuTV SMALLINT)
LANGUAGE plpgsql 
AS $$
BEGIN
    -- Kiểm tra ràng buộc trước khi cập nhật
    IF p_MucTieuK < 0 OR p_MucTieuTV < 0 THEN
        RAISE EXCEPTION 'Mục tiêu không được là số âm!';
    END IF;

    UPDATE NGUOIDUNG 
    SET MucTieuK = p_MucTieuK, MucTieuTV = p_MucTieuTV
    WHERE UserID = p_UserID;
END;
$$;

-- Procedure 4 Reset toàn bộ trạng thái học của từ vựng 
CREATE OR REPLACE PROCEDURE pr_ResetTrangThaiTuVung(p_UserID VARCHAR, p_TuVungID VARCHAR)
LANGUAGE plpgsql 
AS $$
BEGIN
    UPDATE TRANGTHAITUVUNG 
    SET TrangThai = 0, NgayHocLanGanNhat = CURRENT_TIMESTAMP
    WHERE UserID = p_UserID AND TuVungID = p_TuVungID;
END;
$$;

-- Procedure 5 Reset toàn bộ trạng thái học của Kanji 
CREATE OR REPLACE PROCEDURE pr_ResetTrangThaiKanji(p_UserID VARCHAR, p_KanjiID VARCHAR)
LANGUAGE plpgsql 
AS $$
BEGIN
    UPDATE TRANGTHAIKANJI
    SET TrangThai = 0, NgayHocLanGanNhat = CURRENT_TIMESTAMP
    WHERE UserID = p_UserID AND KanjiID = p_KanjiID;
END;
$$;

--PROCEDURE 6 GHI CHÚ CÁ NHÂN CHO TỪ VỰNG
CREATE OR REPLACE PROCEDURE pr_ThemGhiChuHocTap(p_UserID VARCHAR, p_TuVungID VARCHAR, p_NoiDung TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE TRANGTHAITUVUNG 
    SET GhiChu = p_NoiDung
    WHERE UserID = p_UserID AND TuVungID = p_TuVungID;
END;
$$;

--  PROCEDURE 7 THÊM GHI CHÚ CÁ NHÂN CHO KANJI
CREATE OR REPLACE PROCEDURE pr_ThemGhiChuKanji(
    p_UserID VARCHAR, 
    p_KanjiID VARCHAR, -- Đổi tên tham số cho đúng bản chất
    p_NoiDung TEXT
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE TRANGTHAIKANJI -- Cập nhật đúng bảng Kanji
    SET GhiChu = p_NoiDung
    WHERE UserID = p_UserID AND KanjiID = p_KanjiID;
END;
$$;

-- 
CREATE OR REPLACE PROCEDURE pr_GhiNhanHocKanji(
    p_UserID VARCHAR(10),
    p_KanjiID VARCHAR(10),
    p_TrangThai INT,
    p_TienDoID VARCHAR(10),
    p_ChiTietID VARCHAR(10)
)
LANGUAGE plpgsql AS $$

DECLARE
    v_TienDoID VARCHAR(10);
BEGIN
    UPDATE TRANGTHAIKANJI 
    SET TrangThai = p_TrangThai, 
        NgayHocLanGanNhat = CURRENT_TIMESTAMP
    WHERE UserID = p_UserID AND KanjiID = p_KanjiID;

    IF p_TrangThai = 2 THEN 
        INSERT INTO TIENDOHANGNGAY (TienDoID, NgayHoc, UserID, SoLuongTuVungDaHoc, SoLuongKanjiDaHoc, TrangThai)
        VALUES (p_TienDoID, CURRENT_DATE, p_UserID, 0, 0, FALSE)
        ON CONFLICT (UserID, NgayHoc) DO NOTHING;
        
        SELECT TienDoID INTO v_TienDoID 
        FROM TIENDOHANGNGAY 
        WHERE UserID = p_UserID AND NgayHoc = CURRENT_DATE;

        INSERT INTO TIENDOHANGNGAYCHITIET (ChiTietID, TienDoID, KanjiID)
        VALUES (p_ChiTietID, v_TienDoID, p_KanjiID)
        ON CONFLICT (TienDoID, KanjiID) DO NOTHING;
        
    END IF;
END;
$$;

-- Procedure 9
CREATE OR REPLACE PROCEDURE pr_GhiNhanHocTuVung(
    p_UserID VARCHAR(10),
    p_TuVungID VARCHAR(10),
    p_TrangThai INT,
    p_TienDoID VARCHAR(10),
    p_ChiTietID VARCHAR(10)
)
LANGUAGE plpgsql AS $$
DECLARE
    v_TienDoID VARCHAR(10);
BEGIN
    UPDATE TRANGTHAITUVUNG 
    SET TrangThai = p_TrangThai, 
        NgayHocLanGanNhat = CURRENT_TIMESTAMP
    WHERE UserID = p_UserID AND TuVungID = p_TuVungID;

    IF p_TrangThai = 2 THEN 
        INSERT INTO TIENDOHANGNGAY (TienDoID, NgayHoc, UserID, SoLuongTuVungDaHoc, SoLuongKanjiDaHoc, TrangThai)
        VALUES (p_TienDoID, CURRENT_DATE, p_UserID, 0, 0, FALSE)
        ON CONFLICT (UserID, NgayHoc) DO NOTHING;
        
        SELECT TienDoID INTO v_TienDoID 
        FROM TIENDOHANGNGAY 
        WHERE UserID = p_UserID AND NgayHoc = CURRENT_DATE;

        INSERT INTO TIENDOHANGNGAYCHITIET (ChiTietID, TienDoID, TuVungID)
        VALUES (p_ChiTietID, v_TienDoID, p_TuVungID)
        ON CONFLICT (TienDoID, TuVungID) DO NOTHING;
    END IF;
END;
$$;