/**
 * COMPONENT: TEXT TO VIDEO CONTROLLER
 * Triggers AI Storyboard creation and 60FPS motion canvas rendering.
 */

window.STUDIO_TEXT_TO_VIDEO = (function () {
  'use strict';

  function init() {
    const genBtn = document.getElementById('t2vGenerateBtn');
    const promptInput = document.getElementById('t2vPrompt');
    const styleSelect = document.getElementById('t2vStyleSelect');
    const statusEl = document.getElementById('t2vStatus');

    if (genBtn) {
      genBtn.addEventListener('click', async () => {
        const prompt = (promptInput && promptInput.value.trim()) || 'Futuristic AI platform promotional video';
        const style = (styleSelect && styleSelect.value) || 'animation';

        if (statusEl) {
          statusEl.textContent = '🧠 AI writing multi-scene storyboard...';
          statusEl.classList.remove('hidden');
        }

        try {
          const scenes = await window.STUDIO_API.generateVideoStoryboard(prompt, style, 4);

          if (statusEl) statusEl.textContent = '🎨 Rendering 60FPS animated video...';

          const result = await window.STUDIO_ANIMATOR.renderStoryboard(scenes, style, (pct) => {
            if (statusEl) statusEl.textContent = `Rendering video: ${pct}%`;
          });

          // Dispatch event to main app to mount video and cues
          window.dispatchEvent(new CustomEvent('studio-ai-video-created', {
            detail: {
              videoUrl: result.videoUrl,
              duration: result.duration,
              scenes: scenes
            }
          }));

          if (statusEl) statusEl.textContent = '✨ Animated video ready! Loaded into Studio.';
        } catch (err) {
          console.error('T2V error:', err);
          if (statusEl) statusEl.textContent = 'Error: ' + err.message;
        }
      });
    }
  }

  return { init };
})();
