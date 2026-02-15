import LZString from 'lz-string';
import { CachedData } from '@/types';

const COMPRESSION_THRESHOLD = 1000; // bytes
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Compress data using LZ-String
 */
export const compress = <T>(data: T): string => {
  const jsonString = JSON.stringify(data);
  
  // Only compress if data is large enough
  if (jsonString.length < COMPRESSION_THRESHOLD) {
    return jsonString;
  }
  
  return LZString.compressToUTF16(jsonString);
};

/**
 * Decompress data
 */
export const decompress = <T>(compressed: string): T => {
  try {
    // Try decompression first
    const decompressed = LZString.decompressFromUTF16(compressed);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
    
    // If decompression fails, assume it's not compressed
    return JSON.parse(compressed);
  } catch (error) {
    console.error('Decompression error:', error);
    throw new Error('Failed to decompress data');
  }
};

/**
 * Save data to localStorage with optional compression
 */
export const saveToStorage = <T>(key: string, data: T, useCompression = true): void => {
  try {
    const cachedData: CachedData<T> = {
      data,
      timestamp: Date.now(),
      compressed: useCompression,
    };

    const serialized = useCompression ? compress(cachedData) : JSON.stringify(cachedData);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to storage:', error);
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearOldCache();
      // Retry once
      try {
        const cachedData: CachedData<T> = {
          data,
          timestamp: Date.now(),
          compressed: useCompression,
        };
        const serialized = useCompression ? compress(cachedData) : JSON.stringify(cachedData);
        localStorage.setItem(key, serialized);
      } catch (retryError) {
        console.error('Retry failed:', retryError);
      }
    }
  }
};

/**
 * Load data from localStorage
 */
export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return null;
    }

    const cachedData: CachedData<T> = cachedData.compressed
      ? decompress(stored)
      : JSON.parse(stored);

    // Check if cache is expired
    if (Date.now() - cachedData.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return cachedData.data;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
};

/**
 * Clear old cache entries
 */
export const clearOldCache = (): void => {
  const keys = Object.keys(localStorage);
  const now = Date.now();

  keys.forEach(key => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.timestamp && now - parsed.timestamp > CACHE_DURATION) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      // Skip invalid entries
    }
  });
};

/**
 * Get storage usage statistics
 */
export const getStorageStats = (): { used: number; available: number } => {
  let used = 0;
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // Most browsers have 5-10MB limit for localStorage
  const available = 5 * 1024 * 1024; // 5MB
  
  return {
    used: Math.round(used / 1024), // KB
    available: Math.round((available - used) / 1024), // KB
  };
};

/**
 * Clear all app data from storage
 */
export const clearAllStorage = (): void => {
  const appKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('bluestock-') || key.startsWith('puzzle-')
  );
  
  appKeys.forEach(key => localStorage.removeItem(key));
};
