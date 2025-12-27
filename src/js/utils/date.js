/**
 * Brelinx Connect - Date Utilities
 * Date formatting and manipulation helpers
 */

class DateService {
  constructor() {
    this.defaultLocale = 'en-US';
  }

  /**
   * Format date to readable string
   */
  formatDate(date, format = 'medium') {
    const dateObj = new Date(date);
    
    const formats = {
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      medium: { month: 'long', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
      time: { hour: 'numeric', minute: '2-digit', hour12: true },
      datetime: { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }
    };

    return new Intl.DateTimeFormat(this.defaultLocale, formats[format]).format(dateObj);
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  getRelativeTime(date) {
    const now = new Date();
    const dateObj = new Date(date);
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }

  /**
   * Check if date is today
   */
  isToday(date) {
    const today = new Date();
    const dateObj = new Date(date);
    
    return dateObj.toDateString() === today.toDateString();
  }

  /**
   * Check if date is yesterday
   */
  isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateObj = new Date(date);
    
    return dateObj.toDateString() === yesterday.toDateString();
  }

  /**
   * Check if date is this week
   */
  isThisWeek(date) {
    const now = new Date();
    const dateObj = new Date(date);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return dateObj >= startOfWeek && dateObj <= endOfWeek;
  }

  /**
   * Add days to date
   */
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Add months to date
   */
  addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Get start of day
   */
  startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of day
   */
  endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Format duration in milliseconds to readable string
   */
  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Parse date string safely
   */
  parseDate(dateString) {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  /**
   * Get business days between two dates
   */
  getBusinessDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    
    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  }

  /**
   * Format date for input fields
   */
  formatForInput(date, type = 'date') {
    const dateObj = new Date(date);
    
    switch (type) {
      case 'date':
        return dateObj.toISOString().split('T')[0];
      case 'datetime-local':
        return dateObj.toISOString().slice(0, 16);
      case 'time':
        return dateObj.toTimeString().slice(0, 5);
      default:
        return dateObj.toISOString();
    }
  }
}

// Create global instance
window.DateService = DateService;
window.dateService = new DateService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DateService;
}