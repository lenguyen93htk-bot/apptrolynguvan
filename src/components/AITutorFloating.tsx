import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  MessageSquare,
  BookOpen,
  CornerDownLeft,
  ChevronDown,
} from 'lucide-react';

interface AITutorFloatingProps {
  onShowToast: (text: string, type?: 'success' | 'info' | 'badge') => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'student';
  text: string;
  time: string;
}

export const AITutorFloating: React.FC<AITutorFloatingProps> = ({ onShowToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Chào em! Thầy/cô là AI Tutor môn Ngữ văn trường THCS Huỳnh Thúc Kháng. Nhớ quy tắc của chúng ta nhé: "AI không viết thay em – AI giúp em biết cách suy nghĩ để tự viết hay hơn!" Hôm nay em đang gặp khó khăn ở bài học nào?',
      time: 'Vừa xong',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const studentMsg: Message = {
      id: Date.now().toString(),
      sender: 'student',
      text: textToSend.trim(),
      time: timeStr,
    };

    setMessages((prev) => [...prev, studentMsg]);
    if (!customPrompt) setInputText('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/ai/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: historyPayload }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Thầy/cô đang lắng nghe em đây!',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Thầy/cô hiểu suy nghĩ của em! Em hãy thử trả lời câu hỏi này trước: Điều gì khiến em ấn tượng nhất ở đề bài này?',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Em chưa biết cách mở bài gián tiếp?',
    'Làm sao để liên kết hai đoạn văn?',
    'Phân biệt ẩn dụ và hoán dụ?',
    'Viết hộ em một bài văn mẫu đi!',
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-8 right-6 z-50 p-4 rounded-3xl bg-gradient-to-tr from-[#4169F6] to-[#6750FF] text-white shadow-2xl shadow-indigo-500/35 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2.5 group"
          title="Mở AI Tutor Ngữ văn"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#11B981] rounded-full ring-2 ring-white animate-ping" />
          </div>
          <span className="hidden sm:inline-block text-xs font-extrabold pr-1">
            AI Tutor Ngữ văn
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-8 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[600px] h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#4169F6] to-[#6750FF] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold">AI Tutor Đồng Hành</span>
                  <span className="w-2 h-2 rounded-full bg-[#11B981]" />
                </div>
                <p className="text-[11px] text-indigo-100 font-medium">
                  Tổ Ngữ văn • THCS Huỳnh Thúc Kháng
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Socratic Notice Banner */}
          <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-900 font-medium text-left flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>AI luôn hướng dẫn tư duy từng bước, không làm bài hộ!</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-left bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'student'
                      ? 'bg-[#4169F6] text-white rounded-br-xs shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#6750FF]" />
                <span>AI Tutor đang suy nghĩ câu hỏi dẫn dắt...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-[#4169F6] text-slate-600 text-[11px] font-semibold whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập câu hỏi hoặc suy nghĩ của em..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169F6] text-slate-800"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-[#4169F6] hover:bg-blue-600 text-white disabled:opacity-40 transition-all"
              aria-label="Gửi"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
