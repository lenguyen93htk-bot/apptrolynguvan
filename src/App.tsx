import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { HomeDashboard } from './components/HomeDashboard';
import { AIWritingEcosystem } from './components/AIWritingEcosystem';
import { WritingWorkspace } from './components/WritingWorkspace';
import { ReadingComprehensionView } from './components/ReadingComprehensionView';
import { MindmapView } from './components/MindmapView';
import { VietnameseGamesView } from './components/VietnameseGamesView';
import { CurriculumView } from './components/CurriculumView';
import { TeacherCornerView } from './components/TeacherCornerView';
import { ProfileView } from './components/ProfileView';
import { AITutorFloating } from './components/AITutorFloating';
import { ToastContainer } from './components/Toast';
import { INITIAL_STUDENT_PROFILE } from './data/curriculumData';
import { StudentProfile, ToastMessage } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab | 'workspace'>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [activeTopic, setActiveTopic] = useState(
    'Hãy viết bài văn nghị luận về ý nghĩa của lòng biết ơn đối với học sinh THCS trong cuộc sống hôm nay.'
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode class toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (text: string, type: 'success' | 'info' | 'badge' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStartWritingWithTopic = (topic: string) => {
    setActiveTopic(topic);
    setCurrentTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWorkspace = (topic: string) => {
    setActiveTopic(topic);
    setCurrentTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAwardBadge = (badgeId: string) => {
    if (!student.earnedBadgeIds.includes(badgeId)) {
      setStudent((prev) => ({
        ...prev,
        earnedBadgeIds: [...prev.earnedBadgeIds, badgeId],
      }));
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} font-sans antialiased transition-colors duration-200`}>
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Main Top Brand Header */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* App Body with Sidebar */}
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab === 'workspace' ? 'ai-writing' : currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          streakDays={student.streakDays}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:pl-72 pb-24 lg:pb-12">
          {currentTab === 'home' && (
            <HomeDashboard
              student={student}
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartWritingWithTopic={handleStartWritingWithTopic}
            />
          )}

          {currentTab === 'curriculum' && (
            <CurriculumView
              onStartWritingWithTopic={handleStartWritingWithTopic}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'ai-writing' && (
            <AIWritingEcosystem
              onShowToast={showToast}
              onOpenWorkspace={handleOpenWorkspace}
            />
          )}

          {currentTab === 'workspace' && (
            <WritingWorkspace
              initialTopic={activeTopic}
              onBack={() => setCurrentTab('ai-writing')}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'reading' && (
            <ReadingComprehensionView onShowToast={showToast} />
          )}

          {currentTab === 'mindmap' && (
            <MindmapView onShowToast={showToast} />
          )}

          {currentTab === 'games' && (
            <VietnameseGamesView
              onShowToast={showToast}
              onAwardBadge={handleAwardBadge}
            />
          )}

          {currentTab === 'tutor' && (
            <AIWritingEcosystem
              onShowToast={showToast}
              onOpenWorkspace={handleOpenWorkspace}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              student={student}
              onShowToast={showToast}
              onNavigateToWriting={() => setCurrentTab('ai-writing')}
            />
          )}

          {currentTab === 'teacher' && (
            <TeacherCornerView onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Floating AI Tutor Assistant */}
      <AITutorFloating onShowToast={showToast} />
    </div>
  );
}
export default App;
