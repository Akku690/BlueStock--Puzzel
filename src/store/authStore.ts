import { create } from 'zustand';
import { User } from '@/types';
import { isSupabaseConfigured, supabase } from '@/services/supabase';

const DEMO_USER_KEY = 'bluestock-demo-user';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  hydrateAuth: () => Promise<void>;
}

const toUser = (authUser: {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
  user_metadata?: { full_name?: string };
}): User => ({
  id: authUser.id,
  email: authUser.email || '',
  displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Player',
  createdAt: authUser.created_at || new Date().toISOString(),
  lastLogin: authUser.last_sign_in_at || new Date().toISOString(),
});

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isDemoMode: false,

  hydrateAuth: async () => {
    // Try to restore demo mode first
    const demoUserStr = localStorage.getItem(DEMO_USER_KEY);
    if (demoUserStr) {
      try {
        const demoUser: User = JSON.parse(demoUserStr);
        set({ user: demoUser, isAuthenticated: true, isDemoMode: true, error: null });
        return;
      } catch {
        // Fall through to Supabase
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      set({ user: null, isAuthenticated: false, error: error.message });
      return;
    }

    const authUser = data.session?.user;
    if (!authUser) {
      set({ user: null, isAuthenticated: false, error: null });
      return;
    }

    set({ user: toUser(authUser), isAuthenticated: true, error: null });
  },

  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      // Demo mode fallback
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      set({ user: demoUser, isAuthenticated: true, isDemoMode: true, error: null });
      return true;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      set({ error: error?.message || 'Unable to sign in. Please try again.' });
      return false;
    }

    set({ user: toUser(data.user), isAuthenticated: true, error: null });
    return true;
  },

  signUp: async (name: string, email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      // Demo mode: create local user
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        email,
        displayName: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      set({ user: demoUser, isAuthenticated: true, isDemoMode: true, error: null });
      return true;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      set({ error: error.message });
      return false;
    }

    if (!data.user) {
      set({ error: 'Sign up failed. Please try again.' });
      return false;
    }

    const isActiveSession = Boolean(data.session);
    set({
      user: toUser(data.user),
      isAuthenticated: isActiveSession,
      error: isActiveSession ? null : 'Account created. Please verify your email, then sign in.',
    });

    return isActiveSession;
  },

  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    localStorage.removeItem(DEMO_USER_KEY);
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
