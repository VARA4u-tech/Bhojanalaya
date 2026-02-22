
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables in frontend');
}

// Create Supabase client with persistent session configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Store session in localStorage for persistence across browser sessions
        storage: window.localStorage,
        // Automatically refresh tokens
        autoRefreshToken: true,
        // Persist session across page reloads
        persistSession: true,
        // Detect session from URL (for magic links and OAuth)
        detectSessionInUrl: true,
    },
});
