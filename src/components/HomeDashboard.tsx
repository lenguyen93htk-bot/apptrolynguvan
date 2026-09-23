import React from 'react';
import {
  FileText,
  Flame,
  Award,
  CheckCircle,
  BookOpen,
  Network,
  Gamepad2,
  BookOpenCheck,
  PenTool,
  FolderArchive,
  ArrowRight,
  Sparkles,
  Target,
  Compass,
  Zap,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { NavTab } from './Sidebar';

interface HomeDashboardProps {
  student: StudentProfile;
  onNavigate: (tab: NavTab) => void;
  onStartWritingWithTopic?: (topic: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  student,
  onNavigate,
  onStartWritingWithTopic,
}) => {
  const statCards = [
    {
      label: 'Tổng bài tập',
      value: student.totalExercises,
      unit: 'bài đã giao',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      label: 'Chuỗi ngày học',
      value: `${student.streakDays}`,
      unit: 'ngày liên tục',
      icon: Flame,
      color: 'from-amber-500 to-[#FF7A00]',
      textColor: 'text-[#FF7A00]',
      bgLight: 'bg-orange-50',
    },
    {
      label: 'Điểm trung bình',
      value: student.averageScore.toFixed(1),
      unit: 'thang điểm 10',
      icon: Award,
      color: 'from-purple-500 to-[#6750FF]',
      textColor: 'text-[#6750FF]',
      bgLight: 'bg-purple-50',
    },
    {
      label: 'Bài đã hoàn thành',
      value: student.completedExercises,
      unit: 'bài viết & đọc hiểu',
      icon: CheckCircle,
      color: 'from-emerald-500 to-[#11B981]',
      textColor: 'text-[#11B981]',
      bgLight: 'bg-emerald-50',
    },
  ];

  const learningPaths = [
    {
      id: 'curriculum',
      title: 'ÔN TẬP THEO CHỦ ĐỀ',
      desc: 'Hệ thống hóa kiến thức Ngữ văn lớp 6, 7, 8, 9 theo chương trình GDPT chuẩn.',
      icon: BookOpen,
      color: '#4169F6',
      badge: 'Lớp 6–9',
      tab: 'curriculum' as NavTab,
    },
    {
      id: 'mindmap',
      title: 'SƠ ĐỒ TƯ DUY',
      desc: 'AI hỗ trợ trực quan hóa tác phẩm, nhân vật và kiến thức tiếng Việt thành mind map tương tác.',
      icon: Network,
      color: '#6750FF',
      badge: 'Visual Nodes',
      tab: 'mindmap' as NavTab,
    },
    {
      id: 'games',
      title: 'TIẾNG VIỆT VUI',
      desc: 'Mini game sinh động rèn luyện từ vựng, biện pháp tu từ, câu ghép, liên kết câu.',
      icon: Gamepad2,
      color: '#FF7A00',
      badge: 'Thử thách & Combo',
      tab: 'games' as NavTab,
    },
    {
      id: 'reading',
      title: 'ĐỌC HIỂU THÔNG MINH',
      desc: 'Rèn năng lực đọc hiểu theo 3 cấp độ: Nhận biết, Thông hiểu, Vận dụng cùng AI gợi ý.',
      icon: BookOpenCheck,
      color: '#11B981',
      badge: '3 Mức độ',
      tab: 'reading' as NavTab,
    },
    {
      id: 'ai-writing',
      title: 'LUYỆN VIẾT CÙNG AI',
      desc: 'Hệ thống 10 công cụ định hướng tư duy lập luận, dàn ý và viết đoạn văn bản THCS.',
      icon: PenTool,
      color: '#4169F6',
      badge: '10 Công cụ AI',
      tab: 'ai-writing' as NavTab,
    },
    {
      id: 'library',
      title: 'KHO HỌC LIỆU',
      desc: 'Kho tác phẩm trọng tâm, phiếu học tập, bảng tiêu chí rubric chấm điểm và tài liệu giáo viên.',
      icon: FolderArchive,
      color: '#0284C7',
      badge: 'Tổ Văn - GDCD',
      tab: 'curriculum' as NavTab,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 4 Top Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                  {stat.label}
                </span>
                <div
                  className={`w-11 h-11 rounded-2xl ${stat.bgLight} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-400 font-medium">{stat.unit}</span>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-80`}
              />
            </div>
          );
        })}
      </div>

      {/* SPECIAL HERO BANNER: HỆ SINH THÁI AI ĐỊNH HƯỚNG TƯ DUY VIẾT VĂN */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4169F6] via-[#5B54F8] to-[#6750FF] p-7 sm:p-10 text-white shadow-xl shadow-indigo-500/20 text-left">
        {/* Decorative background elements */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 -top-16 w-60 h-60 rounded-full bg-indigo-300/20 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>ĐỘT PHÁ PHƯƠNG PHÁP HỌC VĂN THCS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            HỆ SINH THÁI AI <br className="hidden sm:block" />
            ĐỊNH HƯỚNG TƯ DUY VIẾT VĂN
          </h1>

          <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed mb-6">
            “AI không viết thay em – AI giúp em biết cách suy nghĩ để tự viết hay hơn.”
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onNavigate('ai-writing')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#4169F6] hover:bg-indigo-50 font-bold text-sm shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>BẮT ĐẦU LUYỆN VIẾT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('tutor')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all duration-200"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Khám phá 10 bước AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: LỘ TRÌNH HỌC TẬP */}
      <div className="text-left space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              LỘ TRÌNH HỌC TẬP
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Học phần đa dạng được cấu trúc theo chương trình Ngữ văn THCS trường Huỳnh Thúc Kháng
            </p>
          </div>

          <button
            onClick={() => onNavigate('curriculum')}
            className="text-xs sm:text-sm font-bold text-[#4169F6] hover:text-[#6750FF] flex items-center gap-1 transition-colors"
          >
            <span>Xem tất cả bài học</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {learningPaths.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.tab)}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: item.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-[#4169F6] transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#4169F6] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-[#4169F6]">
                  <span>Vào học ngay</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: GỢI Ý CÁ NHÂN HÓA TỪ AI TUTOR */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-blue-50/80 p-6 sm:p-8 border border-indigo-100/90 text-left relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#6750FF] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6750FF]">
                  GỢI Ý TỪ AI TUTOR
                </span>
                <span className="w-2 h-2 rounded-full bg-[#11B981] animate-ping" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Dựa trên kết quả học tập, em nên luyện thêm phần xác định luận điểm và liên kết câu trong văn nghị luận.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Các bài viết gần đây của em có ý tưởng rất phong phú! Nếu làm sắc nét thêm cây luận điểm, bài viết sẽ đạt điểm 9+ dễ dàng.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => onNavigate('curriculum')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white text-slate-700 hover:text-slate-900 border border-slate-200 font-bold text-xs shadow-sm hover:shadow transition-all"
            >
              ÔN TẬP NGAY
            </button>
            <button
              onClick={() => onNavigate('ai-writing')}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-[#6750FF] hover:bg-[#5B54F8] text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:scale-105 transition-all"
            >
              LUYỆN VỚI AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
