import React from 'react';
import {
  User,
  Flame,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { StudentProfile, Badge } from '../types';
import { BADGES_LIST } from '../data/curriculumData';

interface ProfileViewProps {
  student: StudentProfile;
  onShowToast: (text: string, type?: 'success' | 'info' | 'badge') => void;
  onNavigateToWriting: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  student,
  onShowToast,
  onNavigateToWriting,
}) => {
  const skillStages = [
    { label: '1. Hiểu đề bài', score: student.writingSkills.understandTopic, color: 'bg-blue-500' },
    { label: '2. Khơi nguồn ý tưởng', score: student.writingSkills.brainstorm, color: 'bg-orange-500' },
    { label: '3. Cây luận điểm', score: student.writingSkills.thesisTree, color: 'bg-purple-500' },
    { label: '4. Dàn ý logic', score: student.writingSkills.outline, color: 'bg-indigo-500' },
    { label: '5. Viết đoạn văn', score: student.writingSkills.paragraphWriting, color: 'bg-pink-500' },
    { label: '6. Nâng cấp diễn đạt', score: student.writingSkills.expression, color: 'bg-teal-500' },
    { label: '7. Tự sửa bài', score: student.writingSkills.selfCorrection, color: 'bg-emerald-500' },
  ];

  const recentEssays = [
    {
      title: 'Ý nghĩa của lòng biết ơn đối với học sinh THCS',
      date: '22/09/2026',
      score: 8.8,
      status: 'Đã hoàn thành',
      feedback: 'Lập luận mạch lạc, dẫn chứng chân thực về tình nghĩa thầy trò.',
    },
    {
      title: 'Vẻ đẹp nhân cách của nhân vật Lão Hạc',
      date: '20/09/2026',
      score: 9.0,
      status: 'Đã hoàn thành',
      feedback: 'Cảm xúc sâu sắc, phân tích tinh tế giọt nước mắt của người cha già.',
    },
    {
      title: 'Đoạn văn cảm nhận về hình ảnh "Đầu súng trăng treo"',
      date: '18/09/2026',
      score: 8.5,
      status: 'Đã hoàn thành',
      feedback: 'Làm nổi bật được sự kết hợp giữa hiện thực và lãng mạn.',
    },
  ];

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#4169F6] via-[#5B54F8] to-[#6750FF] p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/15">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white/30 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#11B981] ring-4 ring-[#6750FF] flex items-center justify-center text-xs">
              ✓
            </span>
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold">{student.name}</h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 border border-white/20">
                {student.grade}
              </span>
            </div>
            <p className="text-sm text-indigo-100 font-medium">
              Trường THCS Huỳnh Thúc Kháng • Niên khóa 2026 - 2027
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-4 h-4 fill-amber-300" /> Chuỗi {student.streakDays} ngày học liên tục
              </span>
              <span className="flex items-center gap-1 text-white/90">
                <BookOpen className="w-4 h-4" /> {student.completedExercises} bài đã hoàn thành
              </span>
              <span className="flex items-center gap-1 text-emerald-300">
                <Award className="w-4 h-4" /> Điểm TB: {student.averageScore.toFixed(1)}/10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Writing Skills Breakdown & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 7 Writing Skill Stages (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              NĂNG LỰC 7 CHẶNG VIẾT VĂN
            </h2>
            <span className="text-xs font-bold text-[#4169F6]">Mức độ thành thạo</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {skillStages.map((stage, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">{stage.label}</span>
                  <span className="text-slate-900">{stage.score}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                    style={{ width: `${stage.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-900 mt-2">
            💡 <strong>Nhận định chuyên môn:</strong> Kỹ năng <i>Hiểu đề</i> và <i>Dàn ý logic</i> của em đạt mức xuất sắc (trên 90%). Em hãy tiếp tục rèn thêm kỹ năng <i>Tự sửa bài</i> để hoàn thiện bài văn độc lập nhé!
          </div>
        </div>

        {/* Right: Badges Collection (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              BỘ SƯU TẬP HUY HIỆU DANH DỰ
            </h2>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
              {student.earnedBadgeIds.length} / {BADGES_LIST.length} đã mở khóa
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {BADGES_LIST.map((badge) => {
              const isEarned = student.earnedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    if (isEarned) {
                      onShowToast(`Huy hiệu "${badge.title}": ${badge.description}`, 'badge');
                    } else {
                      onShowToast(`Nhiệm vụ: ${badge.description}`, 'info');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isEarned
                      ? 'bg-amber-50/50 border-amber-200/90 shadow-2xs hover:shadow-md'
                      : 'bg-slate-50 border-slate-200/60 opacity-50 hover:opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{badge.icon}</span>
                      {isEarned ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Đã đạt
                        </span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{badge.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>

                  {badge.earnedDate && (
                    <span className="text-[10px] text-amber-700 font-semibold mt-2 pt-1 border-t border-amber-200/60">
                      Ngày nhận: {badge.earnedDate}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Essays & History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">
            LỊCH SỬ BÀI VIẾT GẦN ĐÂY
          </h2>
          <button
            onClick={onNavigateToWriting}
            className="text-xs font-bold text-[#4169F6] hover:underline flex items-center gap-1"
          >
            <span>Tạo bài viết mới</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentEssays.map((essay, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{essay.title}</h3>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                    {essay.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 italic">
                  Lời nhận xét từ Giám khảo AI: "{essay.feedback}"
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {essay.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-lg font-black text-[#4169F6]">{essay.score}</span>
                  <span className="text-xs text-slate-400 font-bold">/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
