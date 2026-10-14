/**
 * CAMPUS CIRCLE - Dual Theme Engine (Light & Dark)
 * NextGen • Developed by A.K.Antal
 * Persistent, synchronized theme state across all ecosystem pages.
 */

(function () {
  const THEME_KEYS = ['campuscircle_theme', 'campuscircle_theme_preference', 'tc_theme'];

  function readStoredTheme() {
    try {
      for (const k of THEME_KEYS) {
        let v = localStorage.getItem(k);
        if (v) {
          if (v.startsWith('"') && v.endsWith('"')) {
            try { v = JSON.parse(v); } catch (e) {}
          }
          if (v === 'light' || v === 'dark') return v;
        }
      }
    } catch (e) {}
    // Default to dark cyber obsidian theme
    return 'dark';
  }

  function writeStoredTheme(theme) {
    try {
      THEME_KEYS.forEach(k => {
        if (k === 'campuscircle_theme_preference') {
          localStorage.setItem(k, JSON.stringify(theme));
        } else {
          localStorage.setItem(k, theme);
        }
      });
    } catch (e) {}
  }

  function applyTheme(theme) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', validTheme);
    document.documentElement.style.colorScheme = validTheme;
    writeStoredTheme(validTheme);
    updateAllToggleControls(validTheme);

    // Notify any listening components
    window.dispatchEvent(new CustomEvent('campuscircle:theme-change', { detail: { theme: validTheme } }));
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || readStoredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return next;
  }

  function updateAllToggleControls(theme) {
    const isLight = theme === 'light';
    const toggles = document.querySelectorAll('.theme-toggle, .theme-toggle-btn, [data-theme-toggle]');
    toggles.forEach(btn => {
      // If it's a simple emoji button
      if (btn.classList.contains('theme-toggle') && !btn.querySelector('svg')) {
        btn.innerHTML = isLight ? '🌙' : '☀️';
      }
      btn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      btn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });
  }

  // 1. Immediate execution before DOM to avoid flash
  const initialTheme = readStoredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);
  document.documentElement.style.colorScheme = initialTheme;

  // 2. Interactive binding when DOM is ready
  function init() {
    applyTheme(readStoredTheme());

    document.querySelectorAll('.theme-toggle, .theme-toggle-btn, [data-theme-toggle]').forEach(btn => {
      if (btn._themeBound) return;
      btn._themeBound = true;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global exports
  window.CampusTheme = {
    get: () => document.documentElement.getAttribute('data-theme') || readStoredTheme(),
    set: applyTheme,
    toggle: toggleTheme
  };
  window.toggleTheme = toggleTheme;
})();
