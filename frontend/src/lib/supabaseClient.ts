// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Persist auth session in localStorage
    autoRefreshToken: true, // Auto refresh the token before it expires
    detectSessionInUrl: true, // Detect OAuth sessions in URL
    storage: window.localStorage, // Explicitly use localStorage
    storageKey: 'sb-auth-token', // Use standard Supabase storage key
    flowType: 'pkce', // Use PKCE flow for better security
  }
})
