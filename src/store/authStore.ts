import { create } from 'zustand';
import { Role, User } from '../types';
import { api } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  loginAsDemo: (role: Role) => Promise<void>;
  logout: () => void;
  initAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('foodbridge_token'),
  isLoading: false,
  error: null,

  loginAsDemo: async (role: Role) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await api.auth.demoLogin(role);
      localStorage.setItem('foodbridge_token', token);
      localStorage.setItem('foodbridge_user', JSON.stringify(user));
      set({ token, user, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('foodbridge_token');
    localStorage.removeItem('foodbridge_user');
    set({ token: null, user: null });
  },

  setUser: (user: User) => set({ user }),

  initAuth: async () => {
    const savedUser = localStorage.getItem('foodbridge_user');
    const token = localStorage.getItem('foodbridge_token');
    if (savedUser && token) {
      try {
        set({ user: JSON.parse(savedUser), token });
        const { user } = await api.auth.me();
        set({ user });
      } catch (e) {
        // Token might have expired, default to donor demo
        const { token: demoToken, user: demoUser } = await api.auth.demoLogin('donor');
        localStorage.setItem('foodbridge_token', demoToken);
        localStorage.setItem('foodbridge_user', JSON.stringify(demoUser));
        set({ token: demoToken, user: demoUser });
      }
    } else {
      // Auto-initialize with Donor Demo for zero-friction hackathon preview!
      try {
        const { token: demoToken, user: demoUser } = await api.auth.demoLogin('donor');
        localStorage.setItem('foodbridge_token', demoToken);
        localStorage.setItem('foodbridge_user', JSON.stringify(demoUser));
        set({ token: demoToken, user: demoUser });
      } catch (e) {
        // ignore on initial launch
      }
    }
  },
}));
