import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { PredictionChallenge } from '@/types';
import './Pages.css';

const PredictionGamePage = () => {
  const [challenges, setChallenges] = useState<PredictionChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<PredictionChallenge | null>(null);
  const [predictions, setPredictions] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const mockChallenges: PredictionChallenge[] = [
      {
        id: 'pred-1',
        title: 'Apple Stock Price',
        description: 'Predict if AAPL will go up or down in the next 1 hour',
        predictionType: 'price',
        currentValue: 150.25,
        targetValue: 0,
        timeLimit: 60,
        reward: 100,
        difficulty: 'easy',
      },
      {
        id: 'pred-2',
        title: 'Market Volume Surge',
        description: 'Will S&P 500 volume exceed average in next 4 hours?',
        predictionType: 'volume',
        currentValue: 2500000,
        targetValue: 2800000,
        timeLimit: 240,
        reward: 150,
        difficulty: 'medium',
      },
      {
        id: 'pred-3',
        title: 'Crypto Trend Analysis',
        description: 'Predict Bitcoin trend for the next 24 hours',
        predictionType: 'trend',
        currentValue: 42500,
        targetValue: 0,
        timeLimit: 1440,
        reward: 200,
        difficulty: 'hard',
      },
      {
        id: 'pred-4',
        title: 'Tech Sector Rally',
        description: 'Will NASDAQ gain 1% in the next 2 hours?',
        predictionType: 'price',
        currentValue: 16200.5,
        targetValue: 16362.5,
        timeLimit: 120,
        reward: 120,
        difficulty: 'medium',
      },
      {
        id: 'pred-5',
        title: '4-Hour Volatility',
        description: 'Predict if EUR/USD volatility increases in 4 hours',
        predictionType: 'volume',
        currentValue: 225,
        targetValue: 280,
        timeLimit: 240,
        reward: 160,
        difficulty: 'hard',
      },
    ];

    setChallenges(mockChallenges);
    if (mockChallenges.length > 0) {
      setSelectedChallenge(mockChallenges[0]);
    }
  }, []);

  const handlePrediction = (value: number) => {
    if (selectedChallenge) {
      setPredictions({
        ...predictions,
        [selectedChallenge.id]: value,
      });
    }
  };

  const userPrediction = selectedChallenge ? predictions[selectedChallenge.id] : null;
  const difficultyEmoji = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴',
  };

  return (
    <div className="page prediction-game-page fade-in">
      <div className="page-header">
        <h1>🎲 Prediction Game</h1>
        <p>Make predictions on market movements and earn rewards</p>
      </div>

      <div className="prediction-container">
        {/* Active Challenge */}
        {selectedChallenge && (
          <div className="active-challenge">
            <div className="challenge-header">
              <h2>{selectedChallenge.title}</h2>
              <div className="challenge-meta">
                <span className="difficulty">
                  {difficultyEmoji[selectedChallenge.difficulty]} {selectedChallenge.difficulty}
                </span>
                <span className="reward">+{selectedChallenge.reward} 💰</span>
              </div>
            </div>

            <p className="challenge-description">{selectedChallenge.description}</p>

            {/* Prediction Type Specific Content */}
            {selectedChallenge.predictionType === 'price' && (
              <div className="price-prediction">
                <div className="current-value">
                  <span className="label">Current Price</span>
                  <span className="value">${selectedChallenge.currentValue.toFixed(2)}</span>
                </div>

                <div className="prediction-buttons">
                  <button
                    className={`predict-btn up ${userPrediction === 1 ? 'active' : ''}`}
                    onClick={() => handlePrediction(1)}
                  >
                    <span className="arrow">📈</span>
                    <span className="text">Price UP</span>
                  </button>
                  <button
                    className={`predict-btn down ${userPrediction === -1 ? 'active' : ''}`}
                    onClick={() => handlePrediction(-1)}
                  >
                    <span className="arrow">📉</span>
                    <span className="text">Price DOWN</span>
                  </button>
                </div>
              </div>
            )}

            {selectedChallenge.predictionType === 'volume' && (
              <div className="volume-prediction">
                <div className="volume-info">
                  <div>
                    <span className="label">Current Volume</span>
                    <span className="value">{(selectedChallenge.currentValue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div>
                    <span className="label">Target Volume</span>
                    <span className="value">{(selectedChallenge.targetValue / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                <div className="prediction-buttons">
                  <button
                    className={`predict-btn ${userPrediction === 1 ? 'active' : ''}`}
                    onClick={() => handlePrediction(1)}
                  >
                    <span>Yes, Volume will surge 🚀</span>
                  </button>
                  <button
                    className={`predict-btn ${userPrediction === 0 ? 'active' : ''}`}
                    onClick={() => handlePrediction(0)}
                  >
                    <span>No, It will stay normal 📊</span>
                  </button>
                </div>
              </div>
            )}

            {selectedChallenge.predictionType === 'trend' && (
              <div className="trend-prediction">
                <div className="trend-info">
                  <span className="label">Current Trend</span>
                  <div className="trend-chart">📈 Price: ${selectedChallenge.currentValue}</div>
                </div>

                <div className="prediction-buttons">
                  <button
                    className={`predict-btn bullish ${userPrediction === 1 ? 'active' : ''}`}
                    onClick={() => handlePrediction(1)}
                  >
                    🐂 Bullish Trend
                  </button>
                  <button
                    className={`predict-btn bearish ${userPrediction === -1 ? 'active' : ''}`}
                    onClick={() => handlePrediction(-1)}
                  >
                    🐻 Bearish Trend
                  </button>
                  <button
                    className={`predict-btn sideways ${userPrediction === 0 ? 'active' : ''}`}
                    onClick={() => handlePrediction(0)}
                  >
                    ➡️ Sideways/Consolidation
                  </button>
                </div>
              </div>
            )}

            <div className="challenge-timer">
              <span>⏰ Time Limit: {selectedChallenge.timeLimit} minutes</span>
              <button className="btn btn-primary" disabled={userPrediction === null}>
                {userPrediction !== null ? '✓ Submit Prediction' : 'Make Your Prediction'}
              </button>
            </div>
          </div>
        )}

        {/* Challenge List */}
        <div className="challenges-list">
          <h3>🎯 Available Predictions</h3>
          <div className="challenges-grid">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`challenge-card ${selectedChallenge?.id === challenge.id ? 'selected' : ''}`}
                onClick={() => setSelectedChallenge(challenge)}
              >
                <div className="card-header">
                  <span className="type-badge">{challenge.predictionType.toUpperCase()}</span>
                  <span className="reward-small">+{challenge.reward}</span>
                </div>
                <h4>{challenge.title}</h4>
                <div className="card-stats">
                  <span>🕐 {challenge.timeLimit}m</span>
                  <span>{difficultyEmoji[challenge.difficulty]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="page-actions">
          <Link to="/time-challenge" className="btn btn-primary">
            Time Challenge Mode
          </Link>
          <Link to="/technical-analysis" className="btn btn-secondary">
            Learn Technical Analysis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PredictionGamePage;
