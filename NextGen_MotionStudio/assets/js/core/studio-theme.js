/**
 * PROMOTIONAL VIDEO STUDIO - THEME CONTROLLER & UI WIDGET ENGINE
 * Manages Dark/Light mode switching, accent color customizer, and persistent state.
 * Synchronized with NextGen & CampusCircle theme standards.
 * Architecture Reference: NextGen • Developed by A.K.Antal
 */

window.STUDIO_THEME = (function () {
  'use strict';

  const STORAGE_KEYS = [
    'pvs_theme_mode',
    'motionstudio_theme',
    'motionstudio_theme_preference',
    'tc_theme',
    'nexgen_theme_preference'
  ];

  // Detect initial state from any existing token
  let savedTheme = 'dark';
  for (const key of STORAGE_KEYS) {
    try {
      const val = localStorage.getItem(key);
      if (val) {
        savedTheme = val.replace(/"/g, '');
        break;
      }
    } catch (e) {}
  }

  const savedAccent = localStorage.getItem('pvs_theme_accent') || 'indigo';

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    // Synchronize across all known keys
    STORAGE_KEYS.forEach(key => {
      try {
        localStorage.setItem(key, JSON.stringify(theme));
      } catch (e) {}
    });

    // Update toggle icons in DOM
    const themeBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle, [data-theme-toggle]');
    themeBtns.forEach(themeBtn => {
      themeBtn.innerHTML = isDark ? '☀️' : '🌙';
      themeBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      themeBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });

    // Trigger custom event for audio visualizers/canvases
    window.dispatchEvent(new CustomEvent('studio-theme-changed', { detail: { theme, isDark } }));
  }

  function applyAccent(accent) {
    document.documentElement.setAttribute('data-accent', accent);
    try {
      localStorage.setItem('pvs_theme_accent', accent);
    } catch (e) {}

    // Update accent UI picker state
    document.querySelectorAll('[data-accent-choice]').forEach(btn => {
      const match = btn.getAttribute('data-accent-choice') === accent;
      btn.classList.toggle('active', match);
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return next;
  }

  function init() {
    applyTheme(savedTheme);
    applyAccent(savedAccent);

    // Delegate theme switcher clicks
    document.addEventListener('click', function (e) {
      const toggleTrigger = e.target.closest('#themeToggleBtn, .studio-theme-toggle, .theme-toggle, [data-theme-toggle]');
      if (toggleTrigger) {
        e.preventDefault();
        toggle();
      }

      const accentTrigger = e.target.closest('[data-accent-choice]');
      if (accentTrigger) {
        e.preventDefault();
        const choice = accentTrigger.getAttribute('data-accent-choice');
        if (choice) applyAccent(choice);
      }
    });
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    applyTheme,
    applyAccent,
    toggle,
    getTheme: () => document.documentElement.getAttribute('data-theme') || 'dark',
    getAccent: () => document.documentElement.getAttribute('data-accent') || 'indigo',
    init
  };
})();
