// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { supabaseStorage } from './storage'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: supabaseStorage,
    // Removed PKCE flow - it was interfering with cross-tab session sharing
    // Using default storage key - don't override
  }
})
