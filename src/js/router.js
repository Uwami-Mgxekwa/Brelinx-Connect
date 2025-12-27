/**
 * Brelinx Connect - Router System
 * Client-side routing for SPA navigation
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.isNavigating = false;
    this.authService = null; // Will be injected
    
    this.initializeRoutes();
    this.bindEvents();
    this.handleInitialRoute();
  }

  /**
   * Define all application routes
   */
  initializeRoutes() {
    // Authentication Routes
    this.addRoute('/', {
      template: 'pages/auth/login.html',
      title: 'Login - Brelinx Connect',
      requiresAuth: false,
      redirectIfAuth: '/dashboard'
    });

    this.addRoute('/auth/login', {
      template: 'pages/auth/login.html',
      title: 'Login - Brelinx Connect',
      requiresAuth: false,
      redirectIfAuth: '/dashboard'
    });

    this.addRoute('/auth/register', {
      template: 'pages/auth/register.html',
      title: 'Register - Brelinx Connect',
      requiresAuth: false,
      redirectIfAuth: '/dashboard'
    });

    this.addRoute('/auth/reset-password', {
      template: 'pages/auth/reset-password.html',
      title: 'Reset Password - Brelinx Connect',
      requiresAuth: false,
      redirectIfAuth: '/dashboard'
    });

    // Main Application Routes
    this.addRoute('/dashboard', {
      template: 'pages/dashboard/dashboard.html',
      title: 'Dashboard - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    // Project Routes
    this.addRoute('/projects', {
      template: 'pages/projects/projects-list.html',
      title: 'Projects - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    this.addRoute('/projects/:id', {
      template: 'pages/projects/project-detail.html',
      title: 'Project Details - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    this.addRoute('/projects/:id/timeline', {
      template: 'pages/projects/project-timeline.html',
      title: 'Project Timeline - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    // Chat Routes
    this.addRoute('/chat', {
      template: 'pages/chat/conversations.html',
      title: 'Messages - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    this.addRoute('/chat/:id', {
      template: 'pages/chat/chat-room.html',
      title: 'Chat - Brelinx Connect',
      requiresAuth: true,
      showNavigation: false
    });

    // File Routes
    this.addRoute('/files', {
      template: 'pages/files/files-list.html',
      title: 'Files - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    this.addRoute('/files/:id', {
      template: 'pages/files/file-viewer.html',
      title: 'File Viewer - Brelinx Connect',
      requiresAuth: true,
      showNavigation: false
    });

    // Meeting Routes
    this.addRoute('/meetings', {
      template: 'pages/meetings/calendar.html',
      title: 'Meetings - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    this.addRoute('/meetings/:id', {
      template: 'pages/meetings/meeting-details.html',
      title: 'Meeting Details - Brelinx Connect',
      requiresAuth: true,
      showNavigation: false
    });

    // Payment Routes
    this.addRoute('/payments', {
      template: 'pages/payments/invoices.html',
      title: 'Invoices - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    this.addRoute('/payments/history', {
      template: 'pages/payments/payment-history.html',
      title: 'Payment History - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    this.addRoute('/payments/make-payment/:id', {
      template: 'pages/payments/make-payment.html',
      title: 'Make Payment - Brelinx Connect',
      requiresAuth: true,
      showNavigation: false
    });

    // Feedback Routes
    this.addRoute('/feedback', {
      template: 'pages/feedback/submit-feedback.html',
      title: 'Feedback - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    // Profile Routes
    this.addRoute('/profile', {
      template: 'pages/profile/profile.html',
      title: 'Profile - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    this.addRoute('/profile/settings', {
      template: 'pages/profile/settings.html',
      title: 'Settings - Brelinx Connect',
      requiresAuth: true,
      showNavigation: true
    });

    // 404 Route
    this.addRoute('/404', {
      template: 'pages/404.html',
      title: 'Page Not Found - Brelinx Connect',
      requiresAuth: false,
      showNavigation: false
    });
  }

  /**
   * Add a route to the router
   */
  addRoute(path, config) {
    this.routes.set(path, {
      path,
      template: config.template,
      title: config.title || 'Brelinx Connect',
      requiresAuth: config.requiresAuth !== false,
      redirectIfAuth: config.redirectIfAuth || null,
      showNavigation: config.showNavigation !== false,
      params: {},
      query: {}
    });
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Handle hash changes
    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });

    // Handle link clicks
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (link) {
        event.preventDefault();
        const path = link.getAttribute('href').substring(1);
        this.navigate(path);
      }
    });
  }

  /**
   * Handle initial route on page load
   */
  handleInitialRoute() {
    // Check if we're accessing a page directly (not through index.html)
    if (window.location.pathname.includes('/pages/')) {
      // Redirect to main app with the appropriate hash
      const currentPath = window.location.pathname;
      let redirectHash = '/';
      
      if (currentPath.includes('login.html')) {
        redirectHash = '/auth/login';
      } else if (currentPath.includes('register.html')) {
        redirectHash = '/auth/register';
      } else if (currentPath.includes('reset-password.html')) {
        redirectHash = '/auth/reset-password';
      }
      
      // Get the base URL (remove everything after /src/)
      const baseUrl = window.location.origin + window.location.pathname.split('/src/')[0] + '/src/';
      window.location.href = baseUrl + 'index.html#' + redirectHash;
      return;
    }

    // Normal hash-based routing
    const hash = window.location.hash.substring(1) || '/';
    this.navigate(hash, false);
  }

  /**
   * Navigate to a specific route
   */
  async navigate(path, addToHistory = true) {
    if (this.isNavigating) return;
    
    this.isNavigating = true;

    try {
      const route = this.matchRoute(path);
      
      if (!route) {
        this.navigate('/404');
        return;
      }

      // Check authentication
      if (!this.checkAuth(route)) {
        this.isNavigating = false;
        return;
      }

      // Update URL
      if (addToHistory) {
        window.location.hash = '#' + path;
      }

      // Load and render the route
      await this.loadRoute(route);
      
      this.currentRoute = route;
      
    } catch (error) {
      console.error('Navigation error:', error);
      this.showError('Failed to load page. Please try again.');
    } finally {
      this.isNavigating = false;
    }
  }

  /**
   * Match a path to a route
   */
  matchRoute(path) {
    // Remove query string
    const [pathname, queryString] = path.split('?');
    
    // Try exact match first
    if (this.routes.has(pathname)) {
      const route = { ...this.routes.get(pathname) };
      route.query = this.parseQuery(queryString);
      return route;
    }

    // Try pattern matching for dynamic routes
    for (const [routePath, routeConfig] of this.routes) {
      const params = this.matchPattern(routePath, pathname);
      if (params) {
        const route = { ...routeConfig };
        route.params = params;
        route.query = this.parseQuery(queryString);
        return route;
      }
    }

    return null;
  }

  /**
   * Match dynamic route patterns
   */
  matchPattern(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        // Dynamic parameter
        const paramName = patternPart.substring(1);
        params[paramName] = decodeURIComponent(pathPart);
      } else if (patternPart !== pathPart) {
        // Static part doesn't match
        return null;
      }
    }

    return params;
  }

  /**
   * Parse query string
   */
  parseQuery(queryString) {
    const query = {};
    if (queryString) {
      const pairs = queryString.split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        query[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }
    return query;
  }

  /**
   * Check authentication for route
   */
  checkAuth(route) {
    const isAuthenticated = this.isUserAuthenticated();

    if (route.requiresAuth && !isAuthenticated) {
      // Redirect to login
      this.navigate('/auth/login');
      return false;
    }

    if (route.redirectIfAuth && isAuthenticated) {
      // Redirect authenticated users away from auth pages
      this.navigate(route.redirectIfAuth);
      return false;
    }

    return true;
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Load and render a route
   */
  async loadRoute(route) {
    try {
      // Show loading state
      this.showLoading(true);

      // Load the template
      const html = await this.loadTemplate(route.template);
      
      // Update page title
      document.title = route.title;

      // Render the content
      await this.renderContent(html, route);

      // Show/hide navigation
      this.toggleNavigation(route.showNavigation);

      // Hide loading state
      this.showLoading(false);

    } catch (error) {
      console.error('Route loading error:', error);
      this.showError('Failed to load page content.');
      this.showLoading(false);
    }
  }

  /**
   * Load template from file
   */
  async loadTemplate(templatePath) {
    try {
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Template loading error:', error);
      throw error;
    }
  }

  /**
   * Render content to the router outlet
   */
  async renderContent(html, route) {
    const outlet = document.getElementById('router-outlet');
    
    // Add page transition class
    outlet.classList.add('page-enter');
    
    // Set the content
    outlet.innerHTML = html;
    
    // Trigger page-specific JavaScript
    await this.initializePage(route);
    
    // Remove transition class
    setTimeout(() => {
      outlet.classList.remove('page-enter');
    }, 50);
  }

  /**
   * Initialize page-specific functionality
   */
  async initializePage(route) {
    // Load page-specific JavaScript if it exists
    const pageName = this.getPageName(route.template);
    
    try {
      // Try to load page-specific JS
      const scriptPath = `js/pages/${pageName}.js`;
      await this.loadScript(scriptPath);
    } catch (error) {
      // Page-specific JS is optional
      console.log(`No specific JS found for page: ${pageName}`);
    }

    // Dispatch route change event
    window.dispatchEvent(new CustomEvent('routeChanged', {
      detail: { route, params: route.params, query: route.query }
    }));
  }

  /**
   * Get page name from template path
   */
  getPageName(templatePath) {
    const parts = templatePath.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace('.html', '');
  }

  /**
   * Load JavaScript file dynamically
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Show/hide loading screen
   */
  showLoading(show) {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    if (show) {
      loadingScreen.style.display = 'flex';
      mainContent.style.display = 'none';
    } else {
      loadingScreen.style.display = 'none';
      mainContent.style.display = 'block';
    }
  }

  /**
   * Toggle navigation visibility
   */
  toggleNavigation(show) {
    const navigation = document.getElementById('app-navigation');
    if (navigation) {
      navigation.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * Handle route changes
   */
  handleRoute() {
    const hash = window.location.hash.substring(1) || '/';
    this.navigate(hash, false);
  }

  /**
   * Show error message
   */
  showError(message) {
    // This will be replaced with proper toast notification
    console.error('Router Error:', message);
    alert(message);
  }

  /**
   * Get current route information
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Get route parameters
   */
  getParams() {
    return this.currentRoute ? this.currentRoute.params : {};
  }

  /**
   * Get query parameters
   */
  getQuery() {
    return this.currentRoute ? this.currentRoute.query : {};
  }

  /**
   * Go back in history
   */
  goBack() {
    window.history.back();
  }

  /**
   * Replace current route
   */
  replace(path) {
    window.location.replace('#' + path);
  }
}

// Create global router instance
window.router = new Router();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Router;
}