/**
 * Date Utility Functions
 */
class DateUtils {
  /**
   * Format date
   * @param {Date|string} date 
   * @param {string} format 
   * @returns {string}
   */
  static format(date, format = 'short') {
    const d = date instanceof Date ? date : new Date(date);
    
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }

    const formats = {
      short: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      long: new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      time: new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      datetime: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };

    const formatter = formats[format] || formats.short;
    return formatter.format(d);
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   * @param {Date|string} date 
   * @returns {string}
   */
  static formatRelative(date) {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = now - d;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (weeks < 4) {
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  }

  /**
   * Check if date is today
   * @param {Date|string} date 
   * @returns {boolean}
   */
  static isToday(date) {
    const d = date instanceof Date ? date : new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }

  /**
   * Check if date is in the past
   * @param {Date|string} date 
   * @returns {boolean}
   */
  static isPast(date) {
    const d = date instanceof Date ? date : new Date(date);
    return d < new Date();
  }

  /**
   * Check if date is in the future
   * @param {Date|string} date 
   * @returns {boolean}
   */
  static isFuture(date) {
    const d = date instanceof Date ? date : new Date(date);
    return d > new Date();
  }

  /**
   * Get days until date
   * @param {Date|string} date 
   * @returns {number}
   */
  static daysUntil(date) {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = d - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Add days to date
   * @param {Date|string} date 
   * @param {number} days 
   * @returns {Date}
   */
  static addDays(date, days) {
    const d = date instanceof Date ? new Date(date) : new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
}

