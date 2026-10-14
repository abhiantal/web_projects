/**
 * PROMOTIONAL VIDEO STUDIO - MASTER VOICE & SPEECH ENGINE (BILINGUAL)
 * Exactly 20 Top & Famous Studio Voice Choices:
 * 10 Celebrated English Personas + 10 Iconic Hindi (हिन्दी) Personas.
 * Supports Per-Cue Individual Voice Assignment, Timeline Synchronization,
 * and Native OS Neural + Google Neural + OpenAI TTS backends.
 */

window.STUDIO_VOICE_ENGINE = (function () {
  'use strict';

  let currentAudio = null;
  let currentLanguage = 'en';
  let currentPersona = 'alloy';
  let isSpeaking = false;
  let currentVideoPlaybackRate = 1.0;

  // Active utterance retention pool to prevent Chromium GC premature collection bug
  window._activeSpeechUtterances = window._activeSpeechUtterances || new Set();

  /* ── 20 Top & Famous Voice Personas (10 English + 10 Hindi) ──────────── */
  const VOICE_CATALOG = {
    en: [
      { id: 'alloy',    name: '🌟 Alloy (Balanced Studio Narrator)',        gender: 'female', pitch: 1.00, rate: 1.00, lang: 'en', match: ['Google US English', 'Zira', 'Jenny'] },
      { id: 'echo',     name: '⚡ Echo (Deep Cinematic Hero Male)',          gender: 'male',   pitch: 0.76, rate: 0.94, lang: 'en', match: ['David', 'Guy', 'Mark'] },
      { id: 'nova',     name: '🔥 Nova (Energetic Commercial Female)',       gender: 'female', pitch: 1.22, rate: 1.10, lang: 'en', match: ['Zira', 'Aria', 'Google US English'] },
      { id: 'onyx',     name: '📻 Onyx (Authoritative Deep Radio Male)',     gender: 'male',   pitch: 0.65, rate: 0.88, lang: 'en', match: ['Mark', 'David'] },
      { id: 'fable',    name: '✨ Fable (Warm Friendly Storyteller Female)', gender: 'female', pitch: 1.05, rate: 1.00, lang: 'en', match: ['Google UK English Female', 'Zira'] },
      { id: 'shimmer',  name: '🍃 Shimmer (Crisp Corporate Executive)',      gender: 'female', pitch: 1.30, rate: 1.05, lang: 'en', match: ['Google US English', 'Zira'] },
      { id: 'morgan',   name: '🎙️ Morgan (Legendary Deep Documentary)',      gender: 'male',   pitch: 0.60, rate: 0.85, lang: 'en', match: ['David', 'Mark'] },
      { id: 'david',    name: '🎬 David (Classic American Commercial Male)', gender: 'male',   pitch: 0.90, rate: 1.02, lang: 'en', match: ['David', 'George'] },
      { id: 'scarlett', name: '💎 Scarlett (Smooth Modern AI Assistant)',   gender: 'female', pitch: 1.12, rate: 1.02, lang: 'en', match: ['Zira', 'Samantha', 'Google US English'] },
      { id: 'arthur',   name: '🇬🇧 Arthur (Distinguished British Gentleman)', gender: 'male',   pitch: 0.92, rate: 0.96, lang: 'en', match: ['Google UK English Male', 'David'] }
    ],
    hi: [
      { id: 'kalpana',  name: '🇮🇳 Kalpana (कल्पना - स्पष्ट व प्रभावशाली महिला)', gender: 'female', pitch: 1.05, rate: 0.98, lang: 'hi', match: ['Kalpana', 'Google हिन्दी', 'Swara'] },
      { id: 'hemant',   name: '🎙️ Hemant (हेमंत - दमदार व गंभीर पुरुष स्वर)',    gender: 'male',   pitch: 0.82, rate: 0.94, lang: 'hi', match: ['Hemant', 'Madhur', 'Google हिन्दी'] },
      { id: 'aarav',    name: '⚡ Aarav (आरव - ऊर्जावान युवा विज्ञापन स्वर)',     gender: 'male',   pitch: 1.12, rate: 1.06, lang: 'hi', match: ['Hemant', 'Google हिन्दी'] },
      { id: 'pooja',    name: '🌸 Pooja (पूजा - सौम्य कथावाचक व मधुर स्वर)',     gender: 'female', pitch: 1.18, rate: 0.96, lang: 'hi', match: ['Kalpana', 'Google हिन्दी'] },
      { id: 'vikram',   name: '📻 Vikram (विक्रम - क्लासिक रेडियो व पॉडकास्ट)',    gender: 'male',   pitch: 0.70, rate: 0.88, lang: 'hi', match: ['Hemant', 'Google हिन्दी'] },
      { id: 'amitabh',  name: '👑 Amitabh Style (अमिताभ - गंभीर महानायक बैरीटोन)', gender: 'male', pitch: 0.58, rate: 0.86, lang: 'hi', match: ['Hemant', 'David', 'Google हिन्दी'] },
      { id: 'kavya',    name: '🌟 Kavya (काव्या - आधुनिक टेक व कॉर्पोरेट)',       gender: 'female', pitch: 1.25, rate: 1.04, lang: 'hi', match: ['Kalpana', 'Google हिन्दी'] },
      { id: 'rohan',    name: '📺 Rohan (रोहन - न्यूज व इंफॉर्मेटिव एंकर)',      gender: 'male',   pitch: 0.96, rate: 1.08, lang: 'hi', match: ['Hemant', 'Google हिन्दी'] },
      { id: 'ananya',   name: '🍃 Ananya (अनन्या - सोशल मीडिया व रील्स नैरेटर)',   gender: 'female', pitch: 1.15, rate: 1.02, lang: 'hi', match: ['Kalpana', 'Google हिन्दी'] },
      { id: 'devendra', name: '🧘 Devendra (देवेंद्र - प्रेरक व आध्यात्मिक वक्ता)', gender: 'male', pitch: 0.74, rate: 0.88, lang: 'hi', match: ['Hemant', 'Google हिन्दी'] }
    ]
  };

  /* ── Flat Lookup of all 20 personas ──────────────────────────────────── */
  const ALL_PERSONAS = [...VOICE_CATALOG.en, ...VOICE_CATALOG.hi];

  function getPersonaById(id) {
    return ALL_PERSONAS.find(p => p.id === id) || VOICE_CATALOG.en[0];
  }

  /* ── Get System Installed Voice for a Persona ────────────────────────── */
  function findBestSystemVoice(persona) {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const langPrefix = persona.lang === 'hi' ? 'hi' : 'en';
    const langVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
    const targetPool = langVoices.length > 0 ? langVoices : voices;

    // 1. Try persona match keywords
    for (const kw of persona.match) {
      const found = targetPool.find(v => v.name.toLowerCase().includes(kw.toLowerCase()));
      if (found) return found;
    }

    // 2. Match by gender
    if (persona.gender === 'female') {
      const female = targetPool.find(v => /female|woman|zira|kalpana|samantha|aria|jenny/i.test(v.name));
      if (female) return female;
    } else {
      const male = targetPool.find(v => /male|man|david|hemant|mark|guy|george/i.test(v.name));
      if (male) return male;
    }

    return targetPool[0];
  }

  /* ── Get Effective Playback Speed ────────────────────────────────────── */
  function getEffectiveSpeed() {
    if (window.STUDIO_APP && window.STUDIO_APP.getState) {
      const appState = window.STUDIO_APP.getState();
      if (appState && typeof appState.playbackRate === 'number') {
        currentVideoPlaybackRate = appState.playbackRate;
      }
    }
    return Math.max(0.5, Math.min(2.5, currentVideoPlaybackRate || 1.0));
  }

  /* ── Speak with Direct Neural Audio Stream (Google Neural MP3) ───────── */
  function playNeuralStream(text, lang) {
    return new Promise((resolve, reject) => {
      const tl = lang === 'hi' ? 'hi' : 'en';
      const encoded = encodeURIComponent(text.slice(0, 200));
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encoded}`;

      const audio = new Audio(url);
      audio.playbackRate = getEffectiveSpeed();
      currentAudio = audio;

      audio.onended = () => {
        currentAudio = null;
        resolve();
      };
      audio.onerror = (e) => {
        currentAudio = null;
        reject(e);
      };

      audio.play().catch(reject);
    });
  }

  /* ── Speak with Web Speech API (Reliable, GC-protected, Speed-Matched) ─ */
  function playSpeechSynthesis(text, persona) {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) return resolve();

      // Ensure browser is not stuck in paused state
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}

      const effectiveSpeed = getEffectiveSpeed();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = persona.lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.pitch = persona.pitch || 1.0;

      // Match voice rate strictly to video speed!
      const targetRate = Math.max(0.5, Math.min(2.5, (persona.rate || 1.0) * effectiveSpeed));
      utterance.rate = targetRate;

      const voice = findBestSystemVoice(persona);
      if (voice) utterance.voice = voice;

      // Keep in active set to prevent Chromium GC bug
      window._activeSpeechUtterances.add(utterance);

      // Watchdog timer: If browser drops onend (Chromium bug), resolve safely
      const wordCount = text.trim().split(/\s+/).length;
      const estimatedSec = Math.max(2.5, (wordCount / (2.6 * effectiveSpeed)) + 3.0);
      const watchdog = setTimeout(() => {
        window._activeSpeechUtterances.delete(utterance);
        isSpeaking = false;
        resolve();
      }, estimatedSec * 1000);

      // Periodically resume if browser pauses during long speech
      const resumeKeeper = setInterval(() => {
        if (!isSpeaking) {
          clearInterval(resumeKeeper);
        } else if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 800);

      function cleanup() {
        clearTimeout(watchdog);
        clearInterval(resumeKeeper);
        window._activeSpeechUtterances.delete(utterance);
        isSpeaking = false;
        resolve();
      }

      utterance.onend = cleanup;
      utterance.onerror = cleanup;

      isSpeaking = true;
      try {
        window.speechSynthesis.speak(utterance);
        // Force unpause if stalled
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {
        cleanup();
      }
    });
  }

  /* ── Master Speak Function ───────────────────────────────────────────── */
  async function speak(text, personaId = currentPersona, onStart = null, onEnd = null) {
    if (!text || !text.trim()) return;

    stop();

    const persona = getPersonaById(personaId);
    const lang = persona.lang || 'en';
    const effectiveSpeed = getEffectiveSpeed();

    if (window.STUDIO_AUDIO) {
      window.STUDIO_AUDIO.initAudio();
      window.STUDIO_AUDIO.setDucking(true);
    }

    if (onStart) onStart();

    let played = false;

    // 1. If OpenAI key has credit and is in English, try OpenAI TTS
    if (lang === 'en' && window.STUDIO_API && window.STUDIO_CONFIG?.getActiveKey('openai')) {
      try {
        const openaiVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
        const targetVoice = openaiVoices.includes(personaId) ? personaId : 'alloy';
        const url = await window.STUDIO_API.generateOpenAITTS(text, targetVoice);
        if (url) {
          const audio = new Audio(url);
          audio.playbackRate = effectiveSpeed;
          currentAudio = audio;
          await new Promise((res) => {
            audio.onended = () => { currentAudio = null; res(); };
            audio.onerror = () => { currentAudio = null; res(); };
            audio.play().catch(res);
          });
          played = true;
        }
      } catch (err) {
        // Fallback immediately
      }
    }

    // 2. Play using system native voice with exact persona pitch & video-matched rate
    if (!played) {
      try {
        await playSpeechSynthesis(text, persona);
        played = true;
      } catch (err) {
        console.warn('SpeechSynthesis error, falling back to neural stream:', err);
      }
    }

    // 3. Fallback to direct neural stream
    if (!played) {
      try {
        await playNeuralStream(text, lang);
      } catch (err) {
        console.warn('Neural stream fallback error:', err);
      }
    }

    if (window.STUDIO_AUDIO) {
      window.STUDIO_AUDIO.setDucking(false);
    }

    if (onEnd) onEnd();
  }

  /* ── Stop Speech Immediately ─────────────────────────────────────────── */
  function stop() {
    if (currentAudio) {
      try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {}
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (window._activeSpeechUtterances) {
      window._activeSpeechUtterances.clear();
    }
    if (window.STUDIO_AUDIO) {
      window.STUDIO_AUDIO.setDucking(false);
    }
    isSpeaking = false;
  }

  /* ── Update Playback Rate ────────────────────────────────────────────── */
  function setPlaybackRate(rate) {
    currentVideoPlaybackRate = Math.max(0.5, Math.min(2.5, rate || 1.0));
    if (currentAudio) {
      try { currentAudio.playbackRate = currentVideoPlaybackRate; } catch (e) {}
    }
  }

  /* ── Getters & Setters ───────────────────────────────────────────────── */
  function setLanguage(lang) {
    if (VOICE_CATALOG[lang]) {
      currentLanguage = lang;
      currentPersona = VOICE_CATALOG[lang][0].id;
    }
  }

  function setPersona(personaId) {
    const found = getPersonaById(personaId);
    if (found) {
      currentPersona = found.id;
      currentLanguage = found.lang;
    }
  }

  function getVoices(lang = currentLanguage) {
    return VOICE_CATALOG[lang] || VOICE_CATALOG.en;
  }

  function getAllVoices() {
    return ALL_PERSONAS;
  }

  function init() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    // Listen for timeline playback rate changes to scale voice speed in real-time
    window.addEventListener('studio-rate-changed', (e) => {
      if (e.detail && typeof e.detail.rate === 'number') {
        setPlaybackRate(e.detail.rate);
      }
    });
  }

  return {
    init,
    speak,
    stop,
    setLanguage,
    setPersona,
    setPlaybackRate,
    getVoices,
    getAllVoices,
    getPersonaById,
    getLanguage: () => currentLanguage,
    getPersona: () => currentPersona,
    VOICE_CATALOG
  };
})();
