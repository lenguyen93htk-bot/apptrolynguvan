import React, { useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Flame,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { SAMPLE_QUIZZES } from '../data/curriculumData';

interface VietnameseGamesViewProps {
  onShowToast: (text: string, type?: 'success' | 'info' | 'badge') => void;
  onAwardBadge?: (badgeId: string) => void;
}

export const VietnameseGamesView: React.FC<VietnameseGamesViewProps> = ({
  onShowToast,
  onAwardBadge,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [activeGameCategory, setActiveGameCategory] = useState<string>('all');

  const questions = SAMPLE_QUIZZES.filter(
    (q) => activeGameCategory === 'all' || q.category === activeGameCategory
  );

  const currentQ = questions[currentQuestionIndex % questions.length];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      const newCombo = combo + 1;
      const points = 100 * (1 + newCombo * 0.2);
      setScore((prev) => Math.round(prev + points));
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      if (newCombo === 3) {
        onShowToast('Combo x3! Em đang làm bài rất xuất sắc! 🔥', 'success');
      } else if (newCombo === 5) {
        onShowToast('Tuyệt đỉnh! Đạt danh hiệu Thợ săn từ ngữ!', 'badge');
        if (onAwardBadge) onAwardBadge('b2');
      } else {
        onShowToast(`Chính xác! +${Math.round(points)} điểm 🎉`, 'success');
      }
    } else {
      setCombo(0);
      onShowToast('Chưa chính xác rồi, hãy đọc kĩ phần giải thích nhé!', 'info');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const handleResetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCombo(0);
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#FF7A00] to-amber-600 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
              <Gamepad2 className="w-4 h-4" />
              <span>ĐẤU TRƯỜNG TRI THỨC</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              TIẾNG VIỆT VUI
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 mt-1">
              Rèn luyện phản xạ từ vựng, ngữ pháp, các biện pháp tu từ và kỹ năng liên kết câu thông qua các thử thách sinh động.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-orange-100 uppercase">Điểm số</span>
              <p className="text-xl sm:text-2xl font-black text-white">{score}</p>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-orange-100 uppercase flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300" /> Combo
              </span>
              <p className="text-xl sm:text-2xl font-black text-amber-300">x{combo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'Tất cả thử thách' },
          { id: 'Biện pháp tu từ', label: 'Biện pháp tu từ' },
          { id: 'Tìm lỗi câu', label: 'Bác sĩ tìm lỗi câu' },
          { id: 'Liên kết câu', label: 'Liên kết câu & đoạn' },
          { id: 'Thành phần câu', label: 'Thành phần biệt lập' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveGameCategory(cat.id);
              setCurrentQuestionIndex(0);
              setIsAnswered(false);
              setSelectedOption(null);
            }}
            className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeGameCategory === cat.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Game Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Chủ đề: {currentQ.category}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Câu {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-relaxed">
          {currentQ.question}
        </h2>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-orange-50/50 hover:border-orange-300';
            if (isAnswered) {
              if (isCorrect) {
                btnClass = 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20';
              } else if (isSelected && !isCorrect) {
                btnClass = 'bg-red-500 text-white border-red-600 shadow-md shadow-red-500/20';
              } else {
                btnClass = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all duration-200 flex items-center justify-between ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      isAnswered && (isCorrect || isSelected)
                        ? 'bg-white/25 text-white'
                        : 'bg-white text-slate-600 shadow-xs'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-white flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {isAnswered && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-900">Giải thích từ Chuyên gia Tiếng Việt:</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{currentQ.explanation}</p>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-500/20"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
