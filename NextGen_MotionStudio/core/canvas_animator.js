/**
 * PROMOTIONAL VIDEO STUDIO - CORE CANVAS ANIMATOR
 * 60 FPS Procedural Motion Canvas (Ken Burns, 2.5D Parallax, Particles, Storyboard Rendering).
 */

window.STUDIO_ANIMATOR = (function () {
  'use strict';

  let canvas = null;
  let ctx = null;
  let particles = [];

  function getCanvas() {
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      ctx = canvas.getContext('2d', { alpha: false });
    }
    return { canvas, ctx };
  }

  function initParticles(count = 60, style = 'neon') {
    const { canvas } = getCanvas();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: style === 'neon' ? `hsl(${Math.random() * 60 + 170}, 100%, 65%)` : `rgba(255,255,255,${Math.random() * 0.6 + 0.2})`,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function updateAndDrawParticles(context) {
    const { canvas } = getCanvas();
    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.05;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      context.beginPath();
      const r = p.radius + Math.sin(p.pulse) * 1;
      context.arc(p.x, p.y, Math.max(0.5, r), 0, Math.PI * 2);
      context.fillStyle = p.color;
      context.fill();
    }
  }

  // Animate static image into motion video clip
  async function animateImage(imageElement, motionType = 'push_zoom', durationSec = 6.0, onProgress = null) {
    const { canvas, ctx } = getCanvas();
    initParticles(45, 'subtle');

    const stream = canvas.captureStream(60);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6000000 });
    const chunks = [];

    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(URL.createObjectURL(blob));
      };

      recorder.start();
      const start = performance.now();
      const totalMs = durationSec * 1000;

      function frame(now) {
        const elapsed = now - start;
        const progress = Math.min(1.0, elapsed / totalMs);

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let scale = 1.0;
        let transX = 0;
        let transY = 0;
        let rotate = 0;

        if (motionType === 'push_zoom') scale = 1.0 + progress * 0.2;
        else if (motionType === 'pan_left') { scale = 1.15; transX = (1 - progress * 2) * (canvas.width * 0.08); }
        else if (motionType === 'tilt_3d') { scale = 1.08; rotate = Math.sin(progress * Math.PI) * 0.04; }
        else if (motionType === 'orbit') {
          scale = 1.1 + Math.sin(progress * Math.PI) * 0.06;
          transX = Math.cos(progress * Math.PI * 2) * 20;
          transY = Math.sin(progress * Math.PI * 2) * 15;
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.rotate(rotate);
        ctx.translate(-canvas.width / 2 + transX, -canvas.height / 2 + transY);

        const imgAspect = imageElement.naturalWidth / imageElement.naturalHeight;
        const cAspect = canvas.width / canvas.height;
        let dw = canvas.width, dh = canvas.height, dx = 0, dy = 0;
        if (imgAspect > cAspect) {
          dw = canvas.height * imgAspect;
          dx = (canvas.width - dw) / 2;
        } else {
          dh = canvas.width / imgAspect;
          dy = (canvas.height - dh) / 2;
        }
        ctx.drawImage(imageElement, dx, dy, dw, dh);
        ctx.restore();

        // Light sweep glare
        ctx.save();
        const sweepGrad = ctx.createLinearGradient(progress * canvas.width * 2 - canvas.width, 0, progress * canvas.width * 2, canvas.height);
        sweepGrad.addColorStop(0, 'transparent');
        sweepGrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        sweepGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        updateAndDrawParticles(ctx);

        if (onProgress) onProgress(Math.round(progress * 100));

        if (progress < 1.0) requestAnimationFrame(frame);
        else recorder.stop();
      }

      requestAnimationFrame(frame);
    });
  }

  // Render multi-scene storyboard into full video
  async function renderStoryboard(scenes, style = 'animation', onProgress = null) {
    const { canvas, ctx } = getCanvas();
    initParticles(50, style === 'cyberpunk' ? 'neon' : 'ambient');

    const totalSec = scenes.reduce((acc, s) => acc + (s.duration || 5), 0);
    const stream = canvas.captureStream(60);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
    const chunks = [];

    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve({ videoUrl: URL.createObjectURL(blob), duration: totalSec });
      };

      recorder.start();
      const start = performance.now();
      const totalMs = totalSec * 1000;

      function render(now) {
        const elapsed = now - start;
        const progress = Math.min(1.0, elapsed / totalMs);
        const curSec = (elapsed / 1000);

        // Find active scene
        let accum = 0;
        let active = scenes[0];
        for (let s of scenes) {
          const sDur = s.duration || 5;
          if (curSec >= accum && curSec <= accum + sDur) {
            active = s;
            break;
          }
          accum += sDur;
        }

        // Draw background
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, style === 'cyberpunk' ? '#0d0f1f' : '#090a0f');
        grad.addColorStop(0.5, style === 'cyberpunk' ? '#1e1035' : '#141824');
        grad.addColorStop(1, '#0b1626');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Glowing Orb
        const orbX = canvas.width / 2 + Math.cos(curSec * 1.5) * (canvas.width * 0.25);
        const orbY = canvas.height / 2 + Math.sin(curSec * 1.8) * (canvas.height * 0.2);
        const orbGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, canvas.width * 0.45);
        orbGrad.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        orbGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = orbGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        updateAndDrawParticles(ctx);

        // Typography
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = 'rgba(99, 102, 241, 0.35)';
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - 130, canvas.height * 0.25 - 22, 260, 44, 22);
        ctx.fill();

        ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#A5B4FC';
        ctx.fillText((active.title || 'SCENE').toUpperCase(), canvas.width / 2, canvas.height * 0.25);

        ctx.font = '900 46px "Outfit", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 18;

        const words = (active.script || '').split(' ');
        let lines = [];
        let line = '';
        for (let w of words) {
          if ((line + w).length > 22) { lines.push(line.trim()); line = w + ' '; }
          else line += w + ' ';
        }
        if (line) lines.push(line.trim());

        let sy = canvas.height * 0.42;
        lines.forEach((l, i) => ctx.fillText(l, canvas.width / 2, sy + i * 56));

        if (active.highlightWord) {
          ctx.font = '900 60px "Outfit", sans-serif';
          ctx.fillStyle = '#FDE047';
          ctx.shadowColor = 'rgba(253, 224, 71, 0.85)';
          ctx.shadowBlur = 24;
          ctx.fillText(active.highlightWord.toUpperCase(), canvas.width / 2, sy + lines.length * 56 + 36);
        }
        ctx.restore();

        if (onProgress) onProgress(Math.round(progress * 100));

        if (progress < 1.0) requestAnimationFrame(render);
        else recorder.stop();
      }

      requestAnimationFrame(render);
    });
  }

  return {
    animateImage,
    renderStoryboard
  };
})();
