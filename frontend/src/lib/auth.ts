import { supabase } from './supabaseClient';
import { User, Session } from '@supabase/supabase-js';

// API URL for backend services
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Types for our auth system
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    phone?: string;
  };
  role?: 'user' | 'admin';
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  username: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Auth service functions
export const authService = {
  // Sign up new user
  async signUp({ email, password, name, username, phone }: SignUpData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          full_name: name,
          phone,
          role: 'user' // Default role
        },
        emailRedirectTo: undefined // Disable email confirmation for development
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // Send welcome email (non-blocking - don't let email failure block signup)
    try {
      fetch(`${API_BASE_URL}/api/email/send-welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          name
        })
      }).catch(err => {
        // Silently log email errors - don't throw
        console.error('Welcome email error:', err);
      });
    } catch (err) {
      // Email service errors should not block signup
      console.error('Failed to queue welcome email:', err);
    }

    return data;
  },

  // Sign in existing user
  async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  // Sign in with Google OAuth
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Reset password (forgot password)
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    return user;
  },

  // Get current session
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message);
    }
    return session;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Check if user is admin (based on email or metadata)
  isAdmin(user: User | null): boolean {
    if (!user) return false;

    // Check if email contains admin
    if (user.email?.includes('admin')) return true;

    // Check user metadata role
    return user.user_metadata?.role === 'admin';
  }
};

export default authService;