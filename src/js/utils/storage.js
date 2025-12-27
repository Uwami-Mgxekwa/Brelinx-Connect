/**
 * Storage Utility
 * Handles localStorage and sessionStorage operations
 */
class Storage {
  /**
   * Set item in localStorage
   * @param {string} key 
   * @param {any} value 
   */
  static set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage.set error:', error);
      return false;
    }
  }

  /**
   * Get item from localStorage
   * @param {string} key 
   * @param {any} defaultValue 
   * @returns {any}
   */
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error('Storage.get error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key 
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage.remove error:', error);
      return false;
    }
  }

  /**
   * Clear all localStorage
   */
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage.clear error:', error);
      return false;
    }
  }

  /**
   * Set item in sessionStorage
   * @param {string} key 
   * @param {any} value 
   */
  static setSession(key, value) {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage.setSession error:', error);
      return false;
    }
  }

  /**
   * Get item from sessionStorage
   * @param {string} key 
   * @param {any} defaultValue 
   * @returns {any}
   */
  static getSession(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error('Storage.getSession error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from sessionStorage
   * @param {string} key 
   */
  static removeSession(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage.removeSession error:', error);
      return false;
    }
  }

  /**
   * Clear all sessionStorage
   */
  static clearSession() {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage.clearSession error:', error);
      return false;
    }
  }
}

