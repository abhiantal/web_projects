/**
 * MotionStudio - Navbar Component Controller
 * Handles sticky glassmorphism on scroll, active capsule pill tracking,
 * and mobile drawer triggers.
 */

import { $, $$, on } from '../utils/dom.js';
import { eventBus } from '../core/events.js';

export class NavbarController {
  constructor() {
    this.navbar = $('.navbar-wrapper') || $('.main-navbar');
    this.tabLinks = $$('.main-tab-link');
    this.mobileToggle = $('#mobileNavToggle') || $('.mobile-toggle-btn');
    this.scrollThreshold = 20;

    this.init();
  }

  init() {
    if (!this.navbar) return;

    this.bindScroll();
    this.bindTabPills();
    this.bindMobileToggle();
    this.highlightCurrentPage();
  }

  bindScroll() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > this.scrollThreshold;
          this.navbar.classList.toggle('scrolled', isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check on load
    if (window.scrollY > this.scrollThreshold) {
      this.navbar.classList.add('scrolled');
    }
  }

  bindTabPills() {
    if (!this.tabLinks || this.tabLinks.length === 0) return;

    this.tabLinks.forEach(link => {
      on(link, 'click', (e) => {
        // If this link is handled by data-tab-target router, let tab router handle it
        if (link.hasAttribute('data-tab-target')) {
          return;
        }

        const href = link.getAttribute('href');
        
        // If it's a pure in-page anchor without data-tab-target
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const target = $(href);
          if (target) {
            this.setActiveLink(link);
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', href);
          }
        }
      });
    });
  }

  setActiveLink(activeLink) {
    this.tabLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  highlightCurrentPage() {
    const currentPath = window.location.pathname.toLowerCase();
    
    this.tabLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPath = href.toLowerCase();
      if (
        (currentPath.endsWith('/') || currentPath.endsWith('index.html')) &&
        (linkPath === 'index.html' || linkPath === './' || linkPath === '/')
      ) {
        link.classList.add('active');
      } else if (linkPath !== '#' && currentPath.includes(linkPath.replace('../', '').replace('./', ''))) {
        link.classList.add('active');
      }
    });
  }

  bindMobileToggle() {
    if (!this.mobileToggle) return;

    on(this.mobileToggle, 'click', () => {
      eventBus.emit('sidebar:toggle');
    });
  }
}

export function initNavbar() {
  return new NavbarController();
}
