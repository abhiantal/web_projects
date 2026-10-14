/**
 * COMPONENT: IMAGE TO VIDEO CONTROLLER
 * Loads image files and triggers 2.5D / Ken Burns motion canvas rendering.
 */

window.STUDIO_IMAGE_TO_VIDEO = (function () {
  'use strict';

  function init() {
    const chooseBtn = document.getElementById('i2vChooseBtn');
    const fileInput = document.getElementById('i2vFileInput');
    const previewImg = document.getElementById('i2vImagePreview');
    const animateBtn = document.getElementById('i2vAnimateBtn');
    const motionSelect = document.getElementById('i2vMotionSelect');
    const statusEl = document.getElementById('i2vStatus');

    if (chooseBtn && fileInput) {
      chooseBtn.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          loadImageFile(e.target.files[0]);
        }
      });
    }

    function loadImageFile(file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (previewImg) {
          previewImg.src = ev.target.result;
          previewImg.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(file);
    }

    if (animateBtn) {
      animateBtn.addEventListener('click', async () => {
        if (!previewImg || !previewImg.src || previewImg.classList.contains('hidden')) {
          alert('Please choose an image file first!');
          return;
        }

        const motion = (motionSelect && motionSelect.value) || 'push_zoom';
        if (statusEl) {
          statusEl.textContent = '🚀 Animating image at 60 FPS...';
          statusEl.classList.remove('hidden');
        }

        try {
          const videoUrl = await window.STUDIO_ANIMATOR.animateImage(previewImg, motion, 6.0, (pct) => {
            if (statusEl) statusEl.textContent = `Animating: ${pct}%`;
          });

          window.dispatchEvent(new CustomEvent('studio-image-video-created', {
            detail: { videoUrl, duration: 6.0 }
          }));

          if (statusEl) statusEl.textContent = '✨ Motion video ready! Loaded into Studio.';
        } catch (err) {
          console.error('I2V error:', err);
          if (statusEl) statusEl.textContent = 'Error: ' + err.message;
        }
      });
    }
  }

  return { init };
})();
