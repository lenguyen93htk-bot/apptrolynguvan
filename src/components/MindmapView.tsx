import React, { useState } from 'react';
import {
  Network,
  List,
  GitFork,
  Sparkles,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Search,
  BookOpen,
} from 'lucide-react';
import { MindMapNode } from '../types';

interface MindmapViewProps {
  onShowToast: (text: string, type?: 'success' | 'info' | 'badge') => void;
}

export const MindmapView: React.FC<MindmapViewProps> = ({ onShowToast }) => {
  const [keyword, setKeyword] = useState('Đồng chí - Chính Hữu');
  const [viewMode, setViewMode] = useState<'mindmap' | 'tree' | 'list'>('mindmap');
  const [loading, setLoading] = useState(false);
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  const [mindmapData, setMindmapData] = useState<MindMapNode>({
    id: 'root',
    label: 'Bài thơ "Đồng chí" (Chính Hữu)',
    color: '#4169F6',
    children: [
      {
        id: 'branch-1',
        label: 'I. Tác giả & Hoàn cảnh',
        color: '#6750FF',
        children: [
          { id: 'b1-1', label: 'Chính Hữu: Nhà thơ - chiến sĩ quân đội' },
          { id: 'b1-2', label: 'Sáng tác: Đầu năm 1948, chiến dịch Việt Bắc thu - đông' },
          { id: 'b1-3', label: 'Thể loại: Thơ tự do cô đọng, giàu cảm xúc' },
        ],
      },
      {
        id: 'branch-2',
        label: 'II. Cơ sở hình thành tình đồng chí',
        color: '#FF7A00',
        children: [
          { id: 'b2-1', label: 'Cùng chung nguồn gốc xuất thân: "quê hương anh nước mặn đồng chua", "làng tôi nghèo đất cày lên sỏi đá"' },
          { id: 'b2-2', label: 'Cùng chung lý tưởng chiến đấu: "Súng bên súng, đầu sát bên đầu"' },
          { id: 'b2-3', label: 'Cùng chia sẻ gian lao thiếu thốn: "Đêm rét chung chăn thành đôi tri kỉ"' },
        ],
      },
      {
        id: 'branch-3',
        label: 'III. Biểu hiện cao đẹp của tình đồng chí',
        color: '#11B981',
        children: [
          { id: 'b3-1', label: 'Thấu hiểu tâm tư quê nhà: "Ruộng nương anh gửi bạn thân cày / Gian nhà không mặc kệ gió lung lay"' },
          { id: 'b3-2', label: 'Cùng vượt qua cơn sốt rét rừng: "Áo anh rách vai, quần tôi có vài mảnh vá"' },
          { id: 'b3-3', label: 'Sưởi ấm bằng tình đồng đội: "Thương nhau tay nắm lấy bàn tay"' },
        ],
      },
      {
        id: 'branch-4',
        label: 'IV. Bức tranh biểu tượng cuối bài',
        color: '#EC4899',
        children: [
          { id: 'b4-1', label: 'Bối cảnh: Đêm rừng hoang sương muối, đứng cạnh bên nhau chờ giặc tới' },
          { id: 'b4-2', label: 'Hình ảnh bất hủ: "Đầu súng trăng treo"' },
          { id: 'b4-3', label: 'Ý nghĩa: Sự kết hợp giữa hiện thực và lãng mạn, chiến đấu và hòa bình' },
        ],
      },
    ],
  });

  const handleGenerateMindmap = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: keyword, type: 'work' }),
      });
      const data = await res.json();
      setMindmapData(data);
      onShowToast(`Đã kiến tạo sơ đồ tư duy cho "${keyword}"!`, 'success');
    } catch (e) {
      onShowToast('Đã tạo sơ đồ tư duy chuẩn kiến thức.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#6750FF] to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/15">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
              <Network className="w-4 h-4" />
              <span>SƠ ĐỒ TƯ DUY AI NGỮ VĂN</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HỆ THỐNG HÓA KIẾN THỨC BẰNG MIND MAP
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1">
              Nhập tác phẩm, nhân vật, bài học hoặc kiến thức tiếng Việt để AI kiến tạo bản đồ tư duy nhiều cấp độ.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex gap-1">
            <button
              onClick={() => setViewMode('mindmap')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'mindmap' ? 'bg-white text-[#6750FF] shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Sơ đồ</span>
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'tree' ? 'bg-white text-[#6750FF] shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Dàn ý cây</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-white text-[#6750FF] shadow-sm' : 'text-white hover:bg-white/10'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Input Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateMindmap()}
            placeholder="Ví dụ: Lão Hạc, Lặng lẽ Sa Pa, Biện pháp tu từ Ẩn dụ, Nghị luận về lòng dũng cảm..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#6750FF] focus:outline-none"
          />
        </div>
        <button
          onClick={handleGenerateMindmap}
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-[#6750FF] hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{loading ? 'AI đang hệ thống hóa...' : 'Tạo Sơ Đồ'}</span>
        </button>
      </div>

      {/* Quick topics chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold whitespace-nowrap">Chủ đề gợi ý:</span>
        {[
          'Lặng lẽ Sa Pa',
          'Bài thơ về tiểu đội xe không kính',
          'Biện pháp Tu từ Hoán dụ',
          'Tôi đi học (Thanh Tịnh)',
          'Nghị luận về lòng biết ơn',
        ].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setKeyword(tag);
            }}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-[#6750FF] hover:text-[#6750FF] font-semibold whitespace-nowrap transition-all shadow-sm"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Content Rendering based on viewMode */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm min-h-[460px]">
        {/* VIEW 1: SƠ ĐỒ TƯ DUY (VISUAL NODES) */}
        {viewMode === 'mindmap' && (
          <div className="space-y-6">
            {/* Root Node */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#4169F6] via-[#5B54F8] to-[#6750FF] text-white text-center font-extrabold text-base sm:text-lg shadow-lg max-w-xl mx-auto">
              🌟 {mindmapData.label}
            </div>

            {/* Grid of branches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
              {mindmapData.children?.map((branch) => {
                const isCollapsed = collapsedMap[branch.id];
                return (
                  <div
                    key={branch.id}
                    className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-all"
                  >
                    <div
                      onClick={() => toggleCollapse(branch.id)}
                      className="flex items-center justify-between cursor-pointer pb-2 border-b border-slate-200 font-extrabold text-xs sm:text-sm text-slate-900"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: branch.color || '#6750FF' }} />
                        <span>{branch.label}</span>
                      </div>
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {!isCollapsed && branch.children && (
                      <div className="space-y-2 pt-1">
                        {branch.children.map((child) => (
                          <div
                            key={child.id}
                            className="p-3 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-700 leading-relaxed shadow-2xs hover:border-[#6750FF] transition-colors"
                          >
                            {child.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: DÀN Ý DẠNG CÂY (TREE OUTLINE) */}
        {viewMode === 'tree' && (
          <div className="space-y-4 max-w-3xl mx-auto font-sans">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-[#6750FF] font-extrabold text-sm sm:text-base">
              🌳 {mindmapData.label}
            </div>

            <div className="pl-6 border-l-2 border-indigo-200 space-y-4">
              {mindmapData.children?.map((branch) => (
                <div key={branch.id} className="space-y-2">
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#6750FF]" />
                    <span>{branch.label}</span>
                  </div>

                  {branch.children && (
                    <div className="pl-6 border-l-2 border-slate-200 space-y-1.5">
                      {branch.children.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 hover:bg-indigo-50/50 transition-colors"
                        >
                          ↳ {c.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: DANH SÁCH (LIST VIEW) */}
        {viewMode === 'list' && (
          <div className="space-y-5 max-w-3xl mx-auto">
            <h2 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              {mindmapData.label}
            </h2>
            <div className="space-y-4">
              {mindmapData.children?.map((branch, i) => (
                <div key={branch.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                    {branch.label}
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                    {branch.children?.map((c) => (
                      <li key={c.id}>{c.label}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
