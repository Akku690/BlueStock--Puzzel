import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { isSupabaseConfigured } from '@/services/supabase';
import './Pages.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, error, clearError, isAuthenticated } = useAuthStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/game');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [mode, clearError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    let success = false;
    if (mode === 'signup') {
      success = await signUp(name.trim(), email.trim(), password);
    } else {
      success = await signIn(email.trim(), password);
    }

    setIsSubmitting(false);
    if (success) {
      navigate('/game');
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-card fade-in">
        <h2>{mode === 'signin' ? 'Sign In to Play' : 'Create your account'}</h2>
        <p className="auth-subtitle">
          {mode === 'signin'
            ? 'Enter your email and password to continue.'
            : 'Sign up to start your Blue Stock Puzzle journey.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <label>
              Full Name
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={event => setName(event.target.value)}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={event => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'signin' ? 'Unable to sign in?' : 'Already have an account?'}{' '}
          <button
            className="auth-switch-btn"
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        <Link to="/" className="auth-back">← Back to Welcome page</Link>
      </main>
    </div>
  );
};

export default AuthPage;
