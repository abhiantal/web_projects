/**
 * CampusCircle Page Script - Home
 * Controls interactive academic cockpit tabs, screen preview switching, and metrics.
 */

import { $, $$ } from '../utils/dom.js';

class HomeController {
  init() {
    this.bindCockpitTabs();
  }

  bindCockpitTabs() {
    const navButtons = $$('[data-cockpit-target]');
    if (!navButtons.length) return;

    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-cockpit-target');

        // Update button states
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update display panes
        const panes = $$('.cockpit-pane');
        panes.forEach(pane => pane.classList.remove('active'));

        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }
}

export const homeController = new HomeController();
