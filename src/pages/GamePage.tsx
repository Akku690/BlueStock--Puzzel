import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import ErrorBoundary from '@/components/ErrorBoundary';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import PuzzleGame from '@/components/PuzzleGame';
import Stats from '@/components/Stats';
import { GameCategory } from '@/types';
import '@/App.css';

const gameCategories: Array<{ title: GameCategory; description: string }> = [
  { title: 'Grid Puzzles', description: 'Pattern-based market logic challenges with rapid decision making.' },
  { title: 'Sudoku', description: 'Number reasoning rounds for concentration and strategic planning.' },
  { title: 'Nonograms', description: 'Deduction-driven puzzles that reward analytical thinking and accuracy.' },
];

const GamePage = () => {
  const { isLoading, error, initializeGame, setCategory, selectedCategory } = useGameStore();

  const triggerGameAction = (action: 'sprint' | 'smart-hint') => {
    window.dispatchEvent(new CustomEvent('blue-stock-action', { detail: action }));
    document.getElementById('puzzle')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const triggerCategory = (category: GameCategory) => {
    void setCategory(category);
    document.getElementById('puzzle')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container app-stage">
            <section className="showcase">
              <div className="showcase-copy">
                <p className="eyebrow">Daily Market Signal</p>
                <h2 className="showcase-title">Decode today&apos;s Blue Stock puzzle.</h2>
                <p className="showcase-lead">
                  A focused challenge to sharpen your finance instincts with interactive puzzle modes and strategy tools.
                </p>
                <div className="showcase-actions">
                  <a className="btn btn-primary" href="#puzzle">
                    Start Puzzle
                  </a>
                  <span className="showcase-meta">Offline-ready. Syncs when you&apos;re back online.</span>
                </div>
                <div className="showcase-badges">
                  <span className="badge">Daily Drop</span>
                  <button className="badge badge-button" onClick={() => triggerGameAction('sprint')}>
                    AI Sprint
                  </button>
                  <button className="badge badge-button" onClick={() => triggerGameAction('smart-hint')}>
                    Smart Hint
                  </button>
                </div>
              </div>
              <div className="showcase-visual" aria-hidden="true">
                <div className="visual-orb"></div>
                <div className="visual-card">
                  <div className="visual-card-top">
                    <span>Market Pulse</span>
                    <span className="pulse-dot"></span>
                  </div>
                  <div className="visual-card-meter">
                    <span className="meter-fill"></span>
                  </div>
                  <div className="visual-card-rows">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="visual-glow"></div>
              </div>
            </section>

            <section className="game-sections fade-in" aria-label="Game sections">
              <h3 className="game-sections-title">Game Sections</h3>
              <div className="game-sections-grid">
                {gameCategories.map(category => (
                  <article key={category.title} className="game-section-card">
                    <h4>{category.title}</h4>
                    <p>{category.description}</p>
                    <button
                      className="btn btn-secondary game-section-play"
                      onClick={() => triggerCategory(category.title)}
                    >
                      Play {category.title}
                    </button>
                  </article>
                ))}
              </div>
              <p className="selected-category-text">Active section: {selectedCategory}</p>
            </section>

            <PuzzleGame />
            <Stats />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default GamePage;
