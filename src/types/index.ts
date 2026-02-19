export interface Puzzle {
  id: string;
  date: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export type GameCategory =
  | 'Stock Market'
  | 'Finance'
  | 'Economics'
  | 'Trading'
  | 'Investment'
  | 'Grid Puzzles'
  | 'Sudoku'
  | 'Nonograms';

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
  data: UserProgress | UserStats;
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

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  emoji: string;
  earnedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  score: number;
  puzzlesSolved: number;
  achievements: number;
  winRate: number;
  lastActive: string;
}

export interface DailyPuzzle extends Puzzle {
  type: 'daily' | 'weekly';
  dueDate: string;
  solvedBy: number;
  reward: number;
}

export interface PredictionChallenge {
  id: string;
  title: string;
  description: string;
  predictionType: 'price' | 'volume' | 'trend';
  currentValue: number;
  targetValue: number;
  timeLimit: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TimeChallenge {
  id: string;
  name: string;
  description: string;
  puzzleCount: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  record?: number;
  personalBest?: number;
}

export interface TechnicalAnalysisPuzzle {
  id: string;
  title: string;
  description: string;
  chartUrl: string;
  pattern: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}