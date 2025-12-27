/**
 * Brelinx Connect - Authentication Service
 * Handles user authentication and session management
 */

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authToken = null;
    this.refreshToken = null;
    
    this.loadStoredAuth();
  }

  /**
   * Load stored authentication data
   */
  loadStoredAuth() {
    this.authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuth();
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.authToken && !!this.currentUser;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get auth token
   */
  getAuthToken() {
    return this.authToken;
  }

  /**
   * Login user
   */
  async login(credentials) {
    try {
      // Use API service for login
      const response = await window.apiService.login(credentials);
      
      if (response.data.success) {
        this.setAuthData(response.data, credentials.remember);
        return { success: true, user: this.currentUser };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  /**
   * Register user
   */
  async register(userData) {
    try {
      // Use API service for registration
      const response = await window.apiService.register(userData);
      
      if (response.data.success) {
        return { success: true, user: response.data.user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email) {
    try {
      // Use API service for password reset
      const response = await window.apiService.resetPassword(email);
      
      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Failed to send reset email. Please try again.' };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout API if token exists
      if (this.authToken) {
        await window.apiService.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      this.clearAuth();
      this.notifyAuthChange(false);
    }
  }

  /**
   * Refresh auth token
   */
  async refreshAuthToken() {
    if (!this.refreshToken) {
      this.logout();
      return false;
    }

    try {
      const response = await window.apiService.refreshAuthToken(this.refreshToken);
      
      if (response.data.success) {
        this.authToken = response.data.token;
        this.refreshToken = response.data.refreshToken;
        
        // Update stored tokens
        const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
        storage.setItem('authToken', this.authToken);
        if (this.refreshToken) {
          localStorage.setItem('refreshToken', this.refreshToken);
        }
        
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Set authentication data
   */
  setAuthData(authData, remember = false) {
    this.authToken = authData.token;
    this.refreshToken = authData.refreshToken;
    this.currentUser = authData.user;

    // Store tokens
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('authToken', this.authToken);
    
    if (this.refreshToken) {
      localStorage.setItem('refreshToken', this.refreshToken);
    }

    // Store user data
    localStorage.setItem('userData', JSON.stringify(this.currentUser));

    // Notify auth change
    this.notifyAuthChange(true);
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    this.authToken = null;
    this.refreshToken = null;
    this.currentUser = null;

    // Clear stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
  }

  /**
   * Notify authentication state change
   */
  notifyAuthChange(isAuthenticated) {
    window.dispatchEvent(new CustomEvent('authChanged', {
      detail: {
        isAuthenticated,
        user: this.currentUser
      }
    }));
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    if (!this.authToken) return true;

    try {
      // Decode JWT token (basic check)
      const payload = JSON.parse(atob(this.authToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Auto-refresh token if needed
   */
  async ensureValidToken() {
    if (this.isTokenExpired()) {
      return await this.refreshAuthToken();
    }
    return true;
  }

  /**
   * Update user profile
   */
  updateUserProfile(userData) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...userData };
      localStorage.setItem('userData', JSON.stringify(this.currentUser));
      
      this.notifyAuthChange(true);
    }
  }

  /**
   * Check user permissions
   */
  hasPermission(permission) {
    if (!this.currentUser) return false;
    
    // Basic role-based permissions
    const userRole = this.currentUser.role;
    
    const permissions = {
      admin: ['*'], // Admin has all permissions
      client: ['view_projects', 'upload_files', 'send_messages', 'make_payments'],
      viewer: ['view_projects']
    };

    const userPermissions = permissions[userRole] || [];
    
    return userPermissions.includes('*') || userPermissions.includes(permission);
  }
}

// Create global instance
window.AuthService = AuthService;
window.authService = new AuthService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthService;
}