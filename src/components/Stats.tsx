import { useGameStore } from '@/store/gameStore';
import './Stats.css';

const Stats = () => {
  const { userStats } = useGameStore();
  const mastery = Math.min(100, Math.round((userStats.totalPuzzlesSolved / 75) * 100));
  const playerLevel = Math.floor(userStats.totalPuzzlesSolved / 8) + 1;

  const stats = [
    {
      label: 'Total Solved',
      value: userStats.totalPuzzlesSolved,
      icon: '✅',
    },
    {
      label: 'Current Streak',
      value: userStats.currentStreak,
      icon: '🔥',
    },
    {
      label: 'Longest Streak',
      value: userStats.longestStreak,
      icon: '🏆',
    },
    {
      label: 'Avg. Attempts',
      value: userStats.averageAttempts.toFixed(1),
      icon: '📊',
    },
    {
      label: 'Player Level',
      value: playerLevel,
      icon: '🧠',
    },
    {
      label: 'Mastery',
      value: `${mastery}%`,
      icon: '🚀',
    },
  ];

  return (
    <div className="stats-container fade-in">
      <h3 className="stats-title">Your Statistics</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
