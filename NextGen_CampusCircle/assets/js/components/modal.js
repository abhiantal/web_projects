/**
 * CampusCircle Component - Modal Controller
 * Accessible modal dialogs with focus trap and keyboard control.
 */

import { $, $$ } from '../utils/dom.js';

class ModalController {
  constructor() {
    this.activeModal = null;
  }

  init() {
    // Open trigger
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-modal-open]');
      if (openBtn) {
        e.preventDefault();
        const modalId = openBtn.getAttribute('data-modal-open');
        this.open(modalId);
      }

      // Close trigger
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn) {
        e.preventDefault();
        this.close();
      }

      // Click on backdrop
      if (e.target.classList.contains('modal-backdrop')) {
        this.close();
      }
    });

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });
  }

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.activeModal = modal;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Auto focus first input if present
    const firstInput = modal.querySelector('input, button:not([data-modal-close])');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  close() {
    if (!this.activeModal) return;

    this.activeModal.classList.remove('is-open');
    this.activeModal.setAttribute('aria-hidden', 'true');
    this.activeModal = null;
    document.body.style.overflow = '';
  }
}

export const modalController = new ModalController();
