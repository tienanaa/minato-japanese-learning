import { useNavigate } from "react-router-dom";
import { Bell, Settings } from "lucide-react";
import "./home.css";
export default function Home() {
  const navigate = useNavigate();
  const GotoLesson = () => {
    navigate("/lesson");
  };

  const UserName = localStorage.getItem("userName") || "Học viên";
  const trinhdo = localStorage.getItem("trinhdo") || "N3";

  return (
    <div className="ContainInHome">
      <div className="Contain-Home">
        <nav className="home-navbar">
          <div className="nav-logo-section">
            {/* Đổi tên file logo cho đúng với file trong folder public của bạn */}
            <img src="/logo_rv_bg.png" alt="Logo Minato" className="nav-logo" />
          </div>
          <div className="nav-links-section">
            <button className="btn">Trang chủ</button>
            <button className="btn" onClick={GotoLesson}>
              Bài học
            </button>
            <button className="btn">Luyện tập</button>
            <button className="btn">Bảng xếp hạng</button>
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
    </div>
  );
}
