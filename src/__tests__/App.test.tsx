import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the store
jest.mock('../store/gameStore', () => ({
  useGameStore: () => ({
    isLoading: false,
    error: null,
    initializeGame: jest.fn(),
    currentPuzzle: {
      id: 'test-puzzle',
      date: '2024-01-01',
      question: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      difficulty: 'easy',
      category: 'Test',
    },
    userProgress: null,
    userStats: {
      currentStreak: 5,
      longestStreak: 10,
      totalPuzzlesSolved: 50,
      averageAttempts: 1.5,
      lastPlayedDate: '2024-01-01',
      streakHistory: [],
    },
  }),
}));

describe('App', () => {
  it('renders header', () => {
    render(<App />);
    expect(screen.getByText(/Blue Stock/i)).toBeInTheDocument();
  });

  it('displays streak information', () => {
    render(<App />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders puzzle game', () => {
    render(<App />);
    expect(screen.getByText('Test question?')).toBeInTheDocument();
  });

  it('renders stats section', () => {
    render(<App />);
    expect(screen.getByText('Your Statistics')).toBeInTheDocument();
  });
});
