/**
 * API Service
 * Base service for making HTTP requests
 */
class ApiService {
  constructor() {
    // This will be set from environment or config
    this.baseURL = 'https://api.brelinx.com'; // Change to your API URL
    this.token = Storage.get('authToken');
  }

  /**
   * Set authentication token
   * @param {string} token 
   */
  setToken(token) {
    this.token = token;
    if (token) {
      Storage.set('authToken', token);
    } else {
      Storage.remove('authToken');
    }
  }

  /**
   * Get authentication token
   * @returns {string|null}
   */
  getToken() {
    return this.token || Storage.get('authToken');
  }

  /**
   * Make HTTP request
   * @param {string} endpoint 
   * @param {object} options 
   * @returns {Promise<any>}
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle 401 Unauthorized - token expired
        if (response.status === 401) {
          this.handleUnauthorized();
          throw new Error('Unauthorized - Please login again');
        }

        throw new Error(data.message || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} endpoint 
   * @param {object} params 
   * @returns {Promise<any>}
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint 
   * @param {object} data 
   * @returns {Promise<any>}
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   * @param {string} endpoint 
   * @param {object} data 
   * @returns {Promise<any>}
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * PATCH request
   * @param {string} endpoint 
   * @param {object} data 
   * @returns {Promise<any>}
   */
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint 
   * @returns {Promise<any>}
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload file
   * @param {string} endpoint 
   * @param {FormData} formData 
   * @param {Function} onProgress 
   * @returns {Promise<any>}
   */
  async upload(endpoint, formData, onProgress = null) {
    const token = this.getToken();
    const url = `${this.baseURL}${endpoint}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', url);
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  /**
   * Handle unauthorized response
   */
  handleUnauthorized() {
    this.setToken(null);
    Storage.remove('authToken');
    Storage.remove('user');
    
    // Redirect to login
    if (window.router) {
      window.router.navigate('/auth/login');
    } else {
      window.location.hash = '#/auth/login';
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

