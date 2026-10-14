/**
 * PROMOTIONAL VIDEO STUDIO - CORE API SERVICE
 * Connects to Groq, Gemini, OpenAI (Chat, DALL-E, Whisper, TTS), and APMix Claude.
 */

window.STUDIO_API = (function () {
  'use strict';

  async function callGroq(prompt, systemPrompt = 'You are a professional promotional video director.', options = {}) {
    const key = window.STUDIO_CONFIG.getActiveKey('groq');
    if (!key) throw new Error('No active Groq API key found in .env');

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: options.model || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7
      })
    });

    if (!res.ok) {
      if (res.status === 429) window.STUDIO_CONFIG.rotateKey('groq');
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Groq error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async function callOpenAIChat(prompt, systemPrompt = 'You are a creative promotional scriptwriter.', options = {}) {
    const key = window.STUDIO_CONFIG.getActiveKey('openai');
    if (!key) throw new Error('No active OpenAI API key found in .env');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7
      })
    });

    if (!res.ok) {
      if (res.status === 429) window.STUDIO_CONFIG.rotateKey('openai');
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async function generateOpenAITTS(text, voice = 'alloy', speed = 1.05) {
    const key = window.STUDIO_CONFIG.getActiveKey('openai');
    if (!key) throw new Error('No active OpenAI key for TTS');

    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
        speed: speed,
        response_format: 'mp3'
      })
    });

    if (!res.ok) {
      if (res.status === 429) window.STUDIO_CONFIG.rotateKey('openai');
      throw new Error(`OpenAI TTS error: ${res.status}`);
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  async function transcribeAudioWithWhisper(audioBlob) {
    const key = window.STUDIO_CONFIG.getActiveKey('openai');
    if (!key) throw new Error('No active OpenAI key for Whisper');

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}` },
      body: formData
    });

    if (!res.ok) {
      if (res.status === 429) window.STUDIO_CONFIG.rotateKey('openai');
      throw new Error(`Whisper error: ${res.status}`);
    }

    const data = await res.json();
    return data.text || '';
  }

  async function generateVideoStoryboard(topicPrompt, style = 'animation', sceneCount = 4) {
    const prompt = `Create a structured ${sceneCount}-scene video storyboard for a promotional video about: "${topicPrompt}".
Style: ${style}. Return ONLY a valid JSON array of scenes without markdown backticks.
Format:
[
  {
    "sceneIndex": 1,
    "title": "Hook Scene",
    "duration": 5,
    "script": "Narration text here...",
    "visualPrompt": "Scene visuals description...",
    "highlightWord": "AMAZING"
  }
]`;

    try {
      const text = await callGroq(prompt);
      const cleaned = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Groq storyboard fallback to OpenAI...', e);
      try {
        const text = await callOpenAIChat(prompt);
        const cleaned = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (err) {
        console.warn('Using local fallback storyboard...', err);
        return [
          { sceneIndex: 1, title: 'The Hook', duration: 5, script: `Discover the future of ${topicPrompt}. Speed meets elegance!`, highlightWord: 'DISCOVER' },
          { sceneIndex: 2, title: 'Core Power', duration: 6, script: `Everything you need to automate your workflow is right here.`, highlightWord: 'AUTOMATE' },
          { sceneIndex: 3, title: 'High Velocity', duration: 5, script: `Built for creators and teams who demand seamless performance.`, highlightWord: 'PERFORMANCE' },
          { sceneIndex: 4, title: 'Get Started', duration: 5, script: `Transform your process today. Start free now!`, highlightWord: 'NOW' }
        ];
      }
    }
  }

  return {
    callGroq,
    callOpenAIChat,
    generateOpenAITTS,
    transcribeAudioWithWhisper,
    generateVideoStoryboard
  };
})();
