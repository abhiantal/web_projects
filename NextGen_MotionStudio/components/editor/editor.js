/**
 * COMPONENT: EDITOR & ENHANCER CONTROLLER
 * Features:
 * 1. Strict Language Filtering: Shows ONLY English voices when EN is active, and ONLY Hindi voices when HI is active.
 * 2. Single Unified Script Container: Entire combined script in ONE editable container, where every paragraph/blank line break creates or updates a separate cue.
 * 3. Per-Cue Independent Voice Assignment with Timeline Synchronization.
 */

window.STUDIO_EDITOR = (function () {
  'use strict';

  const DEFAULT_ENGLISH_CUES = [
    { time: 0.5, tag: '1. The Hook', text: 'Tired of dealing with complicated tools and slow workflows?', voice: 'echo' },
    { time: 5.5, tag: '2. The Solution', text: 'Introducing the all-in-one studio built for pure speed and precision.', voice: 'nova' },
    { time: 11.0, tag: '3. Core Power', text: 'Effortlessly create stunning promotional videos with smart AI framing.', voice: 'alloy' },
    { time: 17.0, tag: '4. Voice & Sound', text: 'Convert your voice into studio AI narration with crystal clear audio.', voice: 'onyx' },
    { time: 23.0, tag: '5. Action', text: 'Get started today and elevate your content to the next level!', voice: 'scarlett' }
  ];

  const DEFAULT_HINDI_CUES = [
    { time: 0.5, tag: '1. हुक (Hook)', text: 'क्या आप जटिल टूल्स और धीमी वीडियो एडिटिंग से परेशान हैं?', voice: 'hemant' },
    { time: 5.5, tag: '2. समाधान (Solution)', text: 'पेश है आपका अपना ऑल-इन-वन एआई प्रोमोशनल वीडियो स्टूडियो।', voice: 'kalpana' },
    { time: 11.0, tag: '3. मुख्य शक्ति (Power)', text: 'स्मार्ट एआई फ्रेमिंग के साथ शानदार प्रमोशनल वीडियो आसानी से बनाएं।', voice: 'aarav' },
    { time: 17.0, tag: '4. स्वर व संगीत (Audio)', text: 'अपनी आवाज़ को स्टूडियो ग्रेड एआई वॉइसओवर में तुरंत बदलें।', voice: 'pooja' },
    { time: 23.0, tag: '5. शुरुआत करें (Action)', text: 'आज ही शुरू करें और अपने कंटेंट को नई ऊँचाइयों पर ले जाएं!', voice: 'amitabh' }
  ];

  let cues = JSON.parse(JSON.stringify(DEFAULT_ENGLISH_CUES));
  let currentLang = 'en';
  let masterVoice = 'alloy';
  let isVoiceSyncEnabled = true;
  let showMasterScript = false;
  let currentlySpeakingIdx = -1;
  let lastSpokenCueIdx = -1;

  /* ── Format Combined Script for the Single Container ─────────────────── */
  function getCombinedScriptText() {
    return cues.map(c => c.text.trim()).filter(Boolean).join('\n\n');
  }

  /* ── Parse Single Container Text into Cues (Paragraphs -> Cues) ──────── */
  function applyCombinedScriptToCues(text) {
    if (!text || !text.trim()) return;

    // Split by blank lines or multiple newlines (each paragraph = separate cue)
    const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length === 0) return;

    const newCues = paragraphs.map((para, i) => {
      const existing = cues[i];
      const time = existing && typeof existing.time === 'number' ? existing.time : (i * 5.0);
      const tag = existing ? existing.tag : (currentLang === 'hi' ? `दृश्य ${i + 1}` : `Scene ${i + 1}`);
      const voice = existing && existing.voice ? existing.voice : masterVoice;
      return { time, tag, text: para, voice };
    });

    cues = newCues;
    renderCues();
  }

  /* ── Speak Any Text with Specific Persona ────────────────────────────── */
  async function speakText(text, personaId = masterVoice, onStart = null, onEnd = null) {
    if (!text || !text.trim()) return;
    if (window.STUDIO_VOICE_ENGINE) {
      await window.STUDIO_VOICE_ENGINE.speak(text, personaId, onStart, onEnd);
    }
  }

  /* ── Stop Current Speech ─────────────────────────────────────────────── */
  function stopCurrentVoice() {
    if (window.STUDIO_VOICE_ENGINE) {
      window.STUDIO_VOICE_ENGINE.stop();
    }
    currentlySpeakingIdx = -1;
    document.querySelectorAll('.cue-card').forEach(c => c.classList.remove('cue-active-speaking'));
    document.querySelectorAll('.cue-play-voice-btn').forEach(b => {
      b.classList.remove('is-playing');
      b.innerHTML = '🔊 Play Voice';
    });
  }

  /* ── Speak Single Cue with its Assigned Voice ────────────────────────── */
  async function speakCue(idx) {
    if (idx < 0 || idx >= cues.length) return;
    const c = cues[idx];
    const cueVoice = c.voice || masterVoice;

    stopCurrentVoice();
    currentlySpeakingIdx = idx;

    const card = document.getElementById(`cueCard-${idx}`);
    const playBtn = card ? card.querySelector('.cue-play-voice-btn') : null;

    if (card) card.classList.add('cue-active-speaking');
    if (playBtn) {
      playBtn.classList.add('is-playing');
      playBtn.innerHTML = `
        <span class="sound-wave-mini"><span></span><span></span><span></span></span>
        Speaking...
      `;
    }

    await speakText(
      c.text,
      cueVoice,
      null,
      () => {
        if (card) card.classList.remove('cue-active-speaking');
        if (playBtn) {
          playBtn.classList.remove('is-playing');
          playBtn.innerHTML = '🔊 Play Voice';
        }
        currentlySpeakingIdx = -1;
      }
    );
  }

  let lastTickTime = 0;

  /* ── Timeline Synchronized Voice Playback ────────────────────────────── */
  function onTimelineTick(currentTime, isPlaying) {
    highlightActiveClip(currentTime);

    if (!isPlaying || !isVoiceSyncEnabled) return;

    // Reset if looped or backward seek/jump
    if (currentTime < 0.3 || (lastTickTime > 0 && currentTime < lastTickTime - 0.5)) {
      lastSpokenCueIdx = -1;
    }
    lastTickTime = currentTime;

    for (let i = 0; i < cues.length; i++) {
      const c = cues[i];
      if (currentTime >= c.time && currentTime < c.time + 1.2 && lastSpokenCueIdx !== i) {
        lastSpokenCueIdx = i;
        speakCue(i);
        break;
      }
    }
  }

  /* ── Highlight Currently Playing Clip in Sequencer ───────────────────── */
  function highlightActiveClip(currentTime) {
    if (!window.STUDIO_CLIPS) return;
    const active = window.STUDIO_CLIPS.getActiveClipAtTime(currentTime);
    document.querySelectorAll('.clip-card').forEach((card, idx) => {
      if (active && active.clipIndex === idx) {
        card.classList.add('active-playing');
      } else {
        card.classList.remove('active-playing');
      }
    });
  }

  /* ── Play All Cues Sequentially ──────────────────────────────────────── */
  async function playAllCues() {
    stopCurrentVoice();
    for (let i = 0; i < cues.length; i++) {
      await new Promise(resolve => {
        speakCue(i);
        const words = cues[i].text.split(/\s+/).length;
        const durationSec = Math.max(2.8, (words / 2.6)) * 1000;
        setTimeout(resolve, durationSec + 500);
      });
    }
  }

  /* ── Generate Options HTML (STRICTLY FILTERED BY CHOSEN LANGUAGE) ────── */
  function getVoicesDropdownHTML(selectedId, lang = currentLang) {
    if (!window.STUDIO_VOICE_ENGINE) return '';
    // Show ONLY the voices for the chosen language!
    const targetVoices = window.STUDIO_VOICE_ENGINE.VOICE_CATALOG[lang] || window.STUDIO_VOICE_ENGINE.VOICE_CATALOG.en;

    return targetVoices.map(v => `
      <option value="${v.id}" ${v.id === selectedId ? 'selected' : ''}>${v.name}</option>
    `).join('');
  }

  /* ── Render Cue List & Controls in Editor Pane ───────────────────────── */
  function renderCues() {
    const list = document.getElementById('scriptCueList');
    if (!list) return;
    list.innerHTML = '';

    // Master Voice Controls Header
    const voiceHeader = document.createElement('div');
    voiceHeader.className = 'editor-voice-controls';
    voiceHeader.innerHTML = `
      <div class="voice-controls-row">
        <!-- Language Switcher: English / Hindi -->
        <div class="btn-group" style="display:inline-flex; gap:4px;">
          <button id="editorLangEnBtn" class="btn-pill ${currentLang === 'en' ? 'active' : ''}" style="padding:3px 8px; font-size:10.5px;" title="English Mode (Shows 10 English Voices)">🇬🇧 EN</button>
          <button id="editorLangHiBtn" class="btn-pill ${currentLang === 'hi' ? 'active' : ''}" style="padding:3px 8px; font-size:10.5px;" title="हिन्दी Mode (Shows 10 Hindi Voices)">🇮🇳 HI</button>
        </div>

        <!-- Master Voice Dropdown (Strictly filtered by currentLang) -->
        <select id="masterVoiceSelect" class="voice-persona-select-compact" style="flex:1; max-width:210px;" title="Default Voice Persona for ${currentLang === 'hi' ? 'Hindi' : 'English'}">
          ${getVoicesDropdownHTML(masterVoice, currentLang)}
        </select>
      </div>

      <div class="voice-controls-row" style="margin-top:2px;">
        <label class="voice-sync-toggle-label" title="Speak narration cues automatically when video timeline passes them">
          <input type="checkbox" id="syncVoiceToggle" ${isVoiceSyncEnabled ? 'checked' : ''}>
          <span>🎙️ Sync on Video Timeline</span>
        </label>
        <button id="toggleMasterScriptBtn" class="btn-small-ghost" style="font-size:10px; padding:2px 7px;">
          ${showMasterScript ? '📑 Hide Full Script' : '📜 Show Combined Script'}
        </button>
      </div>

      <div class="voice-action-btns-row" style="margin-top:4px;">
        <button class="btn-editor-voice" id="playAllCuesBtn">
          🔊 Play Full Voiceover
        </button>
        <button class="btn-editor-voice" id="loadPresetScriptBtn">
          ${currentLang === 'hi' ? '🇮🇳 Load Hindi Script' : '🇬🇧 Load English Script'}
        </button>
      </div>
    `;

    list.appendChild(voiceHeader);

    // Single Unified Master Script Container (Editable, 1 box for easy Copy/Paste)
    if (showMasterScript) {
      const combinedText = getCombinedScriptText();
      const wordCount = combinedText.trim() ? combinedText.trim().split(/\s+/).length : 0;

      const masterCard = document.createElement('div');
      masterCard.className = 'master-script-card';
      masterCard.innerHTML = `
        <div class="master-script-header">
          <div class="master-script-title">
            <span>📜</span>
            <span>Full Script</span>
          </div>
          <div class="master-script-actions">
            <button id="copyFullScriptBtn" class="btn-small-ghost" style="font-size:10px; padding:3px 8px;">📋 Copy All</button>
            <button id="applyFullScriptBtn" class="btn-primary-action" style="font-size:10px; padding:3px 10px;">📥 Apply to Cues</button>
          </div>
        </div>

        <textarea id="masterScriptTextarea" class="master-script-textarea" rows="7"
          placeholder="Paste or type your full script here. Every paragraph / line space creates or updates a separate cue...">${combinedText}</textarea>

        <div class="master-script-footer">
          <span>💡 Every line space represents the next cue</span>
          <span class="master-script-badge" id="masterScriptStats">${cues.length} Cues · ${wordCount} Words</span>
        </div>
      `;

      // Copy script
      const copyBtn = masterCard.querySelector('#copyFullScriptBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const ta = masterCard.querySelector('#masterScriptTextarea');
          if (ta) {
            navigator.clipboard.writeText(ta.value);
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => copyBtn.textContent = '📋 Copy All', 2000);
          }
        });
      }

      // Apply script to cues (Paste & Apply)
      const applyBtn = masterCard.querySelector('#applyFullScriptBtn');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          const ta = masterCard.querySelector('#masterScriptTextarea');
          if (ta && ta.value.trim()) {
            applyCombinedScriptToCues(ta.value);
            applyBtn.textContent = '✓ Applied!';
            setTimeout(() => applyBtn.textContent = '📥 Apply to Cues', 2000);
          }
        });
      }

      list.appendChild(masterCard);
    }

    // Wire up header events
    const enBtn = voiceHeader.querySelector('#editorLangEnBtn');
    const hiBtn = voiceHeader.querySelector('#editorLangHiBtn');
    const masterSelect = voiceHeader.querySelector('#masterVoiceSelect');
    const syncToggle = voiceHeader.querySelector('#syncVoiceToggle');
    const playAllBtn = voiceHeader.querySelector('#playAllCuesBtn');
    const toggleScriptBtn = voiceHeader.querySelector('#toggleMasterScriptBtn');
    const loadPresetBtn = voiceHeader.querySelector('#loadPresetScriptBtn');

    if (enBtn && hiBtn) {
      enBtn.addEventListener('click', () => {
        currentLang = 'en';
        masterVoice = 'alloy';
        // Reset cues to English personas
        cues.forEach(c => {
          if (!window.STUDIO_VOICE_ENGINE?.VOICE_CATALOG.en.some(v => v.id === c.voice)) {
            c.voice = 'alloy';
          }
        });
        renderCues();
      });

      hiBtn.addEventListener('click', () => {
        currentLang = 'hi';
        masterVoice = 'kalpana';
        // Reset cues to Hindi personas
        cues.forEach(c => {
          if (!window.STUDIO_VOICE_ENGINE?.VOICE_CATALOG.hi.some(v => v.id === c.voice)) {
            c.voice = 'kalpana';
          }
        });
        renderCues();
      });
    }

    if (masterSelect) {
      masterSelect.addEventListener('change', (e) => {
        masterVoice = e.target.value;
        // Optionally update any cues matching the previous master voice
        renderCues();
      });
    }

    if (syncToggle) {
      syncToggle.addEventListener('change', (e) => {
        isVoiceSyncEnabled = e.target.checked;
      });
    }

    if (playAllBtn) playAllBtn.addEventListener('click', playAllCues);

    if (toggleScriptBtn) {
      toggleScriptBtn.addEventListener('click', () => {
        showMasterScript = !showMasterScript;
        renderCues();
      });
    }

    if (loadPresetBtn) {
      loadPresetBtn.addEventListener('click', () => {
        cues = JSON.parse(JSON.stringify(currentLang === 'hi' ? DEFAULT_HINDI_CUES : DEFAULT_ENGLISH_CUES));
        renderCues();
      });
    }

    // Render Individual Cue Cards (with Per-Cue Voice Selection Strictly Filtered by currentLang)
    cues.forEach((c, idx) => {
      // Ensure cue voice belongs to current language catalog
      const catalog = window.STUDIO_VOICE_ENGINE ? window.STUDIO_VOICE_ENGINE.VOICE_CATALOG[currentLang] : [];
      let cueVoice = c.voice;
      if (!catalog.some(v => v.id === cueVoice)) {
        cueVoice = catalog[0] ? catalog[0].id : masterVoice;
        c.voice = cueVoice;
      }

      const card = document.createElement('div');
      card.className = 'cue-card';
      card.id = `cueCard-${idx}`;
      card.innerHTML = `
        <div class="cue-header">
          <div class="cue-header-left">
            <span class="cue-tag-badge">${c.tag || (currentLang === 'hi' ? `दृश्य ${idx + 1}` : `Cue ${idx + 1}`)}</span>
            <input type="text" class="cue-time-input" value="${c.time.toFixed(1)}s" title="Trigger Time in seconds">
            <span style="font-size:9.5px; color:var(--text-muted);">${idx + 1}/${cues.length}</span>
          </div>
          <button class="cue-delete-btn" title="Delete Cue">✕</button>
        </div>

        <textarea class="form-control cue-input" rows="2" placeholder="${currentLang === 'hi' ? 'यहाँ दृश्य के लिए हिन्दी स्क्रिप्ट लिखें...' : 'Enter narration script for this scene...'}">${c.text}</textarea>

        <div class="cue-audio-strip">
          <!-- Per-Cue Voice Dropdown (ONLY shows current language voices) -->
          <select class="cue-voice-selector" data-idx="${idx}" title="Change Voice for this Cue (${currentLang.toUpperCase()})">
            ${getVoicesDropdownHTML(cueVoice, currentLang)}
          </select>

          <button class="cue-play-voice-btn" data-idx="${idx}" title="Listen to this cue immediately">
            🔊 Play Voice
          </button>
        </div>
      `;

      // Textarea input
      card.querySelector('.cue-input').addEventListener('input', (e) => {
        cues[idx].text = e.target.value;
        // Keep master script textarea in sync if visible
        const masterTa = document.getElementById('masterScriptTextarea');
        if (masterTa) {
          masterTa.value = getCombinedScriptText();
        }
      });

      // Per-Cue Voice Selection Change
      const cueVoiceSelect = card.querySelector('.cue-voice-selector');
      cueVoiceSelect.addEventListener('change', (e) => {
        cues[idx].voice = e.target.value;
      });

      // Time change
      card.querySelector('.cue-time-input').addEventListener('change', (e) => {
        const val = parseFloat(e.target.value.replace('s', ''));
        if (!isNaN(val) && val >= 0) {
          cues[idx].time = val;
          e.target.value = val.toFixed(1) + 's';
        }
      });

      // Delete cue
      card.querySelector('.cue-delete-btn').addEventListener('click', () => {
        if (cues.length > 1) {
          cues.splice(idx, 1);
          renderCues();
        }
      });

      // Play Voice button for this specific cue
      const playBtn = card.querySelector('.cue-play-voice-btn');
      playBtn.addEventListener('click', () => {
        if (currentlySpeakingIdx === idx) {
          stopCurrentVoice();
        } else {
          speakCue(idx);
        }
      });

      list.appendChild(card);
    });
  }

  function setCues(newCues) {
    cues = newCues.map((c, i) => ({
      time: typeof c.time === 'number' ? c.time : (i * 5.0),
      tag: c.tag || (currentLang === 'hi' ? `दृश्य ${i + 1}` : `Scene ${i + 1}`),
      text: c.text || '',
      voice: c.voice || (currentLang === 'hi' ? 'kalpana' : 'alloy')
    }));
    renderCues();
  }

  function addCue(currentTime, text = '', voice = null) {
    const roundTime = Math.round((currentTime || 0) * 10) / 10;
    const defaultText = currentLang === 'hi'
      ? 'नया प्रमोशनल दृश्य यहाँ जोड़ें...'
      : 'New dynamic promotional cue...';

    cues.push({
      time: roundTime,
      tag: currentLang === 'hi' ? `दृश्य ${cues.length + 1}` : `Cue ${cues.length + 1}`,
      text: text || defaultText,
      voice: voice || masterVoice
    });
    cues.sort((a, b) => a.time - b.time);
    renderCues();

    setTimeout(() => {
      const idx = cues.findIndex(c => c.time === roundTime);
      const card = document.getElementById(`cueCard-${idx}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('cue-active-speaking');
        setTimeout(() => card.classList.remove('cue-active-speaking'), 1200);
      }
    }, 50);
  }

  /* ── Render Multi-Video Clips in Sequencer List ──────────────────────── */
  function renderClips() {
    const listContainer = document.getElementById('clipListContainer');
    const summaryBar = document.getElementById('mergeSummaryBar');
    const badge = document.getElementById('clipCountBadge');
    const dropZone = document.getElementById('dropZone');
    if (!listContainer || !window.STUDIO_CLIPS) return;

    const clips = window.STUDIO_CLIPS.getClips();
    const totalDuration = window.STUDIO_CLIPS.getTotalDuration();

    if (badge) {
      badge.textContent = clips.length === 0 ? '0 Clips' : `${clips.length} Clips · ${totalDuration.toFixed(1)}s`;
    }

    if (clips.length === 0) {
      listContainer.classList.add('hidden');
      if (summaryBar) summaryBar.classList.add('hidden');
      if (dropZone) dropZone.classList.remove('hidden');
      listContainer.innerHTML = '';
      return;
    }

    listContainer.classList.remove('hidden');
    if (summaryBar) summaryBar.classList.remove('hidden');
    if (dropZone) dropZone.classList.add('hidden');

    const summaryTitle = document.getElementById('mergeSummaryTitle');
    const summaryDur = document.getElementById('mergeSummaryDuration');
    if (summaryTitle) summaryTitle.textContent = `${clips.length} Clips Sequenced`;
    if (summaryDur) summaryDur.textContent = `${totalDuration.toFixed(1)}s`;

    listContainer.innerHTML = '';

    clips.forEach((clip, idx) => {
      const card = document.createElement('div');
      card.className = 'clip-card';
      card.id = `clipCard-${idx}`;
      
      const usedPct = Math.min(100, Math.max(1, (clip.effectiveDuration / Math.max(0.1, clip.originalDuration)) * 100));
      const leftPct = Math.min(100, Math.max(0, (clip.trimStart / Math.max(0.1, clip.originalDuration)) * 100));
      const startFrame = Math.floor(clip.trimStart * 30);
      const endFrame = Math.floor(clip.trimEnd * 30);

      card.innerHTML = `
        <div class="clip-card-header">
          <div class="clip-info-left">
            <span class="clip-index-badge">Scene ${idx + 1}</span>
            <span class="clip-name-text" title="${clip.name}">${clip.name}</span>
          </div>
          <span class="clip-duration-chip">${clip.effectiveDuration.toFixed(1)}s <small style="opacity:0.75; font-size:9px;">(F${endFrame - startFrame})</small></span>
        </div>

        <div class="clip-trim-box">
          <div class="trim-inputs-row">
            <div class="trim-field">
              <span class="trim-label">START <small style="color:#38bdf8;">F${startFrame}</small></span>
              <div class="trim-input-wrap">
                <input type="number" class="trim-num-input" step="0.1" min="0" max="${Math.max(0, clip.originalDuration - 0.1).toFixed(1)}" value="${clip.trimStart.toFixed(1)}" data-id="${clip.id}" data-field="start">
                <span class="trim-unit">s</span>
              </div>
            </div>

            <div class="trim-range-visual">
              <div class="trim-visual-track">
                <div class="trim-visual-fill" style="left: ${leftPct.toFixed(1)}%; width: ${usedPct.toFixed(1)}%;"></div>
              </div>
              <span class="trim-ratio-text">${clip.effectiveDuration.toFixed(1)}s of ${clip.originalDuration.toFixed(1)}s used</span>
            </div>

            <div class="trim-field">
              <span class="trim-label">END <small style="color:#38bdf8;">F${endFrame}</small></span>
              <div class="trim-input-wrap">
                <input type="number" class="trim-num-input" step="0.1" min="0.1" max="${clip.originalDuration.toFixed(1)}" value="${clip.trimEnd.toFixed(1)}" data-id="${clip.id}" data-field="end">
                <span class="trim-unit">s</span>
              </div>
            </div>
          </div>
        </div>

        <div class="clip-toolbar-row">
          <button class="clip-tool-btn preview-btn" data-action="preview" data-idx="${idx}" title="Preview this scene from start">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Play Scene</span>
          </button>
          
          <div class="clip-tools-right">
            <button class="clip-tool-btn" data-action="split-here" data-id="${clip.id}" data-idx="${idx}" title="Split scene at current player frame (S / C)">
              <span style="font-size:11px;">✂️</span>
              <span style="font-size:10px;">Split</span>
            </button>
            <button class="clip-tool-btn" data-action="move-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} title="Move Up in sequence">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button class="clip-tool-btn" data-action="move-down" data-idx="${idx}" ${idx === clips.length - 1 ? 'disabled' : ''} title="Move Down in sequence">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="clip-tool-btn delete-btn" data-action="delete" data-id="${clip.id}" title="Remove scene">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;

      // Trim Start Change
      const startInp = card.querySelector('input[data-field="start"]');
      if (startInp) {
        startInp.addEventListener('change', (e) => {
          const val = parseFloat(e.target.value) || 0;
          window.STUDIO_CLIPS.updateTrim(clip.id, val, clip.trimEnd);
        });
      }

      // Trim End Change
      const endInp = card.querySelector('input[data-field="end"]');
      if (endInp) {
        endInp.addEventListener('change', (e) => {
          const val = parseFloat(e.target.value) || clip.originalDuration;
          window.STUDIO_CLIPS.updateTrim(clip.id, clip.trimStart, val);
        });
      }

      // Reorder & Action Buttons
      card.querySelectorAll('.clip-tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          const clipIdx = parseInt(btn.dataset.idx, 10);
          const clipId = btn.dataset.id;

          if (action === 'preview') {
            const pct = clip.globalStart / Math.max(1, totalDuration);
            window.dispatchEvent(new CustomEvent('studio-seek-percent', { detail: { percent: pct } }));
          } else if (action === 'split-here') {
            window.dispatchEvent(new CustomEvent('studio-split-clip'));
          } else if (action === 'move-up') {
            window.STUDIO_CLIPS.moveClip(clipIdx, -1);
          } else if (action === 'move-down') {
            window.STUDIO_CLIPS.moveClip(clipIdx, 1);
          } else if (action === 'delete') {
            window.STUDIO_CLIPS.removeClip(clipId);
          }
        });
      });

      listContainer.appendChild(card);
    });

    // Auto-generate or update filmstrip for the first active clip
    if (clips.length > 0) {
      triggerFilmstripGeneration(clips[0]);
    }
  }

  let currentFilmstripClipId = null;

  function triggerFilmstripGeneration(clip) {
    if (!clip || !clip.url) return;
    if (currentFilmstripClipId === clip.id) return;
    currentFilmstripClipId = clip.id;
    generateFilmstrip(clip);
  }

  async function generateFilmstrip(clip) {
    const track = document.getElementById('filmstripTrack');
    if (!track || !clip || !clip.url) return;

    const sampleCount = 8;
    const duration = Math.max(0.5, clip.effectiveDuration || clip.originalDuration || 10);
    const step = duration / sampleCount;

    // Immediately render interactive keyframe cards with exact frame numbers & timestamps!
    track.innerHTML = '';
    const thumbElements = [];
    for (let i = 0; i < sampleCount; i++) {
      const sampleLocalTime = clip.trimStart + (i * step);
      const globalSampleTime = clip.globalStart + (sampleLocalTime - clip.trimStart);
      const frameNum = Math.floor(sampleLocalTime * 30);

      const thumbEl = document.createElement('div');
      thumbEl.className = 'filmstrip-thumb';
      thumbEl.dataset.time = globalSampleTime.toFixed(2);
      thumbEl.innerHTML = `
        <div class="thumb-loading-ph">F${frameNum}</div>
        <span class="thumb-frame-label">F${frameNum}</span>
        <span class="thumb-time-label">${sampleLocalTime.toFixed(1)}s</span>
      `;

      thumbEl.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-seek-time', { detail: { time: globalSampleTime } }));
      });

      track.appendChild(thumbEl);
      thumbElements.push({ el: thumbEl, localTime: sampleLocalTime, frameNum });
    }

    // Progressively capture high-resolution frame thumbnails from offscreen video
    const offVid = document.createElement('video');
    offVid.crossOrigin = 'anonymous';
    offVid.playsInline = true;
    offVid.muted = true;
    offVid.preload = 'auto';
    offVid.style.position = 'fixed';
    offVid.style.top = '-9999px';
    offVid.style.width = '160px';
    offVid.style.height = '90px';
    offVid.style.opacity = '0';
    offVid.style.pointerEvents = 'none';
    document.body.appendChild(offVid);
    offVid.src = clip.url;

    await new Promise((res) => {
      offVid.onloadeddata = res;
      offVid.onerror = res;
      setTimeout(res, 2000);
    });

    const offCanvas = document.createElement('canvas');
    offCanvas.width = 96;
    offCanvas.height = 54;
    const ctx = offCanvas.getContext('2d');

    for (let i = 0; i < thumbElements.length; i++) {
      const { el, localTime, frameNum } = thumbElements[i];
      offVid.currentTime = Math.min(clip.trimEnd, Math.max(clip.trimStart, localTime));

      await new Promise(r => {
        offVid.onseeked = r;
        setTimeout(r, 200);
      });

      try {
        ctx.drawImage(offVid, 0, 0, offCanvas.width, offCanvas.height);
        const thumbUrl = offCanvas.toDataURL('image/jpeg', 0.7);
        const ph = el.querySelector('.thumb-loading-ph');
        if (ph) {
          const img = document.createElement('img');
          img.src = thumbUrl;
          img.alt = `F${frameNum}`;
          img.draggable = false;
          el.replaceChild(img, ph);
        }
      } catch (err) {
        console.warn('Filmstrip frame capture notice:', err);
      }
    }

    try {
      document.body.removeChild(offVid);
    } catch (e) {}
  }

  function updateFilmstripPlayhead(currentTime) {
    const thumbs = document.querySelectorAll('.filmstrip-thumb');
    let closest = null;
    let minDiff = Infinity;
    thumbs.forEach(t => {
      const time = parseFloat(t.dataset.time);
      const diff = Math.abs(time - currentTime);
      t.classList.remove('active-frame');
      if (diff < minDiff) {
        minDiff = diff;
        closest = t;
      }
    });
    if (closest && minDiff < 3.0) {
      closest.classList.add('active-frame');
    }
  }

  function updateLiveFrameMonitor() {
    const canvas = document.getElementById('feLiveFrameCanvas');
    if (!canvas) return;
    const activeVid = window.STUDIO_STAGE?.getCurrentDevice() === 'desktop'
      ? document.getElementById('userDesktopVideoPlayer')
      : document.getElementById('userVideoPlayer');
    if (!activeVid || activeVid.readyState < 2) return;
    const ctx = canvas.getContext('2d');
    try {
      ctx.drawImage(activeVid, 0, 0, canvas.width, canvas.height);
    } catch (e) {}
  }

  function init() {
    if (window.STUDIO_VOICE_ENGINE) {
      window.STUDIO_VOICE_ENGINE.init();
    }

    const fileInput = document.getElementById('videoFileInput');
    const chooseBtn = document.getElementById('chooseVideoBtn');
    const addHeaderBtn = document.getElementById('addClipHeaderBtn');
    const clearHeaderBtn = document.getElementById('clearSequencerHeaderBtn');
    const clearAllBtn = document.getElementById('clearAllClipsBtn');
    const mergeExportBtn = document.getElementById('mergeExportBtn');

    if (chooseBtn && fileInput) {
      chooseBtn.addEventListener('click', () => {
        fileInput.dataset.action = 'replace';
        fileInput.click();
      });
    }

    if (addHeaderBtn && fileInput) {
      addHeaderBtn.addEventListener('click', () => {
        fileInput.dataset.action = 'add';
        fileInput.click();
      });
    }

    const handleClearClips = () => {
      if (confirm('Clear all clips from sequencer to start fresh?')) {
        if (window.STUDIO_CLIPS) window.STUDIO_CLIPS.clearAll();
        currentFilmstripClipId = null;
        const track = document.getElementById('filmstripTrack');
        if (track) track.innerHTML = '<div class="filmstrip-empty-hint">Load a video clip to inspect frame filmstrip</div>';
        const canvas = document.getElementById('feLiveFrameCanvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    if (clearHeaderBtn) clearHeaderBtn.addEventListener('click', handleClearClips);
    if (clearAllBtn) clearAllBtn.addEventListener('click', handleClearClips);

    if (mergeExportBtn) {
      mergeExportBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-trigger-export'));
      });
    }

    const goToVoiceBtn = document.getElementById('goToVoiceStudioBtn');
    if (goToVoiceBtn) {
      goToVoiceBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-mode-changed', { detail: { mode: 'voice' } }));
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          if (window.STUDIO_CLIPS) {
            // If user clicked 'Browse Videos' or 'Choose Recording' (replace action), clear previous clips!
            if (fileInput.dataset.action === 'replace') {
              window.STUDIO_CLIPS.clearAll();
            }
            await window.STUDIO_CLIPS.addMultipleClips(e.target.files);
          }
          fileInput.value = '';
          fileInput.dataset.action = '';
        }
      });
    }

    // Section 1B Precision Editor Button Listeners
    const feStepBack5 = document.getElementById('feStepBack5Btn');
    const feStepBack1 = document.getElementById('feStepBack1Btn');
    const feStepFwd1 = document.getElementById('feStepFwd1Btn');
    const feStepFwd5 = document.getElementById('feStepFwd5Btn');
    const feMarkIn = document.getElementById('feMarkInBtn');
    const feMarkOut = document.getElementById('feMarkOutBtn');
    const feSplit = document.getElementById('feSplitBtn');
    const feCapture = document.getElementById('feCaptureSnapshotBtn');

    if (feStepBack5) feStepBack5.addEventListener('click', () => window.dispatchEvent(new CustomEvent('studio-step-frame', { detail: { delta: -5 } })));
    if (feStepBack1) feStepBack1.addEventListener('click', () => window.dispatchEvent(new CustomEvent('studio-step-frame', { detail: { delta: -1 } })));
    if (feStepFwd1) feStepFwd1.addEventListener('click', () => window.dispatchEvent(new CustomEvent('studio-step-frame', { detail: { delta: 1 } })));
    if (feStepFwd5) feStepFwd5.addEventListener('click', () => window.dispatchEvent(new CustomEvent('studio-step-frame', { detail: { delta: 5 } })));

    if (feMarkIn) feMarkIn.addEventListener('click', () => window.dispatchEvent(new CustomEvent('studio-mark-in')));
    if (feMarkOut) feMarkOut.addEventListener('click', () => window.dispatchEvent(new CustomEvent('studio-mark-out')));
    if (feSplit) feSplit.addEventListener('click', () => window.dispatchEvent(new CustomEvent('studio-split-clip')));
    if (feCapture) feCapture.addEventListener('click', () => window.dispatchEvent(new CustomEvent('studio-capture-frame')));

    // Listen to Frame Stepped update
    window.addEventListener('studio-frame-stepped', (e) => {
      const { currentTime, currentFrame, totalFrames } = e.detail;
      const feNum = document.getElementById('feFrameNumber');
      const feTotal = document.getElementById('feTotalFrames');
      const feTime = document.getElementById('feTimecode');

      if (feNum) feNum.textContent = currentFrame;
      if (feTotal) feTotal.textContent = totalFrames;
      if (feTime && window.STUDIO_TIMELINE) {
        feTime.textContent = window.STUDIO_TIMELINE.formatTimePrecise ? window.STUDIO_TIMELINE.formatTimePrecise(currentTime) : `${currentTime.toFixed(3)}s`;
      }
      if (window.STUDIO_CLIPS) {
        const active = window.STUDIO_CLIPS.getActiveClipAtTime(currentTime);
        if (active && active.clip) {
          triggerFilmstripGeneration(active.clip);
        }
      }
      updateFilmstripPlayhead(currentTime);
      updateLiveFrameMonitor();
    });

    // Ensure live frame monitor updates when video element finishes seeking
    const vid1 = document.getElementById('userVideoPlayer');
    const vid2 = document.getElementById('userDesktopVideoPlayer');
    if (vid1) vid1.addEventListener('seeked', updateLiveFrameMonitor);
    if (vid2) vid2.addEventListener('seeked', updateLiveFrameMonitor);

    // Listen to FPS change
    window.addEventListener('studio-fps-changed', (e) => {
      const badge = document.getElementById('frameEditorFpsBadge');
      if (badge) badge.textContent = `${e.detail.fps} FPS`;
    });

    // Handle Drag and Drop for multiple video files
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('dragover');
        });
      });
      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('dragover');
        });
      });
      dropZone.addEventListener('drop', async (e) => {
        const dt = e.dataTransfer;
        const files = dt ? dt.files : null;
        if (files && files.length > 0 && window.STUDIO_CLIPS) {
          await window.STUDIO_CLIPS.addMultipleClips(files);
        }
      });
    }

    // Listen to clip updates to re-render clip cards
    window.addEventListener('studio-clips-updated', (e) => {
      renderClips();
      const clips = e.detail?.clips || [];
      if (clips.length > 0) {
        triggerFilmstripGeneration(clips[0]);
      }
    });

    // Reset voice sync on seek
    window.addEventListener('studio-seek-percent', () => {
      stopCurrentVoice();
      lastSpokenCueIdx = -1;
    });

    const colorSelect = document.getElementById('colorFilterSelect');
    if (colorSelect) {
      colorSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const video1 = document.getElementById('userVideoPlayer');
        const video2 = document.getElementById('userDesktopVideoPlayer');
        [video1, video2].forEach(v => {
          if (!v) return;
          if (val === 'vibrant') v.style.filter = 'contrast(1.18) saturate(1.32) brightness(1.04)';
          else if (val === 'cyberpunk') v.style.filter = 'contrast(1.25) saturate(1.4) hue-rotate(185deg)';
          else if (val === 'cinematic') v.style.filter = 'contrast(1.1) saturate(1.08) sepia(0.18)';
          else if (val === 'pastel') v.style.filter = 'contrast(0.96) saturate(1.2) brightness(1.12)';
          else if (val === 'noir') v.style.filter = 'contrast(1.4) grayscale(1) brightness(0.94)';
          else v.style.filter = 'none';
        });
      });
    }

    document.querySelectorAll('.cam-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const cam = e.currentTarget.dataset.cam;
        if (window.STUDIO_STAGE) window.STUDIO_STAGE.setCameraMode(cam);
      });
    });

    const addCueBtn = document.getElementById('addCueBtn');
    if (addCueBtn) {
      addCueBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('studio-request-add-cue'));
      });
    }

    renderCues();
    renderClips();
  }

  return {
    init,
    getCues: () => cues,
    setCues,
    addCue,
    speakCue,
    speakText,
    stopCurrentVoice,
    onTimelineTick,
    setLanguage: (lang) => { currentLang = lang; renderCues(); },
    getLanguage: () => currentLang,
    getMasterVoice: () => masterVoice,
    getCombinedScriptText,
    applyCombinedScriptToCues,
    isVoiceSyncEnabled: () => isVoiceSyncEnabled
  };
})();
