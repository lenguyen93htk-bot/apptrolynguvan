import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  FileCheck,
  ClipboardList,
  Copy,
  Printer,
  RefreshCw,
  Plus,
  Send,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface TeacherCornerViewProps {
  onShowToast: (text: string, type?: 'success' | 'info' | 'badge') => void;
}

export const TeacherCornerView: React.FC<TeacherCornerViewProps> = ({ onShowToast }) => {
  const [taskType, setTaskType] = useState<
    'rubric' | 'reading_questions' | 'worksheet' | 'exercise' | 'exam_prompt'
  >('worksheet');
  const [gradeLevel, setGradeLevel] = useState('Lớp 8');
  const [topicInput, setTopicInput] = useState('Văn bản "Lão Hạc" (Nam Cao) - Tình phụ tử và phẩm giá người nông dân');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string>(
    `PHIẾU HỌC TẬP: TÁC PHẨM "LÃO HẠC" (NAM CAO)
Môn: Ngữ văn 8 - Trường THCS Huỳnh Thúc Kháng

Họ và tên học sinh: ....................................... Lớp: 8/....

PHẦN I: TÌM HIỂU HOÀN CẢNH VÀ NỖI ĐAU CỦA LÃO HẠC
1. Em hãy chỉ ra những nguyên nhân dẫn đến quyết định bán con chó Vàng của lão Hạc?
   Trả lời: ........................................................................................
2. Những chi tiết nào miêu tả sự dằn vặt, đau đớn tột cùng của lão Hạc sau khi bán cậu Vàng?
   (Chú ý nét mặt, nụ cười và tiếng khóc).
   Trả lời: ........................................................................................

PHẦN II: SUY NGẪM VÀ ĐÁNH GIÁ (VẬN DỤNG)
3. Cái chết của lão Hạc nói lên điều gì về nhân cách và phẩm giá của người nông dân nghèo trước Cách mạng?
   Trả lời: ........................................................................................
4. Nếu được nhắn gửi một câu đến nhân vật lão Hạc, em sẽ nói điều gì?
   Trả lời: ........................................................................................`
  );

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/teacher-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskType, grade: gradeLevel, topic: topicInput }),
      });
      const data = await res.json();
      setGeneratedResult(data.content || 'Đã tạo tài liệu thành công!');
      onShowToast('Tổ chuyên môn đã tạo xong tài liệu giáo án!', 'success');
    } catch (e) {
      onShowToast('Đã sinh mẫu tài liệu giảng dạy.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    onShowToast('Đã sao chép tài liệu vào bộ nhớ tạm!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 to-emerald-800 p-6 sm:p-8 text-white shadow-xl shadow-teal-700/15">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>KHÔNG GIAN SOẠN GIẢNG & BIÊN SOẠN HỌC LIỆU</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            GÓC GIÁO VIÊN – TỔ NGỮ VĂN & GDCD
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl">
            Bộ công cụ hỗ trợ giáo viên trường THCS Huỳnh Thúc Kháng thiết kế nhanh phiếu học tập, ma trận đề, rubric chấm điểm và câu hỏi phát triển năng lực.
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tool Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Loại học liệu cần tạo:</label>
            <select
              value={taskType}
              onChange={(e: any) => setTaskType(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="worksheet">Phiếu học tập định hướng tư duy</option>
              <option value="rubric">Rubric chấm bài viết theo chuẩn 9 tiêu chí</option>
              <option value="reading_questions">Bộ câu hỏi đọc hiểu ma trận 3 mức độ</option>
              <option value="exam_prompt">Đề luyện tập mở rộng kèm hướng dẫn chấm</option>
            </select>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Khối lớp:</label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="Lớp 6">Lớp 6</option>
              <option value="Lớp 7">Lớp 7</option>
              <option value="Lớp 8">Lớp 8</option>
              <option value="Lớp 9">Lớp 9</option>
            </select>
          </div>

          {/* Action Generate */}
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loading ? 'AI đang soạn thảo...' : 'Tạo học liệu ngay'}</span>
            </button>
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Tác phẩm / Chủ đề trọng tâm:
          </label>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Ví dụ: Truyện Lặng lẽ Sa Pa, Nghị luận về tình bạn tuổi học trò..."
          />
        </div>
      </div>

      {/* Editor & Output Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">Bản thảo học liệu hoàn chỉnh</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In ấn</span>
            </button>
          </div>
        </div>

        <textarea
          value={generatedResult}
          onChange={(e) => setGeneratedResult(e.target.value)}
          rows={14}
          className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />

        <p className="text-[11px] text-slate-400">
          💡 Thầy/Cô có thể trực tiếp chỉnh sửa nội dung trong khung văn bản phía trên trước khi in hoặc xuất ra phiếu học tập cho học sinh.
        </p>
      </div>
    </div>
  );
};
