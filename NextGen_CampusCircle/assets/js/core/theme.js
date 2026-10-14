/**
 * CampusCircle Core - Theme Engine
 * Seamless Dual-Theme Engine (Light & Dark) with system sync and persistent state.
 */

import { APP_CONFIG } from './config.js';
import { appStorage } from './storage.js';
import { eventBus } from './events.js';

class ThemeEngine {
  constructor() {
    this.storageKey = APP_CONFIG.storageKeys.theme;
    this.currentTheme = APP_CONFIG.themes.DARK; // Default to futuristic cyber obsidian
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  resolveInitialTheme() {
    try {
      for (const k of ['campuscircle_theme', 'campuscircle_theme_preference', 'tc_theme']) {
        let v = localStorage.getItem(k);
        if (v) {
          if (v.startsWith('"') && v.endsWith('"')) {
            try { v = JSON.parse(v); } catch (e) {}
          }
          if (v === 'light' || v === 'dark') return v;
        }
      }
    } catch (e) {}
    return APP_CONFIG.themes.DARK;
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    // Persist to all synchronized keys
    try {
      localStorage.setItem('campuscircle_theme', theme);
      localStorage.setItem('campuscircle_theme_preference', JSON.stringify(theme));
      localStorage.setItem('tc_theme', theme);
    } catch (e) {}
    appStorage.set(this.storageKey, theme);

    // Update all theme toggle elements
    this.updateToggleControls(theme);

    // Emit event
    eventBus.emit('theme:changed', { theme });
    window.dispatchEvent(new CustomEvent('campuscircle:theme-change', {
      detail: { theme }
    }));
  }

  updateToggleControls(theme) {
    const isDark = theme === 'dark';
    const toggles = document.querySelectorAll('.theme-toggle, .theme-toggle-btn, [data-theme-toggle]');
    toggles.forEach(btn => {
      if (btn.classList.contains('theme-toggle') && !btn.querySelector('svg')) {
        btn.innerHTML = isDark ? '☀️' : '🌙';
      }
      btn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
      btn.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    });
  }

  toggle() {
    if (window.CampusTheme && typeof window.CampusTheme.toggle === 'function') {
      const next = window.CampusTheme.toggle();
      this.currentTheme = next;
      return next;
    }
    const nextTheme = this.currentTheme === APP_CONFIG.themes.DARK
      ? APP_CONFIG.themes.LIGHT
      : APP_CONFIG.themes.DARK;
    this.applyTheme(nextTheme);
    return nextTheme;
  }

  getTheme() {
    return this.currentTheme;
  }

  init() {
    const initialTheme = this.resolveInitialTheme();
    this.applyTheme(initialTheme);

    // Bind click events on all theme toggles
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.theme-toggle, .theme-toggle-btn, [data-theme-toggle]');
      if (toggleBtn) {
        // Handled by js/core/theme.js if present, but if not:
        if (!window.CampusTheme) {
          e.preventDefault();
          this.toggle();
        }
      }
    });

    // Listen for OS system theme changes ONLY if user has NEVER set a theme
    this.mediaQuery.addEventListener('change', (e) => {
      const hasSavedTheme = localStorage.getItem('campuscircle_theme') ||
                            localStorage.getItem('campuscircle_theme_preference') ||
                            localStorage.getItem('tc_theme');
      if (!hasSavedTheme) {
        this.applyTheme(e.matches ? APP_CONFIG.themes.DARK : APP_CONFIG.themes.LIGHT);
      }
    });
  }
}

export const themeEngine = new ThemeEngine();
