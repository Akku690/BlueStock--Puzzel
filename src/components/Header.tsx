import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { userStats } = useGameStore();
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const mastery = Math.min(100, Math.round((userStats.totalPuzzlesSolved / 75) * 100));

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">🔵 Blue Stock</h1>

          <div className="header-meta">
            <nav className="header-nav">
              <Link to="/game">Play</Link>
              <Link to="/daily-puzzles">Daily</Link>
              <Link to="/technical-analysis">Analysis</Link>
              <Link to="/prediction-game">Predict</Link>
              <Link to="/time-challenge">Time Race</Link>
              <Link to="/leaderboard">Rankings</Link>
              <Link to="/rewards">Rewards</Link>
              <Link to="/future">More</Link>
            </nav>
            <div className="streak-indicator">
              <span className="streak-icon">🔥</span>
              <span className="streak-count">{userStats.currentStreak}</span>
              <span className="streak-label">Day Streak</span>
            </div>
            <div className="mastery-pill">
              <span>Mastery</span>
              <strong>{mastery}%</strong>
            </div>
            <div className="user-pill">{user?.displayName || 'Player'}</div>
            <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
