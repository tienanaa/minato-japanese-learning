import { FunctionComponent, useState } from "react";
import "./ChatBox.css";

// 1. KHAI BÁO KIỂU DỮ LIỆU TIN NHẮN CHO TYPESCRIPT ĐỠ BÁO LỖI
interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatBox: FunctionComponent = () => {
  // Bật tắt khung chat
  const [isOpen, setIsOpen] = useState(false);

  // 2. KHAI BÁO CÁC BIẾN LƯU TRỮ (STATE)
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); // Danh sách tin nhắn rỗng lúc mới mở

  // 3. HÀM XỬ LÝ KHI BẤM NÚT GỬI (GỌI API)
  const handleSendMessage = async () => {
    if (!inputText.trim()) return; // Không gõ gì thì không làm gì cả

    // Lấy chữ người dùng vừa gõ đưa lên màn hình
    const newMessages = [...messages, { sender: "user", text: inputText }];
    setMessages(newMessages as Message[]);
    setInputText(""); // Gửi xong xóa chữ trong ô đi

    try {
      // Gửi dữ liệu xuống Backend
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "MinhAnh123", // Thay bằng ID user thật nếu cần
          message: inputText,
        }),
      });

      const data = await response.json();

      // Nhận kết quả từ Backend và hiện lên màn hình
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Minato đang mất sóng, không kết nối được tới cảng! 🌊",
        },
      ]);
    }
  };

  return (
    <div className="minato-floating-wrapper">
      {isOpen && (
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <h2 className="chat-title">Trò chuyện với Minato</h2>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ❌
            </button>
          </div>

          {/* Body */}
          <section className="chat-body">
            <div className="welcome-section">
              <h3 className="greeting-title">Xin chào, Minh Anh</h3>
              <p className="greeting-subtitle">
                Bắt đầu cuộc hội thoại ngay thôi nào!
              </p>
            </div>

            {/* Menu gợi ý */}
            {messages.length === 0 && (
              <div className="suggestion-menu">
                <button className="menu-btn">
                  <span className="emoji-icon">📚</span>
                  <div className="menu-text-wrapper">
                    <span className="menu-text">Trao đổi học tập</span>
                  </div>
                </button>
                <button className="menu-btn">
                  <span className="emoji-icon">💬</span>
                  <div className="menu-text-wrapper">
                    <span className="menu-text">Hội thoại hằng ngày</span>
                  </div>
                </button>
              </div>
            )}

            {/* 4. KHU VỰC HIỂN THỊ TIN NHẮN ĐÃ CHAT */}
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: msg.sender === "user" ? "right" : "left",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "10px 15px",
                      borderRadius:
                        msg.sender === "user"
                          ? "15px 15px 0 15px"
                          : "15px 15px 15px 0",
                      backgroundColor:
                        msg.sender === "user" ? "#1E90FF" : "#E6F2FF",
                      color: msg.sender === "user" ? "white" : "black",
                      maxWidth: "80%",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Input */}
          <div className="chat-input-area">
            <span className="action-icon">📎</span>
            <span className="action-icon">🖼️</span>

            {/* 5. LIÊN KẾT Ô NHẬP VỚI STATE VÀ PHÍM ENTER */}
            <input
              className="chat-input-field"
              placeholder="Nhập tin nhắn..."
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />

            {/* 6. GẮN SỰ KIỆN CLICK CHO NÚT GỬI */}
            <span
              className="action-icon"
              style={{ cursor: "pointer" }}
              onClick={handleSendMessage}
            >
              🚀
            </span>
          </div>
        </div>
      )}

      {/* Nút bấm nổi bên ngoài  */}
      {!isOpen && (
        <button className="floating-chat-icon" onClick={() => setIsOpen(true)}>
          <img
            src="/Tính năng help.png"
            alt="Trợ lý học tập Minato"
            style={{ width: "135px", height: "auto", objectFit: "contain" }}
          />
        </button>
      )}
    </div>
  );
};

export default ChatBox;
