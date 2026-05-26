import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Login from "../Component/login/login";
import Home from "../Component/home/home";
import Lesson from "../Component/Lesson/lesson";
import ContentLesson from "../Component/ContentLesson/contentLesson";
import Quizz from "../Component/Quizz/quizz";
import ChatBox from "../Component/ChatBox/ChatBox";
import Result from "../Component/Result/result";

function App() {
  const location = useLocation();

  const currentUserName = localStorage.getItem("userName") || "Học viên";
  const currentUserId = localStorage.getItem("userId") || "U002";

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div id="center">
              <Login />
            </div>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/ContentLesson" element={<ContentLesson />} />
        <Route path="/Quizz" element={<Quizz />} />
        <Route path="/Result" element={<Result />} />
      </Routes>

      {location.pathname !== "/" && (
        <ChatBox userName={currentUserName} userId={currentUserId} />
      )}
    </>
  );
}

export default App;
