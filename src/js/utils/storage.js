/**
 * Brelinx Connect - Storage Utilities
 * LocalStorage and SessionStorage helpers
 */

class StorageService {
  constructor() {
    this.prefix = 'brelinx_';
  }

  /**
   * Set item in localStorage
   */
  setLocal(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  getLocal(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeLocal(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  }

  /**
   * Set item in sessionStorage
   */
  setSession(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(this.prefix + key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error setting sessionStorage item:', error);
      return false;
    }
  }

  /**
   * Get item from sessionStorage
   */
  getSession(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from sessionStorage
   */
  removeSession(key) {
    try {
      sessionStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
      return false;
    }
  }

  /**
   * Clear all app data
   */
  clearAll() {
    try {
      // Clear localStorage items with our prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage items with our prefix
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });

      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Check if storage is available
   */
  isStorageAvailable(type = 'localStorage') {
    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create global instance
window.StorageService = StorageService;
window.storageService = new StorageService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageService;
}