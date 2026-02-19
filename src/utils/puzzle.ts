import { GameCategory, Puzzle } from '@/types';

/**
 * Generate a unique puzzle ID based on date
 */
export const generatePuzzleId = (date: Date): string => {
  return `puzzle-${date.toISOString().split('T')[0]}`;
};

/**
 * Get current date string in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get date string for offset days from today
 */
export const getDateString = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

/**
 * Generate puzzle data client-side (< 100ms requirement)
 * This is a simplified example - real implementation would be more complex
 */
export const generatePuzzle = (date: string, preferredCategory?: GameCategory): Puzzle => {
  const startTime = performance.now();
  
  // Use date as seed for deterministic puzzle generation
  const seed = dateToSeed(date);
  const rng = seededRandom(seed);

  const categories: GameCategory[] = ['Stock Market', 'Finance', 'Economics', 'Trading', 'Investment', 'Grid Puzzles', 'Sudoku', 'Nonograms'];
  const category = preferredCategory && categories.includes(preferredCategory)
    ? preferredCategory
    : categories[Math.floor(rng() * categories.length)];

  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
  const difficultyIndex = Math.floor(rng() * difficulties.length);
  const difficulty = difficulties[difficultyIndex];

  // Generate question based on category and difficulty
  const puzzleData = getPuzzleData(category, rng);

  const puzzle: Puzzle = {
    id: generatePuzzleId(new Date(date)),
    date,
    category,
    difficulty,
    ...puzzleData,
  };

  const endTime = performance.now();
  const generationTime = endTime - startTime;

  // Ensure we meet the < 100ms requirement
  if (generationTime > 100) {
    console.warn(`Puzzle generation took ${generationTime.toFixed(2)}ms`);
  }

  return puzzle;
};

/**
 * Convert date string to numeric seed
 */
const dateToSeed = (date: string): number => {
  return date.split('-').reduce((acc, val) => acc + parseInt(val), 0);
};

/**
 * Seeded random number generator
 */
const seededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

/**
 * Get puzzle data based on category
 */
const getPuzzleData = (
  category: string,
  rng: () => number
): { question: string; options: string[]; correctAnswer: number } => {
  const puzzleBank = {
    'Stock Market': [
      {
        question: 'What does IPO stand for?',
        options: ['Initial Public Offering', 'Internal Portfolio Organization', 'International Price Order', 'Investment Purchase Option'],
        correctAnswer: 0,
      },
      {
        question: 'What is a bull market?',
        options: ['Market with rising prices', 'Market with falling prices', 'Sideways market', 'Volatile market'],
        correctAnswer: 0,
      },
      {
        question: 'What is a stock dividend?',
        options: ['Cash payment', 'Additional shares', 'Bond payment', 'Tax refund'],
        correctAnswer: 1,
      },
    ],
    'Finance': [
      {
        question: 'What is compound interest?',
        options: ['Simple interest', 'Interest on principal and accumulated interest', 'Fixed rate', 'Variable rate'],
        correctAnswer: 1,
      },
      {
        question: 'What is liquidity?',
        options: ['Profitability', 'Ease of converting assets to cash', 'Long-term investment', 'Risk level'],
        correctAnswer: 1,
      },
    ],
    'Economics': [
      {
        question: 'What is inflation?',
        options: ['Decrease in prices', 'Increase in prices', 'Stable prices', 'Tax increase'],
        correctAnswer: 1,
      },
      {
        question: 'What is GDP?',
        options: ['Gross Domestic Product', 'General Development Plan', 'Global Distribution Point', 'Government Debt Percentage'],
        correctAnswer: 0,
      },
    ],
    'Grid Puzzles': [
      {
        question: 'In a 3x3 market grid, each row and column must have one growth sector. Which concept is this closest to?',
        options: ['Constraint satisfaction', 'Random guessing', 'Momentum trading', 'Sentiment mapping'],
        correctAnswer: 0,
      },
      {
        question: 'What is the first step in solving a grid logic puzzle?',
        options: ['Fill all cells randomly', 'Identify fixed clues and constraints', 'Skip to the final row', 'Use only diagonal rules'],
        correctAnswer: 1,
      },
    ],
    'Sudoku': [
      {
        question: 'Which number rule defines classic Sudoku?',
        options: ['Numbers 0-8 can repeat', 'Numbers 1-9 appear once per row/column/box', 'Only odd numbers allowed', 'Diagonals must be equal'],
        correctAnswer: 1,
      },
      {
        question: 'What is a common advanced Sudoku strategy?',
        options: ['Naked pairs', 'Random backfill', 'Color inversion', 'Cross multiplication'],
        correctAnswer: 0,
      },
    ],
    'Nonograms': [
      {
        question: 'In Nonograms, row and column numbers represent:',
        options: ['Cell coordinates', 'Lengths of consecutive filled blocks', 'Difficulty levels', 'Total empty cells'],
        correctAnswer: 1,
      },
      {
        question: 'What does an "X" usually indicate in a Nonogram?',
        options: ['A guaranteed filled cell', 'A blocked/empty cell', 'A bonus move', 'A hint token'],
        correctAnswer: 1,
      },
    ],
  };

  const categoryPuzzles = puzzleBank[category as keyof typeof puzzleBank] || puzzleBank['Stock Market'];
  const selectedPuzzle = categoryPuzzles[Math.floor(rng() * categoryPuzzles.length)];

  return selectedPuzzle;
};

/**
 * Validate puzzle answer
 */
export const validateAnswer = (puzzle: Puzzle, selectedAnswer: number): boolean => {
  return puzzle.correctAnswer === selectedAnswer;
};

/**
 * Calculate puzzle score based on attempts and time
 */
export const calculateScore = (attempts: number, timeSpent: number): number => {
  const baseScore = 1000;
  const attemptPenalty = (attempts - 1) * 100;
  const timePenalty = Math.floor(timeSpent / 1000) * 10;
  
  return Math.max(0, baseScore - attemptPenalty - timePenalty);
};
