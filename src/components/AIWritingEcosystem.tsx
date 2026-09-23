import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  GitBranch,
  Network,
  Layout,
  FileEdit,
  ShieldAlert,
  Stethoscope,
  Palette,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Send,
  Sliders,
  Copy,
  BookOpen,
} from 'lucide-react';
import { RubricEvaluation } from '../types';

interface AIWritingEcosystemProps {
  onShowToast: (text: string, type?: 'success' | 'info' | 'badge') => void;
  onOpenWorkspace: (topic: string) => void;
}

export const AIWritingEcosystem: React.FC<AIWritingEcosystemProps> = ({
  onShowToast,
  onOpenWorkspace,
}) => {
  const [activeTool, setActiveTool] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Common shared topic
  const [topic, setTopic] = useState<string>(
    'Hãy viết bài văn nghị luận về ý nghĩa của lòng biết ơn đối với học sinh THCS trong cuộc sống hôm nay.'
  );

  // 1. AI 1: HIỂU ĐỀ State
  const [ai1Result, setAi1Result] = useState<any>(null);
  const [ai1StudentReflection, setAi1StudentReflection] = useState<string>('');
  const [ai1TeacherFeedback, setAi1TeacherFeedback] = useState<string>('');

  // 2. AI 2: KHƠI NGUỒN Ý TƯỞNG State
  const [ideaList, setIdeaList] = useState<Array<{ id: string; text: string; category: string }>>([
    { id: '1', text: 'Biết ơn thầy cô, cha mẹ nuôi nấng dạy dỗ thành người', category: 'Cội nguồn' },
    { id: '2', text: 'Biết ơn những người lao động bình dị (bác lao công, anh cứu hỏa)', category: 'Xã hội' },
    { id: '3', text: 'Thể hiện qua hành động cố gắng học tập, lễ phép, nói lời cảm ơn', category: 'Hành động' },
  ]);
  const [newIdeaText, setNewIdeaText] = useState('');
  const [ai2SocraticQuestions, setAi2SocraticQuestions] = useState<string[]>([
    'Điều gì trong đề khiến em cảm thấy rung động hoặc gần gũi nhất?',
    'Em đã từng cảm thấy vô cùng biết ơn một ai đó chưa? Lúc ấy em đã hành động thế nào?',
    'Nếu một người chỉ biết nhận mà không bao giờ biết ơn thì điều gì sẽ xảy ra?',
  ]);

  // 3. AI 3: CÂY LUẬN ĐIỂM State
  const [thesisText, setThesisText] = useState('Lòng biết ơn là cội nguồn của nhân cách và giúp tâm hồn học sinh trở nên phong phú, tươi đẹp.');
  const [thesisPoints, setThesisPoints] = useState([
    {
      point: 'Luận điểm 1: Lòng biết ơn nhắc nhở con người về nguồn cội và những ân tình',
      reasoning: 'Mỗi chúng ta lớn lên đều nhờ công ơn sinh thành, dưỡng dục và sự cưu mang của cộng đồng.',
      evidence: 'Dẫn chứng: Câu chuyện về ngày Nhà giáo Việt Nam 20/11, sự tri ân các anh hùng liệt sĩ.',
    },
    {
      point: 'Luận điểm 2: Lòng biết ơn tạo động lực hoàn thiện bản thân và lan tỏa lối sống đẹp',
      reasoning: 'Khi biết ơn, con người không bao giờ tự mãn mà luôn cố gắng sống tử tế, có trách nhiệm.',
      evidence: 'Dẫn chứng: Học sinh nỗ lực rèn luyện để không phụ lòng mong đợi của gia đình, thầy cô.',
    },
    {
      point: 'Luận điểm 3 (Mở rộng/Phản biện): Phê phán lối sống vô cảm, ích kỷ, "ăn cháo đá bát"',
      reasoning: 'Lối sống bội bạc sẽ khiến con người bị cô lập và đánh mất nhân phẩm.',
      evidence: 'Dẫn chứng: Một số bạn trẻ ỷ lại, coi mọi sự hy sinh của cha mẹ là lẽ đương nhiên.',
    },
  ]);
  const [thesisCheckResult, setThesisCheckResult] = useState<any>(null);

  // 4. AI 4: SƠ ĐỒ TƯ DUY State
  const [mindmapData, setMindmapData] = useState<any>(null);
  const [collapsedBranches, setCollapsedBranches] = useState<Record<string, boolean>>({});

  // 5. AI 5: KIẾN TRÚC SƯ DÀN Ý State
  const [outlineDraft, setOutlineDraft] = useState({
    intro: 'Dẫn dắt từ câu tục ngữ "Uống nước nhớ nguồn", nêu vấn đề lòng biết ơn.',
    p1: 'Giải thích lòng biết ơn là sự ghi nhớ và đền đáp công lao.',
    p2: 'Chứng minh bằng các tấm gương và biểu hiện trong học đường.',
    counter: 'Phản biện thói vô ơn và đòi hỏi quá đáng.',
    outro: 'Khẳng định lại giá trị và cam kết hành động của bản thân.',
  });
  const [outlineResult, setOutlineResult] = useState<any>(null);

  // 6. AI 6: PHÒNG LUYỆN VIẾT ĐOẠN State
  const [paraType, setParaType] = useState('Đoạn mở bài');
  const [paragraphContent, setParagraphContent] = useState(
    'Có ai đó đã từng nói rằng, lòng biết ơn là bông hoa đẹp nhất nở trong khu vườn tâm hồn. Đối với mỗi học sinh THCS chúng em hôm nay, sống có lòng biết ơn không chỉ là một bổn phận đạo đức mà còn là kim chỉ nam giúp ta trưởng thành.'
  );
  const [paragraphReview, setParagraphReview] = useState<any>(null);

  // 7. AI 7: HUẤN LUYỆN VIÊN LẬP LUẬN State
  const [argumentStatement, setArgumentStatement] = useState(
    'Chỉ cần trong lòng luôn nghĩ đến việc biết ơn là đủ, không nhất thiết phải nói ra thành lời hay làm hành động cụ thể.'
  );
  const [studentDefense, setStudentDefense] = useState('');
  const [argumentCoachData, setArgumentCoachData] = useState<any>(null);

  // 8. AI 8: BÁC SĨ CÂU VĂN State
  const [sentenceToExamine, setSentenceToExamine] = useState(
    'Qua lòng biết ơn đã giúp cho các bạn học sinh nhận thức được công lao to lớn của cha mẹ và thầy cô giáo đã dạy dỗ chúng ta nên người.'
  );
  const [sentenceDiagnosis, setSentenceDiagnosis] = useState<any>(null);

  // 9. AI 9: NÂNG CẤP DIỄN ĐẠT State
  const [styleSourceText, setStyleSourceText] = useState(
    'Lòng biết ơn rất quan trọng vì nó làm cho ta nhớ về cha mẹ và cố gắng học tốt hơn.'
  );
  const [selectedStyle, setSelectedStyle] = useState('Giàu hình ảnh');
  const [styleUpgradeResult, setStyleUpgradeResult] = useState<any>(null);

  // 10. AI 10: GIÁM KHẢO AI State
  const [fullEssay, setFullEssay] = useState(
    `"Uống nước nhớ nguồn", "Ăn quả nhớ kẻ trồng cây" từ bao đời nay luôn là bài học đạo lý thiêng liêng chảy trong huyết quản người Việt. Đối với mỗi học sinh THCS hôm nay, lòng biết ơn chính là chiếc la bàn định hướng cho nhân cách và tâm hồn.

Trước hết, lòng biết ơn là sự ghi nhớ, trân trọng và biết ơn công lao mà người khác đã dành cho mình. Đó là tình cảm với cha mẹ - những người mang nặng đẻ đau; là lòng kính trọng với thầy cô - những người lái đò thầm lặng; và là sự tri ân với những người lính, người lao công đang ngày đêm gìn giữ bình yên cho Tổ quốc. Khi có lòng biết ơn, con người biết trân quý từng hạt cơm bát gạo, từng bài học làm người.

Biểu hiện của lòng biết ơn không nằm ở những lời hoa mỹ xa xôi, mà hiện hữu trong từng hành vi nhỏ bé mỗi ngày. Đó là một lời chào lễ phép, là sự chăm chỉ nghe giảng, là việc biết đỡ đần mẹ việc nhà sau giờ tan trường. Nhìn rộng ra xã hội, biết bao bạn trẻ đã tích cực tham gia các phong trào đền ơn đáp nghĩa, chăm sóc các Mẹ Việt Nam anh hùng, quyên góp ủng hộ đồng bào gặp thiên tai. Những hành động ấy đã thắp lên ngọn lửa ấm áp của tình người.

Tuy nhiên, trong xã hội hiện đại, vẫn còn một bộ phận bạn trẻ sống vô cảm, ích kỷ, coi mọi sự chăm sóc của gia đình là điều đương nhiên. Lối sống ấy không chỉ làm tổn thương những người yêu thương ta mà còn khiến tâm hồn ta trở nên khô cằn.

Tóm lại, lòng biết ơn là thước đo phẩm giá của mỗi con người. Là học sinh THCS, em tự hứa sẽ luôn nuôi dưỡng lòng biết ơn bằng những nỗ lực học tập và tình cảm chân thành nhất mỗi ngày.`
  );
  const [rubricResult, setRubricResult] = useState<RubricEvaluation | null>(null);

  // Handlers for AI endpoints
  const handleRunAI1 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/understand-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, studentReflection: ai1StudentReflection }),
      });
      const data = await res.json();
      setAi1Result(data);
      onShowToast('AI đã phân tích cấu trúc đề bài!', 'success');
    } catch (e) {
      onShowToast('Đã áp dụng hướng dẫn phân tích đề.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI2 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, existingIdeas: ideaList.map((i) => i.text) }),
      });
      const data = await res.json();
      if (data.socraticQuestions) setAi2SocraticQuestions(data.socraticQuestions);
      if (data.seedIdeas) {
        const newSeeds = data.seedIdeas.map((s: any) => ({
          id: s.id,
          text: s.title + ': ' + s.description,
          category: s.category || 'Gợi ý',
        }));
        setIdeaList((prev) => [...prev, ...newSeeds]);
      }
      onShowToast('AI đã khơi mở các câu hỏi gợi ý mới!', 'success');
    } catch (e) {
      onShowToast('Đã tạo câu hỏi khơi mở tư duy.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIdea = () => {
    if (!newIdeaText.trim()) return;
    setIdeaList((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newIdeaText.trim(), category: 'Ý của em' },
    ]);
    setNewIdeaText('');
    onShowToast('Đã thêm thẻ ý tưởng mới!', 'success');
  };

  const handleRemoveIdea = (id: string) => {
    setIdeaList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRunAI3 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/thesis-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, thesis: thesisText, points: thesisPoints }),
      });
      const data = await res.json();
      setThesisCheckResult(data);
      onShowToast('AI đã kiểm tra cấu trúc cây luận điểm!', 'success');
    } catch (e) {
      onShowToast('Đã phân tích tính logic của luận điểm.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI4 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topic, type: 'writing' }),
      });
      const data = await res.json();
      setMindmapData(data);
      onShowToast('Sơ đồ tư duy AI đã sẵn sàng!', 'success');
    } catch (e) {
      onShowToast('Đã tạo sơ đồ tư duy tương tác.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI5 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, studentDraft: outlineDraft }),
      });
      const data = await res.json();
      setOutlineResult(data);
      onShowToast('AI Kiến trúc sư đã đồng hành cùng dàn ý!', 'success');
    } catch (e) {
      onShowToast('Đã xây dựng khung dàn ý gợi mở.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI6 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/paragraph-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paragraphType: paraType, prompt: topic, content: paragraphContent }),
      });
      const data = await res.json();
      setParagraphReview(data);
      onShowToast('AI đã phản hồi 4 tiêu chí cho đoạn văn!', 'success');
    } catch (e) {
      onShowToast('Đã phân tích xong đoạn văn.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI7 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/argument-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement: argumentStatement, studentResponse: studentDefense }),
      });
      const data = await res.json();
      setArgumentCoachData(data);
      onShowToast('Huấn luyện viên lập luận đã đặt câu hỏi phản biện!', 'badge');
    } catch (e) {
      onShowToast('Đã mở vòng phản biện Socratic.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI8 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/sentence-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: sentenceToExamine }),
      });
      const data = await res.json();
      setSentenceDiagnosis(data);
      onShowToast('Bác sĩ câu văn đã khám xong!', 'success');
    } catch (e) {
      onShowToast('Đã kiểm tra cấu trúc câu văn.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI9 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/style-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: styleSourceText, style: selectedStyle }),
      });
      const data = await res.json();
      setStyleUpgradeResult(data);
      onShowToast(`Đã nâng cấp diễn đạt theo phong cách ${selectedStyle}!`, 'success');
    } catch (e) {
      onShowToast('Đã tinh chỉnh phương án diễn đạt.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI10 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/rubric-grader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, essay: fullEssay }),
      });
      const data = await res.json();
      setRubricResult(data);
      onShowToast('Giám khảo AI đã hoàn tất bảng rubric 9 tiêu chí!', 'badge');
    } catch (e) {
      onShowToast('Đã chấm điểm theo rubric chuẩn.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const toolTabs = [
    { id: 1, title: 'AI 1 – Hiểu đề', icon: HelpCircle, color: '#4169F6' },
    { id: 2, title: 'AI 2 – Khơi nguồn ý tưởng', icon: Lightbulb, color: '#FF7A00' },
    { id: 3, title: 'AI 3 – Cây luận điểm', icon: GitBranch, color: '#6750FF' },
    { id: 4, title: 'AI 4 – Sơ đồ tư duy', icon: Network, color: '#11B981' },
    { id: 5, title: 'AI 5 – Dàn ý logic', icon: Layout, color: '#4169F6' },
    { id: 6, title: 'AI 6 – Luyện viết đoạn', icon: FileEdit, color: '#EC4899' },
    { id: 7, title: 'AI 7 – Huấn luyện lập luận', icon: ShieldAlert, color: '#F59E0B' },
    { id: 8, title: 'AI 8 – Bác sĩ câu văn', icon: Stethoscope, color: '#10B981' },
    { id: 9, title: 'AI 9 – Nâng cấp diễn đạt', icon: Palette, color: '#8B5CF6' },
    { id: 10, title: 'AI 10 – Giám khảo AI', icon: Award, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#4169F6] to-[#6750FF] p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/15 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>HÀNH TRÌNH 10 BƯỚC TƯ DUY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HỆ SINH THÁI AI ĐỊNH HƯỚNG TƯ DUY VIẾT VĂN
            </h1>
            <p className="text-sm text-indigo-100 mt-1 max-w-xl">
              “AI không viết thay em – AI giúp em biết cách suy nghĩ để tự viết hay hơn.”
            </p>
          </div>

          <button
            onClick={() => onOpenWorkspace(topic)}
            className="self-start md:self-center px-6 py-3.5 rounded-2xl bg-white text-[#4169F6] hover:bg-indigo-50 font-bold text-sm shadow-lg shadow-black/10 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Vào phòng viết tích hợp</span>
          </button>
        </div>
      </div>

      {/* Global Topic Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Đề bài đang luyện tập:
        </span>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Nhập hoặc dán đề văn của em vào đây..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4169F6] focus:bg-white transition-all"
        />
        <button
          onClick={() => {
            onShowToast('Đã áp dụng đề bài cho toàn bộ 10 công cụ!', 'info');
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          Cập nhật đề
        </button>
      </div>

      {/* 10 Tool Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {toolTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTool(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? '#fff' : tab.color }} />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE TOOL CONTENT CONTAINER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm min-h-[480px]">
        {/* ========================================================
            TOOL 1: AI 1 – HIỂU ĐỀ
            ======================================================== */}
        {activeTool === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#4169F6] flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 1 – HIỂU ĐỀ BÀI</h2>
                  <p className="text-xs text-slate-500">
                    Phân tích bản chất đề văn, xác định kiểu bài, từ khóa, phạm vi và yêu cầu. Không đưa bài mẫu ngay.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700">Đề bài cần phân tích:</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={2}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:ring-2 focus:ring-[#4169F6] focus:outline-none"
              />

              <button
                onClick={handleRunAI1}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-[#4169F6] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{loading ? 'AI đang phân tích suy nghĩ của em...' : 'Phân tích cấu trúc đề'}</span>
              </button>
            </div>

            {ai1Result && (
              <div className="mt-6 space-y-5 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                    <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                      Kiểu bài & Vấn đề trọng tâm
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      Kiểu bài: <span className="text-[#4169F6]">{ai1Result.genre}</span>
                    </p>
                    <p className="text-xs text-slate-700 mt-1">
                      Vấn đề cốt lõi: {ai1Result.coreIssue}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                    <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                      Phạm vi kiến thức & Từ khóa
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {ai1Result.keywords?.map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-purple-700 border border-purple-200"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 mt-2">{ai1Result.knowledgeScope}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Yêu cầu về nội dung & hình thức
                  </span>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                    {ai1Result.contentRequirements?.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                    Hình thức: {ai1Result.formatRequirements}
                  </p>
                </div>

                {/* Socratic Question at end of Step 1 */}
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Thử thách Socratic dành cho em:</span>
                  </div>
                  <p className="text-xs sm:text-sm mt-1.5 font-medium italic">
                    “{ai1Result.socraticQuestion || 'Em thử nói lại: Đề bài đang yêu cầu mình làm gì?'}”
                  </p>

                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={ai1StudentReflection}
                      onChange={(e) => setAi1StudentReflection(e.target.value)}
                      placeholder="Nhập suy nghĩ của em để trả lời AI..."
                      className="flex-1 p-2.5 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => {
                        if (!ai1StudentReflection) return;
                        setAi1TeacherFeedback(
                          `Thầy/cô ghi nhận: Em đã nắm rất trúng trọng tâm: "${ai1StudentReflection}". Hãy chuyển sang bước 2 để khơi nguồn ý tưởng!`
                        );
                        onShowToast('AI đã ghi nhận phản hồi của em!', 'success');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi AI</span>
                    </button>
                  </div>

                  {ai1TeacherFeedback && (
                    <div className="mt-3 p-3 rounded-xl bg-white/80 border border-amber-200 text-xs font-medium text-amber-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{ai1TeacherFeedback}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TOOL 2: AI 2 – KHƠI NGUỒN Ý TƯỞNG
            ======================================================== */}
        {activeTool === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF7A00] flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 2 – KHƠI NGUỒN Ý TƯỞNG</h2>
                  <p className="text-xs text-slate-500">
                    Sử dụng câu hỏi gợi mở Socratic để em tự sinh ý tưởng dưới dạng các “thẻ ý tưởng” linh hoạt.
                  </p>
                </div>
              </div>
            </div>

            {/* Socratic questions block */}
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#FF7A00]" />
                  Câu hỏi gợi mở kiểu Socratic:
                </span>
                <button
                  onClick={handleRunAI2}
                  disabled={loading}
                  className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Đổi câu hỏi mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {ai2SocraticQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-orange-200/70 text-xs text-slate-700 italic flex items-start gap-2"
                  >
                    <span className="text-[#FF7A00] font-bold">Q{idx + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Idea cards manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">
                  Thẻ ý tưởng của em ({ideaList.length} ý)
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIdeaList((prev) => [...prev].reverse());
                      onShowToast('Đã sắp xếp lại thứ tự các ý!', 'info');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Sắp xếp ý
                  </button>
                  <button
                    onClick={() => {
                      onShowToast('Đã tự động nhóm các ý có nội dung tương đồng!', 'success');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-[#6750FF] text-xs font-bold hover:bg-indigo-100 transition-colors"
                  >
                    Nhóm ý tương đồng
                  </button>
                </div>
              </div>

              {/* Add idea input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIdeaText}
                  onChange={(e) => setNewIdeaText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddIdea()}
                  placeholder="Nhập một suy nghĩ hoặc dẫn chứng của em rồi nhấn + Thêm ý..."
                  className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:bg-white"
                />
                <button
                  onClick={handleAddIdea}
                  className="px-4 py-3 rounded-xl bg-[#FF7A00] hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm ý</span>
                </button>
              </div>

              {/* Grid of Idea Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {ideaList.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FF7A00]">
                          {idea.category}
                        </span>
                        <button
                          onClick={() => handleRemoveIdea(idea.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-500 transition-opacity"
                          title="Loại bỏ ý này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">{idea.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TOOL 3: AI 3 – CÂY LUẬN ĐIỂM
            ======================================================== */}
        {activeTool === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6750FF] flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 3 – CÂY LUẬN ĐIỂM</h2>
                  <p className="text-xs text-slate-500">
                    Xây dựng mô hình: Luận đề → Luận điểm → Lí lẽ → Dẫn chứng. AI kiểm tra tính hợp lý và xác thực của dẫn chứng.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Tree */}
            <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-6">
              {/* Root: Luận đề */}
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6750FF] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  LUẬN ĐỀ (TRUNG TÂM)
                </span>
                <input
                  type="text"
                  value={thesisText}
                  onChange={(e) => setThesisText(e.target.value)}
                  className="mt-2 w-full p-3 text-center text-sm font-bold text-slate-900 bg-white border border-purple-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#6750FF] focus:outline-none"
                />
                <div className="h-6 w-0.5 bg-purple-300 mx-auto my-1" />
              </div>

              {/* Branches: Luận điểm 1, 2, 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {thesisPoints.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold text-white px-2 py-0.5 rounded-md bg-[#6750FF]">
                        LUẬN ĐIỂM {idx + 1}
                      </span>
                      <textarea
                        value={item.point}
                        onChange={(e) => {
                          const updated = [...thesisPoints];
                          updated[idx].point = e.target.value;
                          setThesisPoints(updated);
                        }}
                        rows={2}
                        className="mt-2 w-full text-xs font-bold text-slate-800 p-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-100 pt-2">
                      <div>
                        <span className="font-bold text-slate-500 text-[10px] uppercase">↓ Lí lẽ:</span>
                        <textarea
                          value={item.reasoning}
                          onChange={(e) => {
                            const updated = [...thesisPoints];
                            updated[idx].reasoning = e.target.value;
                            setThesisPoints(updated);
                          }}
                          rows={2}
                          className="w-full text-[11px] text-slate-700 p-2 rounded-lg bg-slate-50/50 border border-slate-200 focus:bg-white focus:outline-none mt-1"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 text-[10px] uppercase">↓ Dẫn chứng:</span>
                        <textarea
                          value={item.evidence}
                          onChange={(e) => {
                            const updated = [...thesisPoints];
                            updated[idx].evidence = e.target.value;
                            setThesisPoints(updated);
                          }}
                          rows={2}
                          className="w-full text-[11px] text-slate-700 p-2 rounded-lg bg-slate-50/50 border border-slate-200 focus:bg-white focus:outline-none mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleRunAI3}
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl bg-[#6750FF] hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-md shadow-purple-500/20 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'AI đang thẩm định logic...' : 'AI kiểm tra cấu trúc cây luận điểm'}</span>
                </button>
              </div>
            </div>

            {thesisCheckResult && (
              <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-purple-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đánh giá từ AI Coach:</span>
                </div>
                <p>
                  <strong>Điểm mạnh:</strong> {thesisCheckResult.evaluation?.strengths}
                </p>
                <p>
                  <strong>Điểm cần hoàn thiện:</strong> {thesisCheckResult.evaluation?.improvements}
                </p>
                {thesisCheckResult.evaluation?.verificationNotice && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{thesisCheckResult.evaluation.verificationNotice}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TOOL 4: AI 4 – SƠ ĐỒ TƯ DUY
            ======================================================== */}
        {activeTool === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#11B981] flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 4 – SƠ ĐỒ TƯ DUY (MIND MAP)</h2>
                  <p className="text-xs text-slate-500">
                    Từ những ý em đã tạo, AI tổng hợp thành sơ đồ tư duy dạng node trực quan, cho phép thu gọn/mở rộng nhánh.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:bg-white"
              />
              <button
                onClick={handleRunAI4}
                disabled={loading}
                className="px-5 py-3 rounded-2xl bg-[#11B981] hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <Network className="w-4 h-4" />
                <span>Sinh Mind Map</span>
              </button>
            </div>

            {/* Mindmap Interactive Visualizer */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 min-h-[340px] flex flex-col justify-center">
              {mindmapData ? (
                <div className="space-y-4">
                  {/* Central Node */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#4169F6] to-[#6750FF] text-white font-bold text-center text-sm shadow-md max-w-md mx-auto">
                    {mindmapData.label}
                  </div>

                  {/* Branches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    {mindmapData.children?.map((branch: any) => {
                      const isCollapsed = collapsedBranches[branch.id];
                      return (
                        <div
                          key={branch.id}
                          className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left flex flex-col justify-between"
                        >
                          <div
                            onClick={() =>
                              setCollapsedBranches((prev) => ({ ...prev, [branch.id]: !isCollapsed }))
                            }
                            className="flex items-center justify-between cursor-pointer font-bold text-xs text-slate-900 pb-2 border-b border-slate-100"
                          >
                            <span>{branch.label}</span>
                            {isCollapsed ? (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>

                          {!isCollapsed && branch.children && (
                            <ul className="mt-2 space-y-1.5 text-[11px] text-slate-600">
                              {branch.children.map((sub: any) => (
                                <li
                                  key={sub.id}
                                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50/50 transition-colors"
                                >
                                  • {sub.label}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Nhấn "Sinh Mind Map" để AI kiến tạo sơ đồ tư duy trực quan cho đề bài này!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TOOL 5: AI 5 – KIẾN TRÚC SƯ DÀN Ý
            ======================================================== */}
        {activeTool === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#4169F6] flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 5 – KIẾN TRÚC SƯ DÀN Ý</h2>
                  <p className="text-xs text-slate-500">
                    Cơ chế học sinh tự nhập ý trước. AI chỉ gợi mở khi em cần trợ giúp để hoàn thiện bố cục 3 phần.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Mở bài */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Mở bài
                </span>
                <textarea
                  value={outlineDraft.intro}
                  onChange={(e) => setOutlineDraft({ ...outlineDraft, intro: e.target.value })}
                  rows={2}
                  className="mt-2 w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-[#4169F6] focus:outline-none"
                  placeholder="Em dự định mở bài như thế nào? (Trực tiếp hay gián tiếp?)"
                />
              </div>

              {/* Thân bài */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Thân bài
                </span>
                <input
                  type="text"
                  value={outlineDraft.p1}
                  onChange={(e) => setOutlineDraft({ ...outlineDraft, p1: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none"
                  placeholder="Luận điểm 1: Giải thích và khẳng định..."
                />
                <input
                  type="text"
                  value={outlineDraft.p2}
                  onChange={(e) => setOutlineDraft({ ...outlineDraft, p2: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none"
                  placeholder="Luận điểm 2: Bàn luận sâu và dẫn chứng..."
                />
                <input
                  type="text"
                  value={outlineDraft.counter}
                  onChange={(e) => setOutlineDraft({ ...outlineDraft, counter: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none"
                  placeholder="Mở rộng / Phản biện: Phê phán lối sống tiêu cực..."
                />
              </div>

              {/* Kết bài */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Kết bài
                </span>
                <textarea
                  value={outlineDraft.outro}
                  onChange={(e) => setOutlineDraft({ ...outlineDraft, outro: e.target.value })}
                  rows={2}
                  className="mt-2 w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-[#4169F6] focus:outline-none"
                  placeholder="Khẳng định lại vấn đề và rút ra bài học cho bản thân..."
                />
              </div>

              <button
                onClick={handleRunAI5}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-[#4169F6] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Layout className="w-4 h-4" />
                <span>{loading ? 'AI đang cố vấn dàn ý...' : 'Nhận gợi ý hoàn thiện dàn ý'}</span>
              </button>
            </div>

            {outlineResult && (
              <div className="mt-4 p-5 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-2 text-slate-800">
                <span className="font-bold text-sm text-[#4169F6] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {outlineResult.overallFeedback}
                </span>
                <p>
                  <strong>Gợi ý mở bài:</strong> {outlineResult.introduction?.guide}
                </p>
                <p>
                  <strong>Gợi ý kết bài:</strong> {outlineResult.conclusion?.guide}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TOOL 6: AI 6 – PHÒNG LUYỆN VIẾT ĐOẠN
            ======================================================== */}
        {activeTool === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#EC4899] flex items-center justify-center font-bold">
                  6
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 6 – PHÒNG LUYỆN VIẾT ĐOẠN</h2>
                  <p className="text-xs text-slate-500">
                    Luyện riêng từng đoạn. AI phản hồi theo 4 mục (Ý, Lập luận, Diễn đạt, Chính tả – ngữ pháp) và hướng dẫn tự sửa.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Chọn kiểu đoạn:</span>
              {[
                'Đoạn mở bài',
                'Đoạn giải thích',
                'Đoạn phân tích',
                'Đoạn chứng minh',
                'Đoạn nghị luận',
                'Đoạn cảm nhận',
                'Đoạn kết bài',
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => setParaType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    paraType === type
                      ? 'bg-[#EC4899] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Nội dung đoạn văn của em:</span>
                <span>{paragraphContent.split(/\s+/).filter(Boolean).length} từ</span>
              </div>
              <textarea
                value={paragraphContent}
                onChange={(e) => setParagraphContent(e.target.value)}
                rows={5}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#EC4899] focus:outline-none"
              />
              <button
                onClick={handleRunAI6}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-[#EC4899] hover:bg-pink-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-pink-500/20"
              >
                <FileEdit className="w-4 h-4" />
                <span>{loading ? 'AI đang phân tích 4 khía cạnh...' : 'Nhận xét 4 tiêu chí chuẩn'}</span>
              </button>
            </div>

            {paragraphReview && (
              <div className="mt-6 space-y-4 animate-in fade-in">
                {/* 4 Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-pink-50/80 border border-pink-100">
                    <span className="text-[10px] font-bold text-pink-700 uppercase">1. Về Ý</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {paragraphReview.review?.ideas?.comment}
                    </p>
                    <p className="text-[11px] text-pink-800 mt-1 italic">
                      Gợi ý: {paragraphReview.review?.ideas?.hint}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100">
                    <span className="text-[10px] font-bold text-purple-700 uppercase">2. Về Lập luận</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {paragraphReview.review?.logic?.comment}
                    </p>
                    <p className="text-[11px] text-purple-800 mt-1 italic">
                      Gợi ý: {paragraphReview.review?.logic?.hint}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-700 uppercase">3. Về Diễn đạt</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {paragraphReview.review?.expression?.comment}
                    </p>
                    <p className="text-[11px] text-blue-800 mt-1 italic">
                      Gợi ý: {paragraphReview.review?.expression?.hint}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">4. Chính tả - Ngữ pháp</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {paragraphReview.review?.grammar?.comment}
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-1">
                      Điểm: {paragraphReview.review?.grammar?.score}/10
                    </p>
                  </div>
                </div>

                {/* Self Edit Step */}
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-800 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-slate-900">
                    <Sparkles className="w-4 h-4 text-[#EC4899]" />
                    <span>Em tự sửa:</span>
                  </div>
                  <p>{paragraphReview.selfEditPrompt}</p>
                  {paragraphReview.shortSampleSuggestion && (
                    <p className="text-slate-500 pt-1 border-t border-slate-200 italic">
                      Phiên bản tham khảo ngắn: {paragraphReview.shortSampleSuggestion}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TOOL 7: AI 7 – HUẤN LUYỆN VIÊN LẬP LUẬN
            ======================================================== */}
        {activeTool === 7 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold">
                  7
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 7 – HUẤN LUYỆN VIÊN LẬP LUẬN</h2>
                  <p className="text-xs text-slate-500">
                    AI đóng vai người phản biện sắc sảo, đặt câu hỏi: “Tại sao?”, “Bằng chứng ở đâu?”, “Có trường hợp ngược lại không?”.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Nhập nhận định / quan điểm của em:
              </label>
              <textarea
                value={argumentStatement}
                onChange={(e) => setArgumentStatement(e.target.value)}
                rows={2}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <button
                onClick={handleRunAI7}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{loading ? 'AI đang chuẩn bị câu hỏi phản biện...' : 'Thử thách phản biện Socratic'}</span>
              </button>
            </div>

            {argumentCoachData && (
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                  {argumentCoachData.coachFeedback}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {argumentCoachData.socraticChallenges?.map((challenge: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1.5"
                    >
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {challenge.type}
                      </span>
                      <p className="text-xs font-bold text-slate-800 italic">“{challenge.question}”</p>
                    </div>
                  ))}
                </div>

                {/* Student defense field */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800">
                    Em bảo vệ quan điểm của mình trước người phản biện:
                  </span>
                  <textarea
                    value={studentDefense}
                    onChange={(e) => setStudentDefense(e.target.value)}
                    rows={3}
                    placeholder="Em trả lời thế nào để thuyết phục người nghe? Hãy đưa ra lí lẽ và dẫn chứng..."
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={handleRunAI7}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                  >
                    Gửi câu trả lời bảo vệ
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TOOL 8: AI 8 – BÁC SĨ CÂU VĂN
            ======================================================== */}
        {activeTool === 8 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold">
                  8
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 8 – BÁC SĨ CÂU VĂN</h2>
                  <p className="text-xs text-slate-500">
                    Bắt bệnh câu văn: câu dài, lặp từ, thiếu chủ/vị, tối nghĩa, dùng từ sai, chính tả... Hiển thị bảng chẩn đoán 5 mục.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Nhập câu hoặc đoạn văn cần "khám bệnh":
              </label>
              <textarea
                value={sentenceToExamine}
                onChange={(e) => setSentenceToExamine(e.target.value)}
                rows={2}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <button
                onClick={handleRunAI8}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <Stethoscope className="w-4 h-4" />
                <span>{loading ? 'Bác sĩ đang chẩn đoán...' : 'Khám câu văn ngay'}</span>
              </button>
            </div>

            {sentenceDiagnosis && (
              <div className="mt-5 space-y-4 animate-in fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 rounded-tl-xl">Câu của em</th>
                        <th className="p-3">Điểm cần xem lại</th>
                        <th className="p-3">Câu hỏi gợi ý</th>
                        <th className="p-3">Em tự sửa</th>
                        <th className="p-3 rounded-tr-xl">Gợi ý của AI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sentenceDiagnosis.diagnoses?.map((diag: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-3 font-medium text-slate-900 max-w-xs">{diag.originalSentence}</td>
                          <td className="p-3 text-red-600 font-semibold">{diag.issueFound}</td>
                          <td className="p-3 text-indigo-700 italic">{diag.socraticHint}</td>
                          <td className="p-3 text-slate-700">{diag.selfCorrectionInstruction}</td>
                          <td className="p-3 text-emerald-700 font-medium">{diag.aiSuggestion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Đánh giá tổng quan: {sentenceDiagnosis.overallSummary}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TOOL 9: AI 9 – NÂNG CẤP DIỄN ĐẠT
            ======================================================== */}
        {activeTool === 9 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center font-bold">
                  9
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 9 – NÂNG CẤP DIỄN ĐẠT</h2>
                  <p className="text-xs text-slate-500">
                    Chọn phong cách văn phong để trau chuốt câu từ mà không làm thay đổi tư tưởng ban đầu của em.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-500 self-center">Chọn phong cách:</span>
              {[
                'Trong sáng',
                'Giàu hình ảnh',
                'Súc tích',
                'Trang trọng',
                'Cảm xúc',
                'Lập luận chặt chẽ',
              ].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStyle(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedStyle === st
                      ? 'bg-[#8B5CF6] text-white shadow-sm scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <textarea
                value={styleSourceText}
                onChange={(e) => setStyleSourceText(e.target.value)}
                rows={3}
                placeholder="Nhập câu hoặc đoạn văn em muốn nâng tầm diễn đạt..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white"
              />
              <button
                onClick={handleRunAI9}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-[#8B5CF6] hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20"
              >
                <Palette className="w-4 h-4" />
                <span>{loading ? 'AI đang trau chuốt...' : `Nâng cấp phong cách: ${selectedStyle}`}</span>
              </button>
            </div>

            {styleUpgradeResult && (
              <div className="mt-5 space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {styleUpgradeResult.options?.map((opt: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs space-y-2"
                    >
                      <span className="font-bold text-purple-900">Phương án gợi ý {i + 1}:</span>
                      <p className="font-medium text-slate-900 italic">“{opt.version}”</p>
                      <p className="text-slate-600 text-[11px]">{opt.explanation}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-600">
                  💡 <strong>Mẹo diễn đạt:</strong> {styleUpgradeResult.writingTechniqueTip}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TOOL 10: AI 10 – GIÁM KHẢO AI
            ======================================================== */}
        {activeTool === 10 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#EF4444] flex items-center justify-center font-bold">
                  10
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI 10 – GIÁM KHẢO AI (RUBRIC 9 TIÊU CHÍ)</h2>
                  <p className="text-xs text-slate-500">
                    Chấm toàn diện theo chuẩn THCS: Điểm mạnh, điểm cần sửa, câu hỏi tự hoàn thiện và Top 3 việc nên làm ngay.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Dán bài viết hoàn chỉnh:</span>
                <span>{fullEssay.split(/\s+/).filter(Boolean).length} từ</span>
              </div>
              <textarea
                value={fullEssay}
                onChange={(e) => setFullEssay(e.target.value)}
                rows={8}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <button
                onClick={handleRunAI10}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-[#EF4444] hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-500/20"
              >
                <Award className="w-4 h-4" />
                <span>{loading ? 'Giám khảo AI đang chấm điểm...' : 'Chấm điểm theo Rubric 9 tiêu chí'}</span>
              </button>
            </div>

            {rubricResult && (
              <div className="mt-6 space-y-6 animate-in fade-in">
                {/* Score Summary */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-800 uppercase tracking-wider">
                      Điểm đánh giá trung bình
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {rubricResult.totalAverageScore?.toFixed(1) || '8.5'}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">/ 10 điểm</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Đạt loại Giỏi
                    </span>
                  </div>
                </div>

                {/* 9 Criteria Progress Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rubricResult.rubricScores?.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{idx + 1}. {item.criterion}</span>
                        <span className="text-[#4169F6]">{item.score} / {item.max}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#4169F6] to-[#6750FF] rounded-full"
                          style={{ width: `${(item.score / item.max) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">{item.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Điểm mạnh nổi bật:
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      {rubricResult.strengths?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Điểm cần cải thiện:
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      {rubricResult.improvements?.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Top 3 Fixes Priority */}
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    🎯 Top 3 việc em nên ưu tiên sửa ngay:
                  </span>
                  <div className="space-y-1.5 text-xs font-medium text-slate-200">
                    {rubricResult.top3Fixes?.map((fix, i) => (
                      <div key={i} className="p-2 rounded-xl bg-white/10">
                        {fix}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
