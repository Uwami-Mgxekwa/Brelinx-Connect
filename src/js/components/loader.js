/**
 * Loader Component
 */
class Loader {
  constructor() {
    this.loader = null;
  }

  /**
   * Show loader
   * @param {string} message 
   */
  show(message = 'Loading...') {
    if (this.loader) {
      this.hide();
    }

    this.loader = document.createElement('div');
    this.loader.className = 'loader-overlay';
    this.loader.innerHTML = `
      <div class="loader-content">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        ${message ? `<p class="loader-message">${message}</p>` : ''}
      </div>
    `;

    document.body.appendChild(this.loader);
    
    // Trigger animation
    setTimeout(() => {
      this.loader.classList.add('show');
    }, 10);
  }

  /**
   * Hide loader
   */
  hide() {
    if (this.loader) {
      this.loader.classList.remove('show');
      setTimeout(() => {
        if (this.loader && this.loader.parentNode) {
          this.loader.parentNode.removeChild(this.loader);
        }
        this.loader = null;
      }, 300);
    }
  }
}

// Create singleton instance
const loader = new Loader();

// Make globally available
window.loader = loader;

// Add loader styles
const style = document.createElement('style');
style.textContent = `
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .loader-overlay.show {
    opacity: 1;
  }

  .loader-content {
    background: var(--color-white);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    box-shadow: var(--shadow-xl);
  }

  .loader-message {
    margin: 0;
    color: var(--ion-text-color);
    font-size: var(--font-size-base);
  }
`;
document.head.appendChild(style);

