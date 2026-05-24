import './contentLesson.css'
import Vocab from '../Vocab/Vocab'
export default function ContentLesson(){
    return(
        <div className='ContainContent'>
            <nav className="navbar">
                <button className="btn" >Trang chủ</button>
                <button className="btn" >Bài học</button>  
                <button className="btn" >Luyện tập</button>
                <button className="btn" >Bảng xếp hạng</button> 
            </nav>
            <div>
                <h2> Bai 1 /tu vung </h2>
            </div>
            <div className='Content'>
                <h2> Danh sách từ vựng</h2>
                <Vocab/>
            </div>
        </div>
    )
}