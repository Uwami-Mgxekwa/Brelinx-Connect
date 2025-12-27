/**
 * Brelinx Connect - Main Application Controller
 * Initializes the app and manages global functionality
 */

class BrelinxApp {
  constructor() {
    this.isInitialized = false;
    this.services = {};
    this.components = {};
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('🚀 Initializing Brelinx Connect...');
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.startApp());
      } else {
        await this.startApp();
      }
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      this.showCriticalError('Failed to initialize application');
    }
  }

  /**
   * Start the application
   */
  async startApp() {
    try {
      // Show loading screen
      this.showLoadingScreen(true);

      // Initialize services
      await this.initializeServices();

      // Initialize components
      await this.initializeComponents();

      // Setup global event listeners
      this.setupGlobalEvents();

      // Initialize router (this will handle the initial route)
      this.initializeRouter();

      // Setup PWA features
      this.setupPWA();

      // Mark as initialized
      this.isInitialized = true;

      console.log('✅ Brelinx Connect initialized successfully');

      // Hide loading screen after a brief delay
      setTimeout(() => {
        this.showLoadingScreen(false);
      }, 1000);

    } catch (error) {
      console.error('❌ App startup failed:', error);
      this.showCriticalError('Failed to start application');
    }
  }

  /**
   * Initialize core services
   */
  async initializeServices() {
    console.log('🔧 Initializing services...');

    // Initialize API Service
    if (window.ApiService) {
      this.services.api = new window.ApiService();
    }

    // Initialize Auth Service
    if (window.AuthService) {
      this.services.auth = new window.AuthService();
    }

    // Initialize Storage Service
    if (window.StorageService) {
      this.services.storage = new window.StorageService();
    }

    // Initialize WebSocket Service (for real-time features)
    if (window.WebSocketService) {
      this.services.websocket = new window.WebSocketService();
    }

    // Initialize Notification Service
    if (window.NotificationService) {
      this.services.notifications = new window.NotificationService();
    }

    console.log('✅ Services initialized');
  }

  /**
   * Initialize UI components
   */
  async initializeComponents() {
    console.log('🎨 Initializing components...');

    // Initialize Toast component
    if (window.Toast) {
      this.components.toast = new window.Toast();
    }

    // Initialize Modal component
    if (window.Modal) {
      this.components.modal = new window.Modal();
    }

    // Initialize Loader component
    if (window.Loader) {
      this.components.loader = new window.Loader();
    }

    console.log('✅ Components initialized');
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEvents() {
    console.log('📡 Setting up global events...');

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.handleOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      this.handleOnlineStatus(false);
    });

    // Handle app visibility changes
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Handle unhandled errors
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason);
    });

    // Handle route changes
    window.addEventListener('routeChanged', (event) => {
      this.handleRouteChange(event.detail);
    });

    // Handle authentication changes
    window.addEventListener('authChanged', (event) => {
      this.handleAuthChange(event.detail);
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      this.handleKeyboardShortcuts(event);
    });

    console.log('✅ Global events setup complete');
  }

  /**
   * Initialize router
   */
  initializeRouter() {
    console.log('🧭 Router already initialized');
    
    // Inject services into router
    if (window.router && this.services.auth) {
      window.router.authService = this.services.auth;
    }
  }

  /**
   * Setup PWA features
   */
  setupPWA() {
    console.log('📱 Setting up PWA features...');

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
        });
    }

    // Handle app install prompt
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.handleInstallPrompt(event);
    });

    // Handle app installed
    window.addEventListener('appinstalled', () => {
      console.log('✅ App installed successfully');
      this.showToast('App installed successfully!', 'success');
    });

    console.log('✅ PWA features setup complete');
  }

  /**
   * Handle online/offline status
   */
  handleOnlineStatus(isOnline) {
    console.log(`📶 Network status: ${isOnline ? 'Online' : 'Offline'}`);
    
    if (isOnline) {
      this.showToast('Connection restored', 'success');
      // Sync offline data if available
      this.syncOfflineData();
    } else {
      this.showToast('You are offline', 'warning');
    }

    // Update UI to reflect network status
    document.body.classList.toggle('offline', !isOnline);
  }

  /**
   * Handle app visibility changes
   */
  handleVisibilityChange() {
    if (document.hidden) {
      console.log('📱 App hidden');
      // Pause non-essential operations
      this.pauseOperations();
    } else {
      console.log('📱 App visible');
      // Resume operations
      this.resumeOperations();
    }
  }

  /**
   * Handle global errors
   */
  handleGlobalError(error) {
    console.error('🚨 Global error:', error);
    
    // Log error for debugging
    this.logError(error);
    
    // Show user-friendly error message
    this.showToast('Something went wrong. Please try again.', 'error');
  }

  /**
   * Handle route changes
   */
  handleRouteChange(routeData) {
    console.log('🧭 Route changed:', routeData.route.path);
    
    // Update navigation state
    this.updateNavigationState(routeData.route);
    
    // Track page view (analytics)
    this.trackPageView(routeData.route);
  }

  /**
   * Handle authentication changes
   */
  handleAuthChange(authData) {
    console.log('🔐 Auth state changed:', authData.isAuthenticated);
    
    if (authData.isAuthenticated) {
      // User logged in
      this.onUserLogin(authData.user);
    } else {
      // User logged out
      this.onUserLogout();
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K - Search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }

    // Escape - Close modals
    if (event.key === 'Escape') {
      this.closeModals();
    }
  }

  /**
   * Handle app install prompt
   */
  handleInstallPrompt(event) {
    // Store the event for later use
    this.installPromptEvent = event;
    
    // Show install button or banner
    this.showInstallOption();
  }

  /**
   * Show loading screen
   */
  showLoadingScreen(show) {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    if (loadingScreen && mainContent) {
      if (show) {
        loadingScreen.style.display = 'flex';
        mainContent.style.display = 'none';
      } else {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';
      }
    }
  }

  /**
   * Show critical error
   */
  showCriticalError(message) {
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #f3f4f6;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 400px;
        ">
          <h2 style="color: #ef4444; margin-bottom: 1rem;">Application Error</h2>
          <p style="color: #6b7280; margin-bottom: 1.5rem;">${message}</p>
          <button onclick="window.location.reload()" style="
            background: #2d8a5f;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          ">Reload App</button>
        </div>
      </div>
    `;
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    if (this.components.toast) {
      this.components.toast.show(message, type);
    } else {
      console.log(`Toast: ${message} (${type})`);
    }
  }

  /**
   * Sync offline data
   */
  async syncOfflineData() {
    try {
      // Implement offline data synchronization
      console.log('🔄 Syncing offline data...');
      
      // This would sync any queued operations
      if (this.services.api) {
        await this.services.api.syncOfflineQueue();
      }
      
    } catch (error) {
      console.error('❌ Offline sync failed:', error);
    }
  }

  /**
   * Pause non-essential operations
   */
  pauseOperations() {
    // Pause WebSocket connections
    if (this.services.websocket) {
      this.services.websocket.pause();
    }
    
    // Pause background sync
    // Pause animations
  }

  /**
   * Resume operations
   */
  resumeOperations() {
    // Resume WebSocket connections
    if (this.services.websocket) {
      this.services.websocket.resume();
    }
    
    // Resume background sync
    // Resume animations
  }

  /**
   * Log error for debugging
   */
  logError(error) {
    // In production, this would send to error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.error('Error logged:', errorData);
  }

  /**
   * Update navigation state
   */
  updateNavigationState(route) {
    // Update active navigation items
    const navItems = document.querySelectorAll('[data-nav-item]');
    navItems.forEach(item => {
      const path = item.getAttribute('data-nav-item');
      item.classList.toggle('active', route.path.startsWith(path));
    });
  }

  /**
   * Track page view
   */
  trackPageView(route) {
    // In production, this would send to analytics service
    console.log('📊 Page view:', route.path);
  }

  /**
   * Handle user login
   */
  onUserLogin(user) {
    console.log('👤 User logged in:', user.email);
    
    // Initialize user-specific services
    if (this.services.websocket) {
      this.services.websocket.connect(user.id);
    }
    
    // Load user preferences
    this.loadUserPreferences(user);
  }

  /**
   * Handle user logout
   */
  onUserLogout() {
    console.log('👤 User logged out');
    
    // Disconnect user-specific services
    if (this.services.websocket) {
      this.services.websocket.disconnect();
    }
    
    // Clear user data
    this.clearUserData();
  }

  /**
   * Open search
   */
  openSearch() {
    // Implement global search functionality
    console.log('🔍 Opening search...');
  }

  /**
   * Close modals
   */
  closeModals() {
    // Close any open modals
    if (this.components.modal) {
      this.components.modal.closeAll();
    }
  }

  /**
   * Show install option
   */
  showInstallOption() {
    // Show install app button/banner
    console.log('📱 Showing install option...');
  }

  /**
   * Load user preferences
   */
  loadUserPreferences(user) {
    // Load and apply user preferences
    console.log('⚙️ Loading user preferences...');
  }

  /**
   * Clear user data
   */
  clearUserData() {
    // Clear sensitive user data
    localStorage.removeItem('userData');
    sessionStorage.clear();
  }

  /**
   * Get service instance
   */
  getService(name) {
    return this.services[name];
  }

  /**
   * Get component instance
   */
  getComponent(name) {
    return this.components[name];
  }
}

// Initialize the app
window.app = new BrelinxApp();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrelinxApp;
}