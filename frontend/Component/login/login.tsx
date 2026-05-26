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

    const loginData = {
      username: username,
      password: password,
    };
    try {
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

        const safeUserId =
          userData.UserID || userData.userid || userData.userId;
        const safeUserName =
          userData.Username || userData.username || userData.userName;
        if (safeUserId) {
          localStorage.setItem("userId", String(safeUserId));
        }
        if (safeUserName) {
          localStorage.setItem("userName", String(safeUserName));
        }

        localStorage.setItem("user_info", JSON.stringify(result));

        alert("Đăng nhập thành công!");
        window.location.href = "/home";
        navigate("/home");
      } else {
        console.error("Đăng nhập thất bại:", result.detail);
        alert(result.detail || "Tài khoản hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
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
            <a className="remind_password">Quên mật khẩu</a>
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80%",
              margin: "2px 0",
              gap: "5px",
            }}
          >
            <hr
              style={{
                flex: 1,
                border: "none",
                height: "2px",
                backgroundColor: "#e0e0e0",
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
            Bạn chưa có tài khoản?
            <a
              className="remind"
              onClick={() => navigate("/register")}
              style={{ cursor: "pointer" }}
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
