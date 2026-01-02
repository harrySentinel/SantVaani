// Supabase client configuration for Santvaani
import { createClient } from '@supabase/supabase-js'
import { supabaseStorage } from './storage'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

// Initialize Supabase client with persistent storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: supabaseStorage,
    // Note: NOT using PKCE flow to ensure proper cross-tab session sharing
  }
})
