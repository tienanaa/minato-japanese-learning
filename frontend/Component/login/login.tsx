import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, saveUserName] = useState<string>("");
  const [password, savePassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const LoginForUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("dang nhap");

    // Gói dữ liệu đăng nhập lại thành một object để gửi đi
    const loginData = {
      username: username,
      password: password,
    };
    try {
      // 1. Sửa lại đúng endpoint /api/auth/login
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Đăng nhập thành công:", result);

        const userData = result.data || {};

        const safeUserId = userData.UserID;
        const safeUserName = userData.Username;

        if (safeUserId) {
          localStorage.setItem("userId", String(safeUserId));
        }
        if (safeUserName) {
          localStorage.setItem("userName", String(safeUserName));
        }

        // Lưu backup toàn bộ cục dữ liệu
        localStorage.setItem("user_info", JSON.stringify(result));

        alert("Đăng nhập thành công!");
        window.location.href = "/home";
      } else {
        // Trường hợp 2: Backend báo lỗi (Ví dụ: 401 Unauthorized)
        // FastAPI HTTPException trả về JSON có dạng { "detail": "Nội dung lỗi" }
        console.error("Đăng nhập thất bại:", result.detail);
        alert(result.detail || "Tài khoản hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      // Trường hợp 3: Lỗi kết nối mạng (Server sập, sai CORS...)
      console.error("Lỗi kết nối đến server:", error);
      alert("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="Contain">
        <div className="containInput">
          <div className="ContainImg">
            <img src="../../public/logo-movebg.png" />
          </div>
          <div className="username">
            <label htmlFor="username">User Name:</label>
            <input
              type="text"
              id="username"
              placeholder="Nhập username"
              onChange={(e) => saveUserName(e.target.value)}
            ></input>
          </div>
          <div className="password">
            <label htmlFor="pass">Password: </label>
            <input
              type="password"
              id="pass"
              placeholder="Nhập password"
              onChange={(e) => savePassword(e.target.value)}
            ></input>
          </div>
          <div className="checkbox_save">
            <input
              type="checkbox"
              id="ghi_nho"
              className="custom-checkbox"
            ></input>
            <label htmlFor="ghi_nho">Ghi nhớ đăng nhập</label>
          </div>
          <button
            className="btn-login"
            onClick={(e) => LoginForUser(e)}
            disabled={isLoading}
          >
            Đăng nhập
          </button>

          <p>
            <a>Quên mật khẩu</a>
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center" /* Căn đường kẻ thẳng hàng với chữ */,
              justifyContent: "center" /* Căn cả cụm vào chính giữa form */,
              width: "80%" /* Chiều rộng full khung chứa */,
              margin: "2px 0",
              gap: "5px",
            }}
          >
            <hr
              style={{
                flex: 1 /* Tự động kéo dài đường kẻ ra hết khoảng trống */,
                border: "none",
                height: "2px",
                backgroundColor: "#e0e0e0" /* Màu xám mờ tinh tế */,
              }}
            />
            <p>Hoặc</p>
            <hr
              style={{
                flex: 1,
                border: "none",
                height: "2px",
                backgroundColor: "#e0e0e0",
              }}
            />
          </div>
          <button className="btn-gg">
            <img src="../../public/gg-removebg-preview.png" /> Đăng nhập với
            google{" "}
          </button>
          <p>
            Bạn chưa có tài khoản?<a className="remind"> đăng ký ngay</a>
          </p>
        </div>
      </div>
    </>
  );
}
