/**
 * MotionStudio - Showcase & Motion Template Mock Catalog
 * Provides rich metadata for templates, video showcase cards, and platform metrics.
 */

export const MotionData = {
  stats: [
    { id: 'renders', target: 240, suffix: 'K+', label: 'Renders Completed' },
    { id: 'fps', target: 60, suffix: ' FPS', label: 'Real-time WebGL Engine' },
    { id: 'templates', target: 120, suffix: '+', label: 'Motion Presets' },
    { id: 'latency', target: 12, suffix: 'ms', label: 'Ultra-low Latency' }
  ],

  features: [
    {
      id: 'neural-video',
      title: 'Neural Frame Synthesis',
      description: 'Generate high-dynamic-range video sequences from natural language prompts using state-of-the-art diffusion models.',
      icon: '⚡',
      badge: 'AI Powered',
      tag: 'Generative'
    },
    {
      id: 'device-framing',
      title: '3D Photorealistic Mockups',
      description: 'Instantly wrap screen recordings in ray-traced iPhone, iPad, and MacBook studio stages with dynamic lighting.',
      icon: '📱',
      badge: 'Interactive',
      tag: '3D Studio'
    },
    {
      id: 'audio-reactive',
      title: 'Audio Spectrum Reactive',
      description: 'Synchronize visual pulses, particle explosions, and typography kinetics directly to music beat frequency bands.',
      icon: '🎵',
      badge: 'Real-time',
      tag: 'Audio FX'
    },
    {
      id: 'kinetic-typography',
      title: 'Kinetic Motion Typography',
      description: 'Broadcast-quality animated title sequences, lower thirds, and cyber glitch titles with customizable bezier easings.',
      icon: '✨',
      badge: 'Studio Grade',
      tag: 'Typography'
    },
    {
      id: 'multi-track',
      title: 'Nonlinear Layer Compositing',
      description: 'Full multi-track timeline supporting keyframe interpolation, blend modes, alpha masks, and chroma keying.',
      icon: '🎞️',
      badge: 'Pro Suite',
      tag: 'Timeline'
    },
    {
      id: 'instant-export',
      title: 'Zero-Cloud Local GPU Render',
      description: 'Harness WebCodecs and WebGPU to render crisp 4K 60fps MP4 and WebM videos directly in your client browser.',
      icon: '🚀',
      badge: 'Instant',
      tag: 'WebCodecs'
    }
  ],

  showcase: [
    {
      id: 'cyber-title',
      title: 'Neo Tokyo Kinetic Intro',
      category: 'Title Sequence',
      duration: '0:15',
      resolution: '4K UHD',
      fps: '60 FPS',
      gradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      tags: ['Cyberpunk', 'Glow', 'Kinetic']
    },
    {
      id: 'app-promo',
      title: 'NextGen FinTech Product Reel',
      category: 'Product Demo',
      duration: '0:30',
      resolution: '1080p',
      fps: '60 FPS',
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
      tags: ['3D Device', 'Clean', 'Commercial']
    },
    {
      id: 'beat-reactor',
      title: 'Neon Horizon Waveform',
      category: 'Music Visualizer',
      duration: '1:00',
      resolution: '1440p',
      fps: '60 FPS',
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      tags: ['Audio Sync', 'Particles', 'Stage']
    },
    {
      id: 'saas-launch',
      title: 'CloudScale Enterprise Teaser',
      category: 'SaaS Motion',
      duration: '0:45',
      resolution: '4K UHD',
      fps: '60 FPS',
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      tags: ['Infographic', 'Clean', 'B2B']
    }
  ],

  templates: [
    {
      id: 'tmpl-1',
      name: 'Velocity Glitch Lower Third',
      aspect: '16:9',
      category: 'Overlays',
      color: '#8b5cf6'
    },
    {
      id: 'tmpl-2',
      name: 'Titanium Device Frame Stage',
      aspect: '9:16',
      category: 'Mobile Mockup',
      color: '#06b6d4'
    },
    {
      id: 'tmpl-3',
      name: 'Prism Light Leak Transition',
      aspect: '16:9',
      category: 'Transitions',
      color: '#ec4899'
    },
    {
      id: 'tmpl-4',
      name: 'Dynamic Bar Graph HUD',
      aspect: '1:1',
      category: 'Data Viz',
      color: '#10b981'
    }
  ]
};
