/**
 * Authentication Service
 */
class AuthService {
  constructor() {
    this.api = apiService;
  }

  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @param {boolean} remember 
   * @returns {Promise<object>}
   */
  async login(email, password, remember = false) {
    try {
      const response = await this.api.post('/api/auth/login', {
        email,
        password
      });

      if (response.token) {
        this.api.setToken(response.token);
        Storage.set('user', response.user);
        
        if (response.refreshToken) {
          Storage.set('refreshToken', response.refreshToken);
        }

        return {
          success: true,
          user: response.user,
          token: response.token
        };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed. Please check your credentials.'
      };
    }
  }

  /**
   * Register user
   * @param {object} userData 
   * @returns {Promise<object>}
   */
  async register(userData) {
    try {
      const response = await this.api.post('/api/auth/register', userData);

      if (response.token) {
        this.api.setToken(response.token);
        Storage.set('user', response.user);
        
        if (response.refreshToken) {
          Storage.set('refreshToken', response.refreshToken);
        }

        return {
          success: true,
          user: response.user,
          token: response.token
        };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed. Please try again.'
      };
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await this.api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.api.setToken(null);
      Storage.remove('authToken');
      Storage.remove('refreshToken');
      Storage.remove('user');
    }
  }

  /**
   * Reset password
   * @param {string} email 
   * @returns {Promise<object>}
   */
  async resetPassword(email) {
    try {
      const response = await this.api.post('/api/auth/reset-password', { email });
      return {
        success: true,
        message: response.message || 'Password reset email sent'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send reset email'
      };
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.api.getToken();
    const user = Storage.get('user');
    return !!(token && user);
  }

  /**
   * Get current user
   * @returns {object|null}
   */
  getCurrentUser() {
    return Storage.get('user');
  }

  /**
   * Refresh authentication token
   * @returns {Promise<boolean>}
   */
  async refreshToken() {
    try {
      const refreshToken = Storage.get('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.api.post('/api/auth/refresh-token', {
        refreshToken
      });

      if (response.token) {
        this.api.setToken(response.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Check biometric availability
   * @returns {Promise<boolean>}
   */
  async checkBiometric() {
    // This will be implemented with Capacitor Biometric plugin
    return false;
  }

  /**
   * Authenticate with biometric
   * @returns {Promise<object>}
   */
  async authenticateBiometric() {
    // This will be implemented with Capacitor Biometric plugin
    throw new Error('Biometric authentication not implemented');
  }
}

// Create singleton instance
const authService = new AuthService();

