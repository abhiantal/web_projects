/**
 * MotionStudio - Master Application Entry Point
 * Orchestrates Theme Engine, Capsule Navbar, Tab Router, Dynamic Page Loader, Mobile Drawer, Animations, and Interactivity.
 * Architecture Reference: NextGen • Developed by A.K.Antal
 */

import { themeEngine } from './core/theme.js';
import { pageLoader } from './core/page-loader.js';
import { EventBus } from './core/events.js';
import { initNavbar } from './components/navbar.js';
import { initSidebar } from './components/sidebar.js';
import { tabController } from './components/tabs.js';
import { pricingController } from './components/pricing.js';
import { modalManager, openModal, closeModal } from './components/modal.js';
import { showToast } from './components/toast.js';
import { ScrollReveal, animateCounter } from './utils/animation.js';
import { $, $$, on } from './utils/dom.js';
import { MotionData } from './data/motion-data.js';

class MotionStudioApp {
  constructor() {
    this.theme = themeEngine;
    this.events = EventBus;
    this.toast = showToast;
    this.modal = modalManager;
    this.data = MotionData;
    this.tabController = tabController;
    this.pageLoader = pageLoader;
    this.pricing = pricingController;
  }

  init() {
    console.log('[MotionStudio] Initializing flagship application runtime...');

    // 1. Initialize Theme System
    this.theme.init();

    // 2. Initialize UI Navigation & Mobile Off-canvas Drawer
    this.navbar = initNavbar();
    this.sidebar = initSidebar();

    // 3. Initialize Tab Controller & Page Combiner
    this.tabController.init();

    // 4. Initialize Billing & Pricing Controller
    this.pricing.init();

    // 5. Initialize Scroll Reveals & Animations
    this.scrollReveal = new ScrollReveal({ threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    this.scrollReveal.observeAll('.reveal');

    // 6. Initialize Metric Stat Counters
    this.initCounters();

    // 7. Bind Global Interactive Actions
    this.bindActionTriggers();

    // 8. Notify readiness
    EventBus.emit('motionstudio:ready', { app: this });
    console.log('[MotionStudio] Runtime ready.');
  }

  initCounters() {
    const counterElements = $$('[data-counter-target]');
    if (counterElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter-target'), 10) || 0;
          const duration = parseInt(el.getAttribute('data-counter-duration'), 10) || 1600;
          const suffix = el.getAttribute('data-counter-suffix') || '';

          animateCounter(el, target, duration, (val) => `${val}${suffix}`);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  }

  bindActionTriggers() {
    // Bind template cards preview triggers
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.template-card, .showcase-card');
      if (card && !e.target.closest('a') && !e.target.closest('button')) {
        const title = card.querySelector('.card-title')?.textContent || 'Motion Project';
        showToast(`Previewing "${title}" preset...`, 'info', 2500);
      }
    });

    // Bind demo launch buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="launch-studio"]');
      if (btn) {
        e.preventDefault();
        showToast('Initializing MotionStudio GPU Engine...', 'success', 1800);
        setTimeout(() => {
          window.location.href = btn.getAttribute('href') || 'components/studio/studio.html';
        }, 400);
      }
    });

    // Bind copy pills
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-copy]');
      if (copyBtn) {
        const text = copyBtn.getAttribute('data-copy');
        if (text) {
          navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied ${text} to clipboard!`, 'success', 2200);
          }).catch(() => {
            showToast(`Email: ${text}`, 'info', 3000);
          });
        }
      }
    });

    // Bind Cockpit Simulation Tabs
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('[data-cockpit-tab]');
      if (tabBtn) {
        const targetTab = tabBtn.getAttribute('data-cockpit-tab');
        const allBtns = document.querySelectorAll('[data-cockpit-tab]');
        const allPanels = document.querySelectorAll('.cockpit-panel');

        allBtns.forEach(btn => {
          btn.classList.remove('active');
          btn.style.borderLeft = '1px solid var(--color-border)';
          btn.style.background = 'rgba(255, 255, 255, 0.02)';
          const badge = btn.querySelector('.badge');
          if (badge) {
            badge.className = 'badge badge-secondary';
            badge.textContent = btn.getAttribute('data-cockpit-tab') === 'devices' ? 'WebGL 2.0' :
                               btn.getAttribute('data-cockpit-tab') === 'audio' ? 'WebAudio API' : 'Sub-12ms';
          }
        });

        tabBtn.classList.add('active');
        tabBtn.style.borderLeft = '4px solid var(--color-accent-violet)';
        tabBtn.style.background = 'rgba(255, 255, 255, 0.04)';
        const activeBadge = tabBtn.querySelector('.badge');
        if (activeBadge) {
          activeBadge.className = 'badge badge-accent';
          activeBadge.textContent = 'Active';
        }

        allPanels.forEach(panel => {
          panel.style.display = panel.id === `panel-${targetTab}` ? 'block' : 'none';
        });
      }
    });

    // Bind contact / newsletter forms
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form[data-ajax-submit]');
      if (form) {
        e.preventDefault();
        showToast('Thank you! Your inquiry has been sent.', 'success', 3000);
        form.reset();
      }
    });
  }
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.motionStudioApp = new MotionStudioApp();
  window.motionStudioApp.init();
});

// Export helper objects for external scripts
export {
  themeEngine,
  EventBus,
  openModal,
  closeModal,
  showToast,
  MotionData,
  tabController,
  pageLoader,
  pricingController
};
