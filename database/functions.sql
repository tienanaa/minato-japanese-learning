
--FUNCTION
CREATE OR REPLACE FUNCTION public.cal_score(
	btid character varying,
	uid character varying,
	nkid integer)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
 DECLARE COUNT_QUESTION NUMERIC;
 DECLARE COUNT_CORRECT_ANSWER NUMERIC;
 DECLARE SCORE NUMERIC;
 BEGIN
 	SELECT COUNT(CAUHOIID) INTO COUNT_QUESTION
	FROM CAUHOI
	WHERE BTONTAPID=BTID;
	
	IF COUNT_QUESTION = 0 OR COUNT_QUESTION IS NULL THEN 
        RETURN 0.0; -- Trả về 0 điểm và thoát hàm luôn
    END IF;
	
	SELECT COUNT (CAUHOIID) INTO COUNT_CORRECT_ANSWER
	FROM CHITIETLAMBAI CTLB JOIN NHATKYLAMBAI NKLB
	ON CTLB.lambaiid=NKLB.LAMBAIID
	WHERE NKLB.BTONTAPID=BTID AND NKLB.USERID=UID AND NKLB.LAMBAIID=NKID AND LADUNG=TRUE;
	SCORE:=(COUNT_CORRECT_ANSWER/COUNT_QUESTION)*10;
	RETURN ROUND(SCORE, 1);
 END;
 
$BODY$;

--dem so kanji da hoc
CREATE OR REPLACE FUNCTION public.count_kanji(
	character varying)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
 
DECLARE TOTAL NUMERIC:=0;
BEGIN
	SELECT COUNT(KANJIID) INTO TOTAL
	FROM trangthaikanji TTK
	WHERE TTK.TRANGTHAI=2 AND TTK.USERID=$1 ;
	RETURN TOTAL;
END;
$BODY$;

-- dem so tu vung da hoc
CREATE OR REPLACE FUNCTION public.count_tuvung(
	character varying)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
 
DECLARE TOTAL NUMERIC:=0;
BEGIN
	SELECT COUNT(tuvungid) INTO TOTAL
	FROM trangthaituvung TTTV
	WHERE TTTV.TRANGTHAI=2 AND TTTV.USERID=$1 ;
	RETURN TOTAL;
END;
$BODY$;

-- lay cac dap an dung
CREATE OR REPLACE FUNCTION public.get_correct_option_for_question(
	character varying)
    RETURNS TABLE(cauhoiid character varying, ndcauhoi text, dapandung text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
 BEGIN
 	RETURN QUERY
	 SELECT CACLUACHON.CAUHOIID, CAUHOI.NOIDUNG, CACLUACHON.NOIDUNG
	 FROM cacluachon JOIN CAUHOI 
	 ON CAUHOI.cauhoiid = cacluachon.cauhoiid
	 WHERE CACLUACHON.DAPANDUNG=TRUE AND CACLUACHON.CAUHOIID IN (
		SELECT CH.CAUHOIID
		FROM BAIHOC BH JOIN BAITAPONTAP BTOT
			ON BH.baihocid = BTOT.baihocid JOIN CAUHOI CH
			ON CH.btontapid = BTOT.btontapid
		WHERE BH.BAIHOCID=$1
	 );
 END;
$BODY$;


-- lay Kanji cua bai hoc
CREATE OR REPLACE FUNCTION public.get_kanji_of_lesson(
	character varying,
	character varying)
    RETURNS TABLE(kanjiid character varying, kytu character, nghia text, sonet smallint, image text, trangthai smallint) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
 
BEGIN
	RETURN QUERY
	SELECT K.KANJIID, K.kytu,K.NGHIA,K.SONET,K.IMAGE, trangthaikanji.trangthai
	FROM BAIHOC BH JOIN kanji K
		ON BH.BAIHOCID=K.BAIHOCID JOIN trangthaikanji
		ON trangthaikanji.kanjiid = K.kanjiid  
	WHERE BH.BAIHOCID= $1 AND TRANGTHAIKANJI.USERID = $2;
END;
$BODY$;

--lay cac Kanji cua tu vung
CREATE OR REPLACE FUNCTION public.get_kanji_of_vocab(
	character varying)
    RETURNS character[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    kanji_list CHAR[];
BEGIN
	SELECT array_agg(KANJI.KYTU) INTO kanji_list
	FROM tuvungkanji JOIN KANJI
	ON KANJI.kanjiid = tuvungkanji.kanjiid
	WHERE TUVUNGID=$1;
	
	RETURN kanji_list;
	
END;
$BODY$;

--lay cac option cua cau hoi
CREATE OR REPLACE FUNCTION public.get_option_for_question(
	character varying)
    RETURNS TABLE(cauhoiid character varying, noidung text, luachon jsonb) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
 BEGIN
 	RETURN QUERY
	 	SELECT CH.CAUHOIID, CH.NOIDUNG, jsonb_agg(jsonb_build_object(
			'ID', CLC.LUACHONID, 'CONTENT', CLC.NOIDUNG
		)) AS LUACHON 
		FROM BAIHOC BH JOIN BAITAPONTAP BTOT
			ON BH.baihocid = BTOT.baihocid JOIN CAUHOI CH
			ON CH.btontapid = BTOT.btontapid JOIN CACLUACHON CLC
			ON CLC.cauhoiid = CH.cauhoiid
		WHERE BH.BAIHOCID=$1
		GROUP BY CH.CAUHOIID;
 END;
$BODY$;


-- lay cac tu vung co chua kanji
CREATE OR REPLACE FUNCTION public.get_tuvung_of_kanji(
	character varying)
    RETURNS character varying[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE lIST_VOCAB VARCHAR[];
BEGIN
	SELECT array_agg(TUVUNG.TUVUNG) INTO LIST_VOCAB
	FROM TUVUNGKANJI JOIN TUVUNG
	ON TUVUNG.tuvungid = TUVUNGKANJI.tuvungid
	WHERE TUVUNGKANJI.KANJIID=$1;
	RETURN LIST_VOCAB;
END;
$BODY$;

-- lay cac tu vung cua bai hoc
CREATE OR REPLACE FUNCTION public.get_vocab_of_lesson(
	character varying,
	character varying)
    RETURNS TABLE(tuvungid character varying, tuvung character varying, cachdoc character varying, nghia text, vidujan text, viduviet text, audio text, trangthai smallint) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
 
BEGIN
	RETURN QUERY
	SELECT TV.TUVUNGID, TV.TUVUNG,TV.CACHDOC, TV.NGHIA, TV.VIDUJAN, TV.VIDUVIET, AUDIO.AUDIO, TTTV.TRANGTHAI
	FROM BAIHOC BH JOIN TUVUNG TV
		ON BH.BAIHOCID=TV.BAIHOCID JOIN trangthaituvung TTTV 
		ON TV.TUVUNGID=TTTV.TUVUNGID JOIN audio ON audio.audioid = TV.audioid
	WHERE BH.BAIHOCID= $1 AND TTTV.USERID=$2;
	
END;
$BODY$;
