import { useGameStore } from '@/store/gameStore';
import './Header.css';

const Header = () => {
  const { userStats } = useGameStore();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">🔵 Blue Stock</h1>
          
          <div className="streak-indicator">
            <span className="streak-icon">🔥</span>
            <span className="streak-count">{userStats.currentStreak}</span>
            <span className="streak-label">Day Streak</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
