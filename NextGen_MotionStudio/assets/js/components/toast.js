/**
 * MotionStudio - Glassmorphic Toast Notification Controller
 * Displays sleek floating status alerts with animated entry and auto-dismissal.
 */

import { EventBus } from '../core/events.js';

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    EventBus.on('toast:show', ({ message, type, duration }) => {
      this.show(message, type, duration);
    });
  }

  getOrCreateContainer() {
    if (!this.container || !document.body.contains(this.container)) {
      this.container = document.querySelector('.toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    }
    return this.container;
  }

  show(message, type = 'info', duration = 3500) {
    const container = this.getOrCreateContainer();

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    const icons = {
      success: '✓',
      info: 'ℹ',
      warning: '⚠',
      error: '✕'
    };

    const icon = icons[type] || '✦';

    toast.innerHTML = `
      <div class="toast-icon-wrap">${icon}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="Dismiss">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    const dismiss = () => {
      toast.classList.remove('visible');
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    };

    // Close button click
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', dismiss);
    }

    // Auto timeout
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }

    return toast;
  }
}

export const toast = new ToastManager();

export function showToast(message, type = 'info', duration = 3500) {
  return toast.show(message, type, duration);
}
