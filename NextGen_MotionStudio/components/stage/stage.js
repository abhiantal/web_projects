/**
 * COMPONENT: STAGE CONTROLLER
 * Controls 3D Device Switching, Camera Perspectives, and Kinetic Word Highlights.
 */

window.STUDIO_STAGE = (function () {
  'use strict';

  let currentDevice = 'mobile';
  let cameraMode = 'dynamic';

  function setDevice(device) {
    currentDevice = device;
    const mobileEl = document.getElementById('mobileDeviceFrame');
    const desktopEl = document.getElementById('desktopDeviceFrame');
    const stageEl = document.getElementById('phoneMockupStage');

    if (device === 'desktop') {
      if (mobileEl) mobileEl.classList.add('hidden');
      if (desktopEl) desktopEl.classList.remove('hidden');
      if (stageEl) {
        stageEl.classList.remove('device-mobile');
        stageEl.classList.add('device-desktop');
      }
    } else {
      if (mobileEl) mobileEl.classList.remove('hidden');
      if (desktopEl) desktopEl.classList.add('hidden');
      if (stageEl) {
        stageEl.classList.add('device-mobile');
        stageEl.classList.remove('device-desktop');
      }
    }
  }

  function setCameraMode(mode) {
    cameraMode = mode;
    const stageEl = document.getElementById('phoneMockupStage');
    if (stageEl) {
      stageEl.classList.remove('camera-dynamic', 'camera-hero3d', 'camera-closeup', 'camera-center');
      stageEl.classList.add(`camera-${mode}`);
    }
  }

  function updateCaptions(cues, currentTime) {
    const container = document.getElementById('captionContent');
    if (!container) return;

    const activeCue = cues.find((c, i) => {
      const nextTime = cues[i + 1] ? cues[i + 1].time : 9999;
      return currentTime >= c.time && currentTime < nextTime;
    });

    if (!activeCue) {
      container.innerHTML = '';
      return;
    }

    const words = activeCue.text.split(' ');
    const timeInCue = currentTime - activeCue.time;
    const wordProgress = Math.min(words.length - 1, Math.floor((timeInCue / 4.0) * words.length));

    let html = '';
    words.forEach((w, idx) => {
      const isHigh = idx === wordProgress;
      html += `<span class="caption-word ${isHigh ? 'highlight' : ''}">${w}</span> `;
    });

    container.innerHTML = html;
  }

  function init() {
    window.addEventListener('studio-device-changed', (e) => {
      setDevice(e.detail.device);
    });

    window.addEventListener('studio-ratio-changed', (e) => {
      const wrapper = document.getElementById('videoFrameWrapper');
      if (wrapper) wrapper.className = `video-frame-wrapper ratio-${e.detail.ratio}`;
    });
  }

  return {
    init,
    setDevice,
    setCameraMode,
    updateCaptions,
    getCurrentDevice: () => currentDevice
  };
})();
