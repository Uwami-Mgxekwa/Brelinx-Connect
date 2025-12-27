/**
 * Dashboard Page Handler
 */
class DashboardPage {
  constructor() {
    this.init();
  }

  init() {
    this.loadDashboardData();
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Notification button
    document.getElementById('notifications-btn')?.addEventListener('click', () => {
      toast.show('Notifications coming soon', 'info');
    });

    // Profile button
    document.getElementById('profile-btn')?.addEventListener('click', () => {
      router.navigate('/profile');
    });
  }

  /**
   * Load dashboard data
   */
  async loadDashboardData() {
    try {
      // Update welcome message
      const user = authService.getCurrentUser();
      if (user) {
        const welcomeMsg = document.getElementById('welcome-message');
        if (welcomeMsg) {
          welcomeMsg.textContent = `Welcome back, ${user.fullName || user.email}!`;
        }
      }

      // Load stats (mock data for now)
      this.updateStats({
        activeProjects: 3,
        unreadMessages: 5,
        pendingInvoices: 2
      });

      // Load projects (mock data)
      this.loadProjects([
        {
          id: 1,
          name: 'Website Redesign',
          status: 'active',
          progress: 65,
          dueDate: '2024-02-15'
        },
        {
          id: 2,
          name: 'Mobile App Development',
          status: 'active',
          progress: 40,
          dueDate: '2024-03-01'
        }
      ]);

      // Load activity (mock data)
      this.loadActivity([
        {
          type: 'message',
          title: 'New message from John',
          time: new Date(Date.now() - 3600000)
        },
        {
          type: 'milestone',
          title: 'Milestone completed: Design Phase',
          time: new Date(Date.now() - 7200000)
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.show('Failed to load dashboard data', 'error');
    }
  }

  /**
   * Update stats
   * @param {object} stats 
   */
  updateStats(stats) {
    const activeProjectsEl = document.getElementById('active-projects-count');
    const unreadMessagesEl = document.getElementById('unread-messages-count');
    const pendingInvoicesEl = document.getElementById('pending-invoices-count');

    if (activeProjectsEl) activeProjectsEl.textContent = stats.activeProjects || 0;
    if (unreadMessagesEl) unreadMessagesEl.textContent = stats.unreadMessages || 0;
    if (pendingInvoicesEl) pendingInvoicesEl.textContent = stats.pendingInvoices || 0;
  }

  /**
   * Load projects
   * @param {Array} projects 
   */
  loadProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;

    if (projects.length === 0) {
      return; // Keep empty state
    }

    projectsList.innerHTML = projects.map(project => `
      <div class="project-card">
        <div class="project-card-header">
          <h3 class="project-card-title">${project.name}</h3>
          <span class="project-card-status status-${project.status}">${project.status}</span>
        </div>
        <div class="progress-container">
          <div class="progress-label">
            <span>Progress</span>
            <span>${project.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.progress}%"></div>
          </div>
        </div>
        <div class="card-footer">
          <span class="text-secondary">Due: ${DateUtils.format(project.dueDate, 'short')}</span>
          <a href="#/projects/${project.id}" class="btn btn-text btn-sm">View Details</a>
        </div>
      </div>
    `).join('');
  }

  /**
   * Load activity
   * @param {Array} activities 
   */
  loadActivity(activities) {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;

    if (activities.length === 0) {
      return; // Keep empty state
    }

    const iconMap = {
      message: 'chatbubble-outline',
      milestone: 'flag-outline',
      file: 'document-outline',
      payment: 'card-outline'
    };

    activityList.innerHTML = activities.map(activity => `
      <div class="activity-card">
        <div class="activity-icon">
          <ion-icon name="${iconMap[activity.type] || 'notifications-outline'}"></ion-icon>
        </div>
        <div class="activity-content">
          <p class="activity-title">${activity.title}</p>
          <p class="activity-time">${DateUtils.formatRelative(activity.time)}</p>
        </div>
      </div>
    `).join('');
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new DashboardPage());
} else {
  new DashboardPage();
}

