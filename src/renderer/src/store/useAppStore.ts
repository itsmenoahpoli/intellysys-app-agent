import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApiUrl } from '@renderer/utils/env';

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  serverUrl: string;
  isConnected: boolean;
  uptime: number | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setServerUrl: (url: string) => void;
  setConnected: (status: boolean) => void;
  setUptime: (time: number | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      serverUrl: getApiUrl(),
      isConnected: false,
      uptime: null,
      setAuth: (user, token) => {
        localStorage.setItem('wap_auth_token', token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem('wap_auth_token');
        set({ user: null, token: null });
      },
      setServerUrl: (serverUrl) => set({ serverUrl }),
      setConnected: (isConnected) => set({ isConnected }),
      setUptime: (uptime) => set({ uptime }),
    }),
    {
      name: 'wap-intellysys-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
