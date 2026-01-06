// Manual session backup system - independent of Supabase's storage
import { Session } from '@supabase/supabase-js';

const BACKUP_KEY = 'santvaani-session-backup';

// Save session to backup storage
export function backupSession(session: Session | null) {
  try {
    if (session) {
      const backup = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        user: session.user,
        timestamp: Date.now()
      };
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
      console.log('✅ Session backed up manually');
    } else {
      localStorage.removeItem(BACKUP_KEY);
    }
  } catch (error) {
    console.error('Failed to backup session:', error);
  }
}

// Restore session from backup
export function getBackupSession(): any | null {
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
      const parsed = JSON.parse(backup);
      // Check if not expired
      if (parsed.expires_at && parsed.expires_at * 1000 > Date.now()) {
        console.log('✅ Found valid backup session');
        return parsed;
      } else {
        console.log('⚠️ Backup session expired');
        localStorage.removeItem(BACKUP_KEY);
      }
    }
  } catch (error) {
    console.error('Failed to restore backup session:', error);
  }
  return null;
}

// Clear backup
export function clearBackupSession() {
  try {
    localStorage.removeItem(BACKUP_KEY);
  } catch (error) {
    console.error('Failed to clear backup session:', error);
  }
}
