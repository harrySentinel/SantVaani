// NUCLEAR SESSION PERSISTENCE - Store in multiple places
import { Session } from '@supabase/supabase-js';

const KEYS = [
  'santvaani-session-primary',
  'santvaani-session-backup-1',
  'santvaani-session-backup-2',
  'santvaani-auth-token',
  'user-session-santvaani'
];

// Save to MULTIPLE localStorage keys
export function saveSession(session: Session | null) {
  if (!session) {
    KEYS.forEach(key => {
      try { localStorage.removeItem(key); } catch (e) {}
    });
    try { sessionStorage.clear(); } catch (e) {}
    return;
  }

  const data = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    user: session.user,
    saved_at: Date.now()
  });

  // Save to MULTIPLE localStorage keys
  KEYS.forEach(key => {
    try {
      localStorage.setItem(key, data);
    } catch (error) {
      console.error(`Failed to save to ${key}:`, error);
    }
  });

  // Also save to sessionStorage
  try {
    sessionStorage.setItem('santvaani-session', data);
  } catch (error) {
    console.error('Failed to save to sessionStorage:', error);
  }

  console.log('💾 Session saved to ALL storage locations');
}

// Restore from ANY available location
export function restoreSession(): any | null {
  // Try each key in order
  for (const key of KEYS) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.expires_at && parsed.expires_at * 1000 > Date.now()) {
          console.log(`✅ Restored session from: ${key}`);
          return parsed;
        }
      }
    } catch (error) {
      // Try next key
    }
  }

  // Try sessionStorage
  try {
    const data = sessionStorage.getItem('santvaani-session');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.expires_at && parsed.expires_at * 1000 > Date.now()) {
        console.log('✅ Restored session from sessionStorage');
        // Copy back to localStorage
        saveSession(parsed);
        return parsed;
      }
    }
  } catch (error) {
    // Ignore
  }

  console.log('❌ No valid session found in any storage');
  return null;
}

// Periodic backup - run every 10 seconds
export function startSessionBackup(getCurrentSession: () => Promise<Session | null>) {
  const backup = async () => {
    try {
      const session = await getCurrentSession();
      if (session) {
        saveSession(session);
      }
    } catch (error) {
      // Ignore
    }
  };

  // Backup immediately
  backup();

  // Backup every 10 seconds
  const interval = setInterval(backup, 10000);

  return () => clearInterval(interval);
}
