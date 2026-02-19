import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { LeaderboardEntry } from '@/types';
import './Pages.css';

const LeaderboardPage = () => {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedRange, setSelectedRange] = useState<'global' | 'friends'>('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        userId: 'user1',
        displayName: 'Alpha Trader',
        score: 15420,
        puzzlesSolved: 284,
        achievements: 12,
        winRate: 94.5,
        lastActive: 'Now',
      },
      {
        rank: 2,
        userId: 'user2',
        displayName: 'Beta Analyst',
        score: 14890,
        puzzlesSolved: 271,
        achievements: 11,
        winRate: 92.1,
        lastActive: '2 min ago',
      },
      {
        rank: 3,
        userId: 'user3',
        displayName: 'Gamma Investor',
        score: 13560,
        puzzlesSolved: 256,
        achievements: 10,
        winRate: 89.8,
        lastActive: '15 min ago',
      },
      {
        rank: 4,
        userId: user?.id || 'user4',
        displayName: user?.displayName || 'You',
        score: 8920,
        puzzlesSolved: 167,
        achievements: 7,
        winRate: 78.5,
        lastActive: 'Now',
      },
      {
        rank: 5,
        userId: 'user5',
        displayName: 'Delta Pro',
        score: 8450,
        puzzlesSolved: 159,
        achievements: 6,
        winRate: 76.2,
        lastActive: '1 hour ago',
      },
    ];

    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 500);
  }, [user?.id, user?.displayName]);

  const userRank = leaderboard.find((entry) => entry.userId === user?.id);

  return (
    <div className="page leaderboard-page fade-in">
      <div className="page-header">
        <h1>🏆 Leaderboard & Rankings</h1>
        <p>Compete with traders worldwide and climb the ranks</p>
      </div>

      <div className="leaderboard-container">
        {/* Toggle View */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${selectedRange === 'global' ? 'active' : ''}`}
            onClick={() => setSelectedRange('global')}
          >
            🌍 Global
          </button>
          <button
            className={`toggle-btn ${selectedRange === 'friends' ? 'active' : ''}`}
            onClick={() => setSelectedRange('friends')}
          >
            👥 Friends
          </button>
        </div>

        {/* User's Current Rank */}
        {userRank && (
          <div className="user-rank-card">
            <div className="rank-badge">{userRank.rank}</div>
            <div className="rank-info">
              <h3>Your Rank: #{userRank.rank}</h3>
              <div className="rank-stats">
                <span>📊 Score: {userRank.score}</span>
                <span>✅ Solved: {userRank.puzzlesSolved}</span>
                <span>🎖️ Badges: {userRank.achievements}</span>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="col-rank">Rank</div>
            <div className="col-player">Player</div>
            <div className="col-score">Score</div>
            <div className="col-puzzles">Puzzles</div>
            <div className="col-achievements">Achievements</div>
            <div className="col-winrate">Win Rate</div>
            <div className="col-active">Last Active</div>
          </div>

          {loading ? (
            <div className="loading-state">Loading rankings...</div>
          ) : (
            <div className="table-body">
              {leaderboard.map((entry, idx) => (
                <div
                  key={entry.userId}
                  className={`table-row ${entry.userId === user?.id ? 'current-user' : ''} ${
                    idx < 3 ? 'top-tier' : ''
                  }`}
                >
                  <div className="col-rank">
                    {idx === 0 && '🥇'}
                    {idx === 1 && '🥈'}
                    {idx === 2 && '🥉'}
                    {idx >= 3 && `#${entry.rank}`}
                  </div>
                  <div className="col-player">{entry.displayName}</div>
                  <div className="col-score">
                    <span className="score-value">{entry.score.toLocaleString()}</span>
                  </div>
                  <div className="col-puzzles">{entry.puzzlesSolved}</div>
                  <div className="col-achievements">{entry.achievements}</div>
                  <div className="col-winrate">
                    <div className="winrate-bar">
                      <div
                        className="winrate-fill"
                        style={{ width: `${entry.winRate}%` }}
                      ></div>
                    </div>
                    <span>{entry.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="col-active">{entry.lastActive}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="page-actions">
          <Link to="/game" className="btn btn-primary">
            Play & Earn Points
          </Link>
          <Link to="/rewards" className="btn btn-secondary">
            View Achievements
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
