import React, { useState } from 'react';
import {
  BookMarked,
  Search,
  Filter,
  ArrowRight,
  PenTool,
  Sparkles,
  BookOpen,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { CURRICULUM_LESSONS } from '../data/curriculumData';
import { GradeLevel, SubjectCategory, LessonItem } from '../types';

interface CurriculumViewProps {
  onStartWritingWithTopic: (topic: string) => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'badge') => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  onStartWritingWithTopic,
  onShowToast,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'Tất cả'>('Lớp 8');
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory | 'Tất cả'>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const grades: (GradeLevel | 'Tất cả')[] = ['Tất cả', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'];
  const categories: (SubjectCategory | 'Tất cả')[] = [
    'Tất cả',
    'Văn học',
    'Đọc hiểu',
    'Viết',
    'Tiếng Việt',
  ];

  const filteredLessons = CURRICULUM_LESSONS.filter((lesson) => {
    const matchGrade = selectedGrade === 'Tất cả' || lesson.grade === selectedGrade;
    const matchCat = selectedCategory === 'Tất cả' || lesson.category === selectedCategory;
    const matchSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lesson.author && lesson.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchGrade && matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#4169F6] to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <BookMarked className="w-4 h-4" />
            <span>CHƯƠNG TRÌNH NGỮ VĂN THCS HUỲNH THÚC KHÁNG</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            LỘ TRÌNH HỌC TẬP LỚP 6 – 9
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
            Toàn bộ hệ thống bài học Văn học, Tiếng Việt và các dạng bài Tập làm văn trọng tâm bám sát chương trình Giáo dục Phổ thông hiện hành.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Grade Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedGrade === grade
                    ? 'bg-[#4169F6] text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài học, tác giả..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169F6]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-bold whitespace-nowrap">Phân môn:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#4169F6]">
                    {lesson.grade}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-[#6750FF]">
                    {lesson.category}
                  </span>
                </div>
                {lesson.genre && (
                  <span className="text-[11px] font-semibold text-slate-400">
                    {lesson.genre}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#4169F6] transition-colors">
                  {lesson.title}
                </h3>
                {lesson.author && (
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Tác giả: {lesson.author}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lesson.summary}
              </p>

              {/* Key points */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Kiến thức trọng tâm:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {lesson.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#4169F6] font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {lesson.sampleTopic ? (
                <button
                  onClick={() => {
                    onStartWritingWithTopic(lesson.sampleTopic!);
                    onShowToast('Đã tải đề bài vào Phòng viết cùng AI!', 'success');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#4169F6] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Luyện viết với đề này</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Học phần trọng tâm</span>
              )}

              <button
                onClick={() => {
                  onShowToast(`Đã mở tài liệu chi tiết bài học "${lesson.title}"`, 'info');
                }}
                className="text-xs font-bold text-slate-600 hover:text-[#4169F6] flex items-center gap-1"
              >
                <span>Xem tài liệu</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
