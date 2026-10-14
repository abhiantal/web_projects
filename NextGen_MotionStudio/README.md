# 🎬 Promotional Video Studio — Modular AI Video Creation Suite

A personal, studio-grade AI Video Editing and Creation application built with pure HTML, CSS, and modern JavaScript, structured into **fully separated UI components** and **dedicated backend core engines**.

---

## 📁 Clean Modular Architecture

```
C:\StudioProjects\MotionStudio/
├── index.html                     # Master SPA Host Shell (Capsule Nav, Theme Toggle, #page-mount)
├── README.md                      # Documentation & architecture guide
├── .env                           # Multi-account API keys (Groq, Gemini, OpenAI, Claude)
│
├── pages/                         # 📄 DEDICATED SEPARATE HTML PAGES (AI Video Domain)
│   ├── home.html                  # Hero 3D kinetic stage, KPIs, 6 engines, Reels & Founder spotlight
│   ├── features.html              # 6 Core AI video engines & technical breakdown
│   ├── pricing.html               # Creator Free, Pro Studio, Team Agency & Lifetime Pass
│   ├── showcase.html              # 4K 60FPS video showcase gallery with filter chips
│   ├── templates.html             # 120+ motion graphics presets (Lower thirds, device frames, reels)
│   ├── docs.html                  # WebCodecs GPU pipeline, hotkeys, codec matrix, zero-cloud privacy
│   └── terms.html                 # Commercial video ownership, AI ethics, and licensing policy
│
├── components/                    # 🧩 STUDIO WORKSPACE UI WIDGETS
│   ├── studio/                    # 🎬 Full Video Studio HTML Workspace (studio.html)
│   │   └── studio.html
│   ├── topbar/                    # Top navigation bar, brand badge, mode & device selectors
│   ├── stage/                     # 3D Smartphone & Desktop Window frames, kinetic captions
│   ├── timeline/                  # Interactive scrubber, playhead, timecode, speed selector
│   ├── editor/                    # Video uploader, color grading LUTs, narration cue cards
│   ├── text_to_video/             # Text-to-Video prompt card, animation style picker
│   ├── image_to_video/            # Image-to-Video file picker, Ken Burns & parallax motion
│   ├── voice_studio/              # Mic recording, Whisper STT, AI voice personas, Studio EQ
│   └── modals/                    # Multi-account API settings modal & 1080p export modal
│
├── core/                          # ⚙️ BACKEND & ENGINE SERVICES
│   ├── config.js                  # Multi-account API credentials & key rotation (.env pool)
│   ├── api_service.js             # Unified Groq, OpenAI (GPT-4o, DALL-E, TTS, Whisper), Gemini client
│   ├── canvas_animator.js         # 60FPS motion canvas engine (Ken Burns, particles, light sweeps)
│   ├── audio_master.js            # Web Audio API graph (Mastering EQ, Auto-ducking, backing beats)
│   ├── video_compositor.js        # Stage compositor & 1080p 60fps MediaRecorder exporter
│   └── app.js                     # Master orchestrator connecting all UI components and engines
│
└── assets/                        # 🎨 UNIFIED ASSET ECOSYSTEM
    ├── css/                       # 7-1 Modular CSS (base, layout, components, pages, utilities)
    │   ├── studio-globals.css     # Video studio design system tokens
    │   ├── studio-responsive.css  # Video studio responsive layout rules
    │   └── main.css               # Flagship bundle
    ├── js/                        # Core controllers, router, theme engine
    │   ├── core/                  # page-loader.js, theme.js, studio-theme.js, events.js
    │   ├── components/            # tabs.js, pricing.js, navbar.js, sidebar.js, modal.js
    │   └── main.js                # Flagship application entry point
    └── images/                    # Brand emblems, 3D kinetic rings, founder avatar
```

---

## 🌟 Capabilities & Features

1. **Text to Video (AI)**:
   - Generate complete multi-scene animated videos (2D Vibrant Animation, Cyberpunk Anime Glow, Realistic Studio 3D, Minimalist Kinetic).
   - Powered by Groq LLaMA 3.3 for instant storyboards with OpenAI and Gemini fallbacks.
2. **Image to Video (I2V)**:
   - Upload any screenshot or image and animate it with Ken Burns zoom, 2.5D tilt, or smooth panning at 60 FPS.
3. **Video Editor & Auto-Enhancer**:
   - Wrap screen recordings into 3D Titanium Smartphone or macOS/Windows Chrome windows.
   - Cinematic color grading LUTs (Studio Vibrant, Cyberpunk, Film, Pastel, Noir).
   - Alex Hormozi kinetic word-by-word highlighted captions.
4. **Voice Studio**:
   - Record your voice $\rightarrow$ transcribe with Whisper $\rightarrow$ restyle into studio AI narration (*Alloy, Echo, Fable, Onyx, Nova, Shimmer*).
   - Studio Mastering EQ (Broadcast, Crisp, Deep Radio, Natural) and auto-ducking music.
5. **Theme Engine & Desktop Launcher**:
   - Seamless OLED Dark & Light modes with 5 accent colors.
   - Run `create_desktop_icon.bat` to add a shortcut to your desktop.
   - Run `launch_studio.bat` to launch in standalone desktop window mode.
