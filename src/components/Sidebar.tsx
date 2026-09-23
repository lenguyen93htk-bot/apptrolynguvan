import React from 'react';
import {
  Home,
  BookMarked,
  Sparkles,
  BookOpenCheck,
  Network,
  Gamepad2,
  Bot,
  User,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export type NavTab = 
  | 'home'
  | 'curriculum'
  | 'ai-writing'
  | 'reading'
  | 'mindmap'
  | 'games'
  | 'tutor'
  | 'profile'
  | 'teacher';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  streakDays: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  streakDays,
}) => {
  const mainNavItems = [
    { id: 'home' as NavTab, label: 'Trang chủ', icon: Home, highlight: false },
    { id: 'curriculum' as NavTab, label: 'Lộ trình học tập', icon: BookMarked, highlight: false },
    { id: 'ai-writing' as NavTab, label: 'Viết cùng AI', icon: Sparkles, highlight: true },
    { id: 'reading' as NavTab, label: 'Đọc hiểu', icon: BookOpenCheck, highlight: false },
    { id: 'mindmap' as NavTab, label: 'Sơ đồ tư duy', icon: Network, highlight: false },
    { id: 'games' as NavTab, label: 'Tiếng Việt vui', icon: Gamepad2, highlight: false },
    { id: 'tutor' as NavTab, label: 'AI Tutor', icon: Bot, highlight: false },
    { id: 'profile' as NavTab, label: 'Hồ sơ học tập', icon: User, highlight: false },
  ];

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside
        className={`fixed top-20 bottom-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-md border-r border-slate-100/90 flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Học tập & Rèn luyện
          </div>

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4169F6] to-[#6750FF] text-white shadow-md shadow-indigo-500/20'
                    : item.highlight
                    ? 'bg-indigo-50/70 text-[#6750FF] hover:bg-indigo-100/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-[#6750FF]' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse" />
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </button>
            );
          })}

          {/* Teacher Corner in sub-menu */}
          <div className="pt-5 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Dành cho giáo viên
          </div>
          <button
            onClick={() => handleSelect('teacher')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
              currentTab === 'teacher'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap
                className={`w-5 h-5 ${
                  currentTab === 'teacher' ? 'text-white' : 'text-emerald-600'
                }`}
              />
              <span>Góc giáo viên</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
              Soạn giảng
            </span>
          </button>
        </div>

        {/* Sidebar Footer / Daily Motivation */}
        <div className="pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/80 text-left">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Flame className="w-4 h-4 text-[#FF7A00] fill-orange-500 animate-pulse" />
              <span>Chuỗi chăm chỉ: {streakDays} ngày</span>
            </div>
            <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
              "Văn học là nhân học - Tự tin viết nên tư duy của chính mình!"
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: 'home' as NavTab, label: 'Trang chủ', icon: Home },
          { id: 'curriculum' as NavTab, label: 'Học tập', icon: BookMarked },
          { id: 'ai-writing' as NavTab, label: 'Viết AI', icon: Sparkles, badge: true },
          { id: 'games' as NavTab, label: 'Game vui', icon: Gamepad2 },
          { id: 'profile' as NavTab, label: 'Hồ sơ', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all relative ${
                isActive ? 'text-[#4169F6]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#4169F6]' : 'text-slate-500'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF7A00] rounded-full animate-ping" />
                )}
              </div>
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
