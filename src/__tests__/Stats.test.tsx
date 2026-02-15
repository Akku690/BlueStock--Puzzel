import { render, screen } from '@testing-library/react';
import Stats from '../components/Stats';

const mockStats = {
  currentStreak: 7,
  longestStreak: 15,
  totalPuzzlesSolved: 42,
  averageAttempts: 1.8,
  lastPlayedDate: '2024-01-01',
  streakHistory: [],
};

jest.mock('../store/gameStore', () => ({
  useGameStore: () => ({
    userStats: mockStats,
  }),
}));

describe('Stats Component', () => {
  it('renders stats title', () => {
    render(<Stats />);
    expect(screen.getByText('Your Statistics')).toBeInTheDocument();
  });

  it('displays total puzzles solved', () => {
    render(<Stats />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Total Solved')).toBeInTheDocument();
  });

  it('displays current streak', () => {
    render(<Stats />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
  });

  it('displays longest streak', () => {
    render(<Stats />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Longest Streak')).toBeInTheDocument();
  });

  it('displays average attempts with decimal', () => {
    render(<Stats />);
    expect(screen.getByText('1.8')).toBeInTheDocument();
    expect(screen.getByText('Avg. Attempts')).toBeInTheDocument();
  });

  it('renders all stat cards', () => {
    render(<Stats />);
    const statCards = screen.getAllByRole('generic').filter(
      el => el.className.includes('stat-card')
    );
    expect(statCards.length).toBeGreaterThan(0);
  });
});
