import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { DailyPuzzle } from '@/types';
import './Pages.css';

const DailyPuzzlesPage = () => {
  const [puzzles, setPuzzles] = useState<DailyPuzzle[]>([]);
  const [selectedType, setSelectedType] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    const mockPuzzles: DailyPuzzle[] = [
      {
        id: 'daily-2026-02-19',
        date: 'Feb 19, 2026',
        dueDate: '2026-02-20',
        question: 'Which technical indicator is most useful for identifying trend reversals?',
        options: ['Moving Average', 'RSI', 'MACD', 'Bollinger Bands'],
        correctAnswer: 1,
        difficulty: 'medium',
        category: 'Technical Analysis',
        type: 'daily',
        solvedBy: 1247,
        reward: 50,
      },
      {
        id: 'daily-2026-02-18',
        date: 'Feb 18, 2026',
        dueDate: '2026-02-19',
        question: 'What does a "Golden Cross" signify in stock trading?',
        options: [
          'Bearish signal',
          'Bullish signal',
          'Neutral signal',
          'Market reversal',
        ],
        correctAnswer: 1,
        difficulty: 'easy',
        category: 'Trading',
        type: 'daily',
        solvedBy: 1892,
        reward: 50,
      },
      {
        id: 'daily-2026-02-17',
        date: 'Feb 17, 2026',
        dueDate: '2026-02-18',
        question: 'Calculate the P/E ratio if Stock price is $100 and EPS is $5',
        options: ['10', '20', '30', '40'],
        correctAnswer: 1,
        difficulty: 'medium',
        category: 'Finance',
        type: 'daily',
        solvedBy: 956,
        reward: 50,
      },
      {
        id: 'weekly-2026-w7',
        date: 'Week 7, 2026',
        dueDate: '2026-02-26',
        question: 'Advanced: Analyze a 5-day price pattern and predict next move',
        options: ['Bullish', 'Bearish', 'Consolidation', 'Breakout'],
        correctAnswer: 3,
        difficulty: 'hard',
        category: 'Technical Analysis',
        type: 'weekly',
        solvedBy: 423,
        reward: 200,
      },
      {
        id: 'weekly-2026-w6',
        date: 'Week 6, 2026',
        dueDate: '2026-02-19',
        question: 'Identify the chart pattern and trading strategy',
        options: ['Head & Shoulders', 'Double Bottom', 'Triangle', 'Wedge'],
        correctAnswer: 1,
        difficulty: 'hard',
        category: 'Trading',
        type: 'weekly',
        solvedBy: 567,
        reward: 200,
      },
    ];

    setPuzzles(mockPuzzles);
  }, []);

  const filteredPuzzles = puzzles.filter((p) => p.type === selectedType);
  const completedCount = Math.floor(Math.random() * filteredPuzzles.length);

  return (
    <div className="page daily-puzzles-page fade-in">
      <div className="page-header">
        <h1>📅 Daily & Weekly Puzzles</h1>
        <p>Fresh challenges every day to sharpen your trading skills</p>
      </div>

      <div className="daily-container">
        {/* Type Toggle */}
        <div className="puzzle-type-toggle">
          <button
            className={`toggle-btn ${selectedType === 'daily' ? 'active' : ''}`}
            onClick={() => setSelectedType('daily')}
          >
            📅 Daily Challenges
          </button>
          <button
            className={`toggle-btn ${selectedType === 'weekly' ? 'active' : ''}`}
            onClick={() => setSelectedType('weekly')}
          >
            📊 Weekly Quests
          </button>
        </div>

        {/* Progress Overview */}
        <div className="puzzle-progress">
          <div className="progress-card">
            <h3>{completedCount}/{filteredPuzzles.length} Completed</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(completedCount / filteredPuzzles.length) * 100}%` }}
              ></div>
            </div>
            <p className="reward-info">
              Bonus: 50 points for daily streak! 🔥
            </p>
          </div>
        </div>

        {/* Puzzles List */}
        <div className="puzzles-list">
          {filteredPuzzles.map((puzzle, idx) => (
            <div key={puzzle.id} className="puzzle-item">
              <div className="puzzle-header">
                <div className="puzzle-meta">
                  <span className={`difficulty ${puzzle.difficulty}`}>
                    {puzzle.difficulty.toUpperCase()}
                  </span>
                  <span className="category">{puzzle.category}</span>
                </div>
                <div className="puzzle-reward">
                  +{puzzle.reward} <span className="coin-icon">💰</span>
                </div>
              </div>

              <h3>{puzzle.question}</h3>

              <div className="puzzle-options">
                {puzzle.options.map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className={`option ${optIdx === puzzle.correctAnswer ? 'correct' : ''}`}
                  >
                    {String.fromCharCode(65 + optIdx)}. {option}
                  </div>
                ))}
              </div>

              <div className="puzzle-stats">
                <span>👥 Solved by {puzzle.solvedBy.toLocaleString()}</span>
                <span>📅 {puzzle.date}</span>
                {puzzle.type === 'daily' && (
                  <span className="deadline">
                    ⏰ Due: {new Date(puzzle.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <Link to={`/puzzle/${puzzle.id}`} className="btn btn-small">
                Solve Now
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="page-actions">
          <Link to="/game" className="btn btn-primary">
            Play All Puzzles
          </Link>
          <Link to="/technical-analysis" className="btn btn-secondary">
            Technical Analysis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DailyPuzzlesPage;
