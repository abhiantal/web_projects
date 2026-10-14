/**
 * MotionStudio Component - Pricing Switcher Controller
 * Controls monthly/annual discount toggle and price synchronization.
 * NextGen • Developed by A.K.Antal
 */

import { $, $$ } from '../utils/dom.js';

class PricingController {
  constructor() {
    this.isAnnual = false;
  }

  init() {
    const toggleWrapper = $('.billing-toggle-wrapper');
    const switchBtn = $('.billing-switch');

    if (!toggleWrapper && !switchBtn) return;

    const toggle = () => {
      this.isAnnual = !this.isAnnual;
      this.syncUI();
    };

    if (toggleWrapper) {
      toggleWrapper.addEventListener('click', toggle);
    }
    if (switchBtn) {
      switchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle();
      });
    }

    this.syncUI();
  }

  syncUI() {
    const switchBtn = $('.billing-switch');
    const monthlyLabel = $('#billing-label-monthly') || $('.billing-label-monthly');
    const annualLabel = $('#billing-label-annual') || $('.billing-label-annual');
    const priceElements = $$('[data-price-monthly]');

    if (switchBtn) {
      switchBtn.classList.toggle('annual', this.isAnnual);
      switchBtn.setAttribute('aria-checked', String(this.isAnnual));
    }

    if (monthlyLabel) {
      monthlyLabel.classList.toggle('active', !this.isAnnual);
    }

    if (annualLabel) {
      annualLabel.classList.toggle('active', this.isAnnual);
    }

    priceElements.forEach(el => {
      const monthly = el.getAttribute('data-price-monthly');
      const annual = el.getAttribute('data-price-annual');
      el.textContent = this.isAnnual ? annual : monthly;
    });
  }
}

export const pricingController = new PricingController();
