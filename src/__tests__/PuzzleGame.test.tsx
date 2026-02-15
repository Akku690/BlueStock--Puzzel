import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PuzzleGame from '../components/PuzzleGame';

const mockPuzzle = {
  id: 'test-puzzle',
  date: '2024-01-01',
  question: 'What is 2 + 2?',
  options: ['3', '4', '5', '6'],
  correctAnswer: 1,
  difficulty: 'easy' as const,
  category: 'Math',
};

const mockSubmitAnswer = jest.fn();
const mockResetProgress = jest.fn();

jest.mock('../store/gameStore', () => ({
  useGameStore: () => ({
    currentPuzzle: mockPuzzle,
    userProgress: null,
    submitAnswer: mockSubmitAnswer,
    resetProgress: mockResetProgress,
  }),
}));

describe('PuzzleGame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders puzzle question', () => {
    render(<PuzzleGame />);
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<PuzzleGame />);
    mockPuzzle.options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('displays category and difficulty', () => {
    render(<PuzzleGame />);
    expect(screen.getByText('Math')).toBeInTheDocument();
    expect(screen.getByText('easy')).toBeInTheDocument();
  });

  it('allows selecting an option', () => {
    render(<PuzzleGame />);
    const option = screen.getByText('4');
    fireEvent.click(option);
    
    const submitButton = screen.getByText('Submit Answer');
    expect(submitButton).not.toBeDisabled();
  });

  it('submits answer when button clicked', async () => {
    render(<PuzzleGame />);
    
    const option = screen.getByText('4');
    fireEvent.click(option);
    
    const submitButton = screen.getByText('Submit Answer');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmitAnswer).toHaveBeenCalledWith(1);
    });
  });

  it('disables submit button when no option selected', () => {
    render(<PuzzleGame />);
    const submitButton = screen.getByText('Submit Answer');
    expect(submitButton).toBeDisabled();
  });
});
