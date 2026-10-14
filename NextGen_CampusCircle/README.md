# 🎓 Campus Circle – University & College Academic Operating System
### Powered by NexGen • Developed by A.K.Antal

A futuristic, high-performance academic operating system connecting students, faculty, and universities into a unified ecosystem. Built with a high-performance **Cloud Database Engine (PostgreSQL, Auth, RLS, Cloud Storage)**, an autonomous offline data engine, and an interactive practice lab directly integrating resources from `exam_sem_6`.

---

## 📁 Clean & Professional Folder Architecture

```
C:\StudioProjects\CampusCircle\
├── .env                       # Cloud Database & Application Environment Configuration
├── .env.example               # Public environment template for version control
├── .gitignore                 # Protected ignore rules for secrets and builds
├── env.js                     # Browser client environment runtime bridge
├── index.html                 # Main Portal (3 Tabs: Home, Universities, Sign In/Up)
│
├── pages/                     # Clean Modular Pages Directory:
│   ├── university/            # University & Degree Program Hub:
│   │   ├── university-detail.html # 5 Tabs (University, Program, Services, Placements, ERP)
│   │   └── program-detail.html    # 5 Tabs (Program Detail, Exams, PYQs/Practice, Assignments/Projects, Notes)
│   ├── profile/               # Student & Faculty Profile & Account Settings:
│   │   ├── profile.html           # Dedicated Academic Profile Dashboard
│   │   └── delete-account.html    # Account & personal data deletion flow
│   └── webInfo/               # Global Site Information & Legal:
│       ├── features.html          # Architectural feature deep dives
│       ├── contact.html           # Academic support & faculty verification
│       ├── download.html          # Mobile app & offline desktop launcher
│       ├── community.html         # Campus notice feed & verified announcements
│       ├── privacy.html           # Data privacy & GDPR/FERPA guidelines
│       └── terms.html             # Terms of service & academic integrity
│
├── assets/                    # Unified Design System & Runtime Assets:
│   ├── css/                   # Stylesheets & Design System:
│   │   ├── main.css           # 7-1 Modular master bundle
│   │   ├── style.css          # Core typography, dark/light theme, and layout
│   │   ├── academic-hub.css   # Obsidian glassmorphism, multi-tier tabs, ERP cards
│   │   ├── animations.css     # Keyframe pulses, ambient glows, and transitions
│   │   ├── base/              # reset, typography, variables
│   │   ├── components/        # navbar, button, card, modal, toast, sidebar, etc.
│   │   ├── layout/            # container, grid, section, header
│   │   ├── pages/             # home.css
│   │   └── utilities/         # animations, helpers
│   ├── js/                    # Modular JavaScript Ecosystem:
│   │   ├── main.js            # Flagship SPA application orchestrator
│   │   ├── core/              # Platform Core Engines (env-loader, supabase-config, theme, main)
│   │   ├── university/        # Academic Engines (university-engine, program-engine)
│   │   ├── profile/           # Auth & Account Engines (auth-engine, forms)
│   │   ├── webInfo/           # Community & Information Engines (community-engine)
│   │   ├── components/        # navbar, sidebar, tabs, modal, toast
│   │   └── utils/             # dom, animation, formatters, validation
│   └── images/                # Brand logos & badges
│
├── docs/                      # Technical Documentation & Specifications:
│   ├── SPECIFICATION.md       # Master engineering blueprint & module breakdown
│   └── README.md              # Database schemas and quickstart guide
│
├── sql/                       # Modular PostgreSQL Database Architecture (16 SQL files)
│   ├── 00_ALL_TABLES_MIGRATION.sql # Single 1-click master migration script
│   ├── 00_init_schemas_and_helpers.sql
│   ├── 01_profiles.sql        # User accounts & role-based RLS
│   ├── 02_subjects.sql        # Course curriculum & credits
│   ├── 03_exams.sql           # Exam timetables & room allocations
│   ├── 04_assignments.sql     # Coursework deliverables
│   ├── 05_assignment_submissions.sql # Student deliverables & grades
│   ├── 06_pyqs.sql            # PYQ archive & download counter RPC
│   ├── 07_practice_questions.sql # Interactive questions from exam_sem_6
│   ├── 08_user_practice_status.sql # Mastery tracking
│   ├── 09_projects.sql        # Capstone showcase & teammate matcher
│   ├── 10_campus_posts.sql    # Campus notices & faculty broadcasts
│   ├── 11_storage_buckets.sql # Cloud Storage configurations
│   ├── 12_seed_mock_data.sql  # Semester 6 curriculum & practice sets
│   └── 13_universities.sql    # University catalog, history & programs
│
└── assets/                    # Media & Vector Graphics:
    └── logo.svg               # Campus Circle vector crest logo
```

---

## 🏛️ Multi-Tier Tab Navigation Hierarchy

### 1. Main Page (`index.html`)
- **Unauthenticated Mode (Public Landing)**:
  - **Tab 1: Home**: Site introduction, developer/owner profile (**A.K.Antal & NexGen**), vision, architectural stack, and feature overview.
  - **Tab 2: Universities**: Interactive university cards with real-time search bar ("screech bar"). Clicking any card routes to `university-detail.html?id=...`.
  - **Tab 3: Sign In / Sign Up**: Dual authentication portal with role picker (`Student`, `Teacher / Faculty`, `Admin`).
- **Authenticated Mode (Post-Login)**:
  - Automatically transitions to the authenticated Main Portal showing:
    - **Home Tab**: Authenticated student/faculty cockpit (personalized greeting, live exam radar, upcoming assignments, quick gateways).
    - **Universities Tab**: Direct university search and directory.
    - User Profile Chip in header (Avatar, Name, Role badge, and Logout button).

### 2. University Detail Page (`university-detail.html`)
Clean top header with brand crest, `🏠 Main Portal`, `🏛️ All Universities`, `☀️ Theme`, and Auth chip.
Features **5 dedicated tabs**:
- **Tab 1: University**: Overview, history, heritage, leadership (Chancellor & Vice-Chancellor), NAAC A++ / NIRF rankings, and campus statistics.
- **Tab 2: Program**: Degree catalog (B.Tech CSE, B.Tech IT, M.Tech CSE, MCA) with duration, seat matrix, credits, and direct navigation click-through to that program's detail page (`program-detail.html?uni=<slug>&prog=<slug>`).
- **Tab 3: Services ("serviss")**: Campus amenities (Digital Library, Hostels, Sports Complex, Health Center, Rapid Shuttle, Startup Incubator).
- **Tab 4: Placements ("plasmants")**: Verified compensation statistics (Highest CTC ₹54.5 LPA, Average CTC ₹12.8 LPA, Median ₹9.5 LPA, 96.8% placement rate), marquee corporate recruiters (Google, Microsoft, Amazon, Oracle, etc.), and sector distribution metrics.
- **Tab 5: ERP ("erp")**: University Enterprise Resource Planning simulation (live attendance tracker, fee receipts with printable e-receipt modal, certified SGPA transcript generator).

### 3. Program Detail Page (`program-detail.html`)
Dynamic academic cockpit for any selected degree program with **5 dedicated tabs**:
- **Tab 1: Program Detail ("program detal")**: Degree specifications, admission eligibility criteria, seat matrix, specialization tracks, and active Semester 6 credit distributions.
- **Tab 2: Exams ("exams")**: Program-specific examination timetable (CS601, CS602, CS603, CS604, CS605), designated halls, room allocations, rules, and `.ics` calendar sync.
- **Tab 3: PYQ, Practice Sets ("pyq, practisets")**: Dual-mode resource engine:
  - Solved Previous Year Question Papers (PDF preview & download).
  - Interactive Code Practice Lab (from `exam_sem_6`) with Java/Python switchers, 1-click code copying, complexity analysis, and mastery tracker.
- **Tab 4: Assignments, Projects ("assimants, projects")**:
  - Coursework problem sheets with urgency status and online submission modal.
  - Capstone student projects with GitHub links, live demos, upvote counter, and team collaboration request modal.
- **Tab 5: Notes etc ("nots etc")**: High-yield chapter revision notes, algorithm proofs, and formula handbooks with an integrated modal note reader.

---

## 🔐 Cloud Database `.env` Linking

1. Open `.env` or `env.js`.
2. Configure your database endpoints and keys:
   ```ini
   SUPABASE_URL=https://your-cloud-database-url
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Refresh any page. The system automatically connects and switches from autonomous offline mode to live cloud PostgreSQL synchronization!
