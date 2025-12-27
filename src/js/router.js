/**
 * Client-Side Router
 * Handles navigation and page routing
 */
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.outlet = document.getElementById('router-outlet');
    this.init();
  }

  /**
   * Initialize router
   */
  init() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', () => this.handleRoute());

    // Handle initial route
    this.handleRoute();
  }

  /**
   * Register a route
   * @param {string} path 
   * @param {string} pagePath 
   * @param {object} options 
   */
  route(path, pagePath, options = {}) {
    this.routes[path] = {
      pagePath,
      requiresAuth: options.requiresAuth !== false, // Default to true
      ...options
    };
  }

  /**
   * Handle route change
   */
  async handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const path = hash.split('?')[0]; // Remove query params
    const route = this.routes[path];

    // Check if route exists
    if (!route) {
      this.navigate('/dashboard', { replace: true });
      return;
    }

    // Check authentication
    if (route.requiresAuth && !authService.isAuthenticated()) {
      this.navigate('/auth/login', { replace: true });
      return;
    }

    // Redirect authenticated users away from auth pages
    if (path.startsWith('/auth') && authService.isAuthenticated()) {
      this.navigate('/dashboard', { replace: true });
      return;
    }

    // Load page
    await this.loadPage(route.pagePath, path);
    this.currentRoute = path;

    // Update active nav items
    this.updateNavigation(path);
  }

  /**
   * Load page content
   * @param {string} pagePath 
   * @param {string} routePath 
   */
  async loadPage(pagePath, routePath) {
    try {
      // Show loading
      this.showLoading();

      // Fetch page HTML
      const response = await fetch(pagePath);
      if (!response.ok) {
        throw new Error(`Failed to load page: ${response.status}`);
      }

      const html = await response.text();
      
      // Create temporary container
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Clear outlet
      this.outlet.innerHTML = '';

      // Append page content
      const pageContent = tempDiv.querySelector('div') || tempDiv;
      this.outlet.appendChild(pageContent);

      // Load page-specific JavaScript if exists
      await this.loadPageScript(routePath);

      // Hide loading
      this.hideLoading();

      // Scroll to top
      Helpers.scrollToTop();
    } catch (error) {
      console.error('Error loading page:', error);
      this.showError('Failed to load page. Please try again.');
    }
  }

  /**
   * Load page-specific script
   * @param {string} routePath 
   */
  async loadPageScript(routePath) {
    // Map route to script file
    const scriptMap = {
      '/auth/login': 'pages/auth.js',
      '/auth/register': 'pages/auth.js',
      '/auth/reset-password': 'pages/auth.js',
      '/dashboard': 'pages/dashboard.js',
      '/projects': 'pages/projects.js',
      '/chat': 'pages/chat.js',
      '/profile': 'pages/profile.js'
    };

    const scriptPath = scriptMap[routePath];
    if (scriptPath) {
      try {
        // Check if script already loaded
        const scriptId = `script-${routePath.replace(/\//g, '-')}`;
        if (document.getElementById(scriptId)) {
          return;
        }

        // Load script dynamically
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `js/${scriptPath}`;
        script.type = 'module';
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading page script:', error);
      }
    }
  }

  /**
   * Navigate to route
   * @param {string} path 
   * @param {object} options 
   */
  navigate(path, options = {}) {
    if (options.replace) {
      window.location.replace(`#${path}`);
    } else {
      window.location.hash = path;
    }
  }

  /**
   * Update navigation active states
   * @param {string} currentPath 
   */
  updateNavigation(currentPath) {
    // Update bottom nav
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && currentPath.startsWith(href.replace('#', ''))) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * Show loading state
   */
  showLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }

  /**
   * Show error message
   * @param {string} message 
   */
  showError(message) {
    // This will use the toast component
    if (window.toast) {
      window.toast.show(message, 'error');
    } else {
      alert(message);
    }
  }
}

// Initialize router and register routes
const router = new Router();

// Register routes
router.route('/', 'pages/dashboard/dashboard.html', { requiresAuth: true });
router.route('/dashboard', 'pages/dashboard/dashboard.html', { requiresAuth: true });
router.route('/auth/login', 'pages/auth/login.html', { requiresAuth: false });
router.route('/auth/register', 'pages/auth/register.html', { requiresAuth: false });
router.route('/auth/reset-password', 'pages/auth/reset-password.html', { requiresAuth: false });

// Make router globally available
window.router = router;

