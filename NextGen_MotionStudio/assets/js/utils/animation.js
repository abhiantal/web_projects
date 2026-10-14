/**
 * MotionStudio Utils - Scroll Animations & Number Counters
 * NextGen • Developed by A.K.Antal
 */

export class ScrollReveal {
  constructor(options = {}) {
    this.threshold = options.threshold || 0.1;
    this.rootMargin = options.rootMargin || '0px 0px -40px 0px';
    this.observer = null;
  }

  init() {
    this.observeAll('.reveal');
  }

  observeAll(selector = '.reveal') {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: this.threshold,
        rootMargin: this.rootMargin
      });

      targets.forEach(el => this.observer.observe(el));
    } else {
      // Fallback for older browsers
      targets.forEach(el => {
        el.classList.add('active');
        el.classList.add('revealed');
      });
    }
  }
}

export const scrollReveal = new ScrollReveal();

export function animateCounter(el, target, duration = 1600, formatter = (v) => v) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);
    el.textContent = formatter(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = formatter(target);
    }
  }

  requestAnimationFrame(update);
}

export function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target') || '0');
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const duration = parseInt(el.getAttribute('data-counter-duration') || '1600', 10);

        animateCounter(el, target, duration, (val) => `${prefix}${val}${suffix}`);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}
