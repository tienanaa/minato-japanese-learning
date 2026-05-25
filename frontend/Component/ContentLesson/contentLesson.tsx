import './contentLesson.css'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Vocab from '../Vocab/Vocab'
type VocabProp={
    id: string,
    vocab: string,
    cachdoc:string
    mean: string,
}

export default function ContentLesson(){  
   const location = useLocation();

// Ép kiểu an toàn cho state nhận về từ router
const state = location.state as { lessonId?: string } | null;
const lessonId = state?.lessonId || "BH001";
  const userId = localStorage.getItem("user_id") || "U002";

  // 2. Tạo state để lưu trữ danh sách từ vựng/chữ hán lấy từ Backend về
  const [danhSachTuVung, setDanhSachTuVung] = useState<VocabProp[]>([]);
  

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
          
          const formattedList: VocabProp[] = rawList.map((item: any, index: number) => ({
            id: item.tuvungid|| item.baihocid || String(index + 1), // Dự phòng nếu không có id riêng
            vocab: item.tuvung || "",
            cachdoc: item.cachdoc || "",
            mean: item.vietnamese || item.nghia || ""
          }));
          console.log(formattedList)

          setDanhSachTuVung(formattedList);
        } 
      } catch (err: any) {
        console.error("Lỗi lấy chi tiết bài học:", err);
        
      }
      
    };

    fetchDetailData();
  }, [userId, lessonId]);

    return(
        <div className='ContainContent'>
            <nav className="navbar">
                <button className="btn" >Trang chủ</button>
                <button className="btn" >Bài học</button>  
                <button className="btn" >Luyện tập</button>
                <button className="btn" >Bảng xếp hạng</button> 
            </nav>
            <div>
            </div>
            <div className='Content'>
                <h2> Danh sách từ vựng</h2>
                <Vocab listData={danhSachTuVung}/>
            </div>
        </div>
    )
}