import { Puzzle } from '@/types';

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
export const generatePuzzle = (date: string): Puzzle => {
  const startTime = performance.now();
  
  // Use date as seed for deterministic puzzle generation
  const seed = dateToSeed(date);
  const rng = seededRandom(seed);

  const categories = ['Stock Market', 'Finance', 'Economics', 'Trading', 'Investment'];
  const category = categories[Math.floor(rng() * categories.length)];

  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
  const difficultyIndex = Math.floor(rng() * difficulties.length);
  const difficulty = difficulties[difficultyIndex];

  // Generate question based on category and difficulty
  const puzzleData = getPuzzleData(category, difficulty, rng);

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
 * Get puzzle data based on category and difficulty
 */
const getPuzzleData = (
  category: string,
  difficulty: string,
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
