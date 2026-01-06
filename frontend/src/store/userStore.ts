import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailUpdates: boolean;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    preferences: UserPreferences;
    setUser: (user: User | null) => void;
    logout: () => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
    theme: 'system',
    notifications: true,
    emailUpdates: true,
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            preferences: defaultPreferences,

            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: !!user,
                });
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    preferences: defaultPreferences,
                });
            },

            updatePreferences: (newPreferences) => {
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        ...newPreferences,
                    },
                }));
            },
        }),
        {
            name: 'bhojanālaya-user-storage',
        }
    )
);
