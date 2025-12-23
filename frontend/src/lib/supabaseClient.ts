// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Persist auth session in localStorage
    autoRefreshToken: true, // Auto refresh the token before it expires
    detectSessionInUrl: true, // Detect OAuth sessions in URL
    storageKey: 'santvaani-auth', // Custom storage key for better organization
  }
})
