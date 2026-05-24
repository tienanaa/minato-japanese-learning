--VIEW
-- View Tiến trình học tập hàng ngày của người dùng
CREATE VIEW TienTrinhNguoiDung AS
SELECT 
    T.UserID,
    U.Username,
    T.NgayHoc,
    T.SoLuongKanjiDaHoc,
    T.SoLuongTuVungDaHoc,
    T.TrangThai AS HoanThanhMucTieu
FROM TIENDOHANGNGAY T
JOIN NGUOIDUNG U ON T.UserID = U.UserID;

-- View Danh sách từ vựng kèm trạng thái học tập của từng người dùng
CREATE VIEW DanhSachTuVung AS
SELECT 
    TT.UserID,
    V.TuVung,
    V.CachDoc,
    V.Nghia,
    TT.TrangThai -- 0: Chưa học, 1: Đang học, 2: Đã học
FROM TRANGTHAITUVUNG TT
JOIN TUVUNG V ON TT.TuVungID = V.TuVungID;

-- View Danh sách Kanji kèm trạng thái học tập của từng người dùng
CREATE VIEW DanhSachKanji AS
SELECT 
    TK.UserID,
    K.KyTu,
    K.Nghia,
    TK.TrangThai -- 0: Chưa học, 1: Đang học, 2: Đã học
FROM TRANGTHAIKANJI TK
JOIN KANJI K ON TK.KanjiID = K.KanjiID;

-- View Chi tiết chữ Kanji và các cách đọc tương ứng
CREATE VIEW ChiTietKanji AS
SELECT 
    K.KanjiID,
    K.KyTu,
    K.Nghia AS NghiaHanViet,
    C.CachDoc,
    C.Loai AS LoaiCachDoc, -- Onyomi/Kunyomi
    C.DoPhoBien
FROM KANJI K
JOIN CACHDOCKANJI C ON K.KanjiID = C.KanjiID;

-- View phục vụ việc render đề kiểm tra
CREATE VIEW BaiTapKiemTra AS
SELECT 
    BT.BTOntapID,
    BT.TenBaiTap,
    C.CauHoiID,
    C.NoiDung AS NoiDungCauHoi,
    L.LuaChonID,
    L.NoiDung AS NoiDungLuaChon,
    L.DapAnDung
FROM BAITAPONTAP BT
JOIN CAUHOI C ON BT.BTOntapID = C.BTOnTapID
JOIN CACLUACHON L ON C.CauHoiID = L.CauHoiID;

-- View Lịch sử làm bài tổng quát
CREATE VIEW LichSuLamBai AS
SELECT 
	N.LamBaiID,
    N.UserID,
	B.BTOntapID,
	B.BaiHocID,
    B.TenBaiTap,
    N.NgayLam,
    N.Diem,
    N.SoLanLamBai
FROM NHATKYLAMBAI N
JOIN BAITAPONTAP B ON N.BTOntapID = B.BTOntapID;


-- View Chi tiết từng câu trả lời trong một lần làm bài cụ thể
CREATE VIEW ChiTietLichSuLamBai AS
SELECT 
    C.LamBaiID,
    Q.NoiDung AS CauHoi,
    L.NoiDung AS DapAnNguoiDungChon,
    C.LaDung,
    (SELECT NoiDung FROM CACLUACHON WHERE CauHoiID = Q.CauHoiID AND DapAnDung = TRUE) AS DapAnDungChinhXac
FROM CHITIETLAMBAI C
JOIN CAUHOI Q ON C.CauHoiID = Q.CauHoiID
JOIN CACLUACHON L ON C.LuaChonID = L.LuaChonID;

-- View Thống kê dành cho Admin
CREATE VIEW QuanTri AS
SELECT 
    (SELECT COUNT(*) FROM NGUOIDUNG WHERE NgayTaoTK = CURRENT_DATE) AS NguoiDungMoiHomNay,
    (SELECT COUNT(*) FROM TUVUNG) AS TongSoTuVungHienCo,
    (SELECT B.TenBaiTap 
     FROM NHATKYLAMBAI N 
     JOIN BAITAPONTAP B ON N.BTOntapID = B.BTOntapID 
     GROUP BY B.TenBaiTap 
     ORDER BY COUNT(*) DESC LIMIT 1) AS BaiTapDuocLamNhieuNhat;
