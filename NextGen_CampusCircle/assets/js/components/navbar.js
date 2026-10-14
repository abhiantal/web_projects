/**
 * CampusCircle Component - Navbar Controller
 * Controls sticky glass transition, mobile hamburger toggle, and drawer animations.
 */

import { $, $$ } from '../utils/dom.js';

class NavbarController {
  constructor() {
    this.navbar = null;
    this.hamburgerBtn = null;
    this.mobileDrawer = null;
    this.drawerBackdrop = null;
    this.isOpen = false;
  }

  init() {
    this.navbar = $('.navbar');
    this.hamburgerBtn = $('.hamburger-btn');
    this.mobileDrawer = $('.mobile-drawer');
    this.drawerBackdrop = $('.mobile-drawer-backdrop');

    this.bindScroll();
    this.bindMobileDrawer();
  }

  bindScroll() {
    if (!this.navbar) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  bindMobileDrawer() {
    if (!this.hamburgerBtn || !this.mobileDrawer) return;

    this.hamburgerBtn.addEventListener('click', () => {
      this.toggleDrawer();
    });

    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', () => {
        this.closeDrawer();
      });
    }

    // Close drawer when any mobile nav link is clicked
    $$('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeDrawer();
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeDrawer();
      }
    });
  }

  toggleDrawer() {
    if (this.isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  openDrawer() {
    this.isOpen = true;
    this.hamburgerBtn.classList.add('is-active');
    this.hamburgerBtn.setAttribute('aria-expanded', 'true');
    this.mobileDrawer.classList.add('is-open');
    if (this.drawerBackdrop) {
      this.drawerBackdrop.classList.add('is-open');
    }
    document.body.style.overflow = 'hidden';
  }

  closeDrawer() {
    this.isOpen = false;
    if (this.hamburgerBtn) {
      this.hamburgerBtn.classList.remove('is-active');
      this.hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    if (this.mobileDrawer) {
      this.mobileDrawer.classList.remove('is-open');
    }
    if (this.drawerBackdrop) {
      this.drawerBackdrop.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  }
}

export const navbarController = new NavbarController();
