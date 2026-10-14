/**
 * CampusCircle Core - Page Loader & Dynamic Combiner
 * Dynamically fetches and mounts dedicated page templates into application shells.
 */

import { $ } from '../utils/dom.js';
import { scrollReveal, initCounters } from '../utils/animation.js';
import { homeController } from '../pages/home.js';
import { PAGE_PATHS, PAGE_TITLES } from '../pages/registry.js';

class PageLoader {
  constructor() {
    this.mountTarget = null;
    this.pageCache = new Map();
    this.currentPage = null;
  }

  init(mountSelector = '#page-mount') {
    this.mountTarget = $(mountSelector);
  }

  async load(pageName) {
    if (!this.mountTarget) this.init();
    if (!this.mountTarget) return;

    const pagePath = PAGE_PATHS[pageName] || `./pages/${pageName}.html`;

    // 1. Check cache first
    if (this.pageCache.has(pageName)) {
      this.render(pageName, this.pageCache.get(pageName));
      return;
    }

    // 2. Fetch page template
    try {
      const response = await fetch(`${pagePath}?t=${Date.now()}`, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Failed to load ${pagePath} (${response.status})`);
      }
      const html = await response.text();
      this.pageCache.set(pageName, html);
      this.render(pageName, html);
    } catch (err) {
      console.error(`[PageLoader] Error loading page "${pageName}":`, err);
      this.mountTarget.innerHTML = `
        <div class="container section text-center">
          <div class="card p-xl" style="max-width: 600px; margin: 0 auto;">
            <div class="badge badge-rose mb-sm">Template Notice</div>
            <h3>Unable to Load Page</h3>
            <p class="mb-md">
              Could not fetch <code>${pagePath}</code>. If running locally, please ensure viewing via local server.
            </p>
          </div>
        </div>
      `;
    }
  }

  render(pageName, html) {
    this.currentPage = pageName;
    this.mountTarget.innerHTML = html;

    // Update document title if defined
    if (PAGE_TITLES[pageName]) {
      document.title = PAGE_TITLES[pageName];
    }

    // Refresh scroll reveals and counters
    scrollReveal.init();
    initCounters();

    // Re-bind page-specific controllers
    if (pageName === 'home') {
      homeController.init();
    }

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export const pageLoader = new PageLoader();
