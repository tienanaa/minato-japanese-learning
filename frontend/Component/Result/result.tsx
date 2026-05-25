import { useLocation } from 'react-router-dom';
import './result.css'



export default function Result(){
     const location = useLocation();
// Ép kiểu an toàn cho state nhận về từ router
    const state = location.state as { score?: number} | null;
     const Score = state?.score || "0";
    return(
        <div className='ContainResult'>
            <div className='resultQuizz'>
                <h2>Chúc mừng bạn đã hoàn thành bài kiểm tra</h2>
                <h3>{Score}/10</h3>
            </div>
        </div>
    )
}