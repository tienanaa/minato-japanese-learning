import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from '../Component/login/login';
import Home from  '../Component/home/home';
import Lesson from '../Component/Lesson/lesson'
import ContentLesson from '../Component/ContentLesson/contentLesson'
function App() {

  return (
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
        <Route path='/ContentLesson' element={<ContentLesson/>} />
    </Routes>
  )
}

export default App
