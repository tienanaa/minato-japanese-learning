import './lesson.css'
import FrameLesson from '../FrameLesson/frameLesson'
//import ContentLesson from '../ContentLesson/contentLesson'
import { BsFolderFill } from "react-icons/bs";
import "tailwindcss"
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
type LessonPro={
    baihocid: string;
    tenbai: string;
    loai: 'TuVung' | 'Kanji'; // Phân biệt loại bài học
    trinhdo: string;
}
export default function Lesson(){
    const [danhSachBaiHoc, setDanhSachBaiHoc] = useState<LessonPro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy user_id thực tế đã lưu từ trang Login
  const userId = localStorage.getItem("userid") || "U02";
  const trinhDo = "N5"; // Bạn có thể linh hoạt thay đổi "N4", "N3"...

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL(`http://127.0.0.1:8000/api/users/${userId}/baihoc`);
        url.searchParams.append('trinh_do', trinhDo);

        const response = await fetch(url.toString());
        const responseData = await response.json();

        if (response.ok && responseData && responseData.status === "success") {
          setDanhSachBaiHoc(responseData.data.danh_sach_bai_hoc);
        } else {
          setError("Cấu trúc dữ liệu trả về không hợp lệ.");
        }
      } catch (err: any) {
        console.error("Lỗi gọi API bài học:", err);
        setError(err.response?.data?.detail || "Không thể kết nối đến máy chủ backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [userId, trinhDo]);

  const navigate = useNavigate();
  const returnHome = () => {
    navigate('/home');
  }
  const GotoContent = (idCuaBaiHoc: string, loaiBh:string) => {
  navigate('/ContentLesson', { state: { lessonId: idCuaBaiHoc, loaiBH:loaiBh } });
};

  if (loading) return <div className="text-center p-5">Đang tải danh sách bài học...</div>;
  if (error) return <div className="text-center text-danger p-5">{error}</div>;

  return(
        <div className='ContainLesson'>
            <nav className="navbar">
                <button className="btn"  onClick={returnHome}>Trang chủ</button>
                <button className="btn" >Bài học</button>  
                <button className="btn" >Luyện tập</button>
                <button className="btn" >Bảng xếp hạng</button> 
            </nav>
        <div className='ContainTitleLesson'>
            <BsFolderFill style={{
                marginLeft:"15px",
                 width:"5rem",
                 height:"5rem",
                 color: "blue"
            }} />
          <div className=" text-center md:text-left">
    </div>
      {/* Vạch phân cách giữa các khối (Chỉ hiển thị từ màn hình md trở lên) */}
      <div className="hidden md:block w-px h-16 bg-outline-variant mx-4" />

      {/* Khối nút bấm hành động */}

            <span style={{
                marginLeft:"15px",
                fontSize:"2rem",
            }}>Bài học N4</span>
        </div>
        <div className='ContainListLesson'>
          {danhSachBaiHoc.map((baihoc) => (
            <FrameLesson key={baihoc.baihocid} name={baihoc.tenbai} GotoContent={() => GotoContent(baihoc.baihocid, baihoc.loai)} />
          ))}
        </div>
        </div>
    )
}