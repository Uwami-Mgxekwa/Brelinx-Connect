/**
 * Authentication Page Handler
 */
class AuthPage {
  constructor() {
    this.init();
  }

  init() {
    const currentPath = window.location.hash.slice(1);
    
    if (currentPath === '/auth/login') {
      this.initLogin();
    } else if (currentPath === '/auth/register') {
      this.initRegister();
    } else if (currentPath === '/auth/reset-password') {
      this.initResetPassword();
    }
  }

  /**
   * Initialize login page
   */
  initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = form.querySelector('#email').value.trim();
      const password = form.querySelector('#password').value;
      const remember = form.querySelector('#remember').checked;

      // Validate form
      const validation = Validation.validateForm(form);
      if (!validation.valid) {
        Validation.showFormErrors(form, validation.errors);
        return;
      }

      // Show loading
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      try {
        const result = await authService.login(email, password, remember);
        
        if (result.success) {
          toast.show('Login successful!', 'success');
          setTimeout(() => {
            router.navigate('/dashboard');
          }, 500);
        } else {
          toast.show(result.error || 'Login failed', 'error');
        }
      } catch (error) {
        toast.show('An error occurred. Please try again.', 'error');
      } finally {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    // Social login handlers
    document.getElementById('google-login')?.addEventListener('click', () => {
      toast.show('Google login coming soon', 'info');
    });

    document.getElementById('apple-login')?.addEventListener('click', () => {
      toast.show('Apple login coming soon', 'info');
    });

    // Biometric login
    document.getElementById('biometric-btn')?.addEventListener('click', async () => {
      try {
        const result = await authService.authenticateBiometric();
        if (result.success) {
          router.navigate('/dashboard');
        }
      } catch (error) {
        toast.show('Biometric authentication failed', 'error');
      }
    });
  }

  /**
   * Initialize register page
   */
  initRegister() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        fullName: form.querySelector('#full-name').value.trim(),
        companyName: form.querySelector('#company-name').value.trim(),
        email: form.querySelector('#register-email').value.trim(),
        password: form.querySelector('#register-password').value
      };

      // Validate form
      const validation = Validation.validateForm(form);
      if (!validation.valid) {
        Validation.showFormErrors(form, validation.errors);
        return;
      }

      // Show loading
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      try {
        const result = await authService.register(formData);
        
        if (result.success) {
          toast.show('Registration successful!', 'success');
          setTimeout(() => {
            router.navigate('/dashboard');
          }, 500);
        } else {
          toast.show(result.error || 'Registration failed', 'error');
        }
      } catch (error) {
        toast.show('An error occurred. Please try again.', 'error');
      } finally {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    // Social register handlers
    document.getElementById('google-register')?.addEventListener('click', () => {
      toast.show('Google registration coming soon', 'info');
    });

    document.getElementById('apple-register')?.addEventListener('click', () => {
      toast.show('Apple registration coming soon', 'info');
    });
  }

  /**
   * Initialize reset password page
   */
  initResetPassword() {
    const form = document.getElementById('reset-password-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = form.querySelector('#reset-email').value.trim();

      // Validate form
      const validation = Validation.validateForm(form);
      if (!validation.valid) {
        Validation.showFormErrors(form, validation.errors);
        return;
      }

      // Show loading
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      try {
        const result = await authService.resetPassword(email);
        
        if (result.success) {
          toast.show(result.message || 'Password reset email sent!', 'success');
          setTimeout(() => {
            router.navigate('/auth/login');
          }, 2000);
        } else {
          toast.show(result.error || 'Failed to send reset email', 'error');
        }
      } catch (error) {
        toast.show('An error occurred. Please try again.', 'error');
      } finally {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AuthPage());
} else {
  new AuthPage();
}

