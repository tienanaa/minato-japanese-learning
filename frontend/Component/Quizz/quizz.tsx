
import './quizz.css'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type DapAnProp= {
  luachonid: string;
  noidungluachon: string;
  dapandung: boolean;
}

type QuestionProp= {
  btontapid: string;
  tenbaitap: string;
  cauhoiid: string;
  noidungcauhoi: string;
  danh_sach_dap_an: DapAnProp[];
}

export default function Quizz(){
  const [countAnswer, setCountAnswer]= useState(0)
  const location = useLocation();
  const navigate = useNavigate();
  const [score, setScore]= useState(0);
  // Lấy dữ liệu bài học được truyền từ trang trước qua Router State
  const state = location.state as { lessonId?: string } | null;
  const lessonId = state?.lessonId || "BH001";
  const userId = localStorage.getItem("userid") || "U002";
  // Quản lý dữ liệu và trạng thái
  const [danhSachCauHoi, setDanhSachCauHoi] = useState<QuestionProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lưu trữ đáp án người dùng chọn (Ví dụ: { "CH001": "LC001", "CH002": "LC005" })
  const [userChoices, setUserChoices] = useState<{ [key: string]: string }>({});

  // 2. Fetch dữ liệu từ Backend
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/baihoc/${lessonId}/quiz`
        );
        const json = await response.json();

        if (response.ok && json && json.status === "success") {
          setDanhSachCauHoi(json.data || []);
        } else {
          setError(json.message || "Không thể tải câu hỏi trắc nghiệm.");
        }
        console.log(json.data)
        console.log(danhSachCauHoi)
      } catch (err: any) {
        console.error("Lỗi lấy dữ liệu bài test:", err);
        setError("Đã xảy ra lỗi kết nối đến hệ thống.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [userId, lessonId]);
  useEffect(() => {
  console.log("Dữ liệu thực tế trong state hiện tại:", danhSachCauHoi);
}, [danhSachCauHoi]); // Mỗi khi danhSachCauHoi cập nhật, useEffect này sẽ chạy
  const handleSelectAnswer = (cauhoiid: string, luachonid: string, ladung:boolean) => {
    const updatedChoices = {
      ...userChoices,
      [cauhoiid]: luachonid,
    };
    setUserChoices(updatedChoices);

    let updatedScore = score;
    if (ladung) {
      updatedScore = score + 5;
      setScore(updatedScore);
    }

    // 2. Chuyển câu hỏi hoặc nộp bài
    nextQuestion(updatedChoices, updatedScore);
  };

  const handleSubmitQuiz = async (finalChoices: { [key: string]: string }, finalScore: number) => {
    try {
      // Chuyển đổi dữ liệu Object thành mảng chi tiết giống Backend yêu cầu
      const chiTietBaiLam = Object.entries(finalChoices).map(([cauHoiId, luaChonId]) => ({
  cauhoiid: cauHoiId,
  luachonid: luaChonId
}));

      const btontapid = danhSachCauHoi[0]?.btontapid || "BT001";

      const bodyData = {
        btontapid: btontapid,
        chi_tiet: chiTietBaiLam // Bạn check kỹ lại Backend xem key này là chi_tiet hay gì nhé
      };

      console.log("Dữ liệu nộp lên API:", bodyData);
      console.log("Điểm số tính được ở Frontend:", finalScore);
      setScore(finalScore)
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/baihoc/${lessonId}/quiz/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      const json = await response.json();

      if (response.ok && json.status === "success") {
        const lamBaiId = json.data?.ket_qua_hien_tai?.lambai_id || "";
        alert(`🎉 Nộp bài thành công! Điểm của bạn: ${finalScore}`);
         navigate('/Result', {state:{ score: finalScore,lamBaiId: lamBaiId }})
        // Thích thì điều hướng về trang bài học
        // navigate("/lesson");
      } else {
        alert("❌ Nộp bài thất bại: " + (json.detail || "Vui lòng thử lại."));
      }
    } catch (err) {
      console.error("Lỗi gọi API nộp bài:", err);
      alert("❌ Lỗi hệ thống, không thể nộp bài.");
    }
  };

  const nextQuestion = (currentChoices: { [key: string]: string }, currentScore: number) => {
    if (countAnswer < danhSachCauHoi.length - 1) {
      const count = countAnswer + 1;
      setCountAnswer(count);
    } else {
      console.log("Đáp án hoàn chỉnh:", currentChoices);
      console.log("Điểm hoàn chỉnh:", currentScore);
      
      // Tiến hành gọi API nộp bài tự động khi bấm câu cuối
      handleSubmitQuiz(currentChoices, currentScore);
     
    }
  };

  if (loading) return <div className="quiz-status">🔄 Đang tải câu hỏi...</div>;
  if (error || danhSachCauHoi.length === 0) {
    return (
      <div className="quiz-status">
        <p>{error || "Bài học này hiện chưa có câu hỏi trắc nghiệm."}</p>
        <button className="btn-back" onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }
  
  const showQuestion=()=>{
    return(
      <div>
        <div className='Quesstion'>
          <h2> {danhSachCauHoi[countAnswer].noidungcauhoi} </h2>
        </div>
        {danhSachCauHoi[countAnswer].danh_sach_dap_an.map((answer)=>(
          <button
            key={answer.luachonid}
            className='btn-answer'
            onClick={() => handleSelectAnswer(danhSachCauHoi[countAnswer].cauhoiid, answer.luachonid, answer.dapandung)}>
            {answer.noidungluachon}
          </button>
        ))}
      </div>
    )}

    return (
        <div className="ContainQuizz">
            <div className='ContainOfQuizz'>
                {showQuestion()}
                
            </div>
        </div>
    )

}