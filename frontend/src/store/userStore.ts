import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role?: 'user' | 'admin';
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailUpdates: boolean;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    preferences: UserPreferences;

    // Actions
    login: (email: string) => Promise<{ error: any }>;
    logout: () => Promise<void>;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    checkSession: () => Promise<void>;
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
            isLoading: true,
            preferences: defaultPreferences,

            login: async (email) => {
                // For this app, we'll use OTP login as it's common for food apps
                // Or we can use proper sign in if password is provided
                // For now, let's assume we want to support Magic Link / OTP
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: window.location.origin,
                    }
                });

                return { error };
            },

            logout: async () => {
                await supabase.auth.signOut();
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

            checkSession: async () => {
                set({ isLoading: true });
                try {
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user) {
                        set({
                            user: {
                                id: session.user.id,
                                email: session.user.email!,
                                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                                role: session.user.user_metadata?.role || 'user',
                            },
                            isAuthenticated: true,
                        });
                    } else {
                        set({ user: null, isAuthenticated: false });
                    }
                } catch (error) {
                    console.error('Session check failed:', error);
                    set({ user: null, isAuthenticated: false });
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'bhojanālaya-user-storage',
            partialize: (state) => ({ preferences: state.preferences }), // Don't persist user/auth state, let Supabase handle it
        }
    )
);

// Initialize auth listener
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
        useUserStore.setState({
            user: {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                role: session.user.user_metadata?.role || 'user',
            },
            isAuthenticated: true,
            isLoading: false
        });
    } else if (event === 'SIGNED_OUT') {
        useUserStore.setState({
            user: null,
            isAuthenticated: false,
            isLoading: false
        });
    }
});
