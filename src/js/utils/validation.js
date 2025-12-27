/**
 * Brelinx Connect - Validation Utilities
 * Form validation helpers
 */

class ValidationService {
  constructor() {
    this.rules = {};
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      message: 'Please enter a valid email address'
    };
  }

  /**
   * Validate password strength
   */
  validatePassword(password, requirements = {}) {
    const defaultRequirements = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    };

    const reqs = { ...defaultRequirements, ...requirements };
    const errors = [];

    if (password.length < reqs.minLength) {
      errors.push(`Password must be at least ${reqs.minLength} characters long`);
    }

    if (reqs.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (reqs.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (reqs.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (reqs.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      message: errors.join('. '),
      errors
    };
  }

  /**
   * Validate phone number
   */
  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    
    return {
      isValid: phoneRegex.test(cleanPhone),
      message: 'Please enter a valid phone number'
    };
  }

  /**
   * Validate required field
   */
  validateRequired(value, fieldName = 'Field') {
    const isValid = value !== null && value !== undefined && value.toString().trim() !== '';
    
    return {
      isValid,
      message: `${fieldName} is required`
    };
  }

  /**
   * Validate minimum length
   */
  validateMinLength(value, minLength, fieldName = 'Field') {
    const isValid = value && value.length >= minLength;
    
    return {
      isValid,
      message: `${fieldName} must be at least ${minLength} characters long`
    };
  }

  /**
   * Validate maximum length
   */
  validateMaxLength(value, maxLength, fieldName = 'Field') {
    const isValid = !value || value.length <= maxLength;
    
    return {
      isValid,
      message: `${fieldName} must be no more than ${maxLength} characters long`
    };
  }

  /**
   * Validate URL format
   */
  validateUrl(url) {
    try {
      new URL(url);
      return {
        isValid: true,
        message: ''
      };
    } catch {
      return {
        isValid: false,
        message: 'Please enter a valid URL'
      };
    }
  }

  /**
   * Validate date format
   */
  validateDate(dateString) {
    const date = new Date(dateString);
    const isValid = !isNaN(date.getTime());
    
    return {
      isValid,
      message: 'Please enter a valid date'
    };
  }

  /**
   * Validate number range
   */
  validateNumberRange(value, min, max, fieldName = 'Value') {
    const num = parseFloat(value);
    const isValid = !isNaN(num) && num >= min && num <= max;
    
    return {
      isValid,
      message: `${fieldName} must be between ${min} and ${max}`
    };
  }

  /**
   * Validate form using rules
   */
  validateForm(formData, rules) {
    const errors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const fieldRules = rules[fieldName];
      const fieldValue = formData[fieldName];
      
      for (const rule of fieldRules) {
        const result = this.applyRule(fieldValue, rule, fieldName);
        if (!result.isValid) {
          errors[fieldName] = result.message;
          isValid = false;
          break; // Stop at first error for this field
        }
      }
    });

    return {
      isValid,
      errors
    };
  }

  /**
   * Apply validation rule
   */
  applyRule(value, rule, fieldName) {
    switch (rule.type) {
      case 'required':
        return this.validateRequired(value, fieldName);
      
      case 'email':
        return this.validateEmail(value);
      
      case 'password':
        return this.validatePassword(value, rule.requirements);
      
      case 'phone':
        return this.validatePhone(value);
      
      case 'minLength':
        return this.validateMinLength(value, rule.value, fieldName);
      
      case 'maxLength':
        return this.validateMaxLength(value, rule.value, fieldName);
      
      case 'url':
        return this.validateUrl(value);
      
      case 'date':
        return this.validateDate(value);
      
      case 'numberRange':
        return this.validateNumberRange(value, rule.min, rule.max, fieldName);
      
      case 'custom':
        return rule.validator(value, fieldName);
      
      default:
        return { isValid: true, message: '' };
    }
  }
}

// Create global instance
window.ValidationService = ValidationService;
window.validationService = new ValidationService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ValidationService;
}