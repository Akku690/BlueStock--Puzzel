import { Link } from 'react-router-dom';
import './Pages.css';

const FuturePage = () => {
  const roadmap = [
    {
      title: 'AI Tutor Mode',
      description: 'Personalized hint engine that explains puzzle-solving steps and tracks learning gaps.',
    },
    {
      title: 'Multiplayer Leagues',
      description: 'Compete in weekly finance puzzle leagues with live rankings and challenge rooms.',
    },
    {
      title: 'Adaptive Difficulty',
      description: 'Dynamic puzzle complexity based on user accuracy, speed, and category strength.',
    },
    {
      title: 'Interview Simulation',
      description: 'Stock-analysis puzzle packs designed for finance interview preparation.',
    },
  ];

  return (
    <div className="future-page">
      <main className="future-card container fade-in">
        <h2>Future Features</h2>
        <p className="future-subtitle">
          This roadmap shows how Blue Stock Puzzle can evolve into a full AI-powered learning and competition platform.
        </p>

        <div className="future-grid">
          {roadmap.map(item => (
            <article key={item.title} className="future-item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="future-actions">
          <Link to="/auth" className="btn btn-primary">Start Playing</Link>
          <Link to="/" className="btn btn-secondary">Back to Welcome</Link>
        </div>
      </main>
    </div>
  );
};

export default FuturePage;
