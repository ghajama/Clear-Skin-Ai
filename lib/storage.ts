import { Platform } from 'react-native';

// Dynamic import for AsyncStorage to handle web compatibility
let AsyncStorage: any;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

// Web fallback for AsyncStorage
const webStorage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
  async clear(): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  },
  async getAllKeys(): Promise<string[]> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return Object.keys(window.localStorage);
    }
    return [];
  },
};

const storageImpl = Platform.OS === 'web' ? webStorage : AsyncStorage;

export const storage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await storageImpl.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await storageImpl.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await storageImpl.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await storageImpl.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await storageImpl.getAllKeys();
      return keys ? Array.from(keys) : [];
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  },
};

// Storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  QUIZ_ANSWERS: 'quiz_answers',
  ROUTINE_PROGRESS: 'routine_progress',
  CHAT_HISTORY: 'chat_history',
  SETTINGS: 'settings',
  SCAN_FRONT: 'scan_front',
  SCAN_RIGHT: 'scan_right',
  SCAN_LEFT: 'scan_left',
  SCAN_SESSION: 'scan_session',
} as const;

// Image cache management
export interface ScanImage {
  uri: string;
  shouldMirror: boolean;
  timestamp: number;
}

export interface ScanSession {
  id: string;
  timestamp: number;
  front?: ScanImage;
  right?: ScanImage;
  left?: ScanImage;
  completed: boolean;
}

export const imageCache = {
  // Get current scan session
  async getCurrentSession(): Promise<ScanSession | null> {
    try {
      return await storage.getItem<ScanSession>(STORAGE_KEYS.SCAN_SESSION);
    } catch (error) {
      console.error('Failed to get current session:', error);
      return null;
    }
  },

  // Create new scan session
  async createSession(): Promise<ScanSession> {
    const session: ScanSession = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      completed: false,
    };
    
    try {
      await storage.setItem(STORAGE_KEYS.SCAN_SESSION, session);
      return session;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  },

  // Update session with image
  async updateSession(type: 'front' | 'right' | 'left', imageUri: string, shouldMirror: boolean = false): Promise<void> {
    try {
      let session = await this.getCurrentSession();
      if (!session) {
        session = await this.createSession();
      }

      const scanImage: ScanImage = {
        uri: imageUri,
        shouldMirror,
        timestamp: Date.now()
      };

      // If we're updating an existing image type, log the replacement
      if (session[type]) {
        console.log(`🔄 [Storage] Replacing existing ${type} image`);
      }

      session[type] = scanImage;
      session.timestamp = Date.now();
      
      // Check if all images are captured
      if (session.front && session.right && session.left) {
        session.completed = true;
      }

      await storage.setItem(STORAGE_KEYS.SCAN_SESSION, session);
      await storage.setItem(STORAGE_KEYS[`SCAN_${type.toUpperCase()}` as keyof typeof STORAGE_KEYS], scanImage);
      
      console.log(`💾 [Storage] Updated ${type} image in session and individual storage`);
    } catch (error) {
      console.error(`Failed to update session with ${type}:`, error);
      throw error;
    }
  },

  // Get image for specific type
  async getImage(type: 'front' | 'right' | 'left'): Promise<ScanImage | null> {
    try {
      const session = await this.getCurrentSession();
      if (session && session[type]) {
        return session[type] || null;
      }
      
      // Fallback to individual storage
      const stored = await storage.getItem<ScanImage>(STORAGE_KEYS[`SCAN_${type.toUpperCase()}` as keyof typeof STORAGE_KEYS]);
      if (stored) {
        return stored;
      }
      
      // Legacy fallback for string URIs
      const legacyUri = await storage.getItem<string>(STORAGE_KEYS[`SCAN_${type.toUpperCase()}` as keyof typeof STORAGE_KEYS]);
      if (legacyUri && typeof legacyUri === 'string') {
        return {
          uri: legacyUri,
          shouldMirror: type === 'front', // Assume front images should be mirrored
          timestamp: Date.now()
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to get ${type} image:`, error);
      return null;
    }
  },

  // Clear specific image
  async clearImage(type: 'front' | 'right' | 'left'): Promise<void> {
    try {
      const session = await this.getCurrentSession();
      if (session) {
        delete session[type];
        session.completed = false;
        session.timestamp = Date.now();
        await storage.setItem(STORAGE_KEYS.SCAN_SESSION, session);
      }
      
      await storage.removeItem(STORAGE_KEYS[`SCAN_${type.toUpperCase()}` as keyof typeof STORAGE_KEYS]);
    } catch (error) {
      console.error(`Failed to clear ${type} image:`, error);
      throw error;
    }
  },

  // Clear all scan data
  async clearAllImages(): Promise<void> {
    try {
      await Promise.all([
        storage.removeItem(STORAGE_KEYS.SCAN_SESSION),
        storage.removeItem(STORAGE_KEYS.SCAN_FRONT),
        storage.removeItem(STORAGE_KEYS.SCAN_RIGHT),
        storage.removeItem(STORAGE_KEYS.SCAN_LEFT),
      ]);
    } catch (error) {
      console.error('Failed to clear all images:', error);
      throw error;
    }
  },

  // Check if session is expired (older than 24 hours)
  async isSessionExpired(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      if (!session) return true;
      
      const now = Date.now();
      const sessionAge = now - session.timestamp;
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      return sessionAge > twentyFourHours;
    } catch (error) {
      console.error('Failed to check session expiry:', error);
      return true;
    }
  },

  // Clean expired sessions
  async cleanExpiredSessions(): Promise<void> {
    try {
      const isExpired = await this.isSessionExpired();
      if (isExpired) {
        console.log('🧹 [Storage] Cleaning expired session');
        await this.clearAllImages();
      }
    } catch (error) {
      console.error('Failed to clean expired sessions:', error);
    }
  },

  // Get all scan results for display
  async getAllScanResults(): Promise<{
    front?: ScanImage;
    right?: ScanImage;
    left?: ScanImage;
  }> {
    try {
      const session = await this.getCurrentSession();
      if (session) {
        return {
          front: session.front,
          right: session.right,
          left: session.left,
        };
      }
      
      // Fallback to individual storage
      const [front, right, left] = await Promise.all([
        this.getImage('front'),
        this.getImage('right'),
        this.getImage('left'),
      ]);
      
      return {
        front: front || undefined,
        right: right || undefined,
        left: left || undefined,
      };
    } catch (error) {
      console.error('Failed to get all scan results:', error);
      return {};
    }
  },

  // Check if we have any scan images
  async hasScanImages(): Promise<boolean> {
    try {
      const results = await this.getAllScanResults();
      return !!(results.front || results.right || results.left);
    } catch (error) {
      console.error('Failed to check for scan images:', error);
      return false;
    }
  },
};