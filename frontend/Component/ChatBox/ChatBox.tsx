import { useState, useRef, useEffect } from "react";
import type { FunctionComponent } from "react";
import {
  X,
  BookOpen,
  MessageCircle,
  Paperclip,
  Image as ImageIcon,
  Send,
} from "lucide-react";
import "./ChatBox.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatBoxProps {
  userName: string;
  userId: string;
}

const ChatBox: FunctionComponent<ChatBoxProps> = ({ userName, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // --- LOGIC ĐÃ ĐƯỢC LÔI RA NGOÀI ĐỂ KHÔNG BỊ LỖI ĐỎ ---
  const triggerSend = async (text: string) => {
    if (!text.trim()) return;

    // Hiển thị tin nhắn người dùng lên màn hình
    const newMessages = [...messages, { sender: "user", text: text }];
    setMessages(newMessages as Message[]);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          message: text,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Minato đang nghỉ ngơi, vui lòng thử lại sau nhé! 🌊",
        },
      ]);
    }
  };

  const handleInputSend = () => {
    triggerSend(inputText);
    setInputText("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    triggerSend(suggestion);
  };

  return (
    <div className="minato-floating-wrapper">
      {isOpen && (
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <h2 className="chat-title">Trò chuyện với Minato</h2>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={24} color="white" />
            </button>
          </div>

          {/* Body */}
          <section className="chat-body">
            <div className="welcome-section">
              <h3 className="greeting-title">Xin chào, {userName}</h3>
              <p className="greeting-subtitle">
                Bắt đầu cuộc hội thoại ngay thôi nào!
              </p>
            </div>

            {/* Menu Gợi ý */}
            {messages.length === 0 && (
              <div className="suggestion-menu">
                <button
                  className="menu-btn"
                  onClick={() =>
                    handleSuggestionClick(
                      "Bạn có thể giúp tôi tóm tắt bài học hôm nay không?",
                    )
                  }
                >
                  <div className="modern-icon-box">
                    <BookOpen size={24} color="#1E90FF" />
                  </div>
                  <div className="menu-text-wrapper">
                    <span className="menu-text">Giúp tóm tắt bài học</span>
                  </div>
                </button>

                <button
                  className="menu-btn"
                  onClick={() =>
                    handleSuggestionClick(
                      "Làm sao để tập trung học tập hiệu quả hơn?",
                    )
                  }
                >
                  <div className="modern-icon-box">
                    <MessageCircle size={24} color="#1E90FF" />
                  </div>
                  <div className="menu-text-wrapper">
                    <span className="menu-text">Mẹo học tập hiệu quả</span>
                  </div>
                </button>
              </div>
            )}

            {/* Danh sách tin nhắn */}
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
                      textAlign: "left",
                      borderRadius:
                        msg.sender === "user"
                          ? "15px 15px 0 15px"
                          : "15px 15px 15px 0",
                      backgroundColor:
                        msg.sender === "user" ? "#1E90FF" : "#E6F2FF",
                      color: msg.sender === "user" ? "white" : "black",
                      maxWidth: "80%",
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </section>

          {/* Input (Đã gắn hàm handleInputSend) */}
          <div className="chat-input-area">
            <Paperclip
              size={20}
              color="#666"
              style={{ cursor: "pointer", marginRight: "5px" }}
            />
            <ImageIcon
              size={20}
              color="#666"
              style={{ cursor: "pointer", marginRight: "5px" }}
            />

            <input
              className="chat-input-field"
              placeholder="Nhập tin nhắn..."
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInputSend()}
            />

            <Send
              size={22}
              color="#1E90FF"
              style={{ cursor: "pointer" }}
              onClick={handleInputSend}
            />
          </div>
        </div>
      )}

      {/* Nút bấm nổi bên ngoài */}
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
