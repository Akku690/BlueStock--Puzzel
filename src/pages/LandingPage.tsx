import { Link } from 'react-router-dom';
import './Pages.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-overlay"></div>
      <main className="landing-content container">
        <section className="landing-card fade-in">
          <p className="landing-eyebrow">Welcome to</p>
          <h1>Blue Stock Puzzle Game</h1>
          <p>
            Crack finance-themed logic games, improve market intuition, and challenge yourself with
            Grid Puzzles, Sudoku, and Nonograms in one interactive experience.
          </p>
          <div className="landing-actions">
            <Link to="/auth" className="btn btn-primary">Get Started</Link>
            <Link to="/future" className="btn btn-secondary">Future Vision</Link>
          </div>
        </section>

        <aside className="landing-visual fade-in" aria-hidden="true">
          <div className="visual-screen">
            <div className="candles">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="grid-lines"></div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default LandingPage;
