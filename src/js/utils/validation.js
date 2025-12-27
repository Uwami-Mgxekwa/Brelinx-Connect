/**
 * Validation Utility
 */
class Validation {
  /**
   * Validate email
   * @param {string} email 
   * @returns {boolean}
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param {string} password 
   * @returns {object}
   */
  static validatePassword(password) {
    const result = {
      valid: true,
      errors: []
    };

    if (password.length < 8) {
      result.valid = false;
      result.errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      result.valid = false;
      result.errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      result.valid = false;
      result.errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      result.valid = false;
      result.errors.push('Password must contain at least one number');
    }

    return result;
  }

  /**
   * Validate phone number
   * @param {string} phone 
   * @returns {boolean}
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL
   * @param {string} url 
   * @returns {boolean}
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate form
   * @param {HTMLFormElement} form 
   * @returns {object}
   */
  static validateForm(form) {
    const result = {
      valid: true,
      errors: {}
    };

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
      const value = input.value.trim();
      const name = input.name || input.id;

      // Check if required field is empty
      if (input.hasAttribute('required') && !value) {
        result.valid = false;
        result.errors[name] = 'This field is required';
        return;
      }

      // Validate email
      if (input.type === 'email' && value && !this.isValidEmail(value)) {
        result.valid = false;
        result.errors[name] = 'Please enter a valid email address';
        return;
      }

      // Validate password
      if (input.type === 'password' && value && input.name === 'password') {
        const passwordValidation = this.validatePassword(value);
        if (!passwordValidation.valid) {
          result.valid = false;
          result.errors[name] = passwordValidation.errors[0];
          return;
        }
      }

      // Validate password match
      if (input.name === 'confirmPassword' && value) {
        const passwordInput = form.querySelector('input[name="password"]');
        if (passwordInput && value !== passwordInput.value) {
          result.valid = false;
          result.errors[name] = 'Passwords do not match';
          return;
        }
      }

      // Validate min length
      if (input.hasAttribute('minlength')) {
        const minLength = parseInt(input.getAttribute('minlength'));
        if (value.length < minLength) {
          result.valid = false;
          result.errors[name] = `Must be at least ${minLength} characters`;
          return;
        }
      }

      // Validate max length
      if (input.hasAttribute('maxlength')) {
        const maxLength = parseInt(input.getAttribute('maxlength'));
        if (value.length > maxLength) {
          result.valid = false;
          result.errors[name] = `Must be no more than ${maxLength} characters`;
          return;
        }
      }
    });

    return result;
  }

  /**
   * Show form errors
   * @param {HTMLFormElement} form 
   * @param {object} errors 
   */
  static showFormErrors(form, errors) {
    // Remove existing errors
    form.querySelectorAll('.form-error').forEach(error => error.remove());
    form.querySelectorAll('.form-group.error').forEach(group => {
      group.classList.remove('error');
    });

    // Add new errors
    Object.keys(errors).forEach(fieldName => {
      const input = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
      if (input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
          formGroup.classList.add('error');
          const errorElement = document.createElement('span');
          errorElement.className = 'form-error';
          errorElement.textContent = errors[fieldName];
          formGroup.appendChild(errorElement);
        }
      }
    });
  }

  /**
   * Clear form errors
   * @param {HTMLFormElement} form 
   */
  static clearFormErrors(form) {
    form.querySelectorAll('.form-error').forEach(error => error.remove());
    form.querySelectorAll('.form-group.error').forEach(group => {
      group.classList.remove('error');
    });
  }
}

