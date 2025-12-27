/**
 * Brelinx Connect - Loader Component
 * Loading indicators and spinners
 */

class Loader {
  constructor() {
    this.activeLoaders = new Set();
  }

  /**
   * Show loading spinner
   */
  show(target = 'body', options = {}) {
    const config = {
      size: 'medium',
      color: 'primary',
      overlay: true,
      text: '',
      ...options
    };

    const loaderId = this.generateId();
    const loader = this.createLoader(loaderId, config);
    
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (targetElement) {
      targetElement.appendChild(loader);
      this.activeLoaders.add(loaderId);
    }

    return loaderId;
  }

  /**
   * Hide loading spinner
   */
  hide(loaderId) {
    const loader = document.getElementById(loaderId);
    if (loader) {
      loader.remove();
      this.activeLoaders.delete(loaderId);
    }
  }

  /**
   * Hide all loaders
   */
  hideAll() {
    this.activeLoaders.forEach(id => this.hide(id));
  }

  /**
   * Create loader element
   */
  createLoader(id, config) {
    const loader = document.createElement('div');
    loader.id = id;
    loader.className = `loader-container ${config.overlay ? 'loader-overlay' : ''}`;
    
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner loader-${config.size} loader-${config.color}"></div>
        ${config.text ? `<div class="loader-text">${config.text}</div>` : ''}
      </div>
    `;

    return loader;
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `loader_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Add CSS styles
const loaderStyles = `
  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .loader-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .loader-spinner {
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--primary);
    animation: spin 1s linear infinite;
  }

  .loader-small {
    width: 16px;
    height: 16px;
  }

  .loader-medium {
    width: 24px;
    height: 24px;
  }

  .loader-large {
    width: 32px;
    height: 32px;
  }

  .loader-primary {
    border-top-color: var(--primary);
  }

  .loader-white {
    border-color: rgba(255, 255, 255, 0.3);
    border-top-color: white;
  }

  .loader-text {
    color: white;
    font-size: 14px;
    font-weight: 500;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject styles
if (!document.getElementById('loader-styles')) {
  const style = document.createElement('style');
  style.id = 'loader-styles';
  style.textContent = loaderStyles;
  document.head.appendChild(style);
}

// Create global instance
window.Loader = Loader;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Loader;
}