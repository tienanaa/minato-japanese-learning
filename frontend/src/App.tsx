import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "../Component/login/login";
import Home from "../Component/home/home";
import Lesson from "../Component/Lesson/lesson";
import ContentLesson from "../Component/ContentLesson/contentLesson";
import ChatBox from "../Component/ChatBox/ChatBox";

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
      </Routes>

      {/* 🎯 NHÉT CHATBOX VÀO ĐÂY (Nằm ngoài Routes nhưng nằm trong thẻ <>) */}
      <ChatBox />
    </> // Thêm thẻ đóng </> ở đây
  );
}

export default App;
