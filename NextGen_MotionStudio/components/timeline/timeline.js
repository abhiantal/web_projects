/**
 * COMPONENT: TIMELINE CONTROLLER
 * Handles Scrubber interaction, playhead tracking, timecode formatting, and speed changes.
 */

window.STUDIO_TIMELINE = (function () {
  'use strict';

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
  }

  function formatTimePrecise(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  }

  function update(currentTime, duration, fps = 30) {
    const validDuration = Math.max(0.1, duration);
    const pct = Math.max(0, Math.min(100, (currentTime / validDuration) * 100));
    const fill = document.getElementById('timelineProgress');
    const playhead = document.getElementById('timelinePlayhead');
    const curDisplay = document.getElementById('currentTimeDisplay');
    const durDisplay = document.getElementById('durationDisplay');
    const curFrameEl = document.getElementById('currentFrameDisplay');
    const totalFramesEl = document.getElementById('totalFramesDisplay');

    if (fill) fill.style.width = `${pct}%`;
    if (playhead) playhead.style.left = `${pct}%`;
    if (curDisplay) curDisplay.textContent = formatTime(currentTime);
    if (durDisplay) durDisplay.textContent = formatTime(duration);

    const currentFrame = Math.floor(currentTime * fps);
    const totalFrames = Math.floor(duration * fps);
    if (curFrameEl) curFrameEl.textContent = currentFrame;
    if (totalFramesEl) totalFramesEl.textContent = totalFrames;
  }

  function init() {
    const track = document.getElementById('timelineTrack');
    let isDragging = false;

    function handleSeek(e) {
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      window.dispatchEvent(new CustomEvent('studio-seek-percent', { detail: { percent: pct } }));
    }

    if (track) {
      track.addEventListener('mousedown', (e) => {
        isDragging = true;
        handleSeek(e);
      });

      window.addEventListener('mousemove', (e) => {
        if (isDragging) {
          handleSeek(e);
        }
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }

    // Frame jog buttons
    const prevFrameBtn = document.getElementById('prevFrameBtn');
    if (prevFrameBtn) {
      prevFrameBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-step-frame', { detail: { delta: -1 } }));
      });
    }

    const nextFrameBtn = document.getElementById('nextFrameBtn');
    if (nextFrameBtn) {
      nextFrameBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-step-frame', { detail: { delta: 1 } }));
      });
    }

    // Quick Split button on timeline
    const splitBtn = document.getElementById('timelineSplitBtn');
    if (splitBtn) {
      splitBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-split-clip'));
      });
    }

    // FPS selection
    const fpsSelect = document.getElementById('timelineFpsSelect');
    if (fpsSelect) {
      fpsSelect.addEventListener('change', (e) => {
        const fps = parseInt(e.target.value, 10) || 30;
        window.dispatchEvent(new CustomEvent('studio-fps-changed', { detail: { fps } }));
      });
    }

    const rateSelect = document.getElementById('playbackRateSelect');
    if (rateSelect) {
      rateSelect.addEventListener('change', (e) => {
        const rate = parseFloat(e.target.value) || 1.0;
        window.dispatchEvent(new CustomEvent('studio-rate-changed', { detail: { rate } }));
      });
    }

    const replayBtn = document.getElementById('replayBtn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-seek-percent', { detail: { percent: 0 } }));
      });
    }
  }

  return {
    init,
    update,
    formatTime,
    formatTimePrecise
  };
})();
