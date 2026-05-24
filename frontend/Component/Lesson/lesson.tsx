import './lesson.css'
import FrameLesson from '../FrameLesson/frameLesson'
//import ContentLesson from '../ContentLesson/contentLesson'
import { BsFolderFill } from "react-icons/bs";
import "tailwindcss"
import { useNavigate } from 'react-router-dom';
export default function Lesson(){
    const navigate= useNavigate();
    const returnHome=()=>{
      navigate('/home');
    }
    const GotoContent=()=>{
      navigate('/ContentLesson')
    }
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
            <FrameLesson name={"bai 1"} GotoContent={GotoContent}/>
        </div>
        </div>
    )
}