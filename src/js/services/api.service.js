/**
 * Brelinx Connect - API Service
 * Handles all API communications with the backend
 */

class ApiService {
  constructor() {
    this.baseURL = this.getBaseURL();
    this.timeout = 30000; // 30 seconds
    this.offlineQueue = [];
    
    this.setupInterceptors();
  }

  /**
   * Get base URL based on environment
   */
  getBaseURL() {
    // In production, this would be your actual API URL
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    return 'https://api.brelinx.com';
  }

  /**
   * Setup request/response interceptors
   */
  setupInterceptors() {
    // Add auth token to requests
    this.addAuthInterceptor();
    
    // Handle offline requests
    this.addOfflineInterceptor();
  }

  /**
   * Add authentication token to requests
   */
  addAuthInterceptor() {
    this.getAuthToken = () => {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    };
  }

  /**
   * Add offline request handling
   */
  addOfflineInterceptor() {
    this.isOnline = () => navigator.onLine;
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Request configuration
    const config = {
      method: 'GET',
      headers,
      ...options,
      signal: AbortSignal.timeout(this.timeout)
    };

    // Handle offline requests
    if (!this.isOnline() && config.method !== 'GET') {
      return this.queueOfflineRequest(url, config);
    }

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error, url, config);
    }
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(data.message || 'Request failed', response.status, data);
    }

    return {
      data,
      status: response.status,
      headers: response.headers
    };
  }

  /**
   * Handle API errors
   */
  async handleError(error, url, config) {
    console.error('API Error:', error);

    // Handle timeout
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }

    // Handle network errors
    if (!this.isOnline()) {
      if (config.method !== 'GET') {
        return this.queueOfflineRequest(url, config);
      }
      throw new ApiError('No internet connection', 0);
    }

    // Handle auth errors
    if (error.status === 401) {
      await this.handleAuthError();
    }

    throw error;
  }

  /**
   * Handle authentication errors
   */
  async handleAuthError() {
    // Try to refresh token
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      try {
        const response = await this.refreshAuthToken(refreshToken);
        localStorage.setItem('authToken', response.data.token);
        return;
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }

    // Clear auth data and redirect to login
    this.clearAuthData();
    window.dispatchEvent(new CustomEvent('authChanged', {
      detail: { isAuthenticated: false }
    }));
    
    if (window.router) {
      window.router.navigate('/auth/login');
    }
  }

  /**
   * Queue offline requests
   */
  queueOfflineRequest(url, config) {
    const request = {
      id: Date.now(),
      url,
      config,
      timestamp: new Date().toISOString()
    };

    this.offlineQueue.push(request);
    this.saveOfflineQueue();

    return Promise.resolve({
      data: { message: 'Request queued for when online' },
      status: 202,
      queued: true
    });
  }

  /**
   * Sync offline queue when online
   */
  async syncOfflineQueue() {
    if (!this.isOnline() || this.offlineQueue.length === 0) {
      return;
    }

    console.log(`Syncing ${this.offlineQueue.length} offline requests...`);

    const results = [];
    const failedRequests = [];

    for (const request of this.offlineQueue) {
      try {
        const response = await fetch(request.url, request.config);
        const result = await this.handleResponse(response);
        results.push({ request, result, success: true });
      } catch (error) {
        console.error('Offline sync failed for request:', request, error);
        failedRequests.push(request);
        results.push({ request, error, success: false });
      }
    }

    // Keep failed requests in queue
    this.offlineQueue = failedRequests;
    this.saveOfflineQueue();

    return results;
  }

  /**
   * Save offline queue to storage
   */
  saveOfflineQueue() {
    localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
  }

  /**
   * Load offline queue from storage
   */
  loadOfflineQueue() {
    const queue = localStorage.getItem('offlineQueue');
    if (queue) {
      this.offlineQueue = JSON.parse(queue);
    }
  }

  /**
   * Clear auth data
   */
  clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
  }

  // ===== HTTP METHODS =====

  /**
   * GET request
   */
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * PATCH request
   */
  patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload file
   */
  upload(endpoint, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      }
    });
  }

  // ===== AUTH ENDPOINTS =====

  /**
   * Login user
   */
  login(credentials) {
    return this.post('/auth/login', credentials);
  }

  /**
   * Register user
   */
  register(userData) {
    return this.post('/auth/register', userData);
  }

  /**
   * Refresh auth token
   */
  refreshAuthToken(refreshToken) {
    return this.post('/auth/refresh', { refreshToken });
  }

  /**
   * Logout user
   */
  logout() {
    return this.post('/auth/logout');
  }

  /**
   * Reset password
   */
  resetPassword(email) {
    return this.post('/auth/reset-password', { email });
  }

  // ===== PROJECT ENDPOINTS =====

  /**
   * Get user projects
   */
  getProjects() {
    return this.get('/projects');
  }

  /**
   * Get project by ID
   */
  getProject(id) {
    return this.get(`/projects/${id}`);
  }

  /**
   * Get project milestones
   */
  getProjectMilestones(projectId) {
    return this.get(`/projects/${projectId}/milestones`);
  }

  // ===== CHAT ENDPOINTS =====

  /**
   * Get conversations
   */
  getConversations() {
    return this.get('/conversations');
  }

  /**
   * Get messages for conversation
   */
  getMessages(conversationId, page = 1) {
    return this.get(`/conversations/${conversationId}/messages`, { page });
  }

  /**
   * Send message
   */
  sendMessage(conversationId, content, attachments = []) {
    return this.post(`/conversations/${conversationId}/messages`, {
      content,
      attachments
    });
  }

  // ===== FILE ENDPOINTS =====

  /**
   * Get project files
   */
  getFiles(projectId) {
    return this.get(`/files/${projectId}`);
  }

  /**
   * Upload file
   */
  uploadFile(projectId, file, onProgress) {
    return this.upload(`/files/upload?projectId=${projectId}`, file, onProgress);
  }

  /**
   * Download file
   */
  downloadFile(fileId) {
    return this.get(`/files/download/${fileId}`);
  }

  /**
   * Approve file
   */
  approveFile(fileId, approved) {
    return this.patch(`/files/${fileId}/approve`, { approved });
  }

  // ===== PAYMENT ENDPOINTS =====

  /**
   * Get invoices
   */
  getInvoices() {
    return this.get('/invoices');
  }

  /**
   * Get invoice by ID
   */
  getInvoice(id) {
    return this.get(`/invoices/${id}`);
  }

  /**
   * Process payment
   */
  processPayment(invoiceId, paymentData) {
    return this.post('/payments/process', {
      invoiceId,
      ...paymentData
    });
  }

  /**
   * Get payment history
   */
  getPaymentHistory() {
    return this.get('/payments/history');
  }

  // ===== MEETING ENDPOINTS =====

  /**
   * Get meetings
   */
  getMeetings() {
    return this.get('/meetings');
  }

  /**
   * Schedule meeting
   */
  scheduleMeeting(meetingData) {
    return this.post('/meetings/schedule', meetingData);
  }

  // ===== FEEDBACK ENDPOINTS =====

  /**
   * Submit feedback
   */
  submitFeedback(feedbackData) {
    return this.post('/feedback', feedbackData);
  }

  /**
   * Get project feedback
   */
  getProjectFeedback(projectId) {
    return this.get(`/feedback/${projectId}`);
  }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create global instance
window.ApiService = ApiService;
window.apiService = new ApiService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ApiService, ApiError };
}