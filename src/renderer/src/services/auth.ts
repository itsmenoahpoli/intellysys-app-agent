import { useState } from 'react';
import { api } from '@renderer/utils/api';
import { useAppStore, User } from '@renderer/store/useAppStore';

export interface AuthResponse {
  token: string;
  user: User;
}

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!token;

  const login = async (email: string, password: string, serverUrl?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AuthResponse>(
        '/auth/login',
        { email, password },
        { customBaseUrl: serverUrl }
      );
      setAuth(response.user, response.token);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      const errMsg = err.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const loginWithToken = async (authToken: string, serverUrl?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AuthResponse>(
        '/auth/token-login',
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
          customBaseUrl: serverUrl,
        }
      );
      setAuth(response.user, authToken);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      const errMsg = err.message || 'Token login failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    clearAuth();
    setError(null);
  };

  const mockLogin = (email: string) => {
    const mockUser = { id: 'mock', email, role: 'admin', name: 'Mock User' };
    setAuth(mockUser, 'mock_token');
  };

  return {
    user,
    isLoggedIn,
    loading,
    error,
    login,
    loginWithToken,
    logout,
    mockLogin,
  };
}
