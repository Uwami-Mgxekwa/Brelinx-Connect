/**
 * Toast Notification Component
 */
class Toast {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Create toast container
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.setAttribute('aria-live', 'polite');
    this.container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(this.container);
  }

  /**
   * Show toast message
   * @param {string} message 
   * @param {string} type 
   * @param {number} duration 
   */
  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    const icon = this.getIcon(type);
    toast.innerHTML = `
      <div class="toast-content">
        ${icon ? `<ion-icon name="${icon}" class="toast-icon"></ion-icon>` : ''}
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close" aria-label="Close">
        <ion-icon name="close-outline"></ion-icon>
      </button>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove
    const timeout = setTimeout(() => {
      this.remove(toast);
    }, duration);

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(timeout);
      this.remove(toast);
    });

    return toast;
  }

  /**
   * Remove toast
   * @param {HTMLElement} toast 
   */
  remove(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  /**
   * Get icon for toast type
   * @param {string} type 
   * @returns {string}
   */
  getIcon(type) {
    const icons = {
      success: 'checkmark-circle-outline',
      error: 'close-circle-outline',
      warning: 'warning-outline',
      info: 'information-circle-outline'
    };
    return icons[type] || icons.info;
  }
}

// Create singleton instance
const toast = new Toast();

// Make globally available
window.toast = toast;

// Add toast styles
const style = document.createElement('style');
style.textContent = `
  .toast-container {
    position: fixed;
    top: calc(var(--spacing-md) + var(--safe-area-inset-top));
    right: var(--spacing-md);
    z-index: var(--z-toast);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    max-width: 400px;
    pointer-events: none;
  }

  .toast {
    background: var(--color-white);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    opacity: 0;
    transform: translateX(100%);
    transition: all var(--transition-base);
    pointer-events: all;
    border-left: 4px solid var(--ion-color-primary);
  }

  .toast.show {
    opacity: 1;
    transform: translateX(0);
  }

  .toast-success {
    border-left-color: var(--ion-color-success);
  }

  .toast-error {
    border-left-color: var(--ion-color-danger);
  }

  .toast-warning {
    border-left-color: var(--ion-color-warning);
  }

  .toast-info {
    border-left-color: var(--ion-color-info);
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
  }

  .toast-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .toast-success .toast-icon {
    color: var(--ion-color-success);
  }

  .toast-error .toast-icon {
    color: var(--ion-color-danger);
  }

  .toast-warning .toast-icon {
    color: var(--ion-color-warning);
  }

  .toast-info .toast-icon {
    color: var(--ion-color-info);
  }

  .toast-message {
    font-size: var(--font-size-sm);
    color: var(--ion-text-color);
  }

  .toast-close {
    background: none;
    border: none;
    color: var(--ion-text-color-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-round);
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .toast-close:hover {
    background: var(--color-light-gray);
    color: var(--ion-text-color);
  }

  @media (max-width: 575px) {
    .toast-container {
      left: var(--spacing-md);
      right: var(--spacing-md);
      max-width: 100%;
    }
  }
`;
document.head.appendChild(style);

