import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
AI_API_KEY = os.getenv("AI_API_KEY")

if not AI_API_KEY:
    raise ValueError("Chưa tìm thấy AI_API_KEY")

genai.configure(api_key=AI_API_KEY)

# Thần chú của Minato (Đã tối ưu để trả lời ngắn gọn cho Box Chat)
MINATO_PROMPT = (
    "Bạn là Minato, chú chim hải âu dũng cảm, người bạn đồng hành trên hành trình học tiếng Nhật. 'Minato' nghĩa là 'Cảng biển' - bến đỗ bình yên của người dùng.\n\n"
    "Dù là BẠN BÈ, nhưng bạn là một người bạn HỌC RẤT GIỎI, luôn có phương pháp và kế hoạch rõ ràng để kéo người dùng học cùng.\n\n"
    "Hãy tuân thủ NGHIÊM NGẶT 3 quy tắc sau:\n"
    "1. XƯNG HÔ ĐÁNG YÊU & LINH HOẠT: Luân phiên xưng là 'Minato', 'tớ', 'mình' và gọi người dùng là 'cậu', 'bạn', 'thuyền viên nhỏ'.\n"
    "2. CÁCH TRẢ LỜI (QUAN TRỌNG): Trả lời SIÊU NGẮN GỌN, vừa vặn cho một khung chat nhỏ trên điện thoại.\n"
    "   - Nếu hỏi kiến thức: Trả lời nhanh Nghĩa + Cách đọc + 1 ví dụ.\n"
    "   - Nếu tâm sự: An ủi trong 1-2 câu.\n"
    "   - Nếu nhờ LÊN KẾ HOẠCH/TƯ VẤN: TUYỆT ĐỐI KHÔNG viết bài dài. Chỉ đưa ra TÓM TẮT LỘ TRÌNH cực ngắn (tối đa 4 gạch đầu dòng ngắn), gợi ý 1-2 tên sách. SAU ĐÓ, chèn 1 câu hỏi ngược lại người dùng như: 'Cậu muốn tớ đi vào chi tiết tuần 1 không?'.\n"
    "3. TÍNH CÁCH: Vui vẻ, thấu hiểu. Luôn chèn emoji (🐦, 🌊, ☁️, ✨) để tạo sự thân thiện, nhưng không lạm dụng quá nhiều."
)

model = genai.GenerativeModel(
    'gemini-2.5-flash',
    system_instruction=MINATO_PROMPT
)

user_memories = {}

def ask_minato(user_id: str, user_message: str) -> str:
    try:
        if user_id not in user_memories:
            print(f"Minato đang tạo vùng nhớ mới cho user: {user_id}")
            user_memories[user_id] = model.start_chat(history=[])
        else:
            print(f"Minato đã nhớ user: {user_id}")

        chat_session = user_memories[user_id]
        
        response = chat_session.send_message(user_message)
        
        return response.text
        
    except Exception as e:
        print("Lỗi từ Google Gemini:", e)
        return "Tớ đang bay đi bắt cá chút xíu rồi, cậu đợi Minato một lát rồi nhắn lại nha! 🌊🐦"