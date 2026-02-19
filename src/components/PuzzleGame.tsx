import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getDateString, getTodayDateString } from '@/utils/puzzle';
import { GameCategory } from '@/types';
import './PuzzleGame.css';

type GameMode = 'daily' | 'sprint';

const getRoundDuration = (mode: GameMode): number => {
  return mode === 'daily' ? 150 : 75;
};

const getRoundScore = (mode: GameMode, combo: number, attempts: number, timeLeft: number): number => {
  const base = mode === 'daily' ? 120 : 170;
  const comboBonus = combo * 30;
  const speedBonus = Math.max(0, timeLeft) * 2;
  const attemptPenalty = Math.max(0, attempts - 1) * 25;

  return Math.max(20, base + comboBonus + speedBonus - attemptPenalty);
};

const PuzzleGame = () => {
  const { currentPuzzle, userProgress, submitAnswer, resetProgress, loadPuzzle, setCategory, selectedCategory } = useGameStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mode, setMode] = useState<GameMode>('daily');
  const [timeLeft, setTimeLeft] = useState(getRoundDuration('daily'));
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionSolved, setSessionSolved] = useState(0);
  const [sprintOffset, setSprintOffset] = useState(0);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [timeBoostUsed, setTimeBoostUsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const duration = getRoundDuration(mode);
    setTimeLeft(duration);
    setHiddenOptions([]);
    setFiftyFiftyUsed(false);
    setTimeBoostUsed(false);
    setTimedOut(false);

    if (mode === 'daily' && userProgress?.completed) {
      setShowResult(true);
      setLastAnswerCorrect(true);
      setSelectedOption(userProgress.selectedAnswer ?? null);
      return;
    }

    setShowResult(false);
    setLastAnswerCorrect(null);
    setSelectedOption(null);
  }, [currentPuzzle?.id, mode, userProgress?.completed, userProgress?.selectedAnswer]);

  useEffect(() => {
    if (showResult) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setShowResult(true);
          setTimedOut(true);
          setLastAnswerCorrect(false);
          setCombo(0);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [showResult, currentPuzzle?.id]);

  if (!currentPuzzle) {
    return null;
  }

  const currentLevel = Math.floor(sessionScore / 900) + 1;
  const levelProgress = sessionScore % 900;
  const progressPercent = Math.min(100, Math.floor((levelProgress / 900) * 100));
  const attemptsCount = (userProgress?.attempts || 0) + 1;

  const handleModeSwitch = useCallback(async (nextMode: GameMode) => {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    setCombo(0);
    setBestCombo(0);
    setSessionScore(0);
    setSessionSolved(0);
    setSprintOffset(0);
    resetProgress();
    await loadPuzzle(getTodayDateString(), selectedCategory === 'All' ? undefined : selectedCategory);
  }, [loadPuzzle, mode, resetProgress, selectedCategory]);

  useEffect(() => {
    const onExternalAction = (event: Event) => {
      const customEvent = event as CustomEvent<'sprint' | 'smart-hint' | GameCategory>;

      if (customEvent.detail === 'sprint') {
        void handleModeSwitch('sprint');
        return;
      }

      if (customEvent.detail === 'smart-hint') {
        useFiftyFifty();
        return;
      }

      if (typeof customEvent.detail === 'string') {
        void setCategory(customEvent.detail as GameCategory);
      }
    };

    window.addEventListener('blue-stock-action', onExternalAction as EventListener);
    return () => {
      window.removeEventListener('blue-stock-action', onExternalAction as EventListener);
    };
  }, [currentPuzzle?.id, fiftyFiftyUsed, handleModeSwitch, setCategory, showResult]);

  const handleSubmit = async () => {
    if (selectedOption === null) return;

    await submitAnswer(selectedOption);
    const isCorrect = selectedOption === currentPuzzle.correctAnswer;
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      const nextCombo = combo + 1;
      const scoreEarned = getRoundScore(mode, nextCombo, attemptsCount, timeLeft);
      setCombo(nextCombo);
      setBestCombo(prev => Math.max(prev, nextCombo));
      setSessionScore(prev => prev + scoreEarned);
      setSessionSolved(prev => prev + 1);
    } else {
      setCombo(0);
    }

    setShowResult(true);
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowResult(false);
    setTimedOut(false);
    setLastAnswerCorrect(null);
    setHiddenOptions([]);
    setFiftyFiftyUsed(false);
    setTimeBoostUsed(false);
    setTimeLeft(getRoundDuration(mode));
    resetProgress();
  };

  const handleNextChallenge = async () => {
    const nextOffset = sprintOffset + 1;
    setSprintOffset(nextOffset);
    resetProgress();
    await loadPuzzle(getDateString(nextOffset), selectedCategory === 'All' ? undefined : selectedCategory);
  };

  const useFiftyFifty = () => {
    if (fiftyFiftyUsed || showResult) {
      return;
    }

    const incorrect = currentPuzzle.options
      .map((_, index) => index)
      .filter(index => index !== currentPuzzle.correctAnswer && index !== selectedOption);

    const shuffled = [...incorrect].sort(() => Math.random() - 0.5);
    setHiddenOptions(shuffled.slice(0, 2));
    setFiftyFiftyUsed(true);
  };

  const useTimeBoost = () => {
    if (timeBoostUsed || showResult) {
      return;
    }

    setTimeLeft(prev => prev + 15);
    setTimeBoostUsed(true);
  };

  const isCorrect = !!lastAnswerCorrect;
  const canSubmit = selectedOption !== null && !showResult;

  return (
    <div className="puzzle-game fade-in" id="puzzle">
      <div className="puzzle-card">
        <div className="game-mode-toggle">
          <button
            className={`mode-chip ${mode === 'daily' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('daily')}
          >
            Daily Mode
          </button>
          <button
            className={`mode-chip ${mode === 'sprint' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('sprint')}
          >
            AI Sprint
          </button>
        </div>

        <div className="game-hud">
          <div className="hud-card">
            <span>⏱ Time Left</span>
            <strong>{timeLeft}s</strong>
          </div>
          <div className="hud-card">
            <span>⚡ Combo</span>
            <strong>x{combo}</strong>
          </div>
          <div className="hud-card">
            <span>🏅 Score</span>
            <strong>{sessionScore}</strong>
          </div>
          <div className="hud-card">
            <span>🧠 Level</span>
            <strong>{currentLevel}</strong>
          </div>
        </div>

        <div className="level-progress" role="progressbar" aria-valuenow={progressPercent}>
          <span className="level-progress-fill" style={{ width: `${progressPercent}%` }}></span>
        </div>

        <div className="lifeline-row">
          <button className="lifeline-btn" onClick={useFiftyFifty} disabled={fiftyFiftyUsed || showResult}>
            50-50 Hint
          </button>
          <button className="lifeline-btn" onClick={useTimeBoost} disabled={timeBoostUsed || showResult}>
            +15s Boost
          </button>
          <span className="lifeline-meta">
            Solved this session: {sessionSolved} • Best combo: x{bestCombo}
          </span>
        </div>

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
            const isHidden = hiddenOptions.includes(index) && !showResult;

            if (isHidden) {
              return null;
            }

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
            {timedOut ? (
              <>
                <span className="result-icon">⏰</span>
                <p>Time&#39;s up! Challenge expired.</p>
                <p className="result-stats">Correct answer: {currentPuzzle.options[currentPuzzle.correctAnswer]}</p>
              </>
            ) : isCorrect ? (
              <>
                <span className="result-icon">🎉</span>
                <p>Excellent! You got it right!</p>
                <p className="result-stats">
                  Attempts: {userProgress?.attempts} | Time: {Math.floor((userProgress?.timeSpent || 0) / 1000)}s |
                  Score: {sessionScore}
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
          ) : mode === 'sprint' && isCorrect ? (
            <button className="btn btn-primary" onClick={handleNextChallenge}>
              Next Sprint Challenge
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
