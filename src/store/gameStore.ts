import { create } from 'zustand';
import { GameCategory, Puzzle, UserProgress, UserStats } from '@/types';
import {
  getPuzzleByDate,
  getProgress,
  getStats,
  saveStats,
  getAllProgress,
  cleanupOldData,
} from '@/utils/db';
import { generatePuzzle, getTodayDateString, getDateString, validateAnswer } from '@/utils/puzzle';
import { syncProgress, syncStats, fetchPuzzles, processSyncQueue, setupOnlineSync } from '@/services/api';

interface GameState {
  currentPuzzle: Puzzle | null;
  userProgress: UserProgress | null;
  userStats: UserStats;
  selectedCategory: GameCategory | 'All';
  isLoading: boolean;
  error: string | null;
  puzzleStartTime: number;

  // Actions
  initializeGame: () => Promise<void>;
  loadPuzzle: (date: string, preferredCategory?: GameCategory) => Promise<void>;
  setCategory: (category: GameCategory | 'All') => Promise<void>;
  submitAnswer: (answer: number) => Promise<void>;
  updateStats: () => Promise<void>;
  preloadPuzzles: () => Promise<void>;
  resetProgress: () => void;
}

const defaultStats: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalPuzzlesSolved: 0,
  averageAttempts: 0,
  lastPlayedDate: '',
  streakHistory: [],
};

export const useGameStore = create<GameState>((set, get) => ({
  currentPuzzle: null,
  userProgress: null,
  userStats: defaultStats,
  selectedCategory: 'All',
  isLoading: true,
  error: null,
  puzzleStartTime: 0,

  initializeGame: async () => {
    try {
      set({ isLoading: true, error: null });

      // Setup online sync
      setupOnlineSync();

      // Load or generate today's puzzle
      const todayDate = getTodayDateString();
      await get().loadPuzzle(todayDate);

      // Load user stats
      const stats = await getStats();
      if (stats) {
        set({ userStats: stats });
      }

      // Preload next 7 days puzzles
      get().preloadPuzzles();

      // Cleanup old data
      await cleanupOldData();

      // Process any pending sync operations
      processSyncQueue();

      set({ isLoading: false });
    } catch (error) {
      console.error('Error initializing game:', error);
      set({ error: 'Failed to initialize game', isLoading: false });
    }
  },

  loadPuzzle: async (date: string, preferredCategory?: GameCategory) => {
    try {
      set({ isLoading: true, error: null });

      // Try to load from cache first
      let puzzle = await getPuzzleByDate(date);

      // Generate if not cached
      if (!puzzle) {
        puzzle = generatePuzzle(date, preferredCategory);
        // Note: Puzzle will be saved when fetched from API or after generation
      }

      if (preferredCategory && puzzle.category !== preferredCategory) {
        puzzle = generatePuzzle(date, preferredCategory);
      }

      // Load user progress for this puzzle
      const progress = await getProgress(puzzle.id);

      set({
        currentPuzzle: puzzle,
        userProgress: progress || null,
        puzzleStartTime: progress ? 0 : Date.now(),
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading puzzle:', error);
      set({ error: 'Failed to load puzzle', isLoading: false });
    }
  },

  setCategory: async (category: GameCategory | 'All') => {
    set({ selectedCategory: category });
    const todayDate = getTodayDateString();
    await get().loadPuzzle(todayDate, category === 'All' ? undefined : category);
  },

  submitAnswer: async (answer: number) => {
    const { currentPuzzle, userProgress, puzzleStartTime } = get();

    if (!currentPuzzle) {
      return;
    }

    const isCorrect = validateAnswer(currentPuzzle, answer);
    const timeSpent = Date.now() - puzzleStartTime;
    const attempts = (userProgress?.attempts || 0) + 1;

    const newProgress: UserProgress = {
      puzzleId: currentPuzzle.id,
      completed: isCorrect,
      attempts,
      timeSpent: (userProgress?.timeSpent || 0) + timeSpent,
      selectedAnswer: answer,
      timestamp: Date.now(),
    };

    set({ userProgress: newProgress });

    // Sync progress (batched)
    await syncProgress(newProgress, isCorrect);

    // Update stats if puzzle completed
    if (isCorrect) {
      await get().updateStats();
    }

    // Reset timer for next attempt
    if (!isCorrect) {
      set({ puzzleStartTime: Date.now() });
    }
  },

  updateStats: async () => {
    const { userStats, currentPuzzle } = get();
    const todayDate = getTodayDateString();

    if (!currentPuzzle) {
      return;
    }

    // Calculate new streak
    const lastPlayedDate = new Date(userStats.lastPlayedDate);
    const today = new Date(todayDate);
    const daysDiff = Math.floor((today.getTime() - lastPlayedDate.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = userStats.currentStreak;

    if (daysDiff === 1) {
      // Consecutive day
      newStreak += 1;
    } else if (daysDiff > 1) {
      // Streak broken
      newStreak = 1;
    } else if (daysDiff === 0) {
      // Same day (don't change streak)
      newStreak = userStats.currentStreak || 1;
    }

    // Get all progress for average calculation
    const allProgress = await getAllProgress();
    const completedPuzzles = allProgress.filter(p => p.completed);
    const totalAttempts = completedPuzzles.reduce((sum, p) => sum + p.attempts, 0);

    const newStats: UserStats = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, userStats.longestStreak),
      totalPuzzlesSolved: completedPuzzles.length,
      averageAttempts: completedPuzzles.length > 0 ? totalAttempts / completedPuzzles.length : 0,
      lastPlayedDate: todayDate,
      streakHistory: [
        ...userStats.streakHistory.filter(h => h.date !== todayDate),
        { date: todayDate, completed: true },
      ],
    };

    set({ userStats: newStats });

    // Save and sync stats
    await saveStats(newStats);
    await syncStats(newStats);
  },

  preloadPuzzles: async () => {
    try {
      // Generate next 7 days of puzzles
      for (let i = 0; i <= 7; i++) {
        const date = getDateString(i);
        let puzzle = await getPuzzleByDate(date);

        if (!puzzle) {
          puzzle = generatePuzzle(date);
        }
      }

      // Try to fetch from API if online
      if (navigator.onLine) {
        try {
          const today = getTodayDateString();
          const weekFromNow = getDateString(7);
          await fetchPuzzles(today, weekFromNow);
        } catch (error) {
          console.warn('Could not fetch puzzles from API, using generated puzzles');
        }
      }
    } catch (error) {
      console.error('Error preloading puzzles:', error);
    }
  },

  resetProgress: () => {
    set({
      userProgress: null,
      puzzleStartTime: Date.now(),
    });
  },
}));
