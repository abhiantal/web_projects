/**
 * MotionStudio Component - Tab Navigation Router & Combiner
 * Synchronizes tabs, URL hashes, desktop navbar, mobile drawer, and mounts separate page files.
 * NextGen • Developed by A.K.Antal
 */

import { $, $$ } from '../utils/dom.js';
import { pageLoader } from '../core/page-loader.js';
import { PAGE_PATHS } from '../pages/registry.js';

export class TabController {
  constructor() {
    this.primaryTabs = ['home', 'studio', 'features', 'showcase', 'templates', 'pricing', 'docs', 'terms'];
    this.currentRoute = 'home';
    this.navLinks = $$('[data-tab-target]');
  }

  init() {
    // 1. Resolve initial route from URL hash (e.g. #features, #showcase) or default to 'home'
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const initialRoute = this.isValidRoute(hash) ? hash : 'home';

    if (hash && hash !== 'home') {
      this.navigate(initialRoute, false);
    }

    // 2. Listen to tab click triggers
    document.addEventListener('click', (e) => {
      const tabTrigger = e.target.closest('[data-tab-target]');
      if (tabTrigger) {
        const target = tabTrigger.getAttribute('data-tab-target');
        if (target && this.isValidRoute(target)) {
          e.preventDefault();
          this.navigate(target, true);
        }
      }
    });

    // 3. Listen to browser forward/backward navigation
    window.addEventListener('hashchange', () => {
      const currentHash = window.location.hash.replace('#', '').toLowerCase();
      if (this.isValidRoute(currentHash) && currentHash !== this.currentRoute) {
        this.navigate(currentHash, false);
      }
    });
  }

  isValidRoute(route) {
    if (!route) return false;
    return this.primaryTabs.includes(route) || (route in PAGE_PATHS);
  }

  navigate(route, updateHash = true) {
    if (!this.isValidRoute(route)) return;
    this.currentRoute = route;

    // 1. Dynamically load and combine the page file into the mount container
    pageLoader.load(route);

    // 2. Update Nav Link Active States (Desktop & Mobile)
    this.navLinks = $$('[data-tab-target]');
    this.navLinks.forEach(link => {
      if (link.getAttribute('data-tab-target') === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 3. Update URL Hash
    if (updateHash) {
      history.pushState(null, '', `#${route}`);
    }

    // 4. Dispatch custom event for sub-components
    window.dispatchEvent(new CustomEvent('motionstudio:tab-changed', {
      detail: { route }
    }));
  }
}

export const tabController = new TabController();
