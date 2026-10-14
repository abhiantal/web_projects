/**
 * COMPONENT: TOPBAR CONTROLLER
 * Handles mode switching, device toggles, aspect ratio changes, and triggers.
 */

window.STUDIO_TOPBAR = (function () {
  'use strict';

  function init() {
    // Mode tabs: Editor, Text to Video, Image to Video, Voice Studio
    document.querySelectorAll('.mode-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        if (mode) {
          document.querySelectorAll('.mode-tab-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          window.dispatchEvent(new CustomEvent('studio-mode-changed', { detail: { mode } }));
        }
      });
    });

    window.addEventListener('studio-mode-changed', (e) => {
      const mode = e.detail.mode;
      document.querySelectorAll('.mode-tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === mode);
      });
    });

    // Device Frame Switcher: Auto, Mobile, Desktop
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const device = e.currentTarget.dataset.device;
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        window.dispatchEvent(new CustomEvent('studio-device-changed', { detail: { device } }));
      });
    });

    // Aspect Ratio Switcher: 9:16, 16:9, 1:1
    document.querySelectorAll('.ratio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ratio = e.currentTarget.dataset.ratio;
        document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        window.dispatchEvent(new CustomEvent('studio-ratio-changed', { detail: { ratio } }));
      });
    });

    // Sound toggle
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-toggle-sound'));
      });
    }

    // Export button
    const exportBtn = document.getElementById('exportVideoBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-trigger-export'));
      });
    }

    // API settings modal button
    const apiBtn = document.getElementById('apiSettingsBtn');
    if (apiBtn) {
      apiBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-open-api-modal'));
      });
    }
  }

  return { init };
})();
