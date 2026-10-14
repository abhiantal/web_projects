/**
 * MotionStudio - Glassmorphic Modal Controller
 * Handles modal dialog opening, backdrop blur, keyboard dismissal, and data attribute bindings.
 */

import { $, $$, on } from '../utils/dom.js';
import { EventBus } from '../core/events.js';

export class ModalController {
  constructor() {
    this.activeModal = null;
    this.init();
  }

  init() {
    // Bind all opener buttons
    const openers = $$('[data-modal-target], [data-open-modal]');
    openers.forEach(btn => {
      const targetId = btn.getAttribute('data-modal-target') || btn.getAttribute('data-open-modal');
      if (targetId) {
        on(btn, 'click', (e) => {
          e.preventDefault();
          this.open(targetId.replace('#', ''));
        });
      }
    });

    // Delegate close clicks
    document.addEventListener('click', (e) => {
      // Clicked on close button or inside close button
      const closeBtn = e.target.closest('[data-modal-close], .modal-close-btn');
      if (closeBtn) {
        e.preventDefault();
        this.close();
        return;
      }

      // Clicked on modal overlay backdrop directly
      if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-overlay')) {
        this.close();
      }
    });

    // Escape key handling
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });

    // EventBus integrations
    EventBus.on('modal:open', (id) => this.open(id));
    EventBus.on('modal:close', () => this.close());
  }

  open(modalId) {
    const modal = $(`#${modalId}`);
    if (!modal) {
      console.warn(`[Modal] Element #${modalId} not found.`);
      return;
    }

    // If another modal is open, close it first
    if (this.activeModal) {
      this.close(false);
    }

    this.activeModal = modal;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first interactive element or modal container
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) {
      focusable.focus();
    }

    EventBus.emit('modal:opened', { id: modalId, element: modal });
  }

  close(restoreScroll = true) {
    if (!this.activeModal) return;

    const modal = this.activeModal;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    if (restoreScroll) {
      document.body.style.overflow = '';
    }

    const closedId = modal.id;
    this.activeModal = null;
    EventBus.emit('modal:closed', { id: closedId });
  }
}

export const modalManager = new ModalController();

export function openModal(id) {
  modalManager.open(id);
}

export function closeModal() {
  modalManager.close();
}
