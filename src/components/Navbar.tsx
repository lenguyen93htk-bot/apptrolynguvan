import React, { useState } from 'react';
import { BookOpen, Bell, Sun, Moon, Menu, X } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenMobileMenu,
  isMobileMenuOpen,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([
    {
      id: '1',
      title: 'AI Tutor phản hồi bài viết',
      desc: 'Đoạn văn "Ý nghĩa của lòng biết ơn" đã có gợi ý 4 bước.',
      time: '10 phút trước',
      unread: true,
    },
    {
      id: '2',
      title: 'Huy hiệu mới đạt được! 🏆',
      desc: 'Chúc mừng em đạt danh hiệu "Nhà phản biện trẻ".',
      time: 'Hôm qua',
      unread: false,
    },
    {
      id: '3',
      title: 'Lời nhắn từ Tổ Ngữ văn',
      desc: 'Đừng quên hoàn thành bài luyện tập Đọc hiểu Lớp 8 trước thứ Sáu.',
      time: '2 ngày trước',
      unread: false,
    },
  ]);

  const markAllAsRead = () => {
    setUnreadNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const hasUnread = unreadNotifications.some(n => n.unread);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/90 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Left */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4169F6] to-[#6750FF] flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                    NGỮ VĂN THCS
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#6750FF] border border-indigo-100">
                    K12 Chuẩn
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#4169F6] tracking-wide">
                  Tổ Ngữ văn - GDCD
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden xs:block">
                  Trường THCS Huỳnh Thúc Kháng
                </span>
              </div>
            </div>
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl text-slate-600 hover:text-[#4169F6] hover:bg-slate-100/80 transition-all duration-200"
              title={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ dịu mắt'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-[#4169F6] hover:bg-slate-100/80 transition-all duration-200"
                aria-label="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FF7A00] rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">Thông báo học tập</span>
                      {hasUnread && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#FF7A00]">
                          Mới
                        </span>
                      )}
                    </div>
                    {hasUnread && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#4169F6] hover:underline font-medium"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                    {unreadNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`py-3 px-2 rounded-xl transition-colors ${
                          n.unread ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 mt-2 text-center">
                    <span className="text-[11px] text-slate-400">
                      Tổ Ngữ văn - GDCD • THCS Huỳnh Thúc Kháng
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
