/**
 * CampusCircle Core - Storage Manager
 * Resilient LocalStorage wrapper with memory fallback and error protection.
 */

class StorageManager {
  constructor() {
    this.memoryStore = new Map();
    this.isAvailable = this.checkAvailability();
  }

  checkAvailability() {
    try {
      const testKey = '__campuscircle_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('[StorageManager] localStorage unavailable, using memory fallback.', e);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      if (this.isAvailable) {
        const item = window.localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
      }
      return this.memoryStore.has(key) ? this.memoryStore.get(key) : defaultValue;
    } catch (e) {
      console.error(`[StorageManager] Error reading key "${key}":`, e);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      if (this.isAvailable) {
        window.localStorage.setItem(key, JSON.stringify(value));
      } else {
        this.memoryStore.set(key, value);
      }
      return true;
    } catch (e) {
      console.error(`[StorageManager] Error saving key "${key}":`, e);
      return false;
    }
  }

  remove(key) {
    try {
      if (this.isAvailable) {
        window.localStorage.removeItem(key);
      } else {
        this.memoryStore.delete(key);
      }
    } catch (e) {
      console.error(`[StorageManager] Error removing key "${key}":`, e);
    }
  }
}

export const appStorage = new StorageManager();
