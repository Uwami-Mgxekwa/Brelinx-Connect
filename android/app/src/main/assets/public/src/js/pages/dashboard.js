/**
 * Dashboard Page JavaScript
 * Handles dashboard functionality and data loading
 */

class DashboardPage {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  /**
   * Initialize dashboard
   */
  init() {
    if (this.isInitialized) return;
    
    console.log('Dashboard: Initializing...');
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load dashboard data
    this.loadDashboardData();
    
    // Update welcome message
    this.updateWelcomeMessage();
    
    // Set active navigation
    this.setActiveNavigation();
    
    this.isInitialized = true;
    console.log('Dashboard: Initialized successfully');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Header buttons
    const notificationsBtn = document.getElementById('notifications-btn');
    const profileBtn = document.getElementById('profile-btn');
    
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', this.handleNotificationsClick.bind(this));
    }
    
    if (profileBtn) {
      profileBtn.addEventListener('click', this.handleProfileClick.bind(this));
    }
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', this.handleNavigation.bind(this));
    });
    
    // Quick action cards
    const quickActions = document.querySelectorAll('.quick-action-card');
    quickActions.forEach(action => {
      action.addEventListener('click', this.handleQuickAction.bind(this));
    });
  }

  /**
   * Load dashboard data
   */
  async loadDashboardData() {
    try {
      // Simulate API calls - replace with real API endpoints
      const [stats, projects, activities] = await Promise.all([
        this.loadStats(),
        this.loadRecentProjects(),
        this.loadRecentActivities()
      ]);
      
      this.updateStats(stats);
      this.updateProjects(projects);
      this.updateActivities(activities);
      
    } catch (error) {
      console.error('Dashboard: Error loading data:', error);
      this.showError('Failed to load dashboard data');
    }
  }

  /**
   * Load statistics
   */
  async loadStats() {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          activeProjects: 3,
          unreadMessages: 7,
          pendingInvoices: 2
        });
      }, 500);
    });
  }

  /**
   * Load recent projects
   */
  async loadRecentProjects() {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Website Redesign',
            status: 'In Progress',
            progress: 65,
            dueDate: '2025-01-15'
          },
          {
            id: 2,
            name: 'Mobile App Development',
            status: 'Planning',
            progress: 25,
            dueDate: '2025-02-28'
          }
        ]);
      }, 600);
    });
  }

  /**
   * Load recent activities
   */
  async loadRecentActivities() {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            type: 'message',
            title: 'New message from John Doe',
            time: '2 hours ago',
            icon: 'chatbubble-outline'
          },
          {
            id: 2,
            type: 'project',
            title: 'Project milestone completed',
            time: '1 day ago',
            icon: 'checkmark-circle-outline'
          },
          {
            id: 3,
            type: 'payment',
            title: 'Invoice payment received',
            time: '2 days ago',
            icon: 'card-outline'
          }
        ]);
      }, 700);
    });
  }

  /**
   * Update statistics display
   */
  updateStats(stats) {
    const activeProjectsCount = document.getElementById('active-projects-count');
    const unreadMessagesCount = document.getElementById('unread-messages-count');
    const pendingInvoicesCount = document.getElementById('pending-invoices-count');
    
    if (activeProjectsCount) {
      this.animateCounter(activeProjectsCount, stats.activeProjects);
    }
    
    if (unreadMessagesCount) {
      this.animateCounter(unreadMessagesCount, stats.unreadMessages);
    }
    
    if (pendingInvoicesCount) {
      this.animateCounter(pendingInvoicesCount, stats.pendingInvoices);
    }
    
    // Update navigation badges
    this.updateNavigationBadges(stats);
  }

  /**
   * Animate counter
   */
  animateCounter(element, targetValue) {
    const startValue = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  /**
   * Update navigation badges
   */
  updateNavigationBadges(stats) {
    const chatBadge = document.getElementById('chat-badge');
    const notificationBadge = document.getElementById('notification-badge');
    
    if (chatBadge && stats.unreadMessages > 0) {
      chatBadge.textContent = stats.unreadMessages;
      chatBadge.style.display = 'flex';
    }
    
    if (notificationBadge && (stats.unreadMessages + stats.pendingInvoices) > 0) {
      notificationBadge.textContent = stats.unreadMessages + stats.pendingInvoices;
      notificationBadge.style.display = 'flex';
    }
  }

  /**
   * Update projects display
   */
  updateProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;
    
    if (projects.length === 0) {
      // Keep empty state
      return;
    }
    
    // Create projects HTML
    const projectsHTML = projects.map(project => `
      <div class="project-card" data-project-id="${project.id}">
        <div class="project-header">
          <h3 class="project-name">${project.name}</h3>
          <span class="project-status status-${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
        </div>
        <div class="project-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.progress}%"></div>
          </div>
          <span class="progress-text">${project.progress}%</span>
        </div>
        <div class="project-footer">
          <span class="project-due">Due: ${this.formatDate(project.dueDate)}</span>
          <a href="#/projects/${project.id}" class="project-link">View Details</a>
        </div>
      </div>
    `).join('');
    
    projectsList.innerHTML = projectsHTML;
    
    // Add click handlers
    const projectCards = projectsList.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('project-link')) {
          const projectId = card.dataset.projectId;
          window.router.navigate(`/projects/${projectId}`);
        }
      });
    });
  }

  /**
   * Update activities display
   */
  updateActivities(activities) {
    const activitiesList = document.getElementById('activity-list');
    if (!activitiesList) return;
    
    if (activities.length === 0) {
      // Keep empty state
      return;
    }
    
    // Create activities HTML
    const activitiesHTML = activities.map(activity => `
      <div class="activity-item" data-activity-id="${activity.id}">
        <div class="activity-icon">
          <ion-icon name="${activity.icon}"></ion-icon>
        </div>
        <div class="activity-content">
          <p class="activity-title">${activity.title}</p>
          <span class="activity-time">${activity.time}</span>
        </div>
      </div>
    `).join('');
    
    activitiesList.innerHTML = activitiesHTML;
  }

  /**
   * Update welcome message
   */
  updateWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcome-message');
    if (!welcomeMessage) return;
    
    // Get user name from storage or auth service
    const userName = this.getUserName();
    const timeOfDay = this.getTimeOfDay();
    
    welcomeMessage.textContent = `${timeOfDay}, ${userName}!`;
  }

  /**
   * Get user name
   */
  getUserName() {
    // Try to get from auth service or storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.name || user.fullName || 'User';
  }

  /**
   * Get time of day greeting
   */
  getTimeOfDay() {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  /**
   * Set active navigation
   */
  setActiveNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === '#/dashboard') {
        item.classList.add('active');
      }
    });
  }

  /**
   * Handle notifications click
   */
  handleNotificationsClick() {
    console.log('Dashboard: Notifications clicked');
    
    // Show a more visible notification
    const notificationBadge = document.getElementById('notification-badge');
    if (notificationBadge) {
      notificationBadge.style.display = 'flex';
      notificationBadge.textContent = '5';
    }
    
    // Create a simple notification dropdown (temporary)
    this.showNotificationDropdown();
  }

  /**
   * Handle profile click
   */
  handleProfileClick() {
    console.log('Dashboard: Profile clicked');
    
    // Show profile menu or navigate to profile
    this.showProfileMenu();
  }

  /**
   * Show notification dropdown (temporary implementation)
   */
  showNotificationDropdown() {
    // Remove existing dropdown
    const existingDropdown = document.querySelector('.notification-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
      return;
    }

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'notification-dropdown';
    dropdown.innerHTML = `
      <div class="dropdown-header">
        <h3>Notifications</h3>
        <button class="close-btn">&times;</button>
      </div>
      <div class="dropdown-content">
        <div class="notification-item">
          <ion-icon name="mail-outline"></ion-icon>
          <div>
            <p>New message from John Doe</p>
            <span>2 hours ago</span>
          </div>
        </div>
        <div class="notification-item">
          <ion-icon name="document-outline"></ion-icon>
          <div>
            <p>Project update available</p>
            <span>1 day ago</span>
          </div>
        </div>
        <div class="notification-item">
          <ion-icon name="card-outline"></ion-icon>
          <div>
            <p>Payment received</p>
            <span>2 days ago</span>
          </div>
        </div>
      </div>
      <div class="dropdown-footer">
        <a href="#/notifications">View All Notifications</a>
      </div>
    `;

    // Position and show dropdown
    const notificationsBtn = document.getElementById('notifications-btn');
    const rect = notificationsBtn.getBoundingClientRect();
    
    dropdown.style.position = 'fixed';
    dropdown.style.top = (rect.bottom + 10) + 'px';
    dropdown.style.right = '16px';
    dropdown.style.zIndex = '9999';
    
    document.body.appendChild(dropdown);

    // Add close handler
    dropdown.querySelector('.close-btn').addEventListener('click', () => {
      dropdown.remove();
    });

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== notificationsBtn) {
          dropdown.remove();
          document.removeEventListener('click', closeDropdown);
        }
      });
    }, 100);
  }

  /**
   * Show profile menu (temporary implementation)
   */
  showProfileMenu() {
    // Remove existing menu
    const existingMenu = document.querySelector('.profile-menu');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    // Create menu
    const menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.innerHTML = `
      <div class="menu-header">
        <div class="user-info">
          <div class="user-avatar">
            <ion-icon name="person"></ion-icon>
          </div>
          <div>
            <p class="user-name">${this.getUserName()}</p>
            <span class="user-email">user@brelinx.com</span>
          </div>
        </div>
      </div>
      <div class="menu-content">
        <a href="#/profile" class="menu-item">
          <ion-icon name="person-outline"></ion-icon>
          <span>Profile Settings</span>
        </a>
        <a href="#/profile/settings" class="menu-item">
          <ion-icon name="settings-outline"></ion-icon>
          <span>Account Settings</span>
        </a>
        <a href="#/help" class="menu-item">
          <ion-icon name="help-circle-outline"></ion-icon>
          <span>Help & Support</span>
        </a>
        <hr class="menu-divider">
        <button class="menu-item logout-btn">
          <ion-icon name="log-out-outline"></ion-icon>
          <span>Sign Out</span>
        </button>
      </div>
    `;

    // Position and show menu
    const profileBtn = document.getElementById('profile-btn');
    const rect = profileBtn.getBoundingClientRect();
    
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 10) + 'px';
    menu.style.right = '16px';
    menu.style.zIndex = '9999';
    
    document.body.appendChild(menu);

    // Add handlers
    menu.querySelector('.logout-btn').addEventListener('click', () => {
      this.handleLogout();
      menu.remove();
    });

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== profileBtn) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
  }

  /**
   * Handle logout
   */
  handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
      // Clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Navigate to login
      window.router.navigate('/auth/login');
    }
  }

  /**
   * Handle navigation clicks
   */
  handleNavigation(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href && href.startsWith('#/')) {
      const path = href.substring(1);
      window.router.navigate(path);
    }
  }

  /**
   * Handle quick action clicks
   */
  handleQuickAction(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href && href.startsWith('#/')) {
      const path = href.substring(1);
      window.router.navigate(path);
    }
  }

  /**
   * Format date
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  /**
   * Show toast message
   */
  showToast(message) {
    // Use the toast component if available
    if (window.Toast) {
      window.Toast.show(message);
    } else {
      alert(message);
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    console.error('Dashboard Error:', message);
    this.showToast(message);
  }

  /**
   * Cleanup when leaving page
   */
  destroy() {
    this.isInitialized = false;
    console.log('Dashboard: Cleaned up');
  }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dashboardPage = new DashboardPage();
  });
} else {
  window.dashboardPage = new DashboardPage();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DashboardPage;
}