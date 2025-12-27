/**
 * Modal Component
 */
class Modal {
  constructor() {
    this.currentModal = null;
  }

  /**
   * Show modal
   * @param {string|HTMLElement} content 
   * @param {object} options 
   * @returns {HTMLElement}
   */
  show(content, options = {}) {
    // Close existing modal
    if (this.currentModal) {
      this.close();
    }

    const {
      title = '',
      size = 'medium',
      showClose = true,
      onClose = null
    } = options;

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    // Create modal
    const modal = document.createElement('div');
    modal.className = `modal modal-${size}`;

    // Modal header
    if (title || showClose) {
      const header = document.createElement('div');
      header.className = 'modal-header';
      
      if (title) {
        const titleEl = document.createElement('h2');
        titleEl.className = 'modal-title';
        titleEl.textContent = title;
        header.appendChild(titleEl);
      }
      
      if (showClose) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
        closeBtn.setAttribute('aria-label', 'Close modal');
        closeBtn.addEventListener('click', () => this.close());
        header.appendChild(closeBtn);
      }
      
      modal.appendChild(header);
    }

    // Modal body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }
    
    modal.appendChild(body);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Trigger animation
    setTimeout(() => {
      overlay.classList.add('open');
    }, 10);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });

    // Close on Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.close();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    this.currentModal = {
      overlay,
      onClose
    };

    return modal;
  }

  /**
   * Close modal
   */
  close() {
    if (this.currentModal) {
      const { overlay, onClose } = this.currentModal;
      overlay.classList.remove('open');
      
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        if (onClose) {
          onClose();
        }
      }, 300);
      
      this.currentModal = null;
    }
  }

  /**
   * Show alert modal
   * @param {string} message 
   * @param {string} type 
   * @param {string} title 
   */
  alert(message, type = 'info', title = '') {
    const iconMap = {
      success: 'checkmark-circle',
      error: 'close-circle',
      warning: 'warning',
      info: 'information-circle'
    };

    const content = `
      <div class="alert-modal">
        <ion-icon name="${iconMap[type] || iconMap.info}" class="alert-icon ${type}" style="font-size: 48px;"></ion-icon>
        <p class="alert-message">${message}</p>
      </div>
    `;

    const modal = this.show(content, {
      title: title || type.charAt(0).toUpperCase() + type.slice(1),
      size: 'small'
    });

    // Add footer with OK button
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.innerHTML = '<button class="btn btn-primary btn-block" onclick="window.modal.close()">OK</button>';
    modal.appendChild(footer);

    return modal;
  }

  /**
   * Show confirm modal
   * @param {string} message 
   * @param {string} title 
   * @returns {Promise<boolean>}
   */
  confirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
      const content = `<p class="alert-message">${message}</p>`;
      
      const modal = this.show(content, {
        title,
        size: 'small',
        onClose: () => resolve(false)
      });

      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      footer.innerHTML = `
        <button class="btn btn-outline" onclick="window.modal.close(); window.modalConfirmResolve(false)">Cancel</button>
        <button class="btn btn-primary" onclick="window.modal.close(); window.modalConfirmResolve(true)">Confirm</button>
      `;
      modal.appendChild(footer);

      window.modalConfirmResolve = resolve;
    });
  }
}

// Create singleton instance
const modal = new Modal();

// Make globally available
window.modal = modal;

