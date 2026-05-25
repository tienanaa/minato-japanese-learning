
import React, { useState } from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom';

export default function Login(){
    const [username,saveUserName]=useState<string>("")
    const [password, savePassword]=useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const navigate= useNavigate();
    const LoginForUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("dang nhap");
        
    // Gói dữ liệu đăng nhập lại thành một object để gửi đi
        const loginData = {
            username: username,
            password: password
    };
        try {
      // 1. Sửa lại đúng endpoint /api/auth/login
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        // Trường hợp 1: Đăng nhập thành công (Status 200)
        console.log('Đăng nhập thành công:', result);
        alert('Đăng nhập thành công!');
        if (result.user_id) {
          localStorage.setItem('user_id', String(result.user_id));
        } 
        // Cách B: Nếu bạn bọc dữ liệu trong cụm "data" (Ví dụ: { "status": "success", "data": { "user_id": "1" } })
        else if (result.data && result.data.user_id) {
          localStorage.setItem('user_id', String(result.data.user_id));
        }

        // Tiện tay lưu luôn toàn bộ thông tin user dạng JSON để sau này hiển thị Avatar hoặc Tên lên Header
        localStorage.setItem('user_info', JSON.stringify(result));
        // Lưu thông tin user hoặc token nếu cần
        // localStorage.setItem('user', JSON.stringify(result.data));

        // Chỉ chuyển hướng khi đăng nhập thành công thành công
        navigate('/home'); 
      } else {
        // Trường hợp 2: Backend báo lỗi (Ví dụ: 401 Unauthorized)
        // FastAPI HTTPException trả về JSON có dạng { "detail": "Nội dung lỗi" }
        console.error('Đăng nhập thất bại:', result.detail);
        alert(result.detail || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    } catch (error) {
      // Trường hợp 3: Lỗi kết nối mạng (Server sập, sai CORS...)
      console.error('Lỗi kết nối đến server:', error);
      alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau!');
    } finally {
      setIsLoading(false);
    }
  };
    return(
        <>
        <div className='Contain'>
            
            <div className='containInput'>
                <div className='ContainImg'>
                <img src='../../public/logo-movebg.png'  />
                </div>
                <div className='username'>
                    <label htmlFor="username" >User Name:</label>
                    <input type="text" id="username" placeholder="Nhập username" onChange={(e)=> saveUserName(e.target.value)} ></input>
                </div>
                <div className='password'>
                    <label htmlFor="pass" >Password: </label>
                    <input type="password" id="pass" placeholder='Nhập password' onChange={(e)=>savePassword(e.target.value)}></input>
                </div>
                <div className='checkbox_save'>
                    <input type="checkbox" id="ghi_nho" className='custom-checkbox'></input>
                    <label htmlFor="ghi_nho">Ghi nho dang nhap</label>
                </div>
                <button className="btn-login" onClick={(e)=>LoginForUser(e)} disabled={isLoading}>Đăng nhập</button>

                <p><a>quên mật khẩu</a></p>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',    /* Căn đường kẻ thẳng hàng với chữ */
                    justifyContent: 'center', /* Căn cả cụm vào chính giữa form */
                    width: '80%',           /* Chiều rộng full khung chứa */
                    margin: '2px 0',
                    gap:"5px",
    
                }}>
                    <hr
                    style={{ 
                            flex: 1,             /* Tự động kéo dài đường kẻ ra hết khoảng trống */
                            border: 'none', 
                            height: '2px', 
                            backgroundColor: '#e0e0e0' /* Màu xám mờ tinh tế */
                    }}/>
                    <p>Hoặc</p>
                    <hr
                    style={{ 
                             flex: 1, 
                             border: 'none', 
                             height: '2px', 
                             backgroundColor: '#e0e0e0'
                    }}/>
                </div>
                <button className='btn-gg' ><img src='../../public/gg-removebg-preview.png'  /> Đăng nhập với google  </button>
                <p>Bạn chưa có tài khoản?<a className='remind'> đăng ký ngay</a></p>
            </div>
        </div>
        </>
    )
}