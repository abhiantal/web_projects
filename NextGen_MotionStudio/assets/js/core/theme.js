/**
 * MotionStudio Core - Dual-Theme Engine (Light & Dark)
 * Persistent, synchronized theme state with zero-FOUC preloading.
 * NextGen • Developed by A.K.Antal
 */

import { APP_CONFIG } from './config.js';
import { appStorage } from './storage.js';
import { eventBus } from './events.js';

class ThemeEngine {
  constructor() {
    this.keys = [
      APP_CONFIG.storageKeys.theme,
      APP_CONFIG.storageKeys.themePreference,
      APP_CONFIG.storageKeys.legacyTheme
    ];
    this.currentTheme = APP_CONFIG.themes.DARK;
  }

  resolveStoredTheme() {
    try {
      for (const k of this.keys) {
        let v = localStorage.getItem(k);
        if (v) {
          if (v.startsWith('"') && v.endsWith('"')) {
            try { v = JSON.parse(v); } catch {}
          }
          if (v === 'light' || v === 'dark') return v;
        }
      }
    } catch {}
    return APP_CONFIG.themes.DARK;
  }

  applyTheme(theme) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    this.currentTheme = validTheme;
    document.documentElement.setAttribute('data-theme', validTheme);
    document.documentElement.style.colorScheme = validTheme;

    // Persist across all keys
    try {
      this.keys.forEach(k => {
        if (k === APP_CONFIG.storageKeys.themePreference) {
          localStorage.setItem(k, JSON.stringify(validTheme));
        } else {
          localStorage.setItem(k, validTheme);
        }
      });
    } catch {}

    this.updateToggleControls(validTheme);
    eventBus.emit('theme:changed', { theme: validTheme });
    window.dispatchEvent(new CustomEvent('motionstudio:theme-change', { detail: { theme: validTheme } }));
  }

  toggle() {
    const next = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    return next;
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
    });
  }

  init() {
    const initial = this.resolveStoredTheme();
    this.applyTheme(initial);

    // Global click delegate for theme toggles
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle, .theme-toggle-btn, [data-theme-toggle]');
      if (btn) {
        e.preventDefault();
        this.toggle();
      }
    });
  }
}

export const themeEngine = new ThemeEngine();

// Window global fallback
window.MotionTheme = {
  get: () => document.documentElement.getAttribute('data-theme') || themeEngine.resolveStoredTheme(),
  set: (t) => themeEngine.applyTheme(t),
  toggle: () => themeEngine.toggle()
};
