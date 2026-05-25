import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "../Component/login/login";
import Home from "../Component/home/home";
import Lesson from "../Component/Lesson/lesson";
import ContentLesson from "../Component/ContentLesson/contentLesson";
import ChatBox from "../Component/ChatBox/ChatBox";
import Quizz from "../Component/Quizz/quizz";
import Result from '../Component/Result/result';
function App() {
  return (
    // Thêm thẻ mở <> ở đây
    <>
      <Routes>
        {/* 🎯 Đường dẫn mặc định (/) sẽ hiển thị trang Login */}
        <Route
          path="/"
          element={
            <div id="center">
              <Login />
            </div>
          }
        />

        {/* 🎯 Đường dẫn (/home) sẽ hiển thị trang tiếp theo */}
        <Route path="/home" element={<Home />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/ContentLesson" element={<ContentLesson />} />
        <Route path="/Quizz" element={<Quizz />} />
        <Route path="/Result" element={<Result/>} />
      </Routes>

      {/* 🎯 NHÉT CHATBOX VÀO ĐÂY (Nằm ngoài Routes nhưng nằm trong thẻ <>) */}
      <ChatBox />
    </> // Thêm thẻ đóng </> ở đây
  );
}

export default App;
