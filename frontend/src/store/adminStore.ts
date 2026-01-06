import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
    isAuthorized: boolean;
    authorize: (passcode: string) => boolean;
    logout: () => void;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            isAuthorized: false,
            authorize: (passcode: string) => {
                if (passcode === '1234') { // Simple simulated passcode
                    set({ isAuthorized: true });
                    return true;
                }
                return false;
            },
            logout: () => set({ isAuthorized: false }),
        }),
        {
            name: 'bhojanālaya-admin-storage',
        }
    )
);
