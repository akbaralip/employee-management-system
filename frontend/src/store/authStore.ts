import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutUser } from '../api/authService';

interface AuthState {
    isAuthenticated: boolean;
    user: any;
    accessToken: string | null;
    refreshToken: string | null;
    login: (userData: any) => void;
    logout: () => void;
    setTokens: (tokens: { access: string; refresh: string }) => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
            login: (userData) => {
                set({
                    isAuthenticated: true,
                    user: userData.user,
                    accessToken: userData.access,
                    refreshToken: userData.refresh,
                });
            },
            logout: async () => {
                const refreshToken = get().refreshToken;
                if (refreshToken) {
                    try {
                        await logoutUser(refreshToken);
                    } catch (error) {
                        console.error("Failed to blacklist token:", error);
                    }
                }
                set({
                    isAuthenticated: false,
                    user: null,
                    accessToken: null,
                    refreshToken: null,
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