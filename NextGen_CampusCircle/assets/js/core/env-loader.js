/**
 * CAMPUS CIRCLE - DUAL ENVIRONMENT ENGINE (.env & env.js Loader)
 * 
 * Intelligently loads configuration from:
 * 1. env.js runtime object (window.__ENV__)
 * 2. Asynchronous fetch of root .env file (when served over HTTP/HTTPS)
 * 3. Browser localStorage cache (CC_SUPABASE_URL, CC_SUPABASE_KEY)
 * 
 * Provides automated synchronization, status diagnostics, and .env export.
 */

(function () {
  window.__ENV__ = window.__ENV__ || {};

  // 1. Synchronous initialization from localStorage & env.js
  const storedUrl = localStorage.getItem('CC_SUPABASE_URL');
  const storedKey = localStorage.getItem('CC_SUPABASE_KEY');

  if (!window.__ENV__.SUPABASE_URL && storedUrl) {
    window.__ENV__.SUPABASE_URL = storedUrl;
  }
  if (!window.__ENV__.SUPABASE_ANON_KEY && storedKey) {
    window.__ENV__.SUPABASE_ANON_KEY = storedKey;
  }

  // 2. Parse raw .env file text into key-value pairs
  function parseDotEnv(text) {
    const result = {};
    if (!text) return result;

    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) continue;

      const key = trimmed.substring(0, equalsIndex).trim();
      let val = trimmed.substring(equalsIndex + 1).trim();

      // Strip surrounding quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      result[key] = val;
    }
    return result;
  }

  // 3. Asynchronously load root .env file over HTTP/HTTPS dev servers
  async function fetchDotEnv() {
    // Skip fetch on file:/// protocol where browsers restrict CORS
    if (window.location.protocol === 'file:') {
      return;
    }

    try {
      let response = await fetch('.env', { cache: 'no-cache' }).catch(() => null);
      if (!response || !response.ok) {
        response = await fetch('../../.env', { cache: 'no-cache' }).catch(() => null);
      }
      if (!response || !response.ok) {
        response = await fetch('../.env', { cache: 'no-cache' }).catch(() => null);
      }
      if (response && response.ok) {
        const text = await response.text();
        const parsed = parseDotEnv(text);

        // Merge onto window.__ENV__
        Object.assign(window.__ENV__, parsed);

        // Update localStorage & CampusConfig if live keys found
        if (parsed.SUPABASE_URL && !parsed.SUPABASE_URL.includes('your-project-id')) {
          localStorage.setItem('CC_SUPABASE_URL', parsed.SUPABASE_URL);
          if (window.CampusConfig) window.CampusConfig.supabaseUrl = parsed.SUPABASE_URL;
        }
        if (parsed.SUPABASE_ANON_KEY && !parsed.SUPABASE_ANON_KEY.includes('sample-anon-key')) {
          localStorage.setItem('CC_SUPABASE_KEY', parsed.SUPABASE_ANON_KEY);
          if (window.CampusConfig) window.CampusConfig.supabaseKey = parsed.SUPABASE_ANON_KEY;
        }

        window.__ENV_SOURCE__ = '.env file (HTTP live fetch)';
        window.dispatchEvent(new CustomEvent('campus:env:ready', { detail: window.__ENV__ }));
      }
    } catch (e) {
      // Graceful fallback to env.js or localStorage
      console.log('Running in standalone environment mode. Fallback to env.js/localStorage active.');
    }
  }

  // 4. Global accessor helper
  window.getEnv = function (key, defaultValue = '') {
    return window.__ENV__[key] || defaultValue;
  };

  // 5. Generate and download a formatted .env file with active settings
  window.downloadActiveDotEnv = function () {
    const url = window.getEnv('SUPABASE_URL') || localStorage.getItem('CC_SUPABASE_URL') || 'https://your-project-id.supabase.co';
    const key = window.getEnv('SUPABASE_ANON_KEY') || localStorage.getItem('CC_SUPABASE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

    const content = `# ==============================================================================
# CAMPUS CIRCLE (Powered by NextGen) - GENERATED .env FILE
# Exported on: ${new Date().toISOString()}
# ==============================================================================

SUPABASE_URL=${url}
SUPABASE_ANON_KEY=${key}
CAMPUS_CIRCLE_ENV=${window.getEnv('CAMPUS_CIRCLE_ENV', 'development')}
ENABLE_SUPABASE_REALTIME=${window.getEnv('ENABLE_SUPABASE_REALTIME', 'true')}
DEFAULT_UNIVERSITY_ID=${window.getEnv('DEFAULT_UNIVERSITY_ID', 'apex-institute')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const dlUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = '.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(dlUrl);

    if (window.showToast) {
      window.showToast('.env file generated and downloaded successfully!', '📥');
    }
  };

  // Execute async fetch in background
  fetchDotEnv();
})();
