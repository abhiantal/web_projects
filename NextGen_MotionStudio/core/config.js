/**
 * PROMOTIONAL VIDEO STUDIO - CORE CONFIG & API KEY POOL
 * Auto-manages multi-account API credentials for Groq, Gemini, OpenAI, Claude, DeepSeek, and Mistral.
 * Features key rotation and localStorage override.
 */

window.STUDIO_CONFIG = (function () {
  'use strict';

  const DEFAULT_KEY_POOL = {
    groq: [
      { id: 'acc1', name: 'Primary (80143)', key: '', active: true },
      { id: 'acc2', name: 'Fast (gavier)', key: '', active: true },
      { id: 'acc3', name: 'Reasoning (22)', key: '', active: true },
      { id: 'acc4', name: 'Backup (newfor)', key: '', active: true }
    ],
    gemini: [
      { id: 'acc1', name: 'Primary (80143)', key: '', active: true },
      { id: 'acc2', name: 'Vision (gavier)', key: '', active: true },
      { id: 'acc3', name: 'Fast (22)', key: '', active: true },
      { id: 'acc4', name: 'Backup (newfor)', key: '', active: true }
    ],
    openai: [
      { id: 'acc1', name: 'Primary (80143)', key: '', active: true },
      { id: 'acc2', name: 'Judge (gavier)', key: '', active: true },
      { id: 'acc3', name: 'Media (22)', key: '', active: true },
      { id: 'acc4', name: 'Backup (newfor)', key: '', active: true }
    ],
    claude: [
      { id: 'acc1', name: 'Primary (80143)', key: '', active: true },
      { id: 'acc2', name: 'Reasoning (gavier)', key: '', active: true },
      { id: 'acc3', name: 'Fast (22)', key: '', active: true },
      { id: 'acc4', name: 'Backup (newfor)', key: '', active: true }
    ],
    deepseek: [
      { id: 'acc1', name: 'Primary (80143)', key: '', active: true },
      { id: 'acc2', name: 'Reasoning (gavier)', key: '', active: true },
      { id: 'acc3', name: 'Fast (22)', key: '', active: true },
      { id: 'acc4', name: 'Backup (newfor)', key: '', active: true }
    ],
    mistral: [
      { id: 'acc1', name: 'Primary (80143)', key: '', active: true },
      { id: 'acc2', name: 'Fast (gavier)', key: '', active: true },
      { id: 'acc3', name: 'Reasoning (22)', key: '', active: true },
      { id: 'acc4', name: 'Backup (newfor)', key: '', active: true }
    ]
  };

  const STORAGE_KEY = 'promotional_video_api_config';

  function loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return Object.assign({}, DEFAULT_KEY_POOL, JSON.parse(saved));
    } catch (e) {
      console.warn('Using default API key pool:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_KEY_POOL));
  }

  let pool = loadConfig();

  function saveConfig(updatedPool) {
    pool = updatedPool;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pool));
    } catch (e) {
      console.error('Failed to save API keys:', e);
    }
  }

  function getActiveKey(provider) {
    const list = pool[provider] || [];
    const activeItem = list.find(item => item.active && item.key && item.key.trim().length > 5);
    return activeItem ? activeItem.key : null;
  }

  function rotateKey(provider) {
    const list = pool[provider] || [];
    if (list.length <= 1) return;
    const first = list.shift();
    list.push(first);
    saveConfig(pool);
  }

  return {
    getPool: () => pool,
    saveConfig,
    getActiveKey,
    rotateKey,
    providers: ['groq', 'gemini', 'openai', 'claude', 'deepseek', 'mistral']
  };
})();

