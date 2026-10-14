/**
 * CampusCircle Component - Toast Notification Controller
 * Cyber toast alerts with automatic timer dismiss and manual controls.
 */

import { createElement } from '../utils/dom.js';

class ToastManager {
  constructor() {
    this.container = null;
  }

  ensureContainer() {
    if (!this.container || !document.body.contains(this.container)) {
      this.container = createElement('div', { className: 'toast-container', 'aria-live': 'polite' });
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 3500) {
    this.ensureContainer();

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };

    const toast = createElement(
      'div',
      { className: `toast toast-${type}` },
      createElement('span', { className: 'toast-icon' }, icons[type] || 'ℹ'),
      createElement('span', { className: 'toast-message' }, message)
    );

    this.container.appendChild(toast);

    // Auto dismiss
    const timer = setTimeout(() => {
      this.dismiss(toast);
    }, duration);

    toast.addEventListener('click', () => {
      clearTimeout(timer);
      this.dismiss(toast);
    });

    return toast;
  }

  success(msg, duration) { return this.show(msg, 'success', duration); }
  error(msg, duration) { return this.show(msg, 'error', duration); }
  info(msg, duration) { return this.show(msg, 'info', duration); }

  dismiss(toast) {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }
}

export const toast = new ToastManager();
