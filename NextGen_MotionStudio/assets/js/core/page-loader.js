/**
 * MotionStudio Core - Dynamic Page Loader & Combiner
 * Dynamically fetches and mounts dedicated page files into index.html shell.
 * Architecture Reference: NextGen • Developed by A.K.Antal
 */

import { $, $$ } from '../utils/dom.js';
import { scrollReveal, animateCounter } from '../utils/animation.js';
import { pricingController } from '../components/pricing.js';
import { PAGE_PATHS, PAGE_TITLES } from '../pages/registry.js';

class PageLoader {
  constructor() {
    this.mountTarget = null;
    this.pageCache = new Map();
    this.currentPage = null;
  }

  init() {
    this.mountTarget = $('#page-mount');
  }

  async load(pageName) {
    if (!this.mountTarget) this.init();
    if (!this.mountTarget) return;

    // Direct studio workspace launch handler
    if (pageName === 'studio') {
      window.location.href = 'components/studio/studio.html';
      return;
    }

    const pagePath = PAGE_PATHS[pageName] || `./pages/${pageName}.html`;

    // 1. Check cache first
    if (this.pageCache.has(pageName)) {
      this.render(pageName, this.pageCache.get(pageName));
      return;
    }

    // 2. Fetch the clean page template
    try {
      const response = await fetch(`${pagePath}?t=${Date.now()}`, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Failed to load ${pagePath} (${response.status})`);
      }
      const rawHtml = await response.text();
      const cleanContent = this.extractContent(rawHtml);
      this.pageCache.set(pageName, cleanContent);
      this.render(pageName, cleanContent);
    } catch (err) {
      console.warn(`[PageLoader] Notice: Direct file fetch for "${pageName}"`, err);
      // Fallback: direct navigation if file protocol blocks fetch
      window.location.href = pagePath;
    }
  }

  extractContent(html) {
    // Strip standalone redirect scripts if present
    html = html.replace(/<script>[\s\S]*?<\/script>/gi, '').trim();

    // If the file was written as a full document, extract only the main content
    if (html.includes('<main') && html.includes('</main>')) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const mainEl = doc.querySelector('main');
      return mainEl ? mainEl.innerHTML : html;
    }
    return html;
  }

  render(pageName, html) {
    this.currentPage = pageName;
    this.mountTarget.innerHTML = html;

    // Update document title if defined
    if (PAGE_TITLES[pageName]) {
      document.title = PAGE_TITLES[pageName];
    }

    // Initialize page-specific interactivity
    this.initPageInteractivity(pageName);

    // Refresh scroll reveal animations for newly mounted elements
    scrollReveal.observeAll('.reveal');

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Dispatch event for any custom listeners
    window.dispatchEvent(new CustomEvent('motionstudio:page-loaded', { detail: { page: pageName } }));
  }

  initPageInteractivity(pageName) {
    // 1. Pricing Controller
    if (pageName === 'pricing' || $('.billing-switch') || $('.billing-toggle-wrapper')) {
      pricingController.init();
    }

    // 2. Showcase / Template Filter Chips
    const filterChips = $$('.filter-chip');
    if (filterChips.length > 0) {
      filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const filter = chip.getAttribute('data-filter');
          filterChips.forEach(c => {
            c.classList.remove('badge-accent', 'active');
            c.classList.add('badge-secondary');
          });
          chip.classList.add('badge-accent', 'active');
          chip.classList.remove('badge-secondary');

          const items = $$('.showcase-card, .template-card');
          items.forEach(item => {
            const cat = item.getAttribute('data-category');
            if (filter === 'all' || cat === filter) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }

    // 3. Stat Number Counters
    const counters = $$('[data-counter-target]');
    if (counters.length > 0) {
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
      }, { threshold: 0.2 });
      counters.forEach(el => observer.observe(el));
    }
  }
}

export const pageLoader = new PageLoader();
