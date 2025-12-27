/**
 * Authentication Page JavaScript
 * Handles login, registration, and password reset functionality
 */

class AuthController {
  constructor() {
    this.initializeEventListeners();
    this.checkBiometricSupport();
  }

  /**
   * Initialize all event listeners for the auth page
   */
  initializeEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', this.handleLogin.bind(this));
    }

    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', this.handleRegister.bind(this));
    }

    // Reset password form submission
    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
      resetForm.addEventListener('submit', this.handleResetPassword.bind(this));
    }

    // Resend reset email
    const resendBtn = document.getElementById('resendBtn');
    if (resendBtn) {
      resendBtn.addEventListener('click', this.handleResendReset.bind(this));
    }

    // Password toggle functionality
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => this.togglePassword('password'));
    }

    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    if (confirmPasswordToggle) {
      confirmPasswordToggle.addEventListener('click', () => this.togglePassword('confirmPassword'));
    }

    // Social login buttons
    const googleLogin = document.getElementById('googleLogin');
    const appleLogin = document.getElementById('appleLogin');
    const googleRegister = document.getElementById('googleRegister');
    const appleRegister = document.getElementById('appleRegister');
    
    if (googleLogin) {
      googleLogin.addEventListener('click', () => this.handleSocialLogin('google'));
    }
    
    if (appleLogin) {
      appleLogin.addEventListener('click', () => this.handleSocialLogin('apple'));
    }

    if (googleRegister) {
      googleRegister.addEventListener('click', () => this.handleSocialLogin('google'));
    }
    
    if (appleRegister) {
      appleRegister.addEventListener('click', () => this.handleSocialLogin('apple'));
    }

    // Biometric login
    const biometricLogin = document.getElementById('biometricLogin');
    if (biometricLogin) {
      biometricLogin.addEventListener('click', this.handleBiometricLogin.bind(this));
    }

    // Real-time form validation for login
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput) {
      emailInput.addEventListener('blur', () => this.validateEmail(emailInput.value));
      emailInput.addEventListener('input', () => this.clearError('email'));
    }

    if (passwordInput) {
      passwordInput.addEventListener('blur', () => this.validatePassword(passwordInput.value));
      passwordInput.addEventListener('input', () => this.clearError('password'));
    }

    // Real-time form validation for register
    const regFullName = document.getElementById('fullName');
    const regEmail = document.getElementById('email');
    const regPassword = document.getElementById('password');
    const regConfirmPassword = document.getElementById('confirmPassword');

    if (regFullName) {
      regFullName.addEventListener('blur', () => this.validateFullName(regFullName.value));
      regFullName.addEventListener('input', () => this.clearError('fullName'));
    }

    if (regEmail) {
      regEmail.addEventListener('blur', () => this.validateEmail(regEmail.value));
      regEmail.addEventListener('input', () => this.clearError('email'));
    }

    if (regPassword) {
      regPassword.addEventListener('input', () => {
        this.validatePasswordStrength(regPassword.value);
        this.clearError('password');
      });
      regPassword.addEventListener('focus', () => this.showPasswordRequirements(true));
      regPassword.addEventListener('blur', () => {
        this.validatePassword(regPassword.value);
        if (!regPassword.value) {
          this.showPasswordRequirements(false);
        }
      });
    }

    if (regConfirmPassword) {
      regConfirmPassword.addEventListener('blur', () => {
        this.validatePasswordMatch(regPassword?.value, regConfirmPassword.value);
      });
      regConfirmPassword.addEventListener('input', () => this.clearError('confirmPassword'));
    }
  }

  /**
   * Handle login form submission
   */
  async handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    // Validate inputs
    if (!this.validateEmail(email) || !this.validatePassword(password)) {
      return;
    }

    const loginBtn = document.getElementById('loginBtn');
    this.setButtonLoading(loginBtn, true);

    try {
      // Simulate API call (replace with actual API service)
      const response = await this.loginUser({
        email,
        password,
        remember: !!remember
      });

      if (response.success) {
        // Store auth token
        if (remember) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
        } else {
          sessionStorage.setItem('authToken', response.token);
          sessionStorage.setItem('refreshToken', response.refreshToken);
        }

        // Store user data
        localStorage.setItem('userData', JSON.stringify(response.user));

        // Show success message
        this.showToast('Login successful! Redirecting...', 'success');

        // Redirect to dashboard
        setTimeout(() => {
          window.location.hash = '#/dashboard';
        }, 1000);

      } else {
        this.showError('login', response.message || 'Login failed. Please try again.');
      }

    } catch (error) {
      console.error('Login error:', error);
      this.showError('login', 'Network error. Please check your connection and try again.');
    } finally {
      this.setButtonLoading(loginBtn, false);
    }
  }

  /**
   * Handle register form submission
   */
  async handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const fullName = formData.get('fullName');
    const companyName = formData.get('companyName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const agreeTerms = formData.get('agreeTerms');

    // Validate all inputs
    let isValid = true;
    
    if (!this.validateFullName(fullName)) isValid = false;
    if (!this.validateEmail(email)) isValid = false;
    if (!this.validatePassword(password)) isValid = false;
    if (!this.validatePasswordMatch(password, confirmPassword)) isValid = false;
    if (!agreeTerms) {
      this.showError('agreeTerms', 'You must agree to the Terms of Service and Privacy Policy');
      isValid = false;
    }

    if (!isValid) return;

    const registerBtn = document.getElementById('registerBtn');
    this.setButtonLoading(registerBtn, true);

    try {
      // Simulate API call (replace with actual API service)
      const response = await this.registerUser({
        fullName,
        companyName,
        email,
        password
      });

      if (response.success) {
        // Show success message
        this.showToast('Account created successfully! Please check your email to verify your account.', 'success');

        // Redirect to login after delay
        setTimeout(() => {
          window.location.hash = '#/auth/login';
        }, 2000);

      } else {
        this.showError('register', response.message || 'Registration failed. Please try again.');
      }

    } catch (error) {
      console.error('Registration error:', error);
      this.showError('register', 'Network error. Please check your connection and try again.');
    } finally {
      this.setButtonLoading(registerBtn, false);
    }
  }

  /**
   * Handle reset password form submission
   */
  async handleResetPassword(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');

    // Validate email
    if (!this.validateEmail(email)) {
      return;
    }

    const resetBtn = document.getElementById('resetBtn');
    this.setButtonLoading(resetBtn, true);

    try {
      // Simulate API call (replace with actual API service)
      const response = await this.sendResetEmail(email);

      if (response.success) {
        // Hide form and show success message
        document.getElementById('resetForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Store email for resend functionality
        this.resetEmail = email;

      } else {
        this.showError('email', response.message || 'Failed to send reset email. Please try again.');
      }

    } catch (error) {
      console.error('Reset password error:', error);
      this.showError('email', 'Network error. Please check your connection and try again.');
    } finally {
      this.setButtonLoading(resetBtn, false);
    }
  }

  /**
   * Handle resend reset email
   */
  async handleResendReset() {
    if (!this.resetEmail) return;

    const resendBtn = document.getElementById('resendBtn');
    const originalText = resendBtn.textContent;
    
    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';

    try {
      await this.sendResetEmail(this.resetEmail);
      this.showToast('Reset email sent again!', 'success');
      
      // Disable resend for 60 seconds
      let countdown = 60;
      const interval = setInterval(() => {
        resendBtn.textContent = `Resend in ${countdown}s`;
        countdown--;
        
        if (countdown < 0) {
          clearInterval(interval);
          resendBtn.disabled = false;
          resendBtn.textContent = originalText;
        }
      }, 1000);

    } catch (error) {
      console.error('Resend reset error:', error);
      this.showToast('Failed to resend email. Please try again.', 'error');
      resendBtn.disabled = false;
      resendBtn.textContent = originalText;
    }
  }

  /**
   * Simulate send reset email API call (replace with actual API service)
   */
  async sendResetEmail(email) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response - replace with actual API call
    return {
      success: true,
      message: 'Reset email sent successfully'
    };
  }
  async registerUser(userData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock response - replace with actual API call
    // Check if email already exists (mock check)
    if (userData.email === 'existing@example.com') {
      return {
        success: false,
        message: 'An account with this email already exists'
      };
    }

    return {
      success: true,
      message: 'Account created successfully',
      user: {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.fullName,
        company: userData.companyName,
        role: 'client',
        emailVerified: false
      }
    };
  }
  async loginUser(credentials) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response - replace with actual API call
    if (credentials.email === 'demo@brelinx.com' && credentials.password === 'demo123') {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          name: 'Demo User',
          company: 'Demo Company',
          role: 'client'
        }
      };
    } else {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  }

  /**
   * Toggle password visibility
   */
  togglePassword(fieldId = 'password') {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = document.getElementById(fieldId === 'password' ? 'toggleIcon' : 'confirmToggleIcon');
    
    if (passwordInput && toggleIcon) {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.name = 'eye-off-outline';
      } else {
        passwordInput.type = 'password';
        toggleIcon.name = 'eye-outline';
      }
    }
  }

  /**
   * Handle social login
   */
  async handleSocialLogin(provider) {
    try {
      this.showToast(`Connecting to ${provider}...`, 'info');
      
      // Simulate social login process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful social login
      const mockUser = {
        id: '2',
        email: `user@${provider}.com`,
        name: `${provider} User`,
        company: 'Social Login Company',
        role: 'client'
      };

      localStorage.setItem('authToken', 'social-token-' + Date.now());
      localStorage.setItem('userData', JSON.stringify(mockUser));

      this.showToast('Login successful!', 'success');
      
      setTimeout(() => {
        window.location.hash = '#/dashboard';
      }, 1000);

    } catch (error) {
      console.error('Social login error:', error);
      this.showToast(`${provider} login failed. Please try again.`, 'error');
    }
  }

  /**
   * Handle biometric authentication
   */
  async handleBiometricLogin() {
    try {
      // Check if biometric is available (this would use Capacitor plugins in real app)
      if (!this.isBiometricAvailable()) {
        this.showToast('Biometric authentication not available', 'warning');
        return;
      }

      this.showToast('Please authenticate using your biometric...', 'info');

      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful biometric login
      const savedUser = localStorage.getItem('biometricUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        localStorage.setItem('authToken', 'biometric-token-' + Date.now());
        localStorage.setItem('userData', JSON.stringify(user));

        this.showToast('Biometric login successful!', 'success');
        
        setTimeout(() => {
          window.location.hash = '#/dashboard';
        }, 1000);
      } else {
        this.showToast('No biometric data found. Please login normally first.', 'warning');
      }

    } catch (error) {
      console.error('Biometric login error:', error);
      this.showToast('Biometric authentication failed', 'error');
    }
  }

  /**
   * Check if biometric authentication is supported
   */
  checkBiometricSupport() {
    // In a real app, this would check Capacitor biometric plugins
    const biometricSection = document.getElementById('biometricSection');
    const hasBiometricData = localStorage.getItem('biometricUser');
    
    if (hasBiometricData && this.isBiometricAvailable()) {
      biometricSection.style.display = 'block';
    }
  }

  /**
   * Mock biometric availability check
   */
  isBiometricAvailable() {
    // In a real app, this would check device capabilities
    return 'ontouchstart' in window; // Simple mobile detection
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid && email) {
      this.showError('email', 'Please enter a valid email address');
      return false;
    }
    
    this.clearError('email');
    return true;
  }

  /**
   * Validate password (enhanced for registration)
   */
  validatePassword(password) {
    // For registration, use stronger validation
    if (document.getElementById('registerForm')) {
      const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
      };

      const isValid = Object.values(requirements).every(req => req);
      
      if (!isValid && password) {
        this.showError('password', 'Password must meet all requirements above');
        return false;
      }
    } else {
      // For login, use simpler validation
      const isValid = password && password.length >= 6;
      
      if (!isValid && password) {
        this.showError('password', 'Password must be at least 6 characters long');
        return false;
      }
    }
    
    this.clearError('password');
    return true;
  }

  /**
   * Validate password strength and show requirements
   */
  validatePasswordStrength(password) {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };

    // Update requirement indicators
    Object.keys(requirements).forEach(req => {
      const element = document.getElementById(`req-${req}`);
      if (element) {
        element.classList.toggle('valid', requirements[req]);
      }
    });

    return Object.values(requirements).every(req => req);
  }

  /**
   * Show/hide password requirements
   */
  showPasswordRequirements(show) {
    const requirementsElement = document.getElementById('passwordRequirements');
    if (requirementsElement) {
      requirementsElement.classList.toggle('show', show);
    }
  }

  /**
   * Validate password match
   */
  validatePasswordMatch(password, confirmPassword) {
    const isValid = password && confirmPassword && password === confirmPassword;
    
    if (!isValid && confirmPassword) {
      this.showError('confirmPassword', 'Passwords do not match');
      return false;
    }
    
    this.clearError('confirmPassword');
    return true;
  }

  /**
   * Show error message for specific field
   */
  showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputGroup = errorElement.closest('.input-group');
    
    errorElement.textContent = message;
    inputGroup.classList.add('error');
  }

  /**
   * Clear error for specific field
   */
  clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputGroup = errorElement.closest('.input-group');
    
    errorElement.textContent = '';
    inputGroup.classList.remove('error');
  }

  /**
   * Set button loading state
   */
  setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'block';
    } else {
      button.classList.remove('loading');
      button.disabled = false;
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <ion-icon name="${this.getToastIcon(type)}"></ion-icon>
        <span>${message}</span>
      </div>
    `;

    // Add toast styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getToastColor(type)};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;

    // Add to DOM
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  /**
   * Get toast icon based on type
   */
  getToastIcon(type) {
    const icons = {
      success: 'checkmark-circle-outline',
      error: 'alert-circle-outline',
      warning: 'warning-outline',
      info: 'information-circle-outline'
    };
    return icons[type] || icons.info;
  }

  /**
   * Get toast color based on type
   */
  getToastColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[type] || colors.info;
  }
}

// Initialize auth controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on an auth page
  if (document.querySelector('.login-page') || 
      document.querySelector('.register-page') || 
      document.querySelector('.reset-password-page')) {
    new AuthController();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthController;
}