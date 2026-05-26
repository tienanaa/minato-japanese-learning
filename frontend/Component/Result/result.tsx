import { useLocation, useNavigate } from 'react-router-dom';
import './result.css'
import { useEffect, useState } from 'react';

type ChiTietCauHoiProp = {
  cauhoi: string;
  dapannguoidungchon: string;
  ladung: boolean;
  dapandungchinhxac: string;
};

export default function Result(){
     const location = useLocation();
     const navigate = useNavigate ();
// Ép kiểu an toàn cho state nhận về từ router
    const state = location.state as { score?: number; lamBaiId?: number | string } | null;
    
    const Score = state?.score !== undefined ? state.score : 0;
    const LamBaiID = state?.lamBaiId || "001"; // Hứng ID ở đây

    const [chiTietBaiLam, setChiTietBaiLam] = useState<ChiTietCauHoiProp[]>([]);
  const [loading, setLoading] = useState<boolean>(!!LamBaiID);

  useEffect(() => {
    if (!LamBaiID) {
      return;
    }
    console.log("lam bai id", LamBaiID);
    const fetchDetailHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/users/any/quiz/${LamBaiID}`);
        const json = await response.json();

        if (response.ok && json.status === "success") {
          setChiTietBaiLam(json.data || []);
        }
        console.log(json.data)
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết lịch sử làm bài:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailHistory();
  }, [LamBaiID]);

  const ReturnHome=()=>{
    navigate('/lesson')
  }

  if (loading) {
    return (
      <div className='ContainResult'>
        <div className='loading-state'>Đang tải chi tiết...</div>
      </div>
    );
  }

    return(
        <div className='ContainResult'>
          <div className='result-wrapper'>
            <div className='resultQuizz'>
                <h2>Chúc mừng bạn đã hoàn thành bài kiểm tra</h2>
                <h3>Điểm: {Score}/10</h3>
            </div>
            <div className='History'>
                <h2>Xem lại đáp án</h2>
                  {chiTietBaiLam.length === 0 ? (
                    <p>Không có dữ liệu hiển thị hoặc đang tải...</p>) : (
                  chiTietBaiLam.map((item, index) => (
                  <div key={index} className="content" style={{
                    borderColor: item.ladung?'#08fb254d':'#fb08084d',
                    backgroundColor : item.ladung?'#d6f1d8':'#f8e4e4'
                  }} >
                  <p><strong>Câu {index + 1}:</strong> {item.cauhoi}</p>
                  <p>Đáp án bạn chọn: {item.dapannguoidungchon} <span>{item.ladung ? "✅ Đúng" : "❌ Sai"}</span></p>
                  <p>Đáp án chính xác: {item.dapandungchinhxac}</p>
                  </div>
    ))
  )}
            </div>
            <button className='btn-Home' onClick={ReturnHome}>Quay lại bài học</button>
          </div>
        </div>
    )
}