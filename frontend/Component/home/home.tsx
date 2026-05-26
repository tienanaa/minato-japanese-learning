import { useNavigate } from "react-router-dom";
import { Bell, Settings } from "lucide-react";
import "./home.css";
import { useEffect, useState } from "react";

type TienDoHomNay = {
  ngay: string;
  trinh_do: string;
  muc_tieu_Kanji: number;
  muc_tieu_tu_vung: number;
  kanji_da_hoc: number | null;     // Có thể là số hoặc null
  tu_vung_da_hoc: number | null;   // Có thể là số hoặc null
  hoan_thanh: boolean | number | null; // Tùy thuộc backend trả về kiểu gì khi không null
};

type TongTichLuy = {
  tong_kanji_da_thuoc: number;
  tong_tuvung_da_thuoc: number;
};

type DashboardData = {
  tien_do_hom_nay?: TienDoHomNay;
  tong_tich_luy?: TongTichLuy;
};
export default function Home() {
  const userId = localStorage.getItem("userId") || "U002";
  const navigate = useNavigate();
  const GotoLesson = () => {
    navigate("/lesson");
  };
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const UserName = localStorage.getItem("userName") || "Học viên";
 
  // 3. Hàm gọi API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setErrorMessage(null); // Reset lỗi cũ trước khi gọi lại

        const response = await fetch(`http://127.0.0.1:8000/api/dashboard/${userId}`);
        const json = await response.json();

        if (response.ok && json.status === "success") {
          // Lấy trúng phần "data" bên trong cục JSON mà Backend trả về
          setDashboardData(json.data);
          localStorage.setItem("trinhdo", String(json.data.tien_do_hom_nay.trinh_do ));
          console.log(json.data)
        } else {
          // Bắt các lỗi do mình chủ động quăng ra từ Backend (như lỗi 404 user không tồn tại)
          setErrorMessage(json.detail || "Không thể tải dữ liệu Dashboard.");
        }
      } catch (err) {
        // Bắt lỗi kết nối mạng, sập server...
        console.error("Lỗi kết nối API Dashboard:", err);
        setErrorMessage("Lỗi kết nối hệ thống. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userId]);
   const trinhdo = localStorage.getItem("trinhdo") || "N3";
  if (loading) {
    return <div className="loading">Đang tải dữ liệu Dashboard...</div>;
  }

  if (errorMessage) {
    return <div className="error-box" style={{ color: "red", padding: "20px" }}>❌ {errorMessage}</div>;
  }
  return (
    <div className="ContainInHome">
      <div className="Contain-Home">
        <nav className="home-navbar">
          <div className="nav-logo-section">
            <img src="/logo_rv_bg.png" alt="Logo Minato" className="nav-logo" />
            <span className="nav-minato">Minato</span>
          </div>
          <div className="nav-links-section">
            <button className="btn">Trang chủ</button>
            <button className="btn" onClick={GotoLesson}>
              Bài học
            </button>
            <button className="btn">Luyện tập</button>
            <button className="btn">Bảng xếp hạng</button>
            <button className="btn">Trợ giúp</button>
          </div>
          <div className="nav-profile-section">
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
        <div className="Contain-title">
          <h1>Chinh phục tiếng Nhật cùng minato</h1>
          <p>
            Bắt đầu hành trình vượt đại dương tri thức, từ những bước chân đầu
            tiên trên cát đến khi làm chủ những con sóng tiếng Nhật cùng bạn
            đồng hành dễ thương.
          </p>
        </div>
      </div>
      <div className="Dasboard">
        <h3>Mục tiêu học tập</h3>
        <div className="dashboard-item">
          <span>Mục tiêu Kanji:</span>
          <span>{dashboardData?.tien_do_hom_nay?.muc_tieu_Kanji}</span>
        </div>
        <hr/>
        <div className="dashboard-item">
          <span>Mục tiêu từ vựng:</span>
          <span>{dashboardData?.tien_do_hom_nay?.muc_tieu_tu_vung}</span>
        </div>
        <hr/>
        <div className="dashboard-item">
          <span>Kanji đã thuộc:</span>
          <span>{dashboardData?.tong_tich_luy?.tong_kanji_da_thuoc}</span>
        </div>
        <hr/>
        <div className="dashboard-item">
          <span>Từ vựng đã thuộc:</span>
          <span>{dashboardData?.tong_tich_luy?.tong_tuvung_da_thuoc}</span>
        </div>
      </div>
    </div>
  );
}
