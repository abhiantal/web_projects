/**
 * MotionStudio Core - Storage Manager
 * Resilient LocalStorage wrapper with memory fallback and error protection.
 * NextGen • Developed by A.K.Antal
 */

class StorageManager {
  constructor() {
    this.memoryStore = new Map();
    this.isAvailable = this.checkAvailability();
  }

  checkAvailability() {
    try {
      const testKey = '__motionstudio_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('[StorageManager] localStorage unavailable, using memory store.', e);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      if (this.isAvailable) {
        let item = window.localStorage.getItem(key);
        if (item === null) return defaultValue;
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      }
      return this.memoryStore.has(key) ? this.memoryStore.get(key) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      if (this.isAvailable) {
        window.localStorage.setItem(key, serialized);
      } else {
        this.memoryStore.set(key, value);
      }
      return true;
    } catch (e) {
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
    } catch (e) {}
  }
}

export const appStorage = new StorageManager();
