/**
 * Main Application Initialization
 */
class App {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize application
   */
  async init() {
    if (this.initialized) return;

    try {
      // Hide loading screen after a short delay
      setTimeout(() => {
        this.hideLoadingScreen();
      }, 500);

      // Initialize services
      this.initServices();

      // Setup event listeners
      this.setupEventListeners();

      // Check authentication status
      this.checkAuth();

      // Initialize page-specific functionality
      this.initPageFeatures();

      this.initialized = true;
      console.log('App initialized');
    } catch (error) {
      console.error('App initialization error:', error);
      this.showError('Failed to initialize app');
    }
  }

  /**
   * Initialize services
   */
  initServices() {
    // Services are already initialized as singletons
    // This is where we could add service initialization logic
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Handle online/offline events
    window.addEventListener('online', () => {
      this.showToast('Connection restored', 'success');
    });

    window.addEventListener('offline', () => {
      this.showToast('No internet connection', 'warning');
    });

    // Handle visibility change (tab focus)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // App is in background
      } else {
        // App is in foreground - refresh data if needed
        this.onAppForeground();
      }
    });

    // Prevent default form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName === 'FORM' && !form.hasAttribute('data-allow-submit')) {
        e.preventDefault();
      }
    });
  }

  /**
   * Check authentication status
   */
  checkAuth() {
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      // User is logged in
      const user = authService.getCurrentUser();
      console.log('User authenticated:', user);
    } else {
      // User is not logged in
      console.log('User not authenticated');
    }
  }

  /**
   * Initialize page-specific features
   */
  initPageFeatures() {
    // Initialize password toggles
    this.initPasswordToggles();

    // Initialize form validations
    this.initFormValidations();
  }

  /**
   * Initialize password toggle buttons
   */
  initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const button = e.currentTarget;
        const input = button.closest('.input-with-icon')?.querySelector('input[type="password"], input[type="text"]');
        
        if (input) {
          if (input.type === 'password') {
            input.type = 'text';
            button.querySelector('ion-icon').setAttribute('name', 'eye-off-outline');
          } else {
            input.type = 'password';
            button.querySelector('ion-icon').setAttribute('name', 'eye-outline');
          }
        }
      });
    });
  }

  /**
   * Initialize form validations
   */
  initFormValidations() {
    // Real-time validation for email fields
    document.querySelectorAll('input[type="email"]').forEach(input => {
      input.addEventListener('blur', () => {
        const value = input.value.trim();
        const formGroup = input.closest('.form-group');
        
        if (value && !Validation.isValidEmail(value)) {
          formGroup?.classList.add('error');
          if (!formGroup.querySelector('.form-error')) {
            const error = document.createElement('span');
            error.className = 'form-error';
            error.textContent = 'Please enter a valid email address';
            formGroup.appendChild(error);
          }
        } else {
          formGroup?.classList.remove('error');
          formGroup?.querySelector('.form-error')?.remove();
        }
      });
    });
  }

  /**
   * Hide loading screen
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 300);
    }
    
    if (mainContent) {
      mainContent.style.display = 'block';
    }
  }

  /**
   * Show toast notification
   * @param {string} message 
   * @param {string} type 
   */
  showToast(message, type = 'info') {
    if (window.toast) {
      window.toast.show(message, type);
    } else {
      console.log(`Toast: ${message}`);
    }
  }

  /**
   * Show error message
   * @param {string} message 
   */
  showError(message) {
    this.showToast(message, 'error');
  }

  /**
   * Handle app coming to foreground
   */
  onAppForeground() {
    // Refresh authentication token if needed
    const token = apiService.getToken();
    if (token) {
      // Check if token needs refresh
      // This would be implemented based on token expiry
    }
  }
}

// Initialize app when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Make app globally available
window.app = app;

