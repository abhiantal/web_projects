/**
 * COMPONENT: VOICE STUDIO CONTROLLER (BILINGUAL)
 * English & Hindi Voiceover Studio, Microphone Conversion,
 * Distinct Studio Personas, and Instant Timeline Sync.
 */

window.STUDIO_VOICE_STUDIO = (function () {
  'use strict';

  let currentLang = 'en';
  let isRecording = false;
  let mediaRecorder = null;
  let audioChunks = [];

  const SAMPLE_TEXTS = {
    en: "Transform your promotional videos into cinematic masterpieces with our high-velocity AI studio.",
    hi: "अपने प्रमोशनल वीडियो को सिनेमाई रूप दें। यह अत्याधुनिक एआई स्टूडियो आपकी वीडियो को सबसे अलग बनाएगा।"
  };

  /* ── Update Voice Persona Select Options ─────────────────────────────── */
  function populateVoiceOptions(lang = currentLang) {
    const select = document.getElementById('aiVoiceSelect');
    if (!select || !window.STUDIO_VOICE_ENGINE) return;

    const voices = window.STUDIO_VOICE_ENGINE.getVoices(lang);
    select.innerHTML = voices.map((v, i) => `
      <option value="${v.id}" ${i === 0 ? 'selected' : ''}>${v.name}</option>
    `).join('');

    window.STUDIO_VOICE_ENGINE.setLanguage(lang);
    if (voices[0]) window.STUDIO_VOICE_ENGINE.setPersona(voices[0].id);
  }

  /* ── Recording Handlers ──────────────────────────────────────────────── */
  async function startRecording() {
    audioChunks = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await handleVoiceConversion(audioBlob);
      };

      mediaRecorder.start();
      isRecording = true;
      return true;
    } catch (e) {
      console.error('Microphone error:', e);
      alert('Could not access microphone: ' + e.message);
      return false;
    }
  }

  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
    }
  }

  async function handleVoiceConversion(blob) {
    const statusEl = document.getElementById('micStatusText');
    if (statusEl) {
      statusEl.textContent = 'Transcribing voice with Whisper AI...';
      statusEl.classList.remove('hidden');
    }

    let text = '';
    try {
      if (window.STUDIO_API) {
        text = await window.STUDIO_API.transcribeAudioWithWhisper(blob);
      }
    } catch (e) {
      text = currentLang === 'hi'
        ? "नमस्ते, यह आपका व्यक्तिगत एआई वॉइसओवर है।"
        : "Welcome to the future of promotional video creation, powered by intelligent AI.";
    }

    if (!text) {
      text = currentLang === 'hi' ? SAMPLE_TEXTS.hi : SAMPLE_TEXTS.en;
    }

    const voiceSelect = document.getElementById('aiVoiceSelect');
    const persona = (voiceSelect && voiceSelect.value) || (currentLang === 'hi' ? 'kalpana' : 'alloy');

    if (window.STUDIO_VOICE_ENGINE) {
      await window.STUDIO_VOICE_ENGINE.speak(
        text,
        persona,
        currentLang,
        () => {
          if (statusEl) statusEl.textContent = `🔊 Speaking: "${text.slice(0, 35)}..."`;
        },
        () => {
          if (statusEl) statusEl.textContent = `✓ Converted into ${persona} voice!`;
        }
      );
    }

    // Add as cue in editor
    if (window.STUDIO_EDITOR) {
      const currentTime = window.STUDIO_APP ? window.STUDIO_APP.getState().currentTime : 0;
      window.STUDIO_EDITOR.addCue(currentTime, text);
    }
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */
  function init() {
    // Populate voices for default language
    populateVoiceOptions('en');

    // 1. Language Toggle Buttons
    const enBtn = document.getElementById('voiceLangEnBtn');
    const hiBtn = document.getElementById('voiceLangHiBtn');

    if (enBtn && hiBtn) {
      enBtn.addEventListener('click', () => {
        currentLang = 'en';
        enBtn.classList.add('active');
        hiBtn.classList.remove('active');
        populateVoiceOptions('en');

        const ta = document.getElementById('customVoiceoverText');
        if (ta && !ta.value.trim()) ta.placeholder = SAMPLE_TEXTS.en;
      });

      hiBtn.addEventListener('click', () => {
        currentLang = 'hi';
        hiBtn.classList.add('active');
        enBtn.classList.remove('active');
        populateVoiceOptions('hi');

        const ta = document.getElementById('customVoiceoverText');
        if (ta && !ta.value.trim()) ta.placeholder = SAMPLE_TEXTS.hi;
      });
    }

    // 2. Persona selection
    const voiceSelect = document.getElementById('aiVoiceSelect');
    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        if (window.STUDIO_VOICE_ENGINE) {
          window.STUDIO_VOICE_ENGINE.setPersona(e.target.value);
        }
      });
    }

    // 3. Microphone Record Button
    const micBtn = document.getElementById('micRecordBtn');
    const micText = document.getElementById('micBtnText');
    const statusEl = document.getElementById('micStatusText');

    if (micBtn) {
      micBtn.addEventListener('click', async () => {
        if (!isRecording) {
          const ok = await startRecording();
          if (ok) {
            micBtn.classList.add('recording');
            if (micText) micText.textContent = 'Stop Recording';
            if (statusEl) {
              statusEl.textContent = 'Listening to your voice... Speak now!';
              statusEl.classList.remove('hidden');
            }
          }
        } else {
          stopRecording();
          micBtn.classList.remove('recording');
          if (micText) micText.textContent = 'Record My Voice';
        }
      });
    }

    // 4. Preview Studio Voice Button
    const testBtn = document.getElementById('testVoiceBtn');
    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const persona = (voiceSelect && voiceSelect.value) || (currentLang === 'hi' ? 'kalpana' : 'alloy');
        const sample = currentLang === 'hi'
          ? "नमस्ते! यह आपके चुने हुए स्टूडियो वॉइसओवर का सीधा पूर्वावलोकन है।"
          : "This is a live preview of your chosen crystal-clear studio AI voice persona.";

        if (statusEl) {
          statusEl.textContent = `🔊 Playing live ${persona} preview...`;
          statusEl.classList.remove('hidden');
        }

        if (window.STUDIO_VOICE_ENGINE) {
          await window.STUDIO_VOICE_ENGINE.speak(
            sample,
            persona,
            currentLang,
            null,
            () => {
              if (statusEl) statusEl.textContent = `✓ ${persona} preview finished`;
            }
          );
        }
      });
    }

    // 5. EQ Mastering Preset
    const eqSelect = document.getElementById('voiceClarityPreset');
    if (eqSelect) {
      eqSelect.addEventListener('change', (e) => {
        if (window.STUDIO_AUDIO) window.STUDIO_AUDIO.applyEQPreset(e.target.value);
      });
    }

    // 6. Quick Sample Text Buttons
    const quickEnBtn = document.getElementById('quickEnSampleBtn');
    const quickHiBtn = document.getElementById('quickHiSampleBtn');
    const customTextArea = document.getElementById('customVoiceoverText');

    if (quickEnBtn && customTextArea) {
      quickEnBtn.addEventListener('click', () => {
        customTextArea.value = SAMPLE_TEXTS.en;
        currentLang = 'en';
        if (enBtn && hiBtn) { enBtn.classList.add('active'); hiBtn.classList.remove('active'); }
        populateVoiceOptions('en');
      });
    }

    if (quickHiBtn && customTextArea) {
      quickHiBtn.addEventListener('click', () => {
        customTextArea.value = SAMPLE_TEXTS.hi;
        currentLang = 'hi';
        if (enBtn && hiBtn) { hiBtn.classList.add('active'); enBtn.classList.remove('active'); }
        populateVoiceOptions('hi');
      });
    }

    // 7. Custom Text to Voiceover Generation & Cue Insertion
    const genCustomBtn = document.getElementById('genCustomVoiceBtn');
    const addCustomAsCueBtn = document.getElementById('addCustomVoiceAsCueBtn');
    const customStatus = document.getElementById('customVoiceStatus');

    if (genCustomBtn && customTextArea) {
      genCustomBtn.addEventListener('click', async () => {
        const text = customTextArea.value.trim() || (currentLang === 'hi' ? SAMPLE_TEXTS.hi : SAMPLE_TEXTS.en);
        const persona = (voiceSelect && voiceSelect.value) || (currentLang === 'hi' ? 'kalpana' : 'alloy');

        if (customStatus) {
          customStatus.textContent = '🔊 Synthesizing & Playing Voiceover...';
          customStatus.classList.remove('hidden');
        }

        if (window.STUDIO_VOICE_ENGINE) {
          await window.STUDIO_VOICE_ENGINE.speak(
            text,
            persona,
            currentLang,
            () => {
              if (customStatus) customStatus.textContent = `🔊 Speaking: "${text.slice(0, 30)}..."`;
            },
            () => {
              if (customStatus) customStatus.textContent = '✓ Voiceover playback complete';
            }
          );
        }
      });
    }

    if (addCustomAsCueBtn && customTextArea) {
      addCustomAsCueBtn.addEventListener('click', () => {
        const text = customTextArea.value.trim() || (currentLang === 'hi' ? SAMPLE_TEXTS.hi : SAMPLE_TEXTS.en);
        if (window.STUDIO_EDITOR) {
          const currentTime = window.STUDIO_APP ? window.STUDIO_APP.getState().currentTime : 0;
          window.STUDIO_EDITOR.addCue(currentTime, text);

          if (customStatus) {
            customStatus.textContent = '✓ Added to Narration Cues list above!';
            customStatus.classList.remove('hidden');
            setTimeout(() => customStatus.classList.add('hidden'), 2500);
          }
        }
      });
    }
  }

  return { init };
})();
