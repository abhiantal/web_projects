/**
 * PROMOTIONAL VIDEO STUDIO - CORE AUDIO MASTER ENGINE
 * Web Audio API graph, Studio Mastering EQ, Auto-ducking, and backing audio.
 */

window.STUDIO_AUDIO = (function () {
  'use strict';

  let audioCtx = null;
  let masterGain = null;
  let musicGain = null;
  let speechGain = null;
  let lowFilter = null;
  let highFilter = null;
  let compressor = null;
  let synthBeatNode = null;
  let isBeatPlaying = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();

      masterGain = audioCtx.createGain();
      musicGain = audioCtx.createGain();
      speechGain = audioCtx.createGain();

      // Studio EQ Mastering chain
      lowFilter = audioCtx.createBiquadFilter();
      lowFilter.type = 'lowshelf';
      lowFilter.frequency.value = 180;
      lowFilter.gain.value = 3.5;

      highFilter = audioCtx.createBiquadFilter();
      highFilter.type = 'highshelf';
      highFilter.frequency.value = 4500;
      highFilter.gain.value = 3.0;

      compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.ratio.value = 8;

      // Connections
      speechGain.connect(lowFilter);
      lowFilter.connect(highFilter);
      highFilter.connect(compressor);
      compressor.connect(masterGain);

      musicGain.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function applyEQPreset(preset) {
    initAudio();
    if (preset === 'broadcast') {
      lowFilter.gain.value = 4.5;
      highFilter.gain.value = 4.0;
      compressor.threshold.value = -24;
    } else if (preset === 'crisp') {
      lowFilter.gain.value = 0.5;
      highFilter.gain.value = 6.0;
      compressor.threshold.value = -20;
    } else if (preset === 'deep') {
      lowFilter.gain.value = 8.0;
      highFilter.gain.value = 1.0;
      compressor.threshold.value = -26;
    } else if (preset === 'natural') {
      lowFilter.gain.value = 0;
      highFilter.gain.value = 1.0;
      compressor.threshold.value = -18;
    }
  }

  function setDucking(isSpeaking) {
    if (!audioCtx || !musicGain) return;
    const now = audioCtx.currentTime;
    if (isSpeaking) {
      musicGain.gain.cancelScheduledValues(now);
      musicGain.gain.linearRampToValueAtTime(0.2, now + 0.2);
    } else {
      musicGain.gain.cancelScheduledValues(now);
      musicGain.gain.linearRampToValueAtTime(0.8, now + 0.4);
    }
  }

  function toggleBackingBeat(enable) {
    initAudio();
    if (enable && !isBeatPlaying) {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, audioCtx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.16, audioCtx.currentTime);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(musicGain);

        osc.start();
        synthBeatNode = { osc, gain };
        isBeatPlaying = true;
      } catch (e) {
        console.warn('Backing beat error:', e);
      }
    } else if (!enable && isBeatPlaying) {
      if (synthBeatNode && synthBeatNode.osc) {
        try { synthBeatNode.osc.stop(); synthBeatNode.osc.disconnect(); } catch (e) {}
      }
      synthBeatNode = null;
      isBeatPlaying = false;
    }
  }

  return {
    initAudio,
    applyEQPreset,
    setDucking,
    toggleBackingBeat
  };
})();
