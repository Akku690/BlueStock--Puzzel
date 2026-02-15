import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import './PuzzleGame.css';

const PuzzleGame = () => {
  const { currentPuzzle, userProgress, submitAnswer, resetProgress } = useGameStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (userProgress?.completed) {
      setShowResult(true);
      setSelectedOption(userProgress.selectedAnswer ?? null);
    } else {
      setShowResult(false);
      setSelectedOption(null);
    }
  }, [userProgress]);

  if (!currentPuzzle) {
    return null;
  }

  const handleSubmit = async () => {
    if (selectedOption === null) return;

    await submitAnswer(selectedOption);
    setShowResult(true);
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowResult(false);
    resetProgress();
  };

  const isCorrect = userProgress?.completed && selectedOption === currentPuzzle.correctAnswer;
  const canSubmit = selectedOption !== null && !showResult;

  return (
    <div className="puzzle-game fade-in" id="puzzle">
      <div className="puzzle-card">
        <div className="puzzle-header">
          <span className="puzzle-category">{currentPuzzle.category}</span>
          <span className={`puzzle-difficulty puzzle-difficulty-${currentPuzzle.difficulty}`}>
            {currentPuzzle.difficulty}
          </span>
        </div>

        <h2 className="puzzle-question">{currentPuzzle.question}</h2>

        <div className="puzzle-options">
          {currentPuzzle.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isAnswer = index === currentPuzzle.correctAnswer;
            const showCorrect = showResult && isAnswer;
            const showIncorrect = showResult && isSelected && !isAnswer;

            return (
              <button
                key={index}
                className={`puzzle-option ${isSelected ? 'selected' : ''} ${
                  showCorrect ? 'correct' : ''
                } ${showIncorrect ? 'incorrect' : ''}`}
                onClick={() => !showResult && setSelectedOption(index)}
                disabled={showResult}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showCorrect && <span className="option-icon">✓</span>}
                {showIncorrect && <span className="option-icon">✗</span>}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`result-message ${isCorrect ? 'success' : 'error'}`}>
            {isCorrect ? (
              <>
                <span className="result-icon">🎉</span>
                <p>Excellent! You got it right!</p>
                <p className="result-stats">
                  Attempts: {userProgress?.attempts} | Time: {Math.floor((userProgress?.timeSpent || 0) / 1000)}s
                </p>
              </>
            ) : (
              <>
                <span className="result-icon">💡</span>
                <p>Not quite! Try again.</p>
                <p className="result-stats">Attempts: {userProgress?.attempts}</p>
              </>
            )}
          </div>
        )}

        <div className="puzzle-actions">
          {!showResult ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              Submit Answer
            </button>
          ) : !isCorrect ? (
            <button className="btn btn-secondary" onClick={handleRetry}>
              Try Again
            </button>
          ) : null}
        </div>

        {userProgress && !userProgress.completed && userProgress.attempts > 0 && (
          <div className="attempt-counter">
            Attempt {userProgress.attempts + 1}
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleGame;
