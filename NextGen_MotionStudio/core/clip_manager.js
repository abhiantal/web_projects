/**
 * PROMOTIONAL VIDEO STUDIO - MASTER CLIP MANAGER
 * Handles multi-video clip loading, trimming (start/end), reordering,
 * duration computation, and seamless multi-clip timeline synchronization.
 */

window.STUDIO_CLIPS = (function () {
  'use strict';

  let clips = []; // Array of { id, file, url, name, originalDuration, trimStart, trimEnd, effectiveDuration, globalStart, globalEnd, width, height }

  function generateId() {
    return 'clip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  /* ── Load Video Metadata using Offscreen Video ────────────────────────── */
  function readVideoMetadata(url) {
    return new Promise((resolve) => {
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.src = url;
      vid.onloadedmetadata = () => {
        resolve({
          duration: vid.duration && !isNaN(vid.duration) && isFinite(vid.duration) ? vid.duration : 10.0,
          width: vid.videoWidth || 1080,
          height: vid.videoHeight || 1920
        });
      };
      vid.onerror = () => {
        resolve({ duration: 10.0, width: 1080, height: 1920 });
      };
    });
  }

  /* ── Recalculate Global Timeline Offsets ──────────────────────────────── */
  function recalculateTimeline() {
    let cumulative = 0;
    clips.forEach((clip) => {
      // Ensure trim boundaries are valid
      clip.trimStart = Math.max(0, Math.min(clip.trimStart || 0, clip.originalDuration - 0.1));
      clip.trimEnd = Math.max(clip.trimStart + 0.1, Math.min(clip.trimEnd || clip.originalDuration, clip.originalDuration));
      clip.effectiveDuration = Math.max(0.1, clip.trimEnd - clip.trimStart);

      clip.globalStart = cumulative;
      clip.globalEnd = cumulative + clip.effectiveDuration;
      cumulative += clip.effectiveDuration;
    });

    // Total duration strictly matches sum of sequenced clips
    const totalDuration = clips.length > 0 ? Math.max(0.5, cumulative) : 10.0;

    window.dispatchEvent(new CustomEvent('studio-clips-updated', {
      detail: {
        clips: [...clips],
        totalDuration,
        count: clips.length
      }
    }));

    return totalDuration;
  }

  /* ── Add Single Clip from File or URL ─────────────────────────────────── */
  async function addClip(fileOrUrl, customName = null) {
    let url = '';
    let name = '';
    let file = null;

    if (typeof fileOrUrl === 'string') {
      url = fileOrUrl;
      name = customName || 'Video_Clip.mp4';
    } else if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
      file = fileOrUrl;
      url = URL.createObjectURL(fileOrUrl);
      name = customName || fileOrUrl.name || 'recording.mp4';
    } else {
      return null;
    }

    const meta = await readVideoMetadata(url);
    const clipId = generateId();

    const clip = {
      id: clipId,
      file,
      url,
      name,
      originalDuration: Math.max(0.5, meta.duration),
      trimStart: 0,
      trimEnd: Math.max(0.5, meta.duration),
      effectiveDuration: Math.max(0.5, meta.duration),
      globalStart: 0,
      globalEnd: Math.max(0.5, meta.duration),
      width: meta.width,
      height: meta.height
    };

    clips.push(clip);
    recalculateTimeline();
    return clip;
  }

  /* ── Add Multiple Clips Concurrently / Sequentially ───────────────────── */
  async function addMultipleClips(fileList) {
    if (!fileList || fileList.length === 0) return [];
    const added = [];
    for (let i = 0; i < fileList.length; i++) {
      const clip = await addClip(fileList[i]);
      if (clip) added.push(clip);
    }
    return added;
  }

  /* ── Remove Clip by ID ────────────────────────────────────────────────── */
  function removeClip(id) {
    const idx = clips.findIndex(c => c.id === id);
    if (idx !== -1) {
      const removed = clips.splice(idx, 1)[0];
      if (removed.file && removed.url) {
        try { URL.revokeObjectURL(removed.url); } catch (e) {}
      }
      recalculateTimeline();
    }
  }

  /* ── Reorder Clip (Move Up / Down) ────────────────────────────────────── */
  function moveClip(idx, direction) {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= clips.length) return;
    const temp = clips[idx];
    clips[idx] = clips[targetIdx];
    clips[targetIdx] = temp;
    recalculateTimeline();
  }

  /* ── Update Clip Trim Start & End Times ───────────────────────────────── */
  function updateTrim(id, newStart, newEnd) {
    const clip = clips.find(c => c.id === id);
    if (!clip) return;

    clip.trimStart = Math.max(0, Math.min(newStart, clip.originalDuration - 0.1));
    clip.trimEnd = Math.max(clip.trimStart + 0.1, Math.min(newEnd, clip.originalDuration));
    clip.effectiveDuration = clip.trimEnd - clip.trimStart;

    recalculateTimeline();
  }

  /* ── Get Active Clip and Local Time at Given Global Time ──────────────── */
  function getActiveClipAtTime(globalTime) {
    if (clips.length === 0) return null;

    // Find matching clip
    let matched = clips.find(c => globalTime >= c.globalStart && globalTime < c.globalEnd);
    let clipIndex = clips.indexOf(matched);

    if (!matched) {
      // If at or past the end, pick the last clip
      matched = clips[clips.length - 1];
      clipIndex = clips.length - 1;
    }

    const localOffset = Math.max(0, globalTime - matched.globalStart);
    const localTime = Math.min(matched.trimEnd, matched.trimStart + localOffset);

    return {
      clip: matched,
      clipIndex,
      localTime,
      totalClips: clips.length
    };
  }

  /* ── Get Total Duration of All Merged Clips ──────────────────────────── */
  function getTotalDuration() {
    if (clips.length === 0) return 0;
    const last = clips[clips.length - 1];
    return last.globalEnd;
  }

  /* ── Clear All Clips ──────────────────────────────────────────────────── */
  function clearAll() {
    clips.forEach(c => {
      if (c.file && c.url) {
        try { URL.revokeObjectURL(c.url); } catch (e) {}
      }
    });
    clips = [];
    recalculateTimeline();
  }

  /* ── Split Clip at Given Local Time (Blade Cut Tool) ─────────────────── */
  function splitClipAtTime(clipId, splitLocalTime) {
    const idx = clips.findIndex(c => c.id === clipId);
    if (idx === -1) return null;

    const clipA = clips[idx];

    // Must be at least 0.35s (approx 10 frames) away from boundaries to prevent micro-slices
    if (splitLocalTime <= clipA.trimStart + 0.35 || splitLocalTime >= clipA.trimEnd - 0.35) {
      return null;
    }

    const cutTime = Math.round(splitLocalTime * 100) / 100;

    const originalEnd = clipA.trimEnd;
    const baseName = clipA.name.replace(/\s*\(Part \d+\)$/, '');

    // Clip A ends at cut point
    clipA.trimEnd = cutTime;
    clipA.effectiveDuration = cutTime - clipA.trimStart;

    // Clip B starts at cut point and ends at original end
    const clipB = {
      id: generateId(),
      file: clipA.file,
      url: clipA.url,
      name: `${baseName} (Part 2)`,
      originalDuration: clipA.originalDuration,
      trimStart: cutTime,
      trimEnd: originalEnd,
      effectiveDuration: originalEnd - cutTime,
      globalStart: 0,
      globalEnd: 0,
      width: clipA.width,
      height: clipA.height
    };

    clips.splice(idx + 1, 0, clipB);
    recalculateTimeline();

    return { clipA, clipB };
  }

  /* ── Mark In (Set Trim Start to Current Frame) ────────────────────────── */
  function setClipMarkIn(clipId, localTime) {
    const clip = clips.find(c => c.id === clipId);
    if (!clip) return null;
    const newStart = Math.max(0, Math.min(localTime, clip.trimEnd - 0.05));
    clip.trimStart = newStart;
    clip.effectiveDuration = clip.trimEnd - clip.trimStart;
    recalculateTimeline();
    return clip;
  }

  /* ── Mark Out (Set Trim End to Current Frame) ─────────────────────────── */
  function setClipMarkOut(clipId, localTime) {
    const clip = clips.find(c => c.id === clipId);
    if (!clip) return null;
    const newEnd = Math.min(clip.originalDuration, Math.max(localTime, clip.trimStart + 0.05));
    clip.trimEnd = newEnd;
    clip.effectiveDuration = clip.trimEnd - clip.trimStart;
    recalculateTimeline();
    return clip;
  }

  /* ── Duplicate Clip ───────────────────────────────────────────────────── */
  function duplicateClip(clipId) {
    const idx = clips.findIndex(c => c.id === clipId);
    if (idx === -1) return null;
    const source = clips[idx];
    const clone = {
      ...source,
      id: generateId(),
      name: `${source.name} (Copy)`
    };
    clips.splice(idx + 1, 0, clone);
    recalculateTimeline();
    return clone;
  }

  /* ── Get Clip by ID ───────────────────────────────────────────────────── */
  function getClipById(clipId) {
    return clips.find(c => c.id === clipId) || null;
  }

  return {
    addClip,
    addMultipleClips,
    removeClip,
    moveClip,
    updateTrim,
    splitClipAtTime,
    setClipMarkIn,
    setClipMarkOut,
    duplicateClip,
    getClipById,
    getActiveClipAtTime,
    getTotalDuration,
    getClips: () => [...clips],
    getClipCount: () => clips.length,
    clearAll,
    recalculateTimeline
  };
})();
