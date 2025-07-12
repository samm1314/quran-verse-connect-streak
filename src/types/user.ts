export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  joinedDate: string;
  badges: Badge[];
  friends: string[]; // User IDs
  friendRequests: {
    sent: string[];
    received: string[];
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  currentStreak: number;
  lastSeen: string;
  status: 'online' | 'offline' | 'away';
}

export interface LeaderboardEntry {
  user: User;
  rank: number;
  points: number;
  streak: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  timeLimit?: number; // in seconds
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  verse?: {
    arabic: string;
    translation: string;
    reference: string;
  };
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface UserProgress {
  userId: string;
  quizzesCompleted: number;
  totalScore: number;
  averageScore: number;
  categoriesStudied: string[];
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyStats: {
    quizzesTaken: number;
    pointsEarned: number;
    streakDays: number;
  };
}