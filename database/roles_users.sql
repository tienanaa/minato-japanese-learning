--Tao login CHO USER
CREATE ROLE hocvien_login WITH LOGIN PASSWORD 'MatKhau123@';
CREATE ROLE hocvien_03 WITH LOGIN PASSWORD 'HocVien3@2026';
CREATE ROLE hocvien_04 WITH LOGIN PASSWORD 'HocVien4@2026';
CREATE ROLE hocvien_05 WITH LOGIN PASSWORD 'HocVien5@2026';
CREATE ROLE hocvien_06 WITH LOGIN PASSWORD 'HocVien6@2026';
CREATE ROLE hocvien_07 WITH LOGIN PASSWORD 'HocVien7@2026';
CREATE ROLE hocvien_08 WITH LOGIN PASSWORD 'HocVien8@2026';
CREATE ROLE hocvien_09 WITH LOGIN PASSWORD 'HocVien9@2026';
--tao login cho admin
CREATE ROLE admin_01 WITH LOGIN PASSWORD 'Admin@2026';
--TAO ROLE 
CREATE ROLE role_admin WITH NOLOGIN;
CREATE ROLE role_hoc_vien WITH NOLOGIN;
--tao user gắn login vao role
GRANT role_hoc_vien TO hocvien_login;
GRANT role_hoc_vien TO hocvien_03;
GRANT role_hoc_vien TO hocvien_04;
GRANT role_hoc_vien TO hocvien_05;
GRANT role_hoc_vien TO hocvien_06;
GRANT role_hoc_vien TO hocvien_07;
GRANT role_hoc_vien TO hocvien_08;

GRANT role_hoc_vien TO hocvien_09;
--dua admin vao nhom admin
GRANT role_admin TO admin_01;
ALTER ROLE admin_01 WITH SUPERUSER;


-- phan quyen cho admin
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO role_admin;
-- Cho phép admin sử dụng các chuỗi tự động tăng (SERIAL cho thực thể Nhật ký / Chi tiết làm bài)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO role_admin;

-- phan quyen cho user
GRANT SELECT ON TABLE baihoc, kanji, cachdockanji, tuvung, tuvungkanji TO role_hoc_vien;

-- 2. Các bảng USER được phép XEM (SELECT) dữ liệu cá nhân 
-- (Lưu ý: Logic lọc đúng dòng của user đó sẽ được xử lý ở code Backend thông qua WHERE userid = current_user)
GRANT SELECT ON TABLE trangthaikanji, trangthaituvung, nhatkylambai, chitietlambai TO role_hoc_vien;

-- 3. Phân quyền trên bảng NGUOIDUNG (Xem toàn bộ, nhưng SỬA giới hạn cột)
-- User được xem thông tin cá nhân
GRANT SELECT ON TABLE nguoidung TO role_hoc_vien;
-- User CHỈ ĐƯỢC CẬP NHẬT (UPDATE) trên 4 cột: MatKhau, Username, Email, MucTieuK, MucTieuTV
GRANT UPDATE (matkhau, username, email, muctieuk, muctieutv) ON TABLE nguoidung TO role_hoc_vien;

GRANT SELECT, DELETE ON TABLE tiendohangngay TO role_hoc_vien;