import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { TimeChallenge } from '@/types';
import './Pages.css';

const TimeChallengePage = () => {
  const [challenges, setChallenges] = useState<TimeChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<TimeChallenge | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const mockChallenges: TimeChallenge[] = [
      {
        id: 'tc-1',
        name: 'Express Trader',
        description: 'Solve 5 puzzles in 60 seconds!',
        puzzleCount: 5,
        timeLimit: 60,
        difficulty: 'easy',
        personalBest: 45000,
        record: 35000,
      },
      {
        id: 'tc-2',
        name: 'Speed Demon',
        description: 'Solve 10 puzzles in 120 seconds!',
        puzzleCount: 10,
        timeLimit: 120,
        difficulty: 'medium',
        personalBest: 115000,
        record: 95000,
      },
      {
        id: 'tc-3',
        name: 'Lightning Strike',
        description: 'Solve 15 puzzles in 90 seconds!',
        puzzleCount: 15,
        timeLimit: 90,
        difficulty: 'hard',
        personalBest: 142000,
      },
      {
        id: 'tc-4',
        name: 'Marathon Master',
        description: 'Solve 20 puzzles in 300 seconds!',
        puzzleCount: 20,
        timeLimit: 300,
        difficulty: 'hard',
        personeBest: 280000,
      },
      {
        id: 'tc-5',
        name: 'Blitz Mode',
        description: 'Solve 8 puzzles in 45 seconds!',
        puzzleCount: 8,
        timeLimit: 45,
        difficulty: 'medium',
        personalBest: 88000,
        record: 72000,
      },
    ];

    setChallenges(mockChallenges);
  }, []);

  const startChallenge = (challenge: TimeChallenge) => {
    setSelectedChallenge(challenge);
    setTimeLeft(challenge.timeLimit);
    setIsRunning(true);
    setScore(0);
    setCompleted(0);
  };

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const simulateCorrect = () => {
    setScore((prev) => prev + 100);
    setCompleted((prev) => (prev + 1 < (selectedChallenge?.puzzleCount || 0) ? prev + 1 : prev));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyColor = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
  };

  return (
    <div className="page time-challenge-page fade-in">
      <div className="page-header">
        <h1>⚡ Time Challenge Mini-Puzzles</h1>
        <p>How many puzzles can you solve? Race against time!</p>
      </div>

      <div className="time-challenge-container">
        {/* Active Challenge */}
        {selectedChallenge && isRunning ? (
          <div className="challenge-active">
            <div className="challenge-display">
              <h2>{selectedChallenge.name}</h2>

              {/* Timer Display */}
              <div className={`timer ${timeLeft < 10 ? 'critical' : ''}`}>
                <span className="time-digit">{formatTime(timeLeft)}</span>
              </div>

              {/* Progress */}
              <div className="challenge-progress">
                <div className="progress-info">
                  <span>Solved: {completed}/{selectedChallenge.puzzleCount}</span>
                  <span>Score: {score}</span>
                </div>
                <div className="progress-bar-full">
                  <div
                    className="progress-fill"
                    style={{ width: `${(completed / selectedChallenge.puzzleCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Sample Puzzle */}
              <div className="puzzle-sample">
                <h4>What is the P/E ratio when Stock = $120 and EPS = $6?</h4>
                <div className="sample-options">
                  <button
                    className="option-btn"
                    onClick={() => simulateCorrect()}
                  >
                    A) 20 ✅
                  </button>
                  <button className="option-btn">B) 21</button>
                  <button className="option-btn">C) 19</button>
                  <button className="option-btn">D) 22</button>
                </div>
              </div>

              {/* End Button */}
              {timeLeft === 0 && (
                <div className="challenge-end">
                  <h3>Challenge Complete!</h3>
                  <div className="final-score">
                    <p>Your Score: <strong>{score}</strong></p>
                    <p>Puzzles Solved: <strong>{completed}/{selectedChallenge.puzzleCount}</strong></p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setIsRunning(false);
                      setSelectedChallenge(null);
                    }}
                  >
                    Back to Challenges
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Challenge Selection */}
            <div className="challenges-selection">
              <h3>🎯 Available Challenges</h3>
              <div className="challenges-cards-grid">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="challenge-item-card"
                    style={{ borderLeftColor: difficultyColor[challenge.difficulty] }}
                  >
                    <div className="challenge-card-header">
                      <h4>{challenge.name}</h4>
                      <span
                        className="difficulty-badge"
                        style={{ backgroundColor: difficultyColor[challenge.difficulty] }}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>

                    <p className="challenge-description">{challenge.description}</p>

                    <div className="challenge-specs">
                      <div className="spec">
                        <span className="label">Puzzles:</span>
                        <span className="value">{challenge.puzzleCount}</span>
                      </div>
                      <div className="spec">
                        <span className="label">Time:</span>
                        <span className="value">{challenge.timeLimit}s</span>
                      </div>
                    </div>

                    {challenge.personalBest && (
                      <div className="personal-best">
                        🏅 Personal Best: {challenge.personalBest}
                      </div>
                    )}

                    {challenge.record && (
                      <div className="global-record">
                        🌍 Global Record: {challenge.record}
                      </div>
                    )}

                    <button
                      className="btn btn-primary btn-full"
                      onClick={() => startChallenge(challenge)}
                    >
                      Start Challenge
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="challenge-leaderboard-preview">
              <h3>🏆 Time Challenge Leaderboard</h3>
              <div className="leaderboard-mini">
                <div className="leaderboard-entry">
                  <span>🥇 Speed King - 287,450 pts</span>
                  <span className="time-marker">Express Trader</span>
                </div>
                <div className="leaderboard-entry">
                  <span>🥈 Thunder Bolt - 215,320 pts</span>
                  <span className="time-marker">Speed Demon</span>
                </div>
                <div className="leaderboard-entry">
                  <span>🥉 Flash Master - 198,670 pts</span>
                  <span className="time-marker">Blitz Mode</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        {!isRunning && (
          <div className="page-actions">
            <Link to="/prediction-game" className="btn btn-secondary">
              Prediction Game
            </Link>
            <Link to="/leaderboard" className="btn btn-primary">
              View Leaderboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeChallengePage;
