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
export const supabaseStorage = {
  getItem: async (key: string) => {
    return await persistentStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    await persistentStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    await persistentStorage.removeItem(key);
  },
};

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
