export type GradeLevel = 'Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9';

export type SubjectCategory = 
  | 'Đọc hiểu'
  | 'Viết'
  | 'Tiếng Việt'
  | 'Văn học'
  | 'Nói và nghe'
  | 'Ôn tập';

export interface LessonItem {
  id: string;
  grade: GradeLevel;
  category: SubjectCategory;
  title: string;
  author?: string;
  summary: string;
  keyPoints: string[];
  sampleTopic?: string;
  genre?: string;
}

export interface StudentProfile {
  name: string;
  school: string;
  grade: GradeLevel;
  avatar: string;
  streakDays: number;
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  studyHours: number;
  writingSkills: {
    understandTopic: number; // 0-100
    brainstorm: number;
    thesisTree: number;
    outline: number;
    paragraphWriting: number;
    expression: number;
    selfCorrection: number;
  };
  earnedBadgeIds: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'reading' | 'writing' | 'grammar' | 'streak';
  earnedDate?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  color?: string;
  description?: string;
  children?: MindMapNode[];
  collapsed?: boolean;
}

export interface RubricScoreItem {
  criterion: string;
  score: number;
  max: number;
  comment: string;
}

export interface RubricEvaluation {
  rubricScores: RubricScoreItem[];
  totalAverageScore: number;
  strengths: string[];
  improvements: string[];
  selfEditQuestions: string[];
  top3Fixes: string[];
  comparison?: string;
}

export interface QuizItem {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  deviceType?: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'badge';
}
