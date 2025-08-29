import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  username: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (tokens: { access: string; refresh: string }) => void;
  logout: () => void;
  setTokens: (tokens: { access: string; refresh: string }) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: (tokens) => {
        const decodedUser: any = jwtDecode(tokens.access);
        const user: User = {
          username: decodedUser.username,
          email: decodedUser.email,
        };
        set({
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          user,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
      setTokens: (tokens) => {
        set({
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;