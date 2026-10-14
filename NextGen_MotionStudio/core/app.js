/**
 * PROMOTIONAL VIDEO STUDIO - MASTER APP ORCHESTRATOR
 * Coordinates state, timeline loop, keyboard shortcuts, and mounts all UI components.
 */

window.STUDIO_APP = (function () {
  'use strict';

  const state = {
    currentTime: 0,
    duration: 30.0,
    isPlaying: false,
    playbackRate: 1.0,
    isMuted: false,
    hasVideo: false,
    aspectRatio: '9-16',
    fps: 30
  };

  let videoElement = null;
  let desktopVideoElement = null;
  let lastTime = performance.now();

  function init() {
    videoElement = document.getElementById('userVideoPlayer');
    desktopVideoElement = document.getElementById('userDesktopVideoPlayer');

    // Initialize all components
    if (window.STUDIO_TOPBAR) window.STUDIO_TOPBAR.init();
    if (window.STUDIO_STAGE) window.STUDIO_STAGE.init();
    if (window.STUDIO_TIMELINE) window.STUDIO_TIMELINE.init();
    if (window.STUDIO_EDITOR) window.STUDIO_EDITOR.init();
    if (window.STUDIO_TEXT_TO_VIDEO) window.STUDIO_TEXT_TO_VIDEO.init();
    if (window.STUDIO_IMAGE_TO_VIDEO) window.STUDIO_IMAGE_TO_VIDEO.init();
    if (window.STUDIO_VOICE_STUDIO) window.STUDIO_VOICE_STUDIO.init();
    if (window.STUDIO_MODALS) window.STUDIO_MODALS.init();

    setupEventListeners();
    setupKeyboardShortcuts();
  }

  function notifyTimelineUpdate() {
    if (window.STUDIO_TIMELINE) window.STUDIO_TIMELINE.update(state.currentTime, state.duration, state.fps);
    window.dispatchEvent(new CustomEvent('studio-frame-stepped', {
      detail: {
        currentTime: state.currentTime,
        currentFrame: Math.floor(state.currentTime * (state.fps || 30)),
        totalFrames: Math.floor(state.duration * (state.fps || 30)),
        fps: state.fps || 30
      }
    }));
  }

  function stepFrame(deltaFrames) {
    if (state.isPlaying) {
      togglePlay(); // Pause to inspect frame precisely
    }
    const fps = state.fps || 30;
    const frameDuration = 1 / fps;
    const newTime = Math.max(0, Math.min(state.duration, state.currentTime + deltaFrames * frameDuration));
    state.currentTime = Math.round(newTime * 1000) / 1000;
    syncActiveClip(state.currentTime);
    notifyTimelineUpdate();
  }

  function captureCurrentFrame() {
    const activeVid = window.STUDIO_STAGE && window.STUDIO_STAGE.getCurrentDevice() === 'desktop' ? desktopVideoElement : videoElement;
    if (!activeVid || !state.hasVideo) {
      alert('Please load a video clip to capture frame snapshots.');
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = activeVid.videoWidth || 1920;
      canvas.height = activeVid.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(activeVid, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      const fNum = Math.floor(state.currentTime * (state.fps || 30));
      a.download = `Frame_${fNum}_${state.currentTime.toFixed(2)}s.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.warn('Frame capture notification:', err);
    }
  }

  function setupEventListeners() {
    // Mode switcher (Editor, Text to Video, Image to Video, Voice Studio)
    window.addEventListener('studio-mode-changed', (e) => {
      const mode = e.detail.mode;
      const editorPane = document.getElementById('editorSidebarPane');
      const t2vPane = document.getElementById('t2vSidebarPane');
      const i2vPane = document.getElementById('i2vSidebarPane');
      const voicePane = document.getElementById('voiceSidebarPane');

      if (editorPane) editorPane.classList.toggle('hidden', mode !== 'editor');
      if (t2vPane) t2vPane.classList.toggle('hidden', mode !== 'text2video');
      if (i2vPane) i2vPane.classList.toggle('hidden', mode !== 'image2video');
      if (voicePane) voicePane.classList.toggle('hidden', mode !== 'voice');
    });

    // Ratio change
    window.addEventListener('studio-ratio-changed', (e) => {
      state.aspectRatio = e.detail.ratio;
    });

    // Sound toggle
    window.addEventListener('studio-toggle-sound', () => {
      state.isMuted = !state.isMuted;
      if (videoElement) videoElement.muted = state.isMuted;
      if (desktopVideoElement) desktopVideoElement.muted = state.isMuted;
      if (window.STUDIO_AUDIO) window.STUDIO_AUDIO.toggleBackingBeat(!state.isMuted);
    });

    // Clips updated from Clip Manager
    window.addEventListener('studio-clips-updated', (e) => {
      const { clips, totalDuration } = e.detail;
      state.duration = totalDuration;
      state.hasVideo = clips.length > 0;

      const empty1 = document.getElementById('emptyVideoPlaceholder');
      const empty2 = document.getElementById('emptyDesktopPlaceholder');
      if (empty1) empty1.classList.toggle('hidden', state.hasVideo);
      if (empty2) empty2.classList.toggle('hidden', state.hasVideo);

      if (clips.length > 0) {
        syncActiveClip(state.currentTime);
      }
      notifyTimelineUpdate();
    });

    // AI Text-to-Video generated
    window.addEventListener('studio-ai-video-created', (e) => {
      const { videoUrl, duration, scenes } = e.detail;
      if (window.STUDIO_CLIPS) {
        window.STUDIO_CLIPS.addClip(videoUrl, 'AI_Animated_Promo.webm');
      } else {
        loadVideoSource(videoUrl, 'AI_Animated_Promo.webm');
      }
      state.duration = duration;
      if (window.STUDIO_EDITOR) {
        const cues = scenes.map(s => ({
          time: s.sceneIndex * 4.5 - 4.5,
          tag: s.title,
          text: s.script
        }));
        window.STUDIO_EDITOR.setCues(cues);
      }
      window.dispatchEvent(new CustomEvent('studio-mode-changed', { detail: { mode: 'editor' } }));
    });

    // AI Image-to-Video generated
    window.addEventListener('studio-image-video-created', (e) => {
      const { videoUrl, duration } = e.detail;
      if (window.STUDIO_CLIPS) {
        window.STUDIO_CLIPS.addClip(videoUrl, 'AI_Motion_Image.webm');
      } else {
        loadVideoSource(videoUrl, 'AI_Motion_Image.webm');
      }
      state.duration = duration;
      window.dispatchEvent(new CustomEvent('studio-mode-changed', { detail: { mode: 'editor' } }));
    });

    // Voice converted
    window.addEventListener('studio-voice-converted', (e) => {
      if (window.STUDIO_EDITOR) {
        window.STUDIO_EDITOR.addCue(state.currentTime, e.detail.text);
      }
    });

    // Playback rate - synchronized with video players and AI voice engine
    window.addEventListener('studio-rate-changed', (e) => {
      state.playbackRate = e.detail.rate;
      if (videoElement) videoElement.playbackRate = state.playbackRate;
      if (desktopVideoElement) desktopVideoElement.playbackRate = state.playbackRate;
      if (window.STUDIO_VOICE_ENGINE) window.STUDIO_VOICE_ENGINE.setPlaybackRate(state.playbackRate);
    });

    // Seek percent
    window.addEventListener('studio-seek-percent', (e) => {
      state.currentTime = Math.max(0, Math.min(state.duration, e.detail.percent * state.duration));
      syncActiveClip(state.currentTime);
      notifyTimelineUpdate();
    });

    // Seek direct time (frame-accurate)
    window.addEventListener('studio-seek-time', (e) => {
      const targetTime = typeof e.detail.time === 'number' ? e.detail.time : 0;
      state.currentTime = Math.max(0, Math.min(state.duration, targetTime));
      syncActiveClip(state.currentTime);
      notifyTimelineUpdate();
    });

    // Frame-by-frame stepping event
    window.addEventListener('studio-step-frame', (e) => {
      stepFrame(e.detail?.delta || 1);
    });

    // FPS changed
    window.addEventListener('studio-fps-changed', (e) => {
      state.fps = parseInt(e.detail?.fps, 10) || 30;
      notifyTimelineUpdate();
    });

    // Frame-accurate Mark In
    window.addEventListener('studio-mark-in', () => {
      if (!window.STUDIO_CLIPS || window.STUDIO_CLIPS.getClipCount() === 0) return;
      const active = window.STUDIO_CLIPS.getActiveClipAtTime(state.currentTime);
      if (!active || !active.clip) return;
      window.STUDIO_CLIPS.setClipMarkIn(active.clip.id, active.localTime);
      notifyTimelineUpdate();
    });

    // Frame-accurate Mark Out
    window.addEventListener('studio-mark-out', () => {
      if (!window.STUDIO_CLIPS || window.STUDIO_CLIPS.getClipCount() === 0) return;
      const active = window.STUDIO_CLIPS.getActiveClipAtTime(state.currentTime);
      if (!active || !active.clip) return;
      window.STUDIO_CLIPS.setClipMarkOut(active.clip.id, active.localTime);
      notifyTimelineUpdate();
    });

    // Frame-accurate Split / Blade Cut (Debounced & Safe)
    let lastSplitTimestamp = 0;
    window.addEventListener('studio-split-clip', () => {
      const now = Date.now();
      if (now - lastSplitTimestamp < 450) return; // Debounce rapid triggers
      lastSplitTimestamp = now;

      if (!window.STUDIO_CLIPS || window.STUDIO_CLIPS.getClipCount() === 0) return;
      if (state.isPlaying) {
        togglePlay(); // Always pause before splitting
      }
      const active = window.STUDIO_CLIPS.getActiveClipAtTime(state.currentTime);
      if (!active || !active.clip) return;
      const res = window.STUDIO_CLIPS.splitClipAtTime(active.clip.id, active.localTime);
      if (res) {
        notifyTimelineUpdate();
      }
    });

    // Capture Frame Snapshot
    window.addEventListener('studio-capture-frame', () => {
      captureCurrentFrame();
    });

    // Add cue request
    window.addEventListener('studio-request-add-cue', () => {
      if (window.STUDIO_EDITOR) window.STUDIO_EDITOR.addCue(state.currentTime);
    });

    // Trigger 1080p Export
    window.addEventListener('studio-trigger-export', async () => {
      if (window.STUDIO_MODALS) window.STUDIO_MODALS.showExportModal();
      const activeVid = window.STUDIO_STAGE.getCurrentDevice() === 'desktop' ? desktopVideoElement : videoElement;

      await window.STUDIO_COMPOSITOR.exportStageVideo(
        document.getElementById('videoScreen'),
        activeVid,
        state.aspectRatio,
        state.duration,
        (pct) => {
          if (window.STUDIO_MODALS) window.STUDIO_MODALS.updateExportProgress(pct);
        }
      );

      if (window.STUDIO_MODALS) window.STUDIO_MODALS.hideExportModal();
      alert('🎉 Video export ready and downloaded!');
    });

    // Play / Pause button
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.addEventListener('click', togglePlay);
  }

  let currentLoadedClipId = null;

  /* ── Synchronize Active Video Element with Multi-Clip Sequence ───────── */
  function syncActiveClip(globalTime) {
    if (!window.STUDIO_CLIPS || window.STUDIO_CLIPS.getClipCount() === 0) {
      if (state.hasVideo) {
        [videoElement, desktopVideoElement].forEach(v => {
          if (v) v.currentTime = globalTime;
        });
      }
      return;
    }
    const active = window.STUDIO_CLIPS.getActiveClipAtTime(globalTime);
    if (!active || !active.clip) return;

    const { clip, localTime } = active;
    [videoElement, desktopVideoElement].forEach(v => {
      if (!v) return;
      if (currentLoadedClipId !== clip.id || v.src !== clip.url) {
        currentLoadedClipId = clip.id;
        v.src = clip.url;
        v.playbackRate = state.playbackRate;
        v.currentTime = localTime;
        if (state.isPlaying) {
          v.play().catch(() => {});
        }
      } else {
        // When paused (or frame stepping), ALWAYS set currentTime directly so the screen renders the exact frame!
        if (!state.isPlaying) {
          v.currentTime = localTime;
        } else {
          // During playback, resync if video drifts by more than 0.15s
          if (Math.abs(v.currentTime - localTime) > 0.15) {
            v.currentTime = localTime;
          }
        }
      }
    });
  }

  function loadVideoSource(url, name = 'video.mp4') {
    if (window.STUDIO_CLIPS) {
      window.STUDIO_CLIPS.addClip(url, name);
      return;
    }
    if (videoElement) { videoElement.src = url; videoElement.load(); }
    if (desktopVideoElement) { desktopVideoElement.src = url; desktopVideoElement.load(); }

    state.hasVideo = true;
    const empty1 = document.getElementById('emptyVideoPlaceholder');
    const empty2 = document.getElementById('emptyDesktopPlaceholder');

    if (empty1) empty1.classList.add('hidden');
    if (empty2) empty2.classList.add('hidden');

    videoElement.onloadedmetadata = () => {
      state.duration = Math.max(8, videoElement.duration);
      notifyTimelineUpdate();
    };
  }

  function togglePlay() {
    state.isPlaying = !state.isPlaying;
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');

    if (state.isPlaying) {
      syncActiveClip(state.currentTime);
      if (videoElement && state.hasVideo) videoElement.play().catch(() => {});
      if (desktopVideoElement && state.hasVideo) desktopVideoElement.play().catch(() => {});
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');

      lastTime = performance.now();
      requestAnimationFrame(tick);
    } else {
      if (videoElement && state.hasVideo) videoElement.pause();
      if (desktopVideoElement && state.hasVideo) desktopVideoElement.pause();
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (window.STUDIO_EDITOR) window.STUDIO_EDITOR.stopCurrentVoice();
    }
  }

  function tick(now) {
    if (!state.isPlaying) return;
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    state.currentTime += dt * state.playbackRate;
    if (state.currentTime >= state.duration) {
      state.currentTime = 0;
    }

    syncActiveClip(state.currentTime);

    notifyTimelineUpdate();

    // Update kinetic Hormozi captions
    if (window.STUDIO_STAGE && window.STUDIO_EDITOR) {
      window.STUDIO_STAGE.updateCaptions(window.STUDIO_EDITOR.getCues(), state.currentTime);
    }

    // Live Synchronized Voice Narration (Rate-matched to video speed)
    if (window.STUDIO_EDITOR && !state.isMuted) {
      window.STUDIO_EDITOR.onTimelineTick(state.currentTime, state.isPlaying);
    }

    requestAnimationFrame(tick);
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in text inputs or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;

      // DO NOT trigger editor hotkeys if Ctrl, Meta (Cmd/Win), or Alt are pressed! (Prevents Ctrl+S or Ctrl+C from splitting)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // DO NOT trigger single-key action tools on continuous key repeat
      if (e.repeat && ['Space', 'KeyI', 'KeyO', 'KeyS', 'KeyB'].includes(e.code)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepFrame(e.shiftKey ? -5 : -1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepFrame(e.shiftKey ? 5 : 1);
      } else if (e.key === ',' || e.code === 'BracketLeft') {
        e.preventDefault();
        stepFrame(e.shiftKey ? -5 : -1);
      } else if (e.key === '.' || e.code === 'BracketRight') {
        e.preventDefault();
        stepFrame(e.shiftKey ? 5 : 1);
      } else if (e.code === 'KeyI') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('studio-mark-in'));
      } else if (e.code === 'KeyO') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('studio-mark-out'));
      } else if (e.code === 'KeyB' || e.code === 'KeyS') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('studio-split-clip'));
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('studio-toggle-sound'));
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    togglePlay,
    getState: () => state
  };
})();
