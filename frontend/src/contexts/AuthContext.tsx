import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/lib/auth';
import { saveSession, restoreSession, startSessionBackup } from '@/lib/sessionPersistence';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (data: { email: string; password: string; name: string; username: string; phone?: string }) => Promise<any>;
  signIn: (data: { email: string; password: string }) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // STEP 1: Try Supabase first
        let session = await authService.getCurrentSession();

        // STEP 2: If no Supabase session, restore from our storage
        if (!session) {
          console.log('🔍 No Supabase session, checking backups...');
          const backup = restoreSession();
          if (backup) {
            // Restore to Supabase
            const { data, error } = await supabase.auth.setSession({
              access_token: backup.access_token,
              refresh_token: backup.refresh_token
            });
            if (data.session) {
              session = data.session;
              console.log('🎉 SESSION RESTORED FROM BACKUP!');
            } else {
              console.error('❌ Restore failed:', error);
            }
          }
        }

        console.log('📱 Final session:', session ? `✅ ${session.user?.email}` : '❌ Not logged in');
        setSession(session);
        setUser(session?.user ?? null);

        // STEP 3: Save current session
        if (session) {
          saveSession(session);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);

        // Save session on every change
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          saveSession(session);
        } else if (event === 'SIGNED_OUT') {
          saveSession(null);
        }
      }
    );

    // Start periodic backup (every 10 seconds)
    const stopBackup = startSessionBackup(authService.getCurrentSession);

    return () => {
      subscription.unsubscribe();
      stopBackup();
    };
  }, []);

  const signUp = async (userData: { email: string; password: string; name: string; username: string; phone?: string }) => {
    setLoading(true);
    try {
      const result = await authService.signUp(userData);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await authService.signIn(credentials);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await authService.signInWithGoogle();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const result = await authService.resetPassword(email);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = authService.isAdmin(user);

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;