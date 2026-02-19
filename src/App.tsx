import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import GamePage from './pages/GamePage';
import FuturePage from './pages/FuturePage';
import LeaderboardPage from './pages/LeaderboardPage';
import RewardsPage from './pages/RewardsPage';
import DailyPuzzlesPage from './pages/DailyPuzzlesPage';
import TechnicalAnalysisPage from './pages/TechnicalAnalysisPage';
import PredictionGamePage from './pages/PredictionGamePage';
import TimeChallengePage from './pages/TimeChallengePage';

function App() {
  const { isAuthenticated, hydrateAuth } = useAuthStore();

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  // Protected routes require authentication
  const ProtectedRoute = ({ element }: { element: React.ReactNode }) =>
    isAuthenticated ? element : <Navigate to="/auth" replace />;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/future" element={<FuturePage />} />
      <Route path="/game" element={<ProtectedRoute element={<GamePage />} />} />
      <Route path="/leaderboard" element={<ProtectedRoute element={<LeaderboardPage />} />} />
      <Route path="/rewards" element={<ProtectedRoute element={<RewardsPage />} />} />
      <Route path="/daily-puzzles" element={<ProtectedRoute element={<DailyPuzzlesPage />} />} />
      <Route path="/technical-analysis" element={<ProtectedRoute element={<TechnicalAnalysisPage />} />} />
      <Route path="/prediction-game" element={<ProtectedRoute element={<PredictionGamePage />} />} />
      <Route path="/time-challenge" element={<ProtectedRoute element={<TimeChallengePage />} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
