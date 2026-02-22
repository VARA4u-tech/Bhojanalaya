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
    loginWithMagicLink: (email: string) => Promise<{ error: any }>;
    loginWithPassword: (email: string, password: string) => Promise<{ error: any }>;
    signUpWithPassword: (email: string, password: string, name: string) => Promise<{ error: any }>;
    loginWithGoogle: () => Promise<{ error: any }>;
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

            loginWithMagicLink: async (email) => {
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: window.location.origin,
                    }
                });
                return { error };
            },

            loginWithPassword: async (email, password) => {
                const { error, data } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                return { error };
            },

            signUpWithPassword: async (email, password, name) => {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name
                        }
                    }
                });
                return { error };
            },

            loginWithGoogle: async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin
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
            // Persist user state and preferences for "Remember Me" functionality
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                preferences: state.preferences
            }),
            // Only rehydrate if we have a valid session
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Check session validity on rehydration
                    state.checkSession();
                }
            },
        }
    )
);

// Initialize auth listener for persistent sessions
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event, 'Session:', !!session);

    if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user) {
        // User is authenticated - update store
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
        // User signed out - clear store
        useUserStore.setState({
            user: null,
            isAuthenticated: false,
            isLoading: false
        });
    }
});
