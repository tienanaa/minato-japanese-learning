

import { useNavigate } from 'react-router-dom'
import './home.css'
export default function Home(){
    const navigate= useNavigate();
    const GotoLesson=()=> {
        navigate('/lesson');
    }
    return(
        <div className='ContainInHome'>
        <div className="Contain-Home">
            <nav className="navbar">
                <button className="btn" >Trang chủ</button>
                <button className="btn" onClick={GotoLesson} >Bài học</button>  
                <button className="btn" >Luyện tập</button>
                <button className="btn" >Bảng xếp hạng</button>
                  
            </nav>
            <div className='Contain-title'> 
                <h1>Chinh phục tiếng Nhật cùng minato</h1>
                <p>Bắt đầu hành trình vượt đại dương tri thức, từ những bước chân đầu tiên trên cát đến khi làm chủ những con sóng tiếng Nhật cùng bạn đồng hành dễ thương.</p>
            </div>
            
        </div>
        
        </div>
    )
}