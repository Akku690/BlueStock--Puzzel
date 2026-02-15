import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import Header from './components/Header';
import PuzzleGame from './components/PuzzleGame';
import Stats from './components/Stats';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const { isLoading, error, initializeGame } = useGameStore();

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
                <h2 className="showcase-title">Decode today&#39;s Blue Stock puzzle.</h2>
                <p className="showcase-lead">
                  A focused, five-minute challenge built to sharpen your finance instincts and keep your
                  streak alive.
                </p>
                <div className="showcase-actions">
                  <a className="btn btn-primary" href="#puzzle">
                    Start Puzzle
                  </a>
                  <span className="showcase-meta">Offline-ready. Syncs when you&#39;re back online.</span>
                </div>
                <div className="showcase-badges">
                  <span className="badge">Daily Drop</span>
                  <span className="badge">Smart Hints</span>
                  <span className="badge">Streak Boost</span>
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

            <PuzzleGame />
            <Stats />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
