import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  checkAdminAccess: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Admin auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    // Check if user has admin privileges
    if (data.user && !isAdminUser(data.user)) {
      await supabase.auth.signOut();
      throw new Error('Access denied. Admin privileges required.');
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  };

  // Check if user is admin based on email or metadata
  const isAdminUser = (user: User | null): boolean => {
    if (!user) return false;

    // Admin check 1: Email contains 'admin'
    if (user.email?.includes('admin')) return true;

    // Admin check 2: User metadata role
    if (user.user_metadata?.role === 'admin') return true;

    // Admin check 3: Specific admin emails (you can add more)
    const adminEmails = [
      'admin@santvaani.com',
      'aditya@santvaani.com',
      'adityasri1801@gmail.com',
      // Add more admin emails here
    ];

    if (user.email && adminEmails.includes(user.email)) return true;

    return false;
  };

  const isAdmin = isAdminUser(user);

  const checkAdminAccess = (): boolean => {
    return !!user && isAdmin;
  };

  const value: AdminAuthContextType = {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signOut,
    checkAdminAccess
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;