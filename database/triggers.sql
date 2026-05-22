-- TRIGGER
CREATE OR REPLACE FUNCTION check_kanji_baihoc()
RETURNS TRIGGER AS $$
DECLARE
    v_loai VARCHAR(10);
    v_trinhdo VARCHAR(2);
BEGIN
    SELECT Loai, TrinhDo INTO v_loai, v_trinhdo
    FROM BAIHOC
    WHERE BaiHocID = NEW.BaiHocID;

    IF v_loai != 'Kanji' OR v_trinhdo != NEW.TrinhDo THEN
        RAISE EXCEPTION 'Loai bai hoc phai la Kanji va trinh do phai khop nhau.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_kanji_baihoc
BEFORE INSERT OR UPDATE ON KANJI
FOR EACH ROW
EXECUTE FUNCTION check_kanji_baihoc();

CREATE OR REPLACE FUNCTION check_tuvung_baihoc()
RETURNS TRIGGER AS $$
DECLARE
    v_loai VARCHAR(10);
    v_trinhdo VARCHAR(2);
BEGIN
    SELECT Loai, TrinhDo INTO v_loai, v_trinhdo
    FROM BAIHOC
    WHERE BaiHocID = NEW.BaiHocID;

    IF v_loai != 'TuVung' OR v_trinhdo != NEW.TrinhDo THEN
        RAISE EXCEPTION 'Loai bai hoc phai la TuVung va trinh do phai khop nhau.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_tuvung_baihoc
BEFORE INSERT OR UPDATE ON TUVUNG
FOR EACH ROW
EXECUTE FUNCTION check_tuvung_baihoc();

CREATE OR REPLACE FUNCTION set_ladung_chitietlambai()
RETURNS TRIGGER AS $$
BEGIN
    SELECT DapAnDung INTO NEW.LaDung
    FROM CACLUACHON
    WHERE LuaChonID = NEW.LuaChonID AND CauHoiID = NEW.CauHoiID;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lua chon khong ton tai hoac khong thuoc cau hoi nay.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_ladung_chitietlambai
BEFORE INSERT OR UPDATE ON CHITIETLAMBAI
FOR EACH ROW
EXECUTE FUNCTION set_ladung_chitietlambai();

CREATE OR REPLACE FUNCTION set_solanlambai()
RETURNS TRIGGER AS $$
BEGIN
    SELECT COALESCE(MAX(SoLanLamBai), 0) + 1 INTO NEW.SoLanLamBai
    FROM NHATKYLAMBAI
    WHERE UserID = NEW.UserID AND BTOntapID = NEW.BTOntapID;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_solanlambai
BEFORE INSERT ON NHATKYLAMBAI
FOR EACH ROW
EXECUTE FUNCTION set_solanlambai();

CREATE OR REPLACE FUNCTION update_tiendohangngay()
RETURNS TRIGGER AS $$
DECLARE
    v_userid VARCHAR(10);
    v_muctieuk SMALLINT;
    v_muctieutv SMALLINT;
    v_sokanjidahoc SMALLINT;
    v_sotuvungdahoc SMALLINT;
BEGIN
    IF NEW.KanjiID IS NOT NULL THEN
        UPDATE TIENDOHANGNGAY
        SET SoLuongKanjiDaHoc = SoLuongKanjiDaHoc + 1
        WHERE TienDoID = NEW.TienDoID
        RETURNING UserID, SoLuongKanjiDaHoc, SoLuongTuVungDaHoc 
        INTO v_userid, v_sokanjidahoc, v_sotuvungdahoc;
    ELSIF NEW.TuVungID IS NOT NULL THEN
        UPDATE TIENDOHANGNGAY
        SET SoLuongTuVungDaHoc = SoLuongTuVungDaHoc + 1
        WHERE TienDoID = NEW.TienDoID
        RETURNING UserID, SoLuongKanjiDaHoc, SoLuongTuVungDaHoc 
        INTO v_userid, v_sokanjidahoc, v_sotuvungdahoc;
    END IF;

    SELECT MucTieuK, MucTieuTV INTO v_muctieuk, v_muctieutv
    FROM NGUOIDUNG
    WHERE UserID = v_userid;

    IF v_sokanjidahoc >= v_muctieuk AND v_sotuvungdahoc >= v_muctieutv THEN
        UPDATE TIENDOHANGNGAY
        SET TrangThai = TRUE
        WHERE TienDoID = NEW.TienDoID;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tiendohangngay
AFTER INSERT ON TIENDOHANGNGAYCHITIET
FOR EACH ROW
EXECUTE FUNCTION update_tiendohangngay();

CREATE OR REPLACE FUNCTION update_lantruycapcuoi()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE NGUOIDUNG
    SET LanTruyCapCuoi = CURRENT_TIMESTAMP
    WHERE UserID = NEW.UserID;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_truycap_lambai
AFTER INSERT ON NHATKYLAMBAI
FOR EACH ROW
EXECUTE FUNCTION update_lantruycapcuoi();

CREATE TRIGGER trg_update_truycap_tiendo
AFTER INSERT OR UPDATE ON TIENDOHANGNGAY
FOR EACH ROW
EXECUTE FUNCTION update_lantruycapcuoi();

CREATE OR REPLACE FUNCTION delete_tiendohangngay()
RETURNS TRIGGER AS $$
DECLARE
    v_userid VARCHAR(10);
    v_muctieuk SMALLINT;
    v_muctieutv SMALLINT;
    v_sokanjidahoc SMALLINT;
    v_sotuvungdahoc SMALLINT;
BEGIN
    IF OLD.KanjiID IS NOT NULL THEN
        UPDATE TIENDOHANGNGAY
        SET SoLuongKanjiDaHoc = SoLuongKanjiDaHoc - 1
        WHERE TienDoID = OLD.TienDoID
        RETURNING UserID, SoLuongKanjiDaHoc, SoLuongTuVungDaHoc 
        INTO v_userid, v_sokanjidahoc, v_sotuvungdahoc;
    ELSIF OLD.TuVungID IS NOT NULL THEN
        UPDATE TIENDOHANGNGAY
        SET SoLuongTuVungDaHoc = SoLuongTuVungDaHoc - 1
        WHERE TienDoID = OLD.TienDoID
        RETURNING UserID, SoLuongKanjiDaHoc, SoLuongTuVungDaHoc 
        INTO v_userid, v_sokanjidahoc, v_sotuvungdahoc;
    END IF;
    SELECT MucTieuK, MucTieuTV INTO v_muctieuk, v_muctieutv
    FROM NGUOIDUNG
    WHERE UserID = v_userid;
    IF v_sokanjidahoc < v_muctieuk OR v_sotuvungdahoc < v_muctieutv THEN
        UPDATE TIENDOHANGNGAY
        SET TrangThai = FALSE
        WHERE TienDoID = OLD.TienDoID;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_delete_tiendohangngay
AFTER DELETE ON TIENDOHANGNGAYCHITIET
FOR EACH ROW
EXECUTE FUNCTION delete_tiendohangngay();