import { generatePuzzle, validateAnswer, calculateScore, getTodayDateString } from '../utils/puzzle';

describe('Puzzle Utils', () => {
  describe('generatePuzzle', () => {
    it('generates puzzle in under 100ms', () => {
      const start = performance.now();
      const puzzle = generatePuzzle('2024-01-01');
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100);
      expect(puzzle).toBeDefined();
    });

    it('generates consistent puzzle for same date', () => {
      const puzzle1 = generatePuzzle('2024-01-01');
      const puzzle2 = generatePuzzle('2024-01-01');
      
      expect(puzzle1.question).toBe(puzzle2.question);
      expect(puzzle1.correctAnswer).toBe(puzzle2.correctAnswer);
    });

    it('generates different puzzles for different dates', () => {
      const puzzle1 = generatePuzzle('2024-01-01');
      const puzzle2 = generatePuzzle('2024-01-02');
      
      // High probability they'll be different
      expect(puzzle1.id).not.toBe(puzzle2.id);
    });

    it('generates puzzle with required fields', () => {
      const puzzle = generatePuzzle('2024-01-01');
      
      expect(puzzle.id).toBeDefined();
      expect(puzzle.date).toBe('2024-01-01');
      expect(puzzle.question).toBeDefined();
      expect(puzzle.options).toHaveLength(4);
      expect(puzzle.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(puzzle.correctAnswer).toBeLessThan(4);
      expect(puzzle.difficulty).toMatch(/easy|medium|hard/);
      expect(puzzle.category).toBeDefined();
    });
  });

  describe('validateAnswer', () => {
    const puzzle = generatePuzzle('2024-01-01');

    it('returns true for correct answer', () => {
      const isCorrect = validateAnswer(puzzle, puzzle.correctAnswer);
      expect(isCorrect).toBe(true);
    });

    it('returns false for incorrect answer', () => {
      const wrongAnswer = (puzzle.correctAnswer + 1) % 4;
      const isCorrect = validateAnswer(puzzle, wrongAnswer);
      expect(isCorrect).toBe(false);
    });
  });

  describe('calculateScore', () => {
    it('returns base score for first attempt with no time', () => {
      const score = calculateScore(1, 0);
      expect(score).toBe(1000);
    });

    it('penalizes multiple attempts', () => {
      const score1 = calculateScore(1, 0);
      const score2 = calculateScore(2, 0);
      
      expect(score2).toBeLessThan(score1);
      expect(score1 - score2).toBe(100);
    });

    it('penalizes time spent', () => {
      const score1 = calculateScore(1, 0);
      const score2 = calculateScore(1, 10000); // 10 seconds
      
      expect(score2).toBeLessThan(score1);
    });

    it('never returns negative score', () => {
      const score = calculateScore(100, 1000000);
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getTodayDateString', () => {
    it('returns date in YYYY-MM-DD format', () => {
      const date = getTodayDateString();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
