import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Save,
  CheckCircle2,
  Clock,
  HelpCircle,
  Stethoscope,
  Palette,
  Award,
  ArrowLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface WritingWorkspaceProps {
  initialTopic?: string;
  onBack: () => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'badge') => void;
}

export const WritingWorkspace: React.FC<WritingWorkspaceProps> = ({
  initialTopic = 'Hãy viết bài văn nghị luận về ý nghĩa của lòng biết ơn đối với học sinh THCS trong cuộc sống hôm nay.',
  onBack,
  onShowToast,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [essayContent, setEssayContent] = useState('');
  const [currentStage, setCurrentStage] = useState<number>(5); // 1: Hiểu đề -> 7: Hoàn thiện
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [activeCoachTab, setActiveCoachTab] = useState<'tips' | 'doctor' | 'style' | 'grade'>('tips');
  const [coachLoading, setCoachLoading] = useState<boolean>(false);
  const [coachFeedback, setCoachFeedback] = useState<string>('');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Vừa xong');

  const stages = [
    { num: 1, label: 'Hiểu đề' },
    { num: 2, label: 'Tìm ý' },
    { num: 3, label: 'Luận điểm' },
    { num: 4, label: 'Dàn ý' },
    { num: 5, label: 'Viết' },
    { num: 6, label: 'Tự sửa' },
    { num: 7, label: 'Hoàn thiện' },
  ];

  // Auto-save simulation
  useEffect(() => {
    const timer = setInterval(() => {
      if (essayContent.trim()) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(timeStr);
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [essayContent]);

  const wordCount = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;
  const charCount = essayContent.length;

  const handleManualSave = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(timeStr);
    onShowToast('Đã lưu bản nháp tự động thành công!', 'success');
  };

  const handleConsultCoach = async (mode: 'tips' | 'doctor' | 'style' | 'grade') => {
    setActiveCoachTab(mode);
    setCoachLoading(true);

    try {
      if (mode === 'doctor') {
        const res = await fetch('/api/ai/sentence-doctor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sentence: essayContent.slice(-150) || topic }),
        });
        const data = await res.json();
        setCoachFeedback(
          data.diagnoses?.[0]?.socraticHint || 'Câu văn của em có ý tốt, hãy chú ý ngắt nhịp dấu câu nhé!'
        );
      } else if (mode === 'style') {
        const res = await fetch('/api/ai/style-upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: essayContent.slice(-100) || topic, style: 'Giàu hình ảnh' }),
        });
        const data = await res.json();
        setCoachFeedback(
          data.options?.[0]?.version || 'Hãy thử dùng thêm hình ảnh ẩn dụ hoặc từ ngữ biểu cảm!'
        );
      } else if (mode === 'grade') {
        const res = await fetch('/api/ai/rubric-grader', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, essay: essayContent }),
        });
        const data = await res.json();
        setCoachFeedback(
          `Giám khảo AI nhận xét: ${data.strengths?.[0] || 'Bài viết có cảm xúc chân thành.'} Top việc cần sửa: ${data.top3Fixes?.[0] || 'Bổ sung dẫn chứng cụ thể hơn.'}`
        );
      } else {
        setCoachFeedback(
          'Mẹo cho chặng này: Viết một mạch không dừng lại để mạch cảm xúc tự nhiên, sau đó mới bước vào khâu Tự sửa!'
        );
      }
    } catch (e) {
      setCoachFeedback('AI Coach luôn đồng hành: Em hãy tự tin triển khai suy nghĩ của mình nhé!');
    } finally {
      setCoachLoading(false);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isFocusMode ? 'fixed inset-0 z-50 bg-[#F8FAFC] p-4 sm:p-6 overflow-y-auto' : 'space-y-5 pb-12'
      }`}
    >
      {/* Top Header & Progress Stages */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-[#4169F6] uppercase tracking-wider">
              PHÒNG VIẾT TÍCH HỢP AI
            </span>
            <h2 className="text-base font-extrabold text-slate-900 line-clamp-1">
              {topic}
            </h2>
          </div>
        </div>

        {/* 7-Step Progress Pipeline */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 w-full md:w-auto">
          {stages.map((st, idx) => {
            const isDone = currentStage > st.num;
            const isCurrent = currentStage === st.num;
            return (
              <React.Fragment key={st.num}>
                <button
                  onClick={() => setCurrentStage(st.num)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isCurrent
                      ? 'bg-[#4169F6] text-white shadow-md shadow-blue-500/25 scale-105'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span>{st.num}</span>
                  )}
                  <span>{st.label}</span>
                </button>
                {idx < stages.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Tools: Focus mode, Save */}
        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={isFocusMode ? 'Thoát chế độ tập trung' : 'Chế độ tập trung'}
          >
            {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handleManualSave}
            className="px-4 py-2.5 rounded-2xl bg-[#4169F6] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Lưu bài</span>
          </button>
        </div>
      </div>

      {/* 3-Column Layout: Left Context, Center Editor, Right AI Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Topic & Instructions (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 text-left">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Chi tiết đề bài
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
            {topic}
          </p>

          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs space-y-1 text-slate-700">
            <span className="font-bold text-[#4169F6]">Yêu cầu trọng tâm:</span>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Xác định đúng kiểu bài nghị luận</li>
              <li>Có lí lẽ và dẫn chứng thực tế</li>
              <li>Bố cục 3 phần rõ ràng, mạch lạc</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Đã lưu lúc:
              </span>
              <span className="font-semibold text-slate-800">{lastSavedTime}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Số từ hiện tại:</span>
              <span className="font-bold text-[#4169F6] text-sm">{wordCount} từ</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Số ký tự:</span>
              <span className="font-semibold text-slate-800">{charCount} ký tự</span>
            </div>
          </div>
        </div>

        {/* Center Column: Distraction-free Writing Area (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col min-h-[560px] text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs font-semibold text-slate-500">
            <span>KHÔNG GIAN HỌC SINH TỰ DO VIẾT</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {wordCount} từ
            </span>
          </div>

          <textarea
            value={essayContent}
            onChange={(e) => setEssayContent(e.target.value)}
            placeholder="Hãy bắt đầu viết từng câu, từng đoạn theo suy nghĩ của em ở đây... AI Coach ở cột bên phải sẽ luôn sẵn sàng hỗ trợ khi em cần gợi mở!"
            className="flex-1 w-full p-2 bg-transparent text-slate-800 text-sm sm:text-base leading-relaxed resize-none focus:outline-none placeholder:text-slate-300"
          />

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Mẹo: Nhấn nút bên phải để nhờ AI Coach góp ý đoạn văn đang viết</span>
            <span className="font-medium text-emerald-600">Tự động lưu bài</span>
          </div>
        </div>

        {/* Right Column: AI Coach Panel (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6750FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">AI COACH ĐỒNG HÀNH</h3>
              <p className="text-[10px] text-slate-400">Không làm hộ • Gợi mở tư duy</p>
            </div>
          </div>

          {/* Quick Coach Mode Switcher */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleConsultCoach('tips')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeCoachTab === 'tips'
                  ? 'bg-blue-50 text-[#4169F6] border border-blue-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Gợi ý chặng</span>
            </button>
            <button
              onClick={() => handleConsultCoach('doctor')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeCoachTab === 'doctor'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Bắt bệnh câu</span>
            </button>
            <button
              onClick={() => handleConsultCoach('style')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeCoachTab === 'style'
                  ? 'bg-purple-50 text-[#8B5CF6] border border-purple-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Nâng câu từ</span>
            </button>
            <button
              onClick={() => handleConsultCoach('grade')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeCoachTab === 'grade'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Chấm thử</span>
            </button>
          </div>

          {/* Coach Output Bubble */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-2 min-h-[160px]">
            <span className="font-bold text-slate-900 flex items-center gap-1">
              💬 Lời khuyên từ AI Coach:
            </span>
            {coachLoading ? (
              <p className="text-slate-400 italic">AI Tutor đang phân tích suy nghĩ của em...</p>
            ) : coachFeedback ? (
              <p className="leading-relaxed text-slate-800">{coachFeedback}</p>
            ) : (
              <p className="text-slate-500 leading-relaxed">
                Hãy viết những dòng đầu tiên của đoạn mở bài. Khi viết xong một ý, em có thể nhấn "Bắt bệnh câu" hoặc "Gợi ý chặng" để AI kiểm tra giúp em nhé!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
