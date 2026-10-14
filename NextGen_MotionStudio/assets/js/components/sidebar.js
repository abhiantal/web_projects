/**
 * MotionStudio - Off-Canvas Sidebar Controller
 * Controls responsive mobile navigation drawer, backdrop, and accessibility.
 */

import { $, $$, on } from '../utils/dom.js';
import { EventBus } from '../core/events.js';

export class SidebarController {
  constructor() {
    this.sidebar = $('#mobileSidebar') || $('.sidebar-drawer') || $('.mobile-drawer');
    this.backdrop = $('#sidebarBackdrop') || $('.sidebar-backdrop') || $('.mobile-drawer-backdrop');
    this.closeBtn = $('#sidebarCloseBtn') || $('.sidebar-close-btn') || $('.ms-sidebar-close');
    this.navLinks = $$('.sidebar-nav-link, .mobile-nav-link');
    this.triggers = $$('.mobile-toggle-btn, .hamburger-btn, #mobileNavToggle');
    this.isOpen = false;

    this.init();
  }

  init() {
    if (!this.sidebar) return;

    // Listen to EventBus triggers
    EventBus.on('sidebar:toggle', () => this.toggle());
    EventBus.on('sidebar:open', () => this.open());
    EventBus.on('sidebar:close', () => this.close());

    // Trigger buttons
    this.triggers.forEach(btn => {
      on(btn, 'click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    });

    // Backdrop click
    if (this.backdrop) {
      on(this.backdrop, 'click', () => this.close());
    }

    // Close button click
    if (this.closeBtn) {
      on(this.closeBtn, 'click', () => this.close());
    }

    // Auto-close on nav link click
    this.navLinks.forEach(link => {
      on(link, 'click', () => this.close());
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Expose global helper
    window.toggleSidebar = () => this.toggle();
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.sidebar.classList.add('active');
    this.sidebar.classList.add('is-open');
    if (this.backdrop) {
      this.backdrop.classList.add('active');
      this.backdrop.classList.add('is-open');
    }
    document.body.style.overflow = 'hidden';
    EventBus.emit('sidebar:opened');
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.sidebar.classList.remove('active');
    this.sidebar.classList.remove('is-open');
    if (this.backdrop) {
      this.backdrop.classList.remove('active');
      this.backdrop.classList.remove('is-open');
    }
    document.body.style.overflow = '';
    EventBus.emit('sidebar:closed');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

export function initSidebar() {
  return new SidebarController();
}
