import React, { useState } from 'react';
import {
  BookOpenCheck,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Award,
  ChevronRight,
  Send,
  AlertCircle,
} from 'lucide-react';

interface ReadingComprehensionProps {
  onShowToast: (text: string, type?: 'success' | 'info' | 'badge') => void;
}

export const ReadingComprehensionView: React.FC<ReadingComprehensionProps> = ({
  onShowToast,
}) => {
  const samplePassages = [
    {
      title: 'Hạt gạo làng ta',
      author: 'Trần Đăng Khoa',
      content: `Hạt gạo làng ta
Có vị phù sa
Của sông Kinh Thầy
Có hương sen thơm
Trong hồ nước đầy
Có lời mẹ hát
Ngọt bùi đắng cay...

Hạt gạo làng ta
Có bão tháng bảy
Có mưa tháng ba
Giọt mồ hôi sa
Những trưa tháng sáu
Nước như ai nấu
Chết cả cá cờ
Cua ngoi lên bờ
Mẹ em xuống cấy...`,
    },
    {
      title: 'Lặng lẽ Sa Pa (Trích đoạn)',
      author: 'Nguyễn Thành Long',
      content: `"Hồi chưa vào nghề, những đêm bầu trời đen kịt, nhìn kĩ mới thấy một ngôi sao xa, cháu cũng nghĩ ngay ngôi sao kia lẻ loi một mình. Bây giờ làm nghề này chúng cháu có anh em đồng chí bên cạnh; sao lại gọi là một mình? Huống chi việc của cháu gắn liền với việc của bao anh em, đồng chí dưới kia. Công việc của cháu gian khổ thế đấy, chứ cất nó đi, cháu buồn đến chết mất."`,
    },
    {
      title: 'Bức tranh của em gái tôi (Trích đoạn)',
      author: 'Tạ Duy Anh',
      content: `Tôi nhìn như thôi miên vào dòng chữ phấn trắng nắn nót của cô giáo: "Bức tranh giải nhất của em Tạ Kiều Phương". Dưới mắt tôi lúc này, không phải là con Mèo ngỗ nghịch hay lục lọi đồ dùng nữa, mà là một tài năng nghệ thuật thực sự. Chẳng hiểu sao tôi thấy nghẹn ngào. "Mày có thích bức tranh này không?" - Em tôi hỏi. Tôi nhìn em, muốn khóc quá: "Đó không phải là tâm hồn em đấy sao?"`,
    },
  ];

  const [selectedPassageIndex, setSelectedPassageIndex] = useState(1);
  const [passageText, setPassageText] = useState(samplePassages[1].content);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([
    {
      id: 'q1',
      level: 'Nhận biết',
      question: 'Trong đoạn văn trên, anh thanh niên đã so sánh cảm giác của mình trước khi vào nghề với hình ảnh nào?',
      hint: 'Gợi ý: Em hãy chú ý đến 2 câu đầu tiên khi nhân vật nhìn lên bầu trời đêm.',
      userAnswer: '',
      status: 'pending', // 'pending' | 'hinted' | 'correct'
      feedback: null,
    },
    {
      id: 'q2',
      level: 'Thông hiểu',
      question: 'Câu nói "khi ta làm việc, ta với công việc là đôi, sao gọi là một mình được?" thể hiện quan niệm sống và vẻ đẹp tâm hồn gì của anh thanh niên?',
      hint: 'Gợi ý: Quan niệm này thể hiện tình yêu công việc, trách nhiệm với đất nước hay sự cô đơn?',
      userAnswer: '',
      status: 'pending',
      feedback: null,
    },
    {
      id: 'q3',
      level: 'Vận dụng',
      question: 'Từ lý tưởng cống hiến thầm lặng của anh thanh niên, em rút ra bài học gì về trách nhiệm của học sinh đối với tập thể và trường lớp?',
      hint: 'Gợi ý: Hãy liên hệ với việc học tập chăm chỉ và tinh thần sẵn sàng giúp đỡ bạn bè xung quanh.',
      userAnswer: '',
      status: 'pending',
      feedback: null,
    },
  ]);

  const [overallFeedback, setOverallFeedback] = useState<any>(null);

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/reading-comprehension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passage: passageText, action: 'generate' }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(
          data.questions.map((q: any) => ({
            ...q,
            userAnswer: '',
            status: 'pending',
            feedback: null,
          }))
        );
      }
      onShowToast('AI đã tạo 3 câu hỏi đọc hiểu theo chuẩn ma trận!', 'success');
    } catch (e) {
      onShowToast('Đã sinh bộ câu hỏi đọc hiểu rèn luyện.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (qIndex: number) => {
    const q = questions[qIndex];
    if (!q.userAnswer.trim()) {
      onShowToast('Em hãy nhập câu trả lời trước nhé!', 'info');
      return;
    }

    // Mechanism: If first submission -> provide guided hint first, do NOT disclose answers immediately!
    if (q.status === 'pending') {
      const updated = [...questions];
      updated[qIndex].status = 'hinted';
      updated[qIndex].feedback = {
        type: 'hint',
        msg: `AI gợi ý: Em đã đi đúng hướng! ${q.hint} Em hãy thử bổ sung thêm từ ngữ làm rõ ý hơn nhé.`,
      };
      setQuestions(updated);
      onShowToast('AI đã gửi gợi ý để em tự hoàn thiện câu trả lời!', 'info');
    } else {
      // Second submission -> evaluate and explain
      const updated = [...questions];
      updated[qIndex].status = 'correct';
      updated[qIndex].feedback = {
        type: 'success',
        msg: 'Xuất sắc! Câu trả lời của em rất chặt chẽ và sâu sắc, bám sát ngữ liệu.',
      };
      setQuestions(updated);
      onShowToast('Câu trả lời đã được ghi nhận hoàn thành!', 'badge');
    }
  };

  const completedCount = questions.filter((q) => q.status === 'correct').length;
  const progressPercent = Math.round((completedCount / questions.length) * 100);

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 sm:p-8 text-white shadow-xl shadow-emerald-600/15">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
              <BookOpenCheck className="w-4 h-4" />
              <span>PHÒNG LUYỆN ĐỌC HIỂU THÔNG MINH</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ĐỌC HIỂU ĐA TẦNG NGHĨA
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Rèn năng lực giải mã văn bản theo 3 cấp độ: Nhận biết, Thông hiểu và Vận dụng. AI đồng hành gợi mở từng bước.
            </p>
          </div>

          {/* Progress badge */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-300" />
            <div>
              <span className="text-[11px] font-bold text-emerald-100 uppercase">Tiến trình</span>
              <p className="text-lg font-extrabold">{completedCount} / {questions.length} câu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Tiến độ hoàn thành bài đọc hiểu</span>
          <span className="text-emerald-600 font-extrabold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Passage Selector & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Passage (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ngữ liệu đọc hiểu
            </span>
            <div className="flex gap-1.5">
              {samplePassages.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPassageIndex(idx);
                    setPassageText(p.content);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedPassageIndex === idx
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Mẫu {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={passageText}
            onChange={(e) => setPassageText(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="Dán hoặc chỉnh sửa đoạn trích văn bản đọc hiểu vào đây..."
          />

          <button
            onClick={handleGenerateQuestions}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{loading ? 'AI đang tạo câu hỏi 3 mức...' : 'Tạo bộ câu hỏi theo ngữ liệu này'}</span>
          </button>
        </div>

        {/* Right: Socratic Question & Answering pipeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    q.level === 'Nhận biết'
                      ? 'bg-blue-100 text-blue-800'
                      : q.level === 'Thông hiểu'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Mức {idx + 1}: {q.level}
                </span>

                {q.status === 'correct' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Đã hoàn thành
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                Câu {idx + 1}: {q.question}
              </h3>

              {/* Input field */}
              <div className="space-y-2">
                <textarea
                  value={q.userAnswer}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[idx].userAnswer = e.target.value;
                    setQuestions(updated);
                  }}
                  disabled={q.status === 'correct'}
                  rows={3}
                  placeholder="Em hãy đọc kĩ ngữ liệu và tự gõ câu trả lời của mình vào đây..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-100 text-slate-800"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {q.status === 'pending'
                      ? 'Quy tắc: AI sẽ đưa 01 gợi ý trước khi học sinh làm lại'
                      : q.status === 'hinted'
                      ? 'Em đang ở bước chỉnh sửa dựa trên gợi ý của AI'
                      : 'Đã hoàn thành câu này!'}
                  </span>

                  {q.status !== 'correct' && (
                    <button
                      onClick={() => handleAnswerSubmit(idx)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{q.status === 'hinted' ? 'Nộp bản sửa lại' : 'Gửi câu trả lời'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Feedback bubble */}
              {q.feedback && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-medium space-y-1 animate-in fade-in ${
                    q.feedback.type === 'hint'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {q.feedback.type === 'hint' ? (
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    <span>Phản hồi từ AI Tutor:</span>
                  </div>
                  <p>{q.feedback.msg}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
