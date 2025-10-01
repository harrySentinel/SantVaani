import { createClient } from '@supabase/supabase-js'

// Get Supabase config from environment variables or fallback to placeholder
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Log connection status in development
if (import.meta.env.DEV) {
  console.log('🔗 Supabase URL:', supabaseUrl)
  console.log('🔑 Using environment config:', !!import.meta.env.VITE_SUPABASE_URL)
}

// Database table names
export const TABLES = {
  SAINTS: 'saints',
  LIVING_SAINTS: 'living_saints',
  DIVINE_FORMS: 'divine_forms',
  BHAJANS: 'bhajans',
  QUOTES: 'quotes',
  EVENTS: 'events',
  NOTICES: 'notices',
  BLOG_POSTS: 'blog_posts'
} as const