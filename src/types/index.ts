export interface Puzzle {
  id: string;
  date: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface UserProgress {
  puzzleId: string;
  completed: boolean;
  attempts: number;
  timeSpent: number;
  selectedAnswer?: number;
  timestamp: number;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalPuzzlesSolved: number;
  averageAttempts: number;
  lastPlayedDate: string;
  streakHistory: { date: string; completed: boolean }[];
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
  compressed: boolean;
}

export interface SyncQueue {
  id: string;
  action: 'progress' | 'stats' | 'achievement';
  data: any;
  timestamp: number;
  retries: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastLogin: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
