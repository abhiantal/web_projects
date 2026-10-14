/**
 * PROMOTIONAL VIDEO STUDIO - CORE VIDEO COMPOSITOR
 * 1080p 60 FPS Export Recorder & Stage Frame Compositor.
 */

window.STUDIO_COMPOSITOR = (function () {
  'use strict';

  let isExporting = false;

  async function exportStageVideo(stageElement, videoElement, aspectRatio, durationSec = 30, onProgress = null) {
    isExporting = true;
    const canvas = document.createElement('canvas');
    canvas.width = aspectRatio === '16-9' ? 1920 : (aspectRatio === '1-1' ? 1080 : 1080);
    canvas.height = aspectRatio === '16-9' ? 1080 : (aspectRatio === '1-1' ? 1080 : 1920);
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(60);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 10000000 });
    const chunks = [];

    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

    const hasClips = window.STUDIO_CLIPS && window.STUDIO_CLIPS.getClipCount() > 0;
    const clipCount = hasClips ? window.STUDIO_CLIPS.getClipCount() : 0;

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const prefix = clipCount > 1 ? 'Merged_Studio_Promo_' : 'Studio_Promo_';
        a.download = `${prefix}${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        isExporting = false;
        resolve(url);
      };

      recorder.start();
      const start = performance.now();
      const totalMs = Math.min(60, durationSec) * 1000;

      function frame(now) {
        if (!isExporting) return;
        const elapsed = now - start;
        const progress = Math.min(1.0, elapsed / totalMs);
        const currentSec = progress * durationSec;

        // Multi-clip sequence sync during export
        if (hasClips && videoElement) {
          const active = window.STUDIO_CLIPS.getActiveClipAtTime(currentSec);
          if (active && active.clip) {
            if (videoElement.src !== active.clip.url) {
              videoElement.src = active.clip.url;
              videoElement.currentTime = active.localTime;
            } else if (Math.abs(videoElement.currentTime - active.localTime) > 0.4) {
              videoElement.currentTime = active.localTime;
            }
          }
        }

        // Draw backdrop
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw active video if available
        if (videoElement && videoElement.videoWidth) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        }

        if (onProgress) onProgress(Math.round(progress * 100));

        if (progress < 1.0) requestAnimationFrame(frame);
        else recorder.stop();
      }

      requestAnimationFrame(frame);
    });
  }

  function cancelExport() {
    isExporting = false;
  }

  return {
    exportStageVideo,
    cancelExport,
    isExporting: () => isExporting
  };
})();
