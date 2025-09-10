import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_CONFIG } from '../../utils/constants';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheManager {
  set<T>(key: string, data: T, ttl?: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  isExpired(key: string): Promise<boolean>;
  getSize(): Promise<number>;
  cleanup(): Promise<void>;
}

class AsyncStorageCacheManager implements CacheManager {
  private readonly keyPrefix = 'bussp_cache_';

  private getStorageKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  /**
   * Store data in cache with optional TTL
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const expiresAt = ttl ? Date.now() + ttl : Date.now() + CACHE_CONFIG.EXPIRY_TIMES.BUS_LINES;
      
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt,
      };

      const storageKey = this.getStorageKey(key);
      await AsyncStorage.setItem(storageKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  /**
   * Retrieve data from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const storageKey = this.getStorageKey(key);
      const cachedData = await AsyncStorage.getItem(storageKey);
      
      if (!cachedData) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cachedData);
      
      // Check if expired
      if (Date.now() > cacheItem.expiresAt) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  /**
   * Remove item from cache
   */
  async remove(key: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(key);
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Cache remove error:', error);
    }
  }

  /**
   * Clear all cache items
   */
  async clear(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.keyPrefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  /**
   * Check if cache item is expired
   */
  async isExpired(key: string): Promise<boolean> {
    try {
      const storageKey = this.getStorageKey(key);
      const cachedData = await AsyncStorage.getItem(storageKey);
      
      if (!cachedData) {
        return true;
      }

      const cacheItem: CacheItem<any> = JSON.parse(cachedData);
      return Date.now() > cacheItem.expiresAt;
    } catch (error) {
      console.warn('Cache isExpired error:', error);
      return true;
    }
  }

  /**
   * Get total cache size (approximate)
   */
  async getSize(): Promise<number> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.keyPrefix));
      
      let totalSize = 0;
      for (const key of cacheKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.warn('Cache getSize error:', error);
      return 0;
    }
  }

  /**
   * Clean up expired cache items
   */
  async cleanup(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.keyPrefix));
      
      const expiredKeys: string[] = [];
      
      for (const storageKey of cacheKeys) {
        try {
          const cachedData = await AsyncStorage.getItem(storageKey);
          if (cachedData) {
            const cacheItem: CacheItem<any> = JSON.parse(cachedData);
            if (Date.now() > cacheItem.expiresAt) {
              expiredKeys.push(storageKey);
            }
          }
        } catch {
          // If parsing fails, consider it expired
          expiredKeys.push(storageKey);
        }
      }
      
      if (expiredKeys.length > 0) {
        await AsyncStorage.multiRemove(expiredKeys);
      }
    } catch (error) {
      console.warn('Cache cleanup error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalItems: number;
    totalSize: number;
    expiredItems: number;
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.keyPrefix));
      
      let totalSize = 0;
      let expiredItems = 0;
      
      for (const storageKey of cacheKeys) {
        try {
          const cachedData = await AsyncStorage.getItem(storageKey);
          if (cachedData) {
            totalSize += new Blob([cachedData]).size;
            
            const cacheItem: CacheItem<any> = JSON.parse(cachedData);
            if (Date.now() > cacheItem.expiresAt) {
              expiredItems++;
            }
          }
        } catch {
          expiredItems++;
        }
      }
      
      return {
        totalItems: cacheKeys.length,
        totalSize,
        expiredItems,
      };
    } catch (error) {
      console.warn('Cache getStats error:', error);
      return {
        totalItems: 0,
        totalSize: 0,
        expiredItems: 0,
      };
    }
  }
}

// Export singleton instance
export const cacheManager = new AsyncStorageCacheManager();