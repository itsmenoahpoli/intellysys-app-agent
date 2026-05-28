import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApiUrl } from '@renderer/utils/env';

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppState {
  user: User | null;
  token: string | null;
  serverUrl: string;
  agentIdentifier: string | null;
  licenseKey: string | null;
  setupStep: number;
  isConnected: boolean;
  uptime: number | null;
  toasts: Toast[];
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setServerUrl: (url: string) => void;
  setAgentIdentifier: (value: string) => void;
  setLicenseKey: (value: string | null) => void;
  setSetupStep: (value: number) => void;
  setConnected: (status: boolean) => void;
  setUptime: (time: number | null) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      serverUrl: getApiUrl(),
      agentIdentifier: null,
      licenseKey: null,
      setupStep: 3,
      isConnected: false,
      uptime: null,
      toasts: [],
      setAuth: (user, token) => {
        localStorage.setItem('wap_auth_token', token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem('wap_auth_token');
        set({ user: null, token: null });
      },
      setServerUrl: (serverUrl) => set({ serverUrl }),
      setAgentIdentifier: (agentIdentifier) => set({ agentIdentifier }),
      setLicenseKey: (licenseKey) => set({ licenseKey }),
      setSetupStep: (setupStep) => set({ setupStep }),
      setConnected: (isConnected) => set({ isConnected }),
      setUptime: (uptime) => set({ uptime }),
      showToast: (message, type = 'success', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }],
        }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, duration);
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: 'wap-intellysys-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        agentIdentifier: state.agentIdentifier,
        licenseKey: state.licenseKey,
        setupStep: state.setupStep,
      }),
    }
  )
);
