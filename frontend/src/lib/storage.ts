// Custom storage adapter for Supabase that uses both localStorage and IndexedDB
// This provides better persistence for PWAs on mobile devices

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AuthDB extends DBSchema {
  'auth-storage': {
    key: string;
    value: string;
  };
}

const DB_NAME = 'santvaani-auth-db';
const STORE_NAME = 'auth-storage';
const DB_VERSION = 1;

class PersistentStorage {
  private db: IDBPDatabase<AuthDB> | null = null;

  async init() {
    try {
      this.db = await openDB<AuthDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
    }
  }

  async getItem(key: string): Promise<string | null> {
    // Try localStorage first (faster)
    try {
      const localValue = localStorage.getItem(key);
      if (localValue) {
        return localValue;
      }
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
    }

    // Fallback to IndexedDB
    try {
      if (!this.db) await this.init();
      if (this.db) {
        const value = await this.db.get(STORE_NAME, key);
        // Restore to localStorage if found in IndexedDB
        if (value) {
          try {
            localStorage.setItem(key, value);
          } catch (e) {
            console.warn('Could not restore to localStorage:', e);
          }
        }
        return value || null;
      }
    } catch (error) {
      console.error('IndexedDB.get failed:', error);
    }

    return null;
  }

  async setItem(key: string, value: string): Promise<void> {
    // Set in both localStorage and IndexedDB
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
    }

    try {
      if (!this.db) await this.init();
      if (this.db) {
        await this.db.put(STORE_NAME, value, key);
      }
    } catch (error) {
      console.error('IndexedDB.put failed:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    // Remove from both localStorage and IndexedDB
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
    }

    try {
      if (!this.db) await this.init();
      if (this.db) {
        await this.db.delete(STORE_NAME, key);
      }
    } catch (error) {
      console.error('IndexedDB.delete failed:', error);
    }
  }
}

// Create singleton instance
const persistentStorage = new PersistentStorage();

// Supabase-compatible storage adapter
// Use synchronous localStorage for Supabase (required for tab sharing)
// IndexedDB is used as background backup only
export const supabaseStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('localStorage.getItem failed:', error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      // Backup to IndexedDB in background (don't await)
      persistentStorage.setItem(key, value).catch(err =>
        console.warn('IndexedDB backup failed:', err)
      );
    } catch (error) {
      console.error('localStorage.setItem failed:', error);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
      // Remove from IndexedDB in background (don't await)
      persistentStorage.removeItem(key).catch(err =>
        console.warn('IndexedDB remove failed:', err)
      );
    } catch (error) {
      console.error('localStorage.removeItem failed:', error);
    }
  },
};

// Restore sessions from IndexedDB to localStorage if localStorage is empty
export async function restoreSessionFromIndexedDB(): Promise<void> {
  try {
    // Initialize IndexedDB
    await persistentStorage.init();

    if (!persistentStorage.db) {
      console.log('IndexedDB not available for restore');
      return;
    }

    // Get all keys from IndexedDB
    const tx = persistentStorage.db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const allKeys = await store.getAllKeys();

    let restoredCount = 0;

    // Check each key and restore to localStorage if missing
    for (const key of allKeys) {
      const localValue = localStorage.getItem(key as string);

      // Only restore if not in localStorage
      if (!localValue) {
        const indexedDBValue = await persistentStorage.db.get(STORE_NAME, key);
        if (indexedDBValue) {
          try {
            localStorage.setItem(key as string, indexedDBValue);
            restoredCount++;
            console.log('✅ Restored session from IndexedDB:', key);
          } catch (e) {
            console.warn('Failed to restore to localStorage:', key, e);
          }
        }
      }
    }

    if (restoredCount > 0) {
      console.log(`🔄 Restored ${restoredCount} session(s) from IndexedDB`);
    }
  } catch (error) {
    console.error('Error restoring from IndexedDB:', error);
  }
}

// Request persistent storage permission from browser
export async function requestPersistentStorage(): Promise<boolean> {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    try {
      const isPersisted = await navigator.storage.persist();
      console.log('Persistent storage granted:', isPersisted);

      // Check if already persisted
      const persisted = await navigator.storage.persisted();
      console.log('Storage persisted:', persisted);

      return persisted;
    } catch (error) {
      console.error('Error requesting persistent storage:', error);
      return false;
    }
  }
  return false;
}

// Get storage usage estimate
export async function getStorageEstimate(): Promise<StorageEstimate | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      console.log('Storage estimate:', {
        usage: estimate.usage ? (estimate.usage / 1024 / 1024).toFixed(2) + ' MB' : 'unknown',
        quota: estimate.quota ? (estimate.quota / 1024 / 1024).toFixed(2) + ' MB' : 'unknown',
      });
      return estimate;
    } catch (error) {
      console.error('Error getting storage estimate:', error);
    }
  }
  return null;
}
