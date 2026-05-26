import './contentLesson.css'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Vocab from '../Vocab/Vocab'
import Kanji from '../Kanji/Kanji'
import { Bell, Settings } from "lucide-react";
import { ArrowRight } from 'lucide-react';
type VocabProp={
    id: string,
    vocab: string,
    cachdoc:string,
    mean: string,
    trangthai: number,
}
type KanjiProp={
    id: string,
    kanji: string,
    sonet:string,
    mean: string,
    trangthai: number,
}

export default function ContentLesson(){  
  
    const navigate= useNavigate();
   const location = useLocation();
  
  const UserName = localStorage.getItem("userName") || "Học viên";
  const trinhdo = localStorage.getItem("trinhdo") || "N3";
// Ép kiểu an toàn cho state nhận về từ router
const state = location.state as { lessonId?: string; loaiBH?: string; tenBH?:string } | null;
const lessonId = state?.lessonId || "BH001";
const loaiBH = state?.loaiBH || "TuVung";
const tenBH = state?.tenBH|| "Bai 1";
  const userId = localStorage.getItem("user_id") || "U002";

  // 2. Tạo state để lưu trữ danh sách từ vựng/chữ hán lấy từ Backend về
  const [danhSachTuVung, setDanhSachTuVung] = useState<VocabProp[]>([]);
  const [danhSachKanji, setDanhSachKanji] = useState<KanjiProp[]>([]);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  
  const updateLearningStatus = async (itemId: string, newStatus: number) => {
    const loai = loaiBH === 'Kanji' ? 'Kanji' : 'TuVung';
    setSavingItemId(itemId);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId,
          loai,
          trang_thai: newStatus,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || result.message || 'Không thể cập nhật trạng thái');
      }

      if (loai === 'TuVung') {
        setDanhSachTuVung((current) =>
          current.map((item) =>
            item.id === itemId ? { ...item, trangthai: newStatus } : item
          )
        );
      } else {
        setDanhSachKanji((current) =>
          current.map((item) =>
            item.id === itemId ? { ...item, trangthai: newStatus } : item
          )
        );
      }
    } catch (error: unknown) {
      console.error('Lỗi cập nhật trạng thái:', error);
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setSavingItemId(null);
    }
  };

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
         { const formattedList: VocabProp[] = rawList.map((item: unknown, index: number) => {
            const anyItem = item as Record<string, unknown>;
            return {
              id: String(anyItem.tuvungid ?? anyItem.baihocid ?? index + 1),
              vocab: String(anyItem.tuvung ?? ""),
              cachdoc: String(anyItem.cachdoc ?? ""),
              mean: String(anyItem.vietnamese ?? anyItem.nghia ?? ""),
              trangthai: Number(anyItem.trangthai ?? 0),
            };
          });
          console.log(formattedList)
          setDanhSachTuVung(formattedList);}
          if(loaiBH=='Kanji')
          {
             const formattedList: KanjiProp[] = rawList.map((item: unknown, index: number) => {
            const anyItem = item as Record<string, unknown>;
            return {
              id: String(anyItem.kanjiid ?? anyItem.baihocid ?? index + 1),
              kanji: String(anyItem.kytu ?? ""),
              sonet: String(anyItem.sonet ?? ""),
              mean: String(anyItem.vietnamese ?? anyItem.nghia ?? ""),
              trangthai: Number(anyItem.trangthai ?? 0),
            };
          });
          console.log(formattedList)
          setDanhSachKanji(formattedList);
          }
        } 
      } catch (err: unknown) {
        console.error("Lỗi lấy chi tiết bài học:", err);
        
      }
      
    };

    fetchDetailData();
  }, [userId, lessonId, loaiBH]);

    const GotoQuizz=()=>{


      navigate('/Quizz',  { state: {lessonId}})

    }

    return(
        <div className='ContainContent'>
         <nav className="home-navbar">
          <div className="nav-logo-section">
            <img src="/logo_rv_bg.png" alt="Logo Minato" className="nav-logo" />
            <span className="nav-minato">Minato</span>
          </div>
          <div className="nav-profile-section">
            <div className="nav-links-section">
            <button className="btn">Trang chủ</button>
            <button className="btn" >
              Bài học
            </button>
            <button className="btn">Luyện tập</button>
            <button className="btn">Bảng xếp hạng</button>
            <button className="btn">Trợ giúp</button>
          </div>
            {/* Các Icon */}
            <div className="nav-icons">
              <Bell size={22} className="icon-action" />
              <Settings size={22} className="icon-action" />
            </div>
            
            {/* Vạch kẻ dọc */}
            <div className="nav-divider"></div>

            {/* Thông tin chữ */}
            <div className="nav-user-info">
              <span className="user-name">{UserName}</span>
              <span className="user-level">{trinhdo}</span>
            </div>

            {/* Ảnh Avatar */}
            <div className="nav-avatar-box">
              {/* Truyền link ảnh Avatar của bạn vào đây */}
              <img src="/user.jpg" alt="Avatar" className="user-avatar" />
            </div>
          </div>
        </nav>
           
            <div>
            </div>
            <h1>{tenBH}</h1>
            <div className='Content'>
              
                <h2>{loaiBH === "Kanji" ? "Danh sách chữ Hán" : "Danh sách từ vựng"}</h2>
    
    {/* Nếu loaiBH là TuVung thì mới hiện bảng Vocab */}
    {loaiBH === "TuVung" && (
      <Vocab
        listData={danhSachTuVung}
        onToggleStatus={(itemId: string, newStatus: number) => updateLearningStatus(itemId, newStatus)}
        savingItemId={savingItemId}
      />
    )}
    {loaiBH === "Kanji" && (
      <Kanji
        listData={danhSachKanji}
        onToggleStatus={(itemId: string, newStatus: number) => updateLearningStatus(itemId, newStatus)}
        savingItemId={savingItemId}
      />
    )}
            </div>
             <button className='btn-test' onClick={GotoQuizz} >Mini Test <ArrowRight /></button>
        </div>
    )
}