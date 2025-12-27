/**
 * Brelinx Connect - Modal Component
 * Modal dialogs and overlays
 */

class Modal {
  constructor() {
    this.modals = new Map();
    this.activeModals = [];
  }

  /**
   * Show modal
   */
  show(content, options = {}) {
    const config = {
      title: '',
      size: 'medium',
      closable: true,
      backdrop: true,
      keyboard: true,
      ...options
    };

    const modalId = this.generateId();
    const modal = this.createModal(modalId, content, config);
    
    document.body.appendChild(modal);
    this.modals.set(modalId, { element: modal, config });
    this.activeModals.push(modalId);

    // Animate in
    setTimeout(() => {
      modal.classList.add('modal-show');
    }, 50);

    // Handle keyboard events
    if (config.keyboard) {
      this.handleKeyboard(modalId);
    }

    return modalId;
  }

  /**
   * Hide modal
   */
  hide(modalId) {
    const modalData = this.modals.get(modalId);
    if (modalData) {
      const { element } = modalData;
      
      element.classList.add('modal-hide');
      
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        this.modals.delete(modalId);
        
        // Remove from active modals
        const index = this.activeModals.indexOf(modalId);
        if (index > -1) {
          this.activeModals.splice(index, 1);
        }
      }, 300);
    }
  }

  /**
   * Hide all modals
   */
  hideAll() {
    [...this.activeModals].forEach(id => this.hide(id));
  }

  /**
   * Show confirmation dialog
   */
  confirm(message, options = {}) {
    return new Promise((resolve) => {
      const config = {
        title: 'Confirm',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        confirmClass: 'btn-primary',
        ...options
      };

      const content = `
        <div class="modal-confirm">
          <p class="confirm-message">${message}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" data-action="cancel">${config.cancelText}</button>
            <button class="btn ${config.confirmClass}" data-action="confirm">${config.confirmText}</button>
          </div>
        </div>
      `;

      const modalId = this.show(content, {
        title: config.title,
        size: 'small',
        closable: false
      });

      // Handle button clicks
      const modal = document.getElementById(modalId);
      modal.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action) {
          this.hide(modalId);
          resolve(action === 'confirm');
        }
      });
    });
  }

  /**
   * Show alert dialog
   */
  alert(message, options = {}) {
    return new Promise((resolve) => {
      const config = {
        title: 'Alert',
        buttonText: 'OK',
        ...options
      };

      const content = `
        <div class="modal-alert">
          <p class="alert-message">${message}</p>
          <div class="alert-actions">
            <button class="btn btn-primary" data-action="ok">${config.buttonText}</button>
          </div>
        </div>
      `;

      const modalId = this.show(content, {
        title: config.title,
        size: 'small',
        closable: false
      });

      // Handle button click
      const modal = document.getElementById(modalId);
      modal.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'ok') {
          this.hide(modalId);
          resolve();
        }
      });
    });
  }

  /**
   * Create modal element
   */
  createModal(id, content, config) {
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = `modal modal-${config.size}`;
    
    modal.innerHTML = `
      <div class="modal-backdrop" ${config.backdrop ? 'data-dismiss="modal"' : ''}></div>
      <div class="modal-dialog">
        <div class="modal-content">
          ${config.title ? `
            <div class="modal-header">
              <h3 class="modal-title">${config.title}</h3>
              ${config.closable ? '<button class="modal-close" data-dismiss="modal"><ion-icon name="close"></ion-icon></button>' : ''}
            </div>
          ` : ''}
          <div class="modal-body">
            ${content}
          </div>
        </div>
      </div>
    `;

    // Handle dismiss events
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.dismiss === 'modal') {
        this.hide(id);
      }
    });

    return modal;
  }

  /**
   * Handle keyboard events
   */
  handleKeyboard(modalId) {
    const handler = (e) => {
      if (e.key === 'Escape' && this.activeModals[this.activeModals.length - 1] === modalId) {
        this.hide(modalId);
        document.removeEventListener('keydown', handler);
      }
    };

    document.addEventListener('keydown', handler);
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Add CSS styles
const modalStyles = `
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .modal-show {
    opacity: 1;
    visibility: visible;
  }

  .modal-hide {
    opacity: 0;
    visibility: hidden;
  }

  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .modal-dialog {
    position: relative;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    margin: 20px;
    transform: scale(0.9);
    transition: transform 0.3s ease;
  }

  .modal-show .modal-dialog {
    transform: scale(1);
  }

  .modal-small .modal-dialog {
    max-width: 400px;
  }

  .modal-medium .modal-dialog {
    max-width: 600px;
  }

  .modal-large .modal-dialog {
    max-width: 800px;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--dark-gray, #1f2937);
  }

  .modal-close {
    background: none;
    border: none;
    color: var(--neutral-gray, #6b7280);
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.15s ease;
  }

  .modal-close:hover {
    background: var(--light-gray, #f3f4f6);
    color: var(--dark-gray, #1f2937);
  }

  .modal-body {
    padding: 24px;
  }

  .modal-confirm,
  .modal-alert {
    text-align: center;
  }

  .confirm-message,
  .alert-message {
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 1.5;
    color: var(--dark-gray, #1f2937);
  }

  .confirm-actions,
  .alert-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .confirm-actions .btn,
  .alert-actions .btn {
    min-width: 100px;
  }

  @media (max-width: 480px) {
    .modal-dialog {
      margin: 10px;
    }

    .modal-header,
    .modal-body {
      padding: 16px;
    }

    .confirm-actions,
    .alert-actions {
      flex-direction: column;
    }

    .confirm-actions .btn,
    .alert-actions .btn {
      width: 100%;
    }
  }
`;

// Inject styles
if (!document.getElementById('modal-styles')) {
  const style = document.createElement('style');
  style.id = 'modal-styles';
  style.textContent = modalStyles;
  document.head.appendChild(style);
}

// Create global instance
window.Modal = Modal;
window.modal = new Modal();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Modal;
}