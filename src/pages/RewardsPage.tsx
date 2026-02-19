import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Achievement, Trophy } from '@/types';
import './Pages.css';

const RewardsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'trophies'>('achievements');

  useEffect(() => {
    // Mock achievements data
    const mockAchievements: Achievement[] = [
      {
        id: 'first-puzzle',
        name: 'First Step',
        description: 'Complete your first puzzle',
        icon: '🎯',
        unlockedAt: '2025-01-15',
        rarity: 'common',
      },
      {
        id: 'streak-7',
        name: '7-Day Streak',
        description: 'Play 7 days in a row',
        icon: '🔥',
        unlockedAt: '2025-01-20',
        rarity: 'uncommon',
      },
      {
        id: 'expert',
        name: 'Expert Trader',
        description: 'Solve 50 puzzles',
        icon: '👑',
        unlockedAt: '2025-02-01',
        rarity: 'rare',
      },
      {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete 5 puzzles under 30 seconds',
        icon: '⚡',
        rarity: 'rare',
      },
      {
        id: 'perfect-week',
        name: 'Perfect Week',
        description: 'Solve all daily puzzles for a week',
        icon: '💯',
        rarity: 'epic',
      },
      {
        id: 'legend',
        name: 'Legend Status',
        description: 'Reach #1 on leaderboard',
        icon: '👸',
        rarity: 'legendary',
      },
    ];

    const mockTrophies: Trophy[] = [
      {
        id: 'bronze-trader',
        title: 'Bronze Trader',
        description: 'Score 5,000+ points',
        emoji: '🥉',
        earnedAt: '2025-01-20',
      },
      {
        id: 'silver-analyst',
        title: 'Silver Analyst',
        description: 'Score 10,000+ points',
        emoji: '🥈',
        earnedAt: '2025-02-01',
      },
      {
        id: 'gold-investor',
        title: 'Gold Investor',
        description: 'Score 15,000+ points',
        emoji: '🥇',
      },
      {
        id: 'platinum-pro',
        title: 'Platinum Pro',
        description: 'Score 20,000+ points',
        emoji: '💎',
      },
    ];

    setAchievements(mockAchievements);
    setTrophies(mockTrophies);
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  const trophyCount = trophies.filter((t) => t.earnedAt).length;

  return (
    <div className="page rewards-page fade-in">
      <div className="page-header">
        <h1>🏅 Rewards & Achievements</h1>
        <p>Unlock badges, trophies, and exclusive rewards</p>
      </div>

      <div className="rewards-container">
        {/* Stats Overview */}
        <div className="rewards-stats">
          <div className="stat-card">
            <div className="stat-icon">🎖️</div>
            <div className="stat-content">
              <h3>{unlockedCount}</h3>
              <p>Achievements Unlocked</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3>{trophyCount}</h3>
              <p>Trophies Earned</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{unlockedCount * 10 + trophyCount * 25}</h3>
              <p>Total Points</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="rewards-tabs">
          <button
            className={`tab-btn ${selectedTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setSelectedTab('achievements')}
          >
            🎯 Achievements ({unlockedCount}/{achievements.length})
          </button>
          <button
            className={`tab-btn ${selectedTab === 'trophies' ? 'active' : ''}`}
            onClick={() => setSelectedTab('trophies')}
          >
            🏆 Trophies ({trophyCount}/{trophies.length})
          </button>
        </div>

        {/* Achievements Grid */}
        {selectedTab === 'achievements' && (
          <div className="rewards-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`reward-card achievement-card ${achievement.unlockedAt ? 'unlocked' : 'locked'} ${achievement.rarity}`}
              >
                <div className="reward-icon">{achievement.icon}</div>
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                {achievement.unlockedAt && (
                  <div className="unlock-date">
                    🔓 Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
                {!achievement.unlockedAt && <div className="locked-badge">🔒 Locked</div>}
              </div>
            ))}
          </div>
        )}

        {/* Trophies Grid */}
        {selectedTab === 'trophies' && (
          <div className="rewards-grid">
            {trophies.map((trophy) => (
              <div
                key={trophy.id}
                className={`reward-card trophy-card ${trophy.earnedAt ? 'earned' : 'available'}`}
              >
                <div className="reward-icon trophy-emoji">{trophy.emoji}</div>
                <h3>{trophy.title}</h3>
                <p>{trophy.description}</p>
                {trophy.earnedAt && (
                  <div className="earn-date">
                    ✓ Earned {new Date(trophy.earnedAt).toLocaleDateString()}
                  </div>
                )}
                {!trophy.earnedAt && <div className="available-badge">⏳ Keep Playing</div>}
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="page-actions">
          <Link to="/leaderboard" className="btn btn-primary">
            Check Leaderboard
          </Link>
          <Link to="/game" className="btn btn-secondary">
            Earn More Rewards
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
