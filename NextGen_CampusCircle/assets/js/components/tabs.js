/**
 * CampusCircle Component - Tab Controller
 * Modular, accessible tab switcher supporting nested tabs and animated pane transitions.
 */

import { $$, delegate } from '../utils/dom.js';

class TabController {
  init() {
    // Listen for tab button clicks via delegation
    delegate(document.body, '[data-tab-target]', 'click', (e, target) => {
      e.preventDefault();
      const tabGroup = target.closest('[data-tab-group]') || target.parentElement;
      const targetId = target.getAttribute('data-tab-target');

      this.switchTab(tabGroup, target, targetId);
    });
  }

  switchTab(tabGroup, activeBtn, targetId) {
    if (!targetId) return;

    // 1. Update button states within this group
    if (tabGroup) {
      tabGroup.querySelectorAll('[data-tab-target]').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
    }
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');

    // 2. Find matching pane
    const targetPane = document.getElementById(targetId);
    if (!targetPane) return;

    // Find parent pane container or siblings
    const parentContainer = targetPane.parentElement;
    if (parentContainer) {
      parentContainer.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });
    }

    targetPane.classList.add('active');

    // Emit event
    window.dispatchEvent(new CustomEvent('campuscircle:tab-change', {
      detail: { targetId, activeBtn }
    }));
  }
}

export const tabController = new TabController();
