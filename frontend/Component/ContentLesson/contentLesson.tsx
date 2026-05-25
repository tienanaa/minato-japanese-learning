import './contentLesson.css'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Vocab from '../Vocab/Vocab'
import Kanji from '../Kanji/Kanji'
type VocabProp={
    id: string,
    vocab: string,
    cachdoc:string,
    mean: string,
}
type KanjiProp={
    id: string,
    kanji: string,
    sonet:string
    mean: string,
}

export default function ContentLesson(){  
    const navigate= useNavigate();
   const location = useLocation();

// Ép kiểu an toàn cho state nhận về từ router
const state = location.state as { lessonId?: string; loaiBH?: string } | null;
const lessonId = state?.lessonId || "BH001";
const loaiBH = state?.loaiBH || "TuVung";
  const userId = localStorage.getItem("user_id") || "U002";

  // 2. Tạo state để lưu trữ danh sách từ vựng/chữ hán lấy từ Backend về
  const [danhSachTuVung, setDanhSachTuVung] = useState<VocabProp[]>([]);
  const [danhSachKanji, setDanhSachKanji] = useState<KanjiProp[]>([]);
  

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        // 3. Gọi chính xác API chi tiết của Backend
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/baihoc/${lessonId}`);
        const json = await response.json();

        if (response.ok && json && json.status === "success") {
          const detailData = json.data;
          
          // 4. Ánh xạ dữ liệu từ backend trả về tương thích với kiểu VocabProp ở frontend
          // Giả sử Backend trả về mảng nằm trong trường: detailData.danh_sach_tu_vung
          const rawList = detailData.danh_sach_chi_tiet || [];
          if(loaiBH=="TuVung")
         { const formattedList: VocabProp[] = rawList.map((item: any, index: number) => ({
            id: item.tuvungid|| item.baihocid || String(index + 1), // Dự phòng nếu không có id riêng
            vocab: item.tuvung || "",
            cachdoc: item.cachdoc || "",
            mean: item.vietnamese || item.nghia || ""
          }));
          console.log(formattedList)
          setDanhSachTuVung(formattedList);}
          if(loaiBH=='Kanji')
          {
             const formattedList: KanjiProp[] = rawList.map((item: any, index: number) => ({
            id: item.kanjiid|| item.baihocid || String(index + 1), // Dự phòng nếu không có id riêng
            kanji: item.kytu || "",
            sonet: item.sonet || "",
            mean: item.vietnamese || item.nghia || ""
          }));
          console.log(formattedList)
          setDanhSachKanji(formattedList);
          }
        } 
      } catch (err: any) {
        console.error("Lỗi lấy chi tiết bài học:", err);
        
      }
      
    };

    fetchDetailData();
  }, [userId, lessonId]);

    const GotoQuizz=()=>{


      navigate('/Quizz',  { state: {lessonId}})

    }

    return(
        <div className='ContainContent'>
            <nav className="navbar">
                <button className="btn" >Trang chủ</button>
                <button className="btn" >Bài học</button>  
                <button className="btn" >Luyện tập</button>
                <button className="btn" >Bảng xếp hạng</button> 
            </nav>
            <button onClick={GotoQuizz} >Mini Test</button>
            <div>
            </div>
            <div className='Content'>
                <h2>{loaiBH === "Kanji" ? "Danh sách chữ Hán" : "Danh sách từ vựng"}</h2>
    
    {/* Nếu loaiBH là TuVung thì mới hiện bảng Vocab */}
    {loaiBH === "TuVung" && <Vocab listData={danhSachTuVung} />}
    
    {/* Nếu loaiBH là Kanji thì mới hiện bảng Kanji */}
    {loaiBH === "Kanji" && <Kanji listData={danhSachKanji} />}
            </div>
        </div>
    )
}