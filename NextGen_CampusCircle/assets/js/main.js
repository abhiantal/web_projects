/**
 * CampusCircle Master Script
 * Entry point orchestrating core modules, components, theme engine, and animations.
 * Academic Operating System • Powered by NextGen
 */

import { APP_CONFIG } from './core/config.js';
import { themeEngine } from './core/theme.js';
import { appStorage } from './core/storage.js';
import { eventBus } from './core/events.js';
import { navbarController } from './components/navbar.js';
import { tabController } from './components/tabs.js';
import { modalController } from './components/modal.js';
import { toast } from './components/toast.js';
import { homeController } from './pages/home.js';
import { scrollReveal, initCounters } from './utils/animation.js';
import { $, $$ } from './utils/dom.js';

class CampusCircleApp {
  constructor() {
    this.config = APP_CONFIG;
  }

  init() {
    // 1. Initialize Dual-Theme Engine (Light & Dark)
    themeEngine.init();

    // 2. Initialize Navigation and Mobile Drawer
    navbarController.init();

    // 3. Initialize Tab Controller
    tabController.init();

    // 4. Initialize Modal Controller
    modalController.init();

    // 5. Initialize Home Controller (Academic Cockpit)
    homeController.init();

    // 6. Initialize Scroll Reveal Animations & Counters
    scrollReveal.init();
    initCounters();

    // 7. Console Branding
    this.printBranding();
  }

  printBranding() {
    console.log(
      `%c 🎓 CampusCircle OS %c v${this.config.version} • Powered by NextGen `,
      'background: #0284C7; color: #FFFFFF; font-weight: bold; border-radius: 4px 0 0 4px; padding: 4px 8px;',
      'background: #0F172A; color: #00F2FE; font-weight: bold; border-radius: 0 4px 4px 0; padding: 4px 8px;'
    );
  }
}

export const app = new CampusCircleApp();

// Auto initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Re-export core systems for module consumers
import { pageLoader } from './core/page-loader.js';

export {
  APP_CONFIG,
  themeEngine,
  appStorage,
  eventBus,
  navbarController,
  tabController,
  modalController,
  toast,
  scrollReveal,
  pageLoader,
  $,
  $$
};
