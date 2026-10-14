/**
 * CampusCircle Utilities - Animation & Scroll Observers
 * IntersectionObserver driven scroll reveals and animated counters.
 */

import { $$ } from './dom.js';

class ScrollRevealManager {
  constructor() {
    this.observer = null;
  }

  init() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    });

    $$('.reveal-on-scroll').forEach(el => this.observer.observe(el));
  }

  observe(element) {
    if (this.observer && element) {
      this.observer.observe(element);
    }
  }
}

export const scrollReveal = new ScrollRevealManager();

/**
 * Animate numeric counter elements
 */
export function initCounters() {
  const counters = $$('[data-counter-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter-target'), 10);
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const duration = 1500;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}
