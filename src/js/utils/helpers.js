/**
 * Helper Utility Functions
 */
class Helpers {
  /**
   * Debounce function
   * @param {Function} func 
   * @param {number} wait 
   * @returns {Function}
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   * @param {Function} func 
   * @param {number} limit 
   * @returns {Function}
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Format currency
   * @param {number} amount 
   * @param {string} currency 
   * @returns {string}
   */
  static formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Truncate text
   * @param {string} text 
   * @param {number} maxLength 
   * @returns {string}
   */
  static truncate(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Generate unique ID
   * @returns {string}
   */
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Check if device is mobile
   * @returns {boolean}
   */
  static isMobile() {
    return window.innerWidth <= 768;
  }

  /**
   * Check if device is tablet
   * @returns {boolean}
   */
  static isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  /**
   * Check if device is desktop
   * @returns {boolean}
   */
  static isDesktop() {
    return window.innerWidth > 1024;
  }

  /**
   * Scroll to top smoothly
   */
  static scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Copy text to clipboard
   * @param {string} text 
   * @returns {Promise<boolean>}
   */
  static async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      }
    } catch (error) {
      console.error('Copy to clipboard error:', error);
      return false;
    }
  }

  /**
   * Get query parameter from URL
   * @param {string} name 
   * @returns {string|null}
   */
  static getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  /**
   * Set query parameter in URL
   * @param {string} name 
   * @param {string} value 
   */
  static setQueryParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
  }

  /**
   * Remove query parameter from URL
   * @param {string} name 
   */
  static removeQueryParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
  }
}

