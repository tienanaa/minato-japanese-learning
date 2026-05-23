
import React, { useState } from 'react'
import './login.css'

export default function Login(){
    const [username,saveUserName]=useState<string>("")
    const [password, savePassword]=useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
      // Thay URL bên dưới bằng đường dẫn API thực tế của backend bạn (ví dụ FastAPI hoặc Node.js)
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Báo cho backend biết dữ liệu gửi lên là JSON
        },
        body: JSON.stringify(loginData), // Chuyển object thành chuỗi JSON để truyền đi
      });

      const result = await response.json();

      if (response.ok) {
        // Trường hợp 1: Đăng nhập thành công (Status code 200 - 299)
        console.log('Đăng nhập thành công:', result);
        alert('Đăng nhập thành công!');
        
        // Mẹo: Thường backend sẽ trả về một mã token (JWT). Bạn có thể lưu nó lại:
        // localStorage.setItem('token', result.token);
      } else {
        // Trường hợp 2: Backend báo lỗi (ví dụ: Sai mật khẩu, không tìm thấy user)
        console.error('Đăng nhập thất bại:', result.message);
        alert(result.message || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    } catch (error) {
      // Trường hợp 3: Lỗi kết nối mạng hoặc server sập không phản hồi
      console.error('Lỗi kết nối đến server:', error);
      alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau!');
    } finally {
      setIsLoading(false); // Hoàn thành quá trình xử lý, tắt trạng thái chờ
    }
    }
    return(
        <>
        <div className='Contain'>
            
            <div className='containInput'>
                <div className='ContainImg'>
                <img src='../../public/logo-movebg.png'  />
                </div>
                <div className='username'>
                    <label htmlFor="username" >User Name:</label>
                    <input type="text" id="username" placeholder="  Nhập username" onChange={(e)=> saveUserName(e.target.value)} ></input>
                </div>
                <div className='password'>
                    <label htmlFor="pass" >Password: </label>
                    <input type="password" id="pass" placeholder='Nhập password' onChange={(e)=>savePassword(e.target.value)}></input>
                </div>
                <div className='checkbox_save'>
                    <input type="checkbox" id="ghi_nho"></input>
                    <label htmlFor="ghi_nho">Ghi nho dang nhap</label>
                </div>
                <button className="btn-login" onClick={(e)=>LoginForUser(e)} disabled={isLoading}>Đăng nhập</button>

                <a>quên mật khẩu</a>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',    /* Căn đường kẻ thẳng hàng với chữ */
                    justifyContent: 'center', /* Căn cả cụm vào chính giữa form */
                    width: '80%',           /* Chiều rộng full khung chứa */
                    margin: '5px 0',
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