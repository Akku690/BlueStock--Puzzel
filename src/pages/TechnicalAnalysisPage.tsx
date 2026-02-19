import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { TechnicalAnalysisPuzzle } from '@/types';
import './Pages.css';

const TechnicalAnalysisPage = () => {
  const [puzzles, setPuzzles] = useState<TechnicalAnalysisPuzzle[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  useEffect(() => {
    const mockPuzzles: TechnicalAnalysisPuzzle[] = [
      {
        id: 'ta-1',
        title: 'Identify the Support Level',
        description: 'Look at the chart and identify the key support level',
        chartUrl: 'https://via.placeholder.com/400x200?text=Support+Level+Chart',
        pattern: 'support_level',
        options: ['$45.50', '$46.00', '$46.50', '$47.00'],
        correctAnswer: 1,
        explanation: 'The support level is at $46.00 where the price has bounced multiple times.',
        difficulty: 'beginner',
      },
      {
        id: 'ta-2',
        title: 'Recognize Resistance Pattern',
        description: 'Identify the resistance pattern in this price chart',
        chartUrl: 'https://via.placeholder.com/400x200?text=Resistance+Pattern',
        pattern: 'resistance',
        options: ['Single Peak', 'Double Top', 'Triple Top', 'Flag Pattern'],
        correctAnswer: 1,
        explanation: 'This is a double top pattern, indicating potential reversal.',
        difficulty: 'beginner',
      },
      {
        id: 'ta-3',
        title: 'Moving Average Crossover',
        description: 'Analyze the 50-day and 200-day moving average crossover',
        chartUrl: 'https://via.placeholder.com/400x200?text=Moving+Averages',
        pattern: 'moving_average_cross',
        options: ['Bearish Signal', 'Bullish Signal', 'No Signal', 'Consolidation'],
        correctAnswer: 1,
        explanation: 'The 50-day MA crossing above the 200-day MA is a bullish golden cross.',
        difficulty: 'intermediate',
      },
      {
        id: 'ta-4',
        title: 'RSI Divergence Analysis',
        description: 'Identify the bullish/bearish divergence in RSI',
        chartUrl: 'https://via.placeholder.com/400x200?text=RSI+Divergence',
        pattern: 'rsi_divergence',
        options: ['Bullish Divergence', 'Bearish Divergence', 'Convergence', 'Neutral'],
        correctAnswer: 0,
        explanation: 'Price makes lower lows while RSI makes higher lows - bullish divergence.',
        difficulty: 'intermediate',
      },
      {
        id: 'ta-5',
        title: 'MACD Signal Crossover',
        description: 'Analyze the MACD histogram and signal line',
        chartUrl: 'https://via.placeholder.com/400x200?text=MACD+Histogram',
        pattern: 'macd_cross',
        options: ['Buy Signal', 'Sell Signal', 'Weak Signal', 'Hold'],
        correctAnswer: 0,
        explanation: 'MACD line crossing above signal line with positive histogram = buy signal.',
        difficulty: 'intermediate',
      },
      {
        id: 'ta-6',
        title: 'Harmonic Pattern: ABCD',
        description: 'Complete the harmonic pattern and predict the D level',
        chartUrl: 'https://via.placeholder.com/400x200?text=Harmonic+ABCD',
        pattern: 'harmonic_abcd',
        options: ['$52.40', '$53.20', '$54.80', '$55.60'],
        correctAnswer: 2,
        explanation: 'Based on Fibonacci ratios, the D point should be at $54.80.',
        difficulty: 'advanced',
      },
      {
        id: 'ta-7',
        title: 'Ichimoku Cloud Strategy',
        description: 'Analyze the Ichimoku cloud layers for trading signals',
        chartUrl: 'https://via.placeholder.com/400x200?text=Ichimoku+Cloud',
        pattern: 'ichimoku_cloud',
        options: ['Strong Uptrend', 'Strong Downtrend', 'Consolidation', 'Reversal Imminent'],
        correctAnswer: 0,
        explanation: 'Price is above all cloud layers with kumo support - strong uptrend.',
        difficulty: 'advanced',
      },
    ];

    setPuzzles(mockPuzzles);
  }, []);

  const filteredPuzzles = puzzles.filter((p) => p.difficulty === selectedDifficulty);
  const completed = Math.floor(Math.random() * filteredPuzzles.length);

  const difficultyColor = {
    beginner: '#10b981',
    intermediate: '#f59e0b',
    advanced: '#ef4444',
  };

  return (
    <div className="page technical-analysis-page fade-in">
      <div className="page-header">
        <h1>📈 Technical Analysis Puzzles</h1>
        <p>Master chart patterns, indicators, and trading signals</p>
      </div>

      <div className="ta-container">
        {/* Difficulty Filter */}
        <div className="difficulty-filter">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              className={`filter-btn ${selectedDifficulty === level ? 'active' : ''}`}
              style={
                selectedDifficulty === level
                  ? { backgroundColor: difficultyColor[level], color: 'white' }
                  : {}
              }
              onClick={() => setSelectedDifficulty(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Progress Stats */}
        <div className="ta-stats">
          <div className="stat-item">
            <span className="stat-label">Level Progress:</span>
            <span className="stat-value">
              {completed}/{filteredPuzzles.length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mastery:</span>
            <div className="mastery-bar">
              <div
                className="mastery-fill"
                style={{ width: `${(completed / filteredPuzzles.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Puzzles Grid */}
        <div className="ta-puzzles-grid">
          {filteredPuzzles.map((puzzle) => (
            <div key={puzzle.id} className="ta-puzzle-card">
              <div className="chart-preview">
                <img src={puzzle.chartUrl} alt={puzzle.title} />
                <div className="difficulty-badge" style={{ backgroundColor: difficultyColor[puzzle.difficulty] }}>
                  {puzzle.difficulty}
                </div>
              </div>

              <div className="puzzle-content">
                <h3>{puzzle.title}</h3>
                <p>{puzzle.description}</p>

                <div className="pattern-info">
                  <span className="pattern-type">📊 {puzzle.pattern.replace(/_/g, ' ').toUpperCase()}</span>
                </div>

                {/* Options Preview */}
                <div className="options-preview">
                  {puzzle.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`option-preview ${idx === puzzle.correctAnswer ? 'correct' : ''}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>

                <Link to={`/technical-analysis/${puzzle.id}`} className="btn btn-small btn-primary">
                  Learn & Practice
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="page-actions">
          <Link to="/prediction-game" className="btn btn-primary">
            Prediction Game
          </Link>
          <Link to="/daily-puzzles" className="btn btn-secondary">
            Daily Puzzles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAnalysisPage;
