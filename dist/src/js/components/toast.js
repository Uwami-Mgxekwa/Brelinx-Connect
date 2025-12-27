/**
 * Brelinx Connect - Toast Component
 * Toast notifications for user feedback
 */

class Toast {
  constructor() {
    this.toasts = new Map();
    this.container = this.createContainer();
  }

  /**
   * Show toast notification
   */
  show(message, type = 'info', options = {}) {
    const config = {
      duration: 4000,
      position: 'top-right',
      closable: true,
      ...options
    };

    const toastId = this.generateId();
    const toast = this.createToast(toastId, message, type, config);
    
    this.container.appendChild(toast);
    this.toasts.set(toastId, { element: toast, config });

    // Animate in
    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 100);

    // Auto-hide
    if (config.duration > 0) {
      setTimeout(() => {
        this.hide(toastId);
      }, config.duration);
    }

    return toastId;
  }

  /**
   * Hide toast
   */
  hide(toastId) {
    const toastData = this.toasts.get(toastId);
    if (toastData) {
      const { element } = toastData;
      
      element.classList.add('toast-hide');
      
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        this.toasts.delete(toastId);
      }, 300);
    }
  }

  /**
   * Hide all toasts
   */
  hideAll() {
    this.toasts.forEach((_, id) => this.hide(id));
  }

  /**
   * Show success toast
   */
  success(message, options = {}) {
    return this.show(message, 'success', options);
  }

  /**
   * Show error toast
   */
  error(message, options = {}) {
    return this.show(message, 'error', { duration: 6000, ...options });
  }

  /**
   * Show warning toast
   */
  warning(message, options = {}) {
    return this.show(message, 'warning', options);
  }

  /**
   * Show info toast
   */
  info(message, options = {}) {
    return this.show(message, 'info', options);
  }

  /**
   * Create toast container
   */
  createContainer() {
    let container = document.getElementById('toast-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    return container;
  }

  /**
   * Create toast element
   */
  createToast(id, message, type, config) {
    const toast = document.createElement('div');
    toast.id = id;
    toast.className = `toast toast-${type}`;
    
    const icon = this.getIcon(type);
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          <ion-icon name="${icon}"></ion-icon>
        </div>
        <div class="toast-message">${message}</div>
        ${config.closable ? '<button class="toast-close" onclick="window.toast?.hide(\'' + id + '\')"><ion-icon name="close"></ion-icon></button>' : ''}
      </div>
    `;

    return toast;
  }

  /**
   * Get icon for toast type
   */
  getIcon(type) {
    const icons = {
      success: 'checkmark-circle',
      error: 'alert-circle',
      warning: 'warning',
      info: 'information-circle'
    };
    return icons[type] || icons.info;
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Add CSS styles
const toastStyles = `
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 400px;
  }

  .toast {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-left: 4px solid;
    transform: translateX(100%);
    transition: all 0.3s ease;
    opacity: 0;
  }

  .toast-show {
    transform: translateX(0);
    opacity: 1;
  }

  .toast-hide {
    transform: translateX(100%);
    opacity: 0;
  }

  .toast-success {
    border-left-color: var(--success, #10b981);
  }

  .toast-error {
    border-left-color: var(--error, #ef4444);
  }

  .toast-warning {
    border-left-color: var(--warning, #f59e0b);
  }

  .toast-info {
    border-left-color: var(--info, #3b82f6);
  }

  .toast-content {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
  }

  .toast-icon {
    flex-shrink: 0;
  }

  .toast-success .toast-icon {
    color: var(--success, #10b981);
  }

  .toast-error .toast-icon {
    color: var(--error, #ef4444);
  }

  .toast-warning .toast-icon {
    color: var(--warning, #f59e0b);
  }

  .toast-info .toast-icon {
    color: var(--info, #3b82f6);
  }

  .toast-message {
    flex: 1;
    font-size: 14px;
    line-height: 1.4;
    color: var(--dark-gray, #1f2937);
  }

  .toast-close {
    background: none;
    border: none;
    color: var(--neutral-gray, #6b7280);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .toast-close:hover {
    background: var(--light-gray, #f3f4f6);
    color: var(--dark-gray, #1f2937);
  }

  @media (max-width: 480px) {
    .toast-container {
      top: 10px;
      right: 10px;
      left: 10px;
      max-width: none;
    }
  }
`;

// Inject styles
if (!document.getElementById('toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = toastStyles;
  document.head.appendChild(style);
}

// Create global instance
window.Toast = Toast;
window.toast = new Toast();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Toast;
}