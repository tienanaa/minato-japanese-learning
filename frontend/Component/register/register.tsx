import React, { useState } from "react";
import "../login/login.css";
import "./register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Xác nhận mật khẩu
  const [trinhDo, setTrinhDo] = useState<string>("N5");
  const [mucTieuK, setMucTieuK] = useState<number>(5);
  const [mucTieuTV, setMucTieuTV] = useState<number>(10);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!username || !email || !password) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsLoading(true);

    const registerData = {
      username: username,
      email: email,
      password: password,
      trinhdo: trinhDo,
      muctieu_k: mucTieuK,
      muctieu_tv: mucTieuTV,
    };

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/");
      } else {
        alert(result.detail || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="Contain"
      style={{ marginTop: "30px", marginBottom: "30px" }}
    >
      <div className="containInput" style={{ padding: "20px 0" }}>
        <div className="ContainImg">
          <img src="../../public/logo-movebg.png" alt="Logo" />
        </div>
        <h2 style={{ color: "#0074D4", margin: "5px 0" }}>Tạo tài khoản mới</h2>

        <div className="username">
          <label>Tên đăng nhập:</label>
          <input
            type="text"
            placeholder="Nhập username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="username">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Nhập email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="password">
          <label>Mật khẩu:</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="password">
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Trình độ và Mục tiêu */}
        <div className="register-options-row">
          <div className="register-input-group">
            <label>Trình độ:</label>
            <select
              value={trinhDo}
              onChange={(e) => setTrinhDo(e.target.value)}
              className="register-input"
            >
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1</option>
            </select>
          </div>

          <div className="register-input-group">
            <label>Kanji:</label>
            <input
              type="number"
              min="1"
              value={mucTieuK}
              onChange={(e) => setMucTieuK(Number(e.target.value))}
              className="register-input"
            />
          </div>

          <div className="register-input-group">
            <label>Từ vựng:</label>
            <input
              type="number"
              min="1"
              value={mucTieuTV}
              onChange={(e) => setMucTieuTV(Number(e.target.value))}
              className="register-input"
            />
          </div>
        </div>

        <button
          className="btn-login"
          onClick={handleRegister}
          disabled={isLoading}
          style={{ marginTop: "15px" }}
        >
          Đăng ký ngay
        </button>

        <p style={{ marginTop: "10px" }}>
          Đã có tài khoản?{" "}
          <a
            className="remind"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
