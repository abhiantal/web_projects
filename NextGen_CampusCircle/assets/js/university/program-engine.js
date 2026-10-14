/**
 * CAMPUS CIRCLE - PROGRAM DETAIL ACADEMIC OPERATING SYSTEM ENGINE
 * Implements the 5 dedicated tabs for any selected University Program:
 * - Tab 1: Program Detail ("program detal" - specs, eligibility, curriculum, specializations)
 * - Tab 2: Exams ("exams" - timetables, rooms, seating allocations, calendar sync)
 * - Tab 3: PYQ, Practice Sets ("pyq, practisets" - solved papers + interactive code sets from exam_sem_6)
 * - Tab 4: Assignments, Projects ("assimants, projects" - coursework submissions + capstones)
 * - Tab 5: Notes etc ("nots etc" - chapter revision notes, formula sheets, modal reader)
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('program-detail-container')) {
    await renderProgramDetail();
  }
});

let currentUni = null;
let currentProg = null;
let cachedExams = [];
let cachedPyqs = [];
let cachedPractice = [];
let cachedAssignments = [];
let cachedProjects = [];
let cachedNotes = [];
let currentSelectedYear = '3';
let currentSelectedSem = '6';

const ALL_SEMESTER_SUBJECTS = {
  1: [
    { code: 'CS101', name: 'Introduction to Computer Programming & C', credits: 4, icon: 'code', color: '#00d4aa' },
    { code: 'MA101', name: 'Engineering Mathematics I (Calculus & Matrices)', credits: 4, icon: 'cpu', color: '#38bdf8' },
    { code: 'PH101', name: 'Engineering Physics & Quantum Theory', credits: 3, icon: 'layers', color: '#6366f1' },
    { code: 'EE101', name: 'Basic Electrical & Electronics Engineering', credits: 3, icon: 'zap', color: '#f59e0b' },
    { code: 'ME101', name: 'Engineering Graphics & Computer-Aided Design', credits: 2, icon: 'pen-tool', color: '#10b981' }
  ],
  2: [
    { code: 'CS201', name: 'Object-Oriented Programming with C++', credits: 4, icon: 'code', color: '#00d4aa' },
    { code: 'MA201', name: 'Engineering Mathematics II (Differential Equations)', credits: 4, icon: 'cpu', color: '#38bdf8' },
    { code: 'EC201', name: 'Digital Logic & Circuit Design', credits: 4, icon: 'cpu', color: '#6366f1' },
    { code: 'CH201', name: 'Engineering Chemistry & Material Science', credits: 3, icon: 'layers', color: '#a855f7' },
    { code: 'EN201', name: 'Technical Professional Communication & Ethics', credits: 2, icon: 'message-square', color: '#10b981' }
  ],
  3: [
    { code: 'CS301', name: 'Data Structures & Algorithms in C/C++', credits: 4, icon: 'git-branch', color: '#00d4aa' },
    { code: 'CS302', name: 'Object-Oriented Systems & Java Programming', credits: 4, icon: 'code', color: '#6366f1' },
    { code: 'CS303', name: 'Computer Organization & Architecture', credits: 4, icon: 'cpu', color: '#38bdf8' },
    { code: 'MA301', name: 'Discrete Mathematical Structures', credits: 3, icon: 'layers', color: '#f59e0b' },
    { code: 'CS304', name: 'Data Communications & Networking Foundations', credits: 3, icon: 'globe', color: '#10b981' }
  ],
  4: [
    { code: 'CS401', name: 'Operating Systems & System Programming', credits: 4, icon: 'cpu', color: '#00d4aa' },
    { code: 'CS402', name: 'Database Management Systems & SQL', credits: 4, icon: 'layers', color: '#6366f1' },
    { code: 'CS403', name: 'Theory of Computation & Automata Theory', credits: 4, icon: 'code', color: '#a855f7' },
    { code: 'CS404', name: 'Computer Networks & Internet Protocols', credits: 4, icon: 'globe', color: '#38bdf8' },
    { code: 'MA401', name: 'Probability, Statistics & Stochastic Processes', credits: 3, icon: 'git-branch', color: '#f59e0b' }
  ],
  5: [
    { code: 'CS501', name: 'Design & Analysis of Algorithms', credits: 4, icon: 'code', color: '#00d4aa' },
    { code: 'CS502', name: 'Microprocessors, Microcontrollers & Interfacing', credits: 4, icon: 'cpu', color: '#6366f1' },
    { code: 'CS503', name: 'Artificial Intelligence & Intelligent Agents', credits: 3, icon: 'message-square', color: '#a855f7' },
    { code: 'CS504', name: 'Cloud Computing & Distributed Virtualization', credits: 3, icon: 'globe', color: '#38bdf8' },
    { code: 'CS505', name: 'Cybersecurity Fundamentals & Network Defense', credits: 3, icon: 'shield', color: '#10b981' }
  ],
  6: [
    { code: 'CS601', name: 'Advanced Algorithms & Problem Solving', credits: 4, icon: 'code', color: '#00d4aa' },
    { code: 'CS602', name: 'Compiler Design', credits: 4, icon: 'cpu', color: '#6366f1' },
    { code: 'CS603', name: 'Natural Language Processing', credits: 3, icon: 'message-square', color: '#a855f7' },
    { code: 'CS604', name: 'Software Engineering & Agile Methodologies', credits: 3, icon: 'layers', color: '#f59e0b' },
    { code: 'CS605', name: 'Web Technology & Modern Full-Stack Frameworks', credits: 4, icon: 'globe', color: '#38bdf8' },
    { code: 'CS606', name: 'Design & Analysis of Algorithms Laboratory', credits: 4, icon: 'git-branch', color: '#10b981' }
  ],
  7: [
    { code: 'CS701', name: 'Distributed Systems & Microservices Architecture', credits: 4, icon: 'globe', color: '#00d4aa' },
    { code: 'CS702', name: 'Deep Learning & Neural Network Frameworks', credits: 4, icon: 'message-square', color: '#a855f7' },
    { code: 'CS703', name: 'Cryptography & Enterprise Security Architecture', credits: 3, icon: 'shield', color: '#6366f1' },
    { code: 'CS704', name: 'Blockchain Technology & Smart Contract Engineering', credits: 3, icon: 'layers', color: '#f59e0b' },
    { code: 'CS705', name: 'Pre-Capstone Industrial Project Sprint', credits: 4, icon: 'git-branch', color: '#10b981' }
  ],
  8: [
    { code: 'CS801', name: 'Major Industry Capstone Project & Thesis', credits: 12, icon: 'rocket', color: '#00d4aa' },
    { code: 'CS802', name: 'Quantum Computing & Information Theory', credits: 3, icon: 'cpu', color: '#38bdf8' },
    { code: 'CS803', name: 'Entrepreneurship, Product Management & Tech IP', credits: 3, icon: 'briefcase', color: '#f59e0b' }
  ]
};

async function renderProgramDetail() {
  const container = document.getElementById('program-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const uniSlug = urlParams.get('uni') || 'galgotias-university';
  const progSlug = urlParams.get('prog') || 'btech-cse';
  const initialTab = urlParams.get('tab') || 'program-detail';

  currentUni = await window.CampusDB.getUniversityById(uniSlug);
  currentProg = await window.CampusDB.getUniversityProgram(uniSlug, progSlug);

  if (!currentProg) {
    currentProg = currentUni.programs[0];
  }

  // Fetch related academic datasets
  const exams = await window.CampusDB.getExams();
  const pyqs = await window.CampusDB.getPYQs();
  const practiceQuestions = await window.CampusDB.getPracticeQuestions();
  const assignments = await window.CampusDB.getAssignments();
  const projects = await window.CampusDB.getProjects();
  const notes = await window.CampusDB.getNotes();

  cachedExams = exams;
  cachedPyqs = pyqs;
  cachedPractice = practiceQuestions;
  cachedAssignments = assignments;
  cachedProjects = projects;
  cachedNotes = notes;

  document.title = `${currentProg.name} – ${currentUni.short_name} Academic Hub`;

  container.innerHTML = `
    <!-- Top Breadcrumb Navigation -->
    <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
      <a href="university-detail.html?id=${encodeURIComponent(currentUni.slug)}&tab=program" style="color: var(--neon-cyan); text-decoration: none; font-size: 0.88rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
        ← Back to ${currentUni.name} Programs
      </a>
      <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 8px; align-items: center;">
        <span>${currentUni.ranking_nirf}</span>
        <span>•</span>
        <span style="color: var(--neon-emerald); font-weight: 600;">✓ ${currentUni.accreditation}</span>
      </div>
    </div>

    <!-- Program Hero Banner -->
    <div class="radar-banner" style="margin-bottom: 28px; padding: 34px 38px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 22px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="width: 76px; height: 76px; border-radius: 20px; background: rgba(99, 102, 241, 0.15); color: var(--neon-indigo); display: flex; align-items: center; justify-content: center; font-size: 2.7rem; border: 2px solid rgba(99, 102, 241, 0.35); flex-shrink: 0;">
            🎓
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px;">
              <span class="exam-badge badge-ete">${currentProg.code || 'BTECH-CSE'}</span>
              <span style="background: rgba(56, 189, 248, 0.12); color: var(--neon-cyan); border: 1px solid rgba(56, 189, 248, 0.25); font-size: 0.72rem; padding: 3px 9px; border-radius: 8px; font-weight: 700;">
                ${currentProg.degree || 'Bachelor of Technology'}
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Offered at ${currentUni.name}</span>
            </div>
            <h1 style="font-family: 'Outfit', sans-serif; font-size: clamp(1.7rem, 3.2vw, 2.3rem); font-weight: 800; color: var(--text-primary); margin: 0 0 6px;">
              ${currentProg.name}
            </h1>
            <div style="font-size: 0.88rem; color: var(--text-secondary); display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
              <span>⏱️ ${currentProg.duration}</span>
              <span>•</span>
              <span>🪑 ${currentProg.seats} Total Seats</span>
              <span>•</span>
              <span>🎯 ${currentProg.credits || 160} Degree Credits</span>
              <span>•</span>
              <span id="prog-active-sem-badge" style="color: var(--neon-emerald); font-weight: 600;">Active: Semester 6</span>
            </div>
          </div>
        </div>

        <!-- Academic Year & Semester Filter Bar -->
        <div class="academic-filter-control" style="display: flex; align-items: center; gap: 12px; border-radius: 16px; padding: 8px 16px; backdrop-filter: blur(16px); flex-wrap: wrap;">
          <!-- Year Selector -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <label for="filter-academic-year" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
              <span>📅</span> Year
            </label>
            <select id="filter-academic-year" onchange="handleYearFilterChange(this.value)" class="filter-select">
              <option value="all">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3" selected>3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div style="height: 22px; width: 1px; background: rgba(255, 255, 255, 0.15);"></div>

          <!-- Semester Selector -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <label for="filter-academic-sem" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--neon-cyan); font-weight: 700; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
              <span>🎓</span> Sem
            </label>
            <select id="filter-academic-sem" onchange="handleSemFilterChange(this.value)" class="filter-select" style="background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(56, 189, 248, 0.4); color: var(--neon-cyan); font-size: 0.84rem; font-weight: 700; padding: 6px 14px; border-radius: 8px; cursor: pointer; outline: none; box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);">
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6" selected>Semester 6 (Active)</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 5 Specific Tabs for Program Detail Page:
         Tab 1: Program Detail ("program detal")
         Tab 2: Exams ("exams")
         Tab 3: PYQ, Practice Sets ("pyq, practisets")
         Tab 4: Assignments, Projects ("assimants, projects")
         Tab 5: Notes etc ("nots etc")
    -->
    <!-- SECTION 1: PROGRAM DETAIL & SPECS -->
    <section class="academic-tab-pane active" id="prog-pane-program-detail" style="display: block; margin-bottom: 48px;">
      <!-- 4 Program Key Highlights Grid -->
      <div class="stats-grid" style="margin-bottom: 30px;">
        <div class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-info">
            <span class="stat-value">${currentProg.duration.split(' ')[0]} ${currentProg.duration.split(' ')[1] || 'Years'}</span>
            <span class="stat-label">Full-Time Duration</span>
          </div>
        </div>
        <div class="stat-card stat-emerald">
          <div class="stat-icon">🪑</div>
          <div class="stat-info">
            <span class="stat-value">${currentProg.seats}</span>
            <span class="stat-label">Approved Annual Intake</span>
          </div>
        </div>
        <div class="stat-card stat-indigo">
          <div class="stat-icon">📜</div>
          <div class="stat-info">
            <span class="stat-value">${currentProg.credits || 160}</span>
            <span class="stat-label">Total Degree Credits</span>
          </div>
        </div>
        <div class="stat-card stat-amber">
          <div class="stat-icon">💼</div>
          <div class="stat-info">
            <span class="stat-value">${currentUni.placements.highest_package}</span>
            <span class="stat-label">Branch Highest Package</span>
          </div>
        </div>
      </div>

      <!-- Program Comprehensive Overview -->
      <div class="exam-card" style="padding: 34px; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="font-size: 1.8rem;">📘</div>
          <div>
            <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.45rem; color: var(--text-primary); margin: 0;">
              Curriculum Overview & Educational Objectives
            </h2>
            <span style="font-size: 0.82rem; color: var(--text-muted);">
              Outcome-Based Education Framework Aligned with IEEE & ACM Curricula
            </span>
          </div>
        </div>

        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.85; margin-bottom: 24px;">
          ${currentProg.description || 'The curriculum offers rigorous technical training covering computational theory, distributed algorithms, systems engineering, machine learning pipelines, and production web systems. Students participate in industrial internships, competitive programming, and capstone engineering sprints.'}
        </p>

        <!-- Eligibility and Admission Criteria -->
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 22px; margin-bottom: 24px;">
          <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; color: var(--text-primary); margin: 0 0 10px;">
            📋 Admission Eligibility Criteria
          </h4>
          <p style="font-size: 0.9rem; color: var(--neon-cyan); margin: 0 0 10px; font-weight: 600;">
            ${currentProg.eligibility || '10+2 with Physics, Mathematics & Chemistry (Minimum 75% aggregate) or qualifying All-India JEE Main score.'}
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 0.78rem; color: var(--text-secondary);">
            <span class="service-feature-pill">Central Counseling (JoSAA / State)</span>
            <span class="service-feature-pill">Merit Scholarships Available</span>
            <span class="service-feature-pill">Direct Lateral Entry to Sem 3 for Diploma Holders</span>
          </div>
        </div>

        <!-- Specialization Tracks Grid -->
        <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.2rem; color: var(--text-primary); margin: 0 0 14px;">
          Specialization Tracks & Industry Electives
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          ${(currentProg.specializations || ['Artificial Intelligence & ML', 'Cloud Architecture & DevOps', 'Cybersecurity', 'Full Stack Web']).map(s => `
            <div style="background: var(--bg-surface-elevated); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; padding: 18px;">
              <div style="font-size: 1.4rem; margin-bottom: 6px;">⚡</div>
              <h5 style="font-family: 'Outfit', sans-serif; font-size: 1.05rem; color: var(--text-primary); margin: 0 0 6px;">
                ${s}
              </h5>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">
                Comprehensive lab projects, industry mentor reviews, and production capstone deliverables.
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Active Subject Breakdown by Semester -->
      <div class="exam-card" style="padding: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
          <div>
            <h3 id="prog-roster-title" style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: var(--text-primary); margin: 0 0 4px;">
              Semester 6 Active Academic Roster
            </h3>
            <span id="prog-roster-subtitle" style="font-size: 0.8rem; color: var(--text-muted);">
              Current semester core courses integrated directly with exams, PYQs, and interactive practice sets
            </span>
          </div>
          <span id="prog-roster-credits-badge" class="exam-badge badge-ete" style="font-size: 0.78rem;">
            22 Total Credits
          </span>
        </div>

        <div id="prog-subjects-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          ${ALL_SEMESTER_SUBJECTS[6].map(sub => `
            <div class="subject-card" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px; border-left: 4px solid ${sub.color};">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <strong style="font-family: 'JetBrains Mono', monospace; color: ${sub.color}; font-size: 0.95rem;">${sub.code}</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${sub.credits} Credits</span>
              </div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.98rem; margin-bottom: 8px;">${sub.name}</div>
              <div style="display: flex; gap: 6px; font-size: 0.72rem;">
                <span class="tech-pill" style="padding: 2px 8px; cursor: pointer;" onclick="switchProgTab('exams')">⏰ Exam</span>
                <span class="tech-pill" style="padding: 2px 8px; cursor: pointer;" onclick="switchProgTab('pyq-practice')">📝 PYQ</span>
                <span class="tech-pill" style="padding: 2px 8px; cursor: pointer;" onclick="switchProgTab('notes')">📚 Notes</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 2: EXAMS & TIMETABLES -->
    <section class="academic-tab-pane active" id="prog-pane-exams" style="display: block; margin-bottom: 48px;">
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: var(--text-primary); margin: 0 0 4px;">
            ${currentProg.code || 'B.Tech CSE'} Examination Schedules
          </h2>
          <span style="font-size: 0.85rem; color: var(--text-secondary);">
            Official timetable for End-Term Theory Examinations (ETE) June 2026, room allocations, and rules.
          </span>
        </div>
        <button onclick="downloadAllExamsICS()" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.82rem;">
          📅 Export All to Calendar (.ics)
        </button>
      </div>

      <div id="prog-exams-list" style="display: flex; flex-direction: column; gap: 18px;">
        ${exams.map(e => `
          <div class="exam-card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <span class="exam-badge badge-ete">${e.exam_type}</span>
                  <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--neon-cyan); font-weight: 700;">
                    ${e.subject_code}
                  </span>
                </div>
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: var(--text-primary); margin: 0 0 6px;">
                  ${e.subject_name}
                </h3>
                <div style="font-size: 0.86rem; color: var(--text-secondary); display: flex; gap: 16px; flex-wrap: wrap;">
                  <span>📅 <strong>${e.exam_date}</strong></span>
                  <span>⏰ ${e.start_time} – ${e.end_time}</span>
                  <span>📍 ${e.block} (${e.room_number})</span>
                </div>
              </div>

              <div style="display: flex; gap: 10px;">
                <button onclick="openSeatingModal('${e.subject_code}', '${e.room_number}', '${e.block}')" class="btn btn-secondary" style="padding: 8px 14px; font-size: 0.82rem;">
                  🪑 Room Allocation
                </button>
                <button onclick="downloadExamICS('${e.subject_code}', '${e.subject_name}', '${e.exam_date}', '${e.start_time}', '${e.room_number}')" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.82rem;">
                  🗓️ Add to Calendar
                </button>
              </div>
            </div>

            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 10px 14px; margin-top: 16px; font-size: 0.82rem; color: var(--text-muted); display: flex; align-items: center; gap: 10px;">
              <span style="color: var(--neon-amber);">⚠️</span>
              <span><strong>Instructions:</strong> ${e.guidelines}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- SECTION 3: PYQ & PRACTICE SETS -->
    <section class="academic-tab-pane active" id="prog-pane-pyq-practice" style="display: block; margin-bottom: 48px;">
      
      <!-- Sub-section 1: Solved Question Papers (PYQs) -->
      <div style="margin-bottom: 36px;">
        <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; color: var(--text-primary); margin: 0 0 4px;">
              Verified Previous Year Question Papers (PYQs)
            </h3>
            <span style="font-size: 0.82rem; color: var(--text-secondary);">
              Solved End-Term & Mid-Term examination papers with step-by-step marking schemes
            </span>
          </div>
          <span class="tech-pill" style="font-size: 0.78rem; color: var(--neon-emerald);">
            ${pyqs.length} Solved Papers Available
          </span>
        </div>

        <div id="prog-pyqs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
          ${pyqs.map(p => `
            <div class="exam-card" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span class="exam-badge badge-ete">${p.exam_type} ${p.year}</span>
                  <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--neon-cyan);">${p.subject_code}</span>
                </div>
                <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; color: var(--text-primary); margin: 0 0 6px;">
                  ${p.title}
                </h4>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 14px;">
                  ${p.subject_name} • Sem ${p.semester} • 📥 ${p.download_count} Downloads
                </div>
              </div>

              <div style="display: flex; gap: 10px; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
                <button onclick="previewPYQ('${p.id}', '${escapeHtml(p.title)}', '${p.subject_code}')" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem; flex: 1;">
                  📄 Preview
                </button>
                <button onclick="downloadPYQ('${p.id}', '${p.file_name}')" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.78rem; flex: 1;">
                  ⬇️ Download PDF
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Sub-section 2: Interactive Code Practice Sets from exam_sem_6 -->
      <div>
        <div style="margin-bottom: 18px;">
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; color: var(--text-primary); margin: 0 0 4px;">
            Interactive Code Practice Lab (exam_sem_6 Integrated)
          </h3>
          <span style="font-size: 0.82rem; color: var(--text-secondary);">
            Hand-curated algorithmic coding challenges with Time/Space complexity analysis, Java & Python code, and common pitfalls
          </span>
        </div>

        <div id="prog-practice-list" style="display: flex; flex-direction: column; gap: 24px;">
          ${practiceQuestions.map((q, idx) => `
            <div class="exam-card" style="padding: 26px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span class="exam-badge badge-ete">${q.subject_code}</span>
                    <span class="tech-pill" style="font-size: 0.72rem;">${q.topic}</span>
                    <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 6px; background: rgba(245, 158, 11, 0.15); color: var(--neon-amber); font-weight: 700;">
                      ${q.difficulty}
                    </span>
                  </div>
                  <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; color: var(--text-primary); margin: 0;">
                    ${q.question_number}. ${q.title}
                  </h4>
                </div>

                <div style="display: flex; gap: 8px;">
                  <button id="master-btn-${q.id}" onclick="toggleMastered('${q.id}')" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.78rem;">
                    Mark Mastered 🎯
                  </button>
                </div>
              </div>

              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px;">
                ${q.problem_statement}
              </p>

              <!-- Sample Input / Output -->
              <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem;">
                <div style="color: var(--text-muted);">Input: <span style="color: var(--text-primary);">${q.sample_input}</span></div>
                <div style="color: var(--text-muted); margin-top: 4px;">Output: <span style="color: var(--neon-emerald); font-weight: 700;">${q.sample_output}</span></div>
              </div>

              <!-- Complexity Analysis Badges -->
              <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 16px;">
                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                  Time Complexity: <strong style="color: var(--neon-emerald); font-family: 'JetBrains Mono', monospace;">${q.time_complexity}</strong>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                  Space Complexity: <strong style="color: var(--neon-cyan); font-family: 'JetBrains Mono', monospace;">${q.space_complexity}</strong>
                </div>
              </div>

              <!-- Code Solution Viewer -->
              <div style="background: #090d16; border: 1px solid var(--border-subtle); border-radius: 10px; overflow: hidden;">
                <div style="background: var(--bg-surface-elevated); padding: 8px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle);">
                  <div style="display: flex; gap: 8px;">
                    <button class="tech-pill active" id="btn-lang-java-${q.id}" onclick="switchCodeLang('${q.id}', 'java')" style="font-size: 0.72rem; cursor: pointer;">Java Solution</button>
                    ${q.code_python ? `<button class="tech-pill" id="btn-lang-py-${q.id}" onclick="switchCodeLang('${q.id}', 'py')" style="font-size: 0.72rem; cursor: pointer;">Python Solution</button>` : ''}
                  </div>
                  <button onclick="copyCodeSnippet('${q.id}')" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.72rem;">
                    📋 Copy Code
                  </button>
                </div>
                <pre style="margin: 0; padding: 16px; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; color: #e2e8f0; line-height: 1.5;"><code id="code-snippet-${q.id}">${escapeHtml(q.code_java)}</code></pre>
              </div>

              <!-- Pitfalls alert -->
              <div style="background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.25); border-radius: 8px; padding: 10px 14px; margin-top: 14px; font-size: 0.8rem; color: var(--neon-rose); display: flex; align-items: center; gap: 8px;">
                <span>⚠️</span>
                <span><strong>Exam Pitfall:</strong> ${q.pitfalls_warning}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </section>

    <!-- SECTION 4: ASSIGNMENTS & CAPSTONES -->
    <section class="academic-tab-pane active" id="prog-pane-assignments-projects" style="display: block; margin-bottom: 48px;">
      
      <!-- Sub-section 1: Coursework Deliverables (Assignments) -->
      <div style="margin-bottom: 36px;">
        <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; color: var(--text-primary); margin: 0 0 4px;">
              Active Coursework Assignments
            </h3>
            <span style="font-size: 0.82rem; color: var(--text-secondary);">
              Semester 6 problem sheets and project briefs with automated submission verification
            </span>
          </div>
          <span class="tech-pill" style="font-size: 0.78rem; color: var(--neon-amber);">
            ${assignments.length} Deliverables Tracked
          </span>
        </div>

        <div id="prog-assignments-list" style="display: flex; flex-direction: column; gap: 16px;">
          ${assignments.map(a => `
            <div class="exam-card" style="padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span class="exam-badge badge-ete">${a.subject_code}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Max Marks: ${a.max_marks}</span>
                    ${a.submitted ? '<span style="font-size: 0.72rem; color: var(--neon-emerald); font-weight: 700; background: rgba(16,185,129,0.12); padding: 2px 8px; border-radius: 6px;">✓ Submitted</span>' : '<span style="font-size: 0.72rem; color: var(--neon-rose); font-weight: 700; background: rgba(244,63,94,0.12); padding: 2px 8px; border-radius: 6px;">Pending</span>'}
                  </div>
                  <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.2rem; color: var(--text-primary); margin: 0 0 6px;">
                    ${a.title}
                  </h4>
                  <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 10px;">
                    ${a.description}
                  </p>
                  <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 14px; flex-wrap: wrap;">
                    <span>👨‍🏫 ${a.instructor}</span>
                    <span>•</span>
                    <span>📦 Format: ${a.submission_format}</span>
                    <span>•</span>
                    <span style="color: var(--neon-amber);">⏳ Due: ${new Date(a.due_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <button onclick="openAssignmentModal('${a.id}', '${escapeHtml(a.title)}')" class="btn ${a.submitted ? 'btn-secondary' : 'btn-primary'}" style="padding: 8px 16px; font-size: 0.82rem;">
                    ${a.submitted ? 'View Submission 📄' : 'Submit Solution 📤'}
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Sub-section 2: Student Innovation Projects & Capstone Showcase -->
      <div>
        <!-- Official SCSE Project Approval Form Banner -->
        <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(56, 189, 248, 0.1)); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 16px; padding: 18px 22px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; backdrop-filter: blur(12px);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 2.2rem; background: rgba(99, 102, 241, 0.2); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">📋</div>
            <div>
              <div style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 2px;">
                Galgotias SCSE B.Tech Project Approval Form (Odd 2026-27)
              </div>
              <div style="font-size: 0.82rem; color: var(--text-secondary);">
                Submit your official B.Tech project title, SDG goals, team details, and 200–250 word abstract with 1:1 official document print &amp; Word (.doc) export.
              </div>
            </div>
          </div>
          <a href="project-approval.html" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.84rem; text-decoration: none; white-space: nowrap;">
            Open Form Portal ↗
          </a>
        </div>

        <div style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; color: var(--text-primary); margin: 0 0 4px;">
              Student Capstones & Teammate Finder
            </h3>
            <span style="font-size: 0.82rem; color: var(--text-secondary);">
              Explore and collaborate on student-built systems, open-source repositories, and startup prototypes
            </span>
          </div>
          <span class="tech-pill" style="font-size: 0.78rem; color: var(--neon-cyan);">
            ${projects.length} Open Initiatives
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          ${projects.map(proj => `
            <div class="project-card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div class="project-header" style="margin-bottom: 10px;">
                  <span class="exam-badge badge-ete" style="font-size: 0.7rem;">${proj.category}</span>
                  <button onclick="upvoteProject('${proj.id}')" style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); color: var(--neon-emerald); font-size: 0.75rem; padding: 3px 10px; border-radius: 8px; cursor: pointer; font-weight: 700;">
                    ▲ <span id="proj-upvotes-${proj.id}">${proj.upvotes}</span>
                  </button>
                </div>

                <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.2rem; color: var(--text-primary); margin: 0 0 6px;">
                  ${proj.title}
                </h4>

                <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 14px;">
                  ${proj.tagline}
                </p>

                <!-- Tech Tags -->
                <div class="tech-tags" style="margin-bottom: 16px;">
                  ${proj.tech_stack.map(t => `<span class="tech-pill" style="font-size: 0.7rem;">${t}</span>`).join('')}
                </div>

                ${proj.looking_for_teammates ? `
                  <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 10px; margin-bottom: 14px;">
                    <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--neon-cyan); font-weight: 700; margin-bottom: 4px;">🤝 Teammates Wanted:</div>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                      ${proj.open_roles.map(r => `<span style="font-size: 0.7rem; color: var(--text-secondary);">• ${r}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <div class="project-footer" style="padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <a href="${proj.github_url}" target="_blank" style="color: var(--neon-cyan); font-size: 0.82rem; text-decoration: none; font-weight: 600;">
                  GitHub Repo ↗
                </a>
                <button onclick="openCollabModal('${proj.title}')" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.78rem;">
                  Join Team 🤝
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </section>

    <!-- SECTION 5: NOTES & STUDY GUIDES -->
    <section class="academic-tab-pane active" id="prog-pane-notes" style="display: block; margin-bottom: 48px;">
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: var(--text-primary); margin: 0 0 4px;">
            High-Yield Chapter Revision Notes & Handbooks
          </h2>
          <span style="font-size: 0.85rem; color: var(--text-secondary);">
            Synthesized formula sheets, algorithm proofs, and exam revision guides written by top scholars and faculty.
          </span>
        </div>
        <span class="tech-pill" style="font-size: 0.8rem; color: var(--neon-cyan);">
          ${notes.length} Study Guides Ready
        </span>
      </div>

      <div id="prog-notes-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px;">
        ${notes.map(n => `
          <div class="note-card">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="exam-badge badge-ete" style="font-size: 0.72rem;">${n.subject_code}</span>
                <span style="font-size: 0.75rem; color: var(--neon-amber); font-weight: 700;">★ ${n.rating} (${n.downloads} Downloads)</span>
              </div>

              <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; color: var(--text-primary); margin: 0 0 8px; line-height: 1.3;">
                ${n.title}
              </h3>

              <div style="font-size: 0.8rem; color: var(--neon-cyan); margin-bottom: 12px;">
                ✍️ ${n.author} • 📄 ${n.pages} Pages Comprehensive
              </div>

              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
                ${n.summary}
              </p>

              <!-- Key Topics Covered -->
              <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px;">
                ${n.topics.map(t => `<span class="service-feature-pill">${t}</span>`).join('')}
              </div>
            </div>

            <div style="display: flex; gap: 10px; align-items: center; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
              <button onclick="openNoteReader('${n.id}')" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.82rem; flex: 1;">
                Read Notes Online 📖
              </button>
              <button onclick="downloadNotePDF('${n.id}', '${escapeHtml(n.title)}')" class="btn btn-secondary" style="padding: 8px 14px; font-size: 0.82rem;">
                PDF ⬇️
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Auto scroll to requested section if URL has tab parameter
  if (initialTab && initialTab !== 'program-detail') {
    setTimeout(() => {
      const targetPane = document.getElementById(`prog-pane-${initialTab}`);
      if (targetPane) targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
}

// Section smooth scroll navigator (replaces clunky secondary tab switching)
window.switchProgTab = function(tabName) {
  const targetPane = document.getElementById(`prog-pane-${tabName}`);
  if (targetPane) {
    targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const url = new URL(window.location);
  url.searchParams.set('tab', tabName);
  window.history.replaceState({}, '', url);
};

// Seating Allotment Modal
window.openSeatingModal = function(subCode, roomNo, block) {
  let modal = document.getElementById('seating-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'seating-modal';
    modal.className = 'cc-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="cc-modal-box" style="max-width: 500px; border-color: var(--neon-cyan);">
      <button class="modal-close-btn" onclick="document.getElementById('seating-modal').classList.remove('active')">&times;</button>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="font-size: 2rem;">🪑</div>
        <div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: var(--text-primary); margin: 0;">Seating & Hall Allotment</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${subCode} End-Term Examination</span>
        </div>
      </div>

      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 0.88rem;">
        <div style="margin-bottom: 8px;">Academic Block: <strong style="color: var(--neon-cyan);">${block}</strong></div>
        <div style="margin-bottom: 8px;">Designated Room: <strong style="color: var(--neon-emerald); font-size: 1.05rem;">${roomNo}</strong></div>
        <div style="margin-bottom: 8px;">Desk Allotment: <strong style="font-family: 'JetBrains Mono', monospace; color: var(--text-primary);">Desk #14 (Row C)</strong></div>
        <div style="color: var(--text-muted); font-size: 0.78rem; margin-top: 10px;">Please report 20 minutes prior to exam commencement with your biometric identity card.</div>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-primary" onclick="document.getElementById('seating-modal').classList.remove('active')">Got It</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
};

// Calendar .ics download simulation
window.downloadExamICS = function(subCode, subName, date, time, room) {
  const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${subCode}: ${subName} Exam\nDESCRIPTION:Room: ${room}\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([icsData], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${subCode}_Exam.ics`;
  a.click();
  window.showToast(`Calendar sync generated for ${subCode}!`, '🗓️');
};

window.downloadAllExamsICS = function() {
  window.showToast('Comprehensive Semester 6 Calendar (.ics) downloaded!', '📅');
};

// PYQ Preview & Download
window.previewPYQ = function(id, title, subCode) {
  let modal = document.getElementById('pyq-preview-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pyq-preview-modal';
    modal.className = 'cc-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="cc-modal-box" style="max-width: 640px; border-color: var(--neon-cyan);">
      <button class="modal-close-btn" onclick="document.getElementById('pyq-preview-modal').classList.remove('active')">&times;</button>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="font-size: 1.8rem;">📄</div>
        <div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; color: var(--text-primary); margin: 0;">${title}</h3>
          <span style="font-size: 0.8rem; color: var(--neon-cyan);">${subCode} Solved Question Paper</span>
        </div>
      </div>
      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 20px; margin-bottom: 20px; max-height: 340px; overflow-y: auto; font-size: 0.88rem; line-height: 1.7; color: var(--text-secondary);">
        <p style="color: var(--neon-emerald); font-weight: 700;">SECTION A (Mandatory Short Questions - 20 Marks)</p>
        <p>Q1. Explain optimal substructure and write the recursive state equation for the 0/1 Knapsack problem.<br>
        <em>Solution: State dp[i][w] represents maximum value obtainable using subset of first i items with weight limit w...</em></p>
        <p>Q2. Define Synthesized vs Inherited attributes in Syntax-Directed Definitions with an arithmetic parse tree example.<br>
        <em>Solution: Synthesized attributes evaluate bottom-up from children nodes; inherited attributes pull from parent or siblings...</em></p>
        <p style="color: var(--neon-emerald); font-weight: 700;">SECTION B (Analytical Numericals - 40 Marks)</p>
        <p>Q3. Compute the FIRST and FOLLOW sets for given arithmetic LL(1) grammar without left recursion.<br>
        <em>Solution: FIRST(E) = {(, id}, FOLLOW(E) = {$, )}...</em></p>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-secondary" onclick="document.getElementById('pyq-preview-modal').classList.remove('active')">Close</button>
        <button class="btn btn-primary" onclick="downloadPYQ('${id}', '${subCode}_Solved.pdf')">Download Full PDF 📥</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
};

window.downloadPYQ = function(id, fileName) {
  window.CampusDB.incrementPYQDownload(id);
  window.showToast(`Downloading ${fileName}...`, '⬇️');
};

// Code Lang Switcher
window.switchCodeLang = function(questionId, lang) {
  const codeEl = document.getElementById(`code-snippet-${questionId}`);
  const btnJava = document.getElementById(`btn-lang-java-${questionId}`);
  const btnPy = document.getElementById(`btn-lang-py-${questionId}`);
  const q = MOCK_DATA.practice_questions.find(item => item.id === questionId);
  if (!q || !codeEl) return;

  if (lang === 'py' && q.code_python) {
    codeEl.innerText = q.code_python;
    if (btnPy) btnPy.classList.add('active');
    if (btnJava) btnJava.classList.remove('active');
  } else {
    codeEl.innerText = q.code_java;
    if (btnJava) btnJava.classList.add('active');
    if (btnPy) btnPy.classList.remove('active');
  }
};

window.copyCodeSnippet = function(questionId) {
  const codeEl = document.getElementById(`code-snippet-${questionId}`);
  if (codeEl) {
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      window.showToast('Source code copied to clipboard!', '📋');
    }).catch(() => {
      window.showToast('Copied to clipboard!', '📋');
    });
  }
};

window.toggleMastered = function(questionId) {
  const btn = document.getElementById(`master-btn-${questionId}`);
  if (btn) {
    if (btn.innerText.includes('Mastered')) {
      btn.innerHTML = 'Mark Mastered 🎯';
      btn.style.color = '';
      window.showToast('Question reset in revision queue', '🔄');
    } else {
      btn.innerHTML = '✓ Mastered';
      btn.style.color = 'var(--neon-emerald)';
      window.showToast('Great job! Question marked as mastered.', '🎉');
    }
  }
};

// Assignment Submission Modal
window.openAssignmentModal = function(asgId, title) {
  let modal = document.getElementById('assignment-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'assignment-modal';
    modal.className = 'cc-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="cc-modal-box" style="max-width: 520px; border-color: var(--neon-cyan);">
      <button class="modal-close-btn" onclick="document.getElementById('assignment-modal').classList.remove('active')">&times;</button>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="font-size: 1.8rem;">📤</div>
        <div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: var(--text-primary); margin: 0;">Submit Assignment</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${title}</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
        <div>
          <label style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 6px;">GitHub Repository or Live Solution Link</label>
          <input type="url" class="filter-input" style="width: 100%;" placeholder="https://github.com/username/project">
        </div>
        <div>
          <label style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 6px;">Notes for Faculty Evaluator</label>
          <textarea class="filter-input" style="width: 100%; height: 80px; resize: none;" placeholder="Explain your time complexity or architecture decisions..."></textarea>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn btn-secondary" onclick="document.getElementById('assignment-modal').classList.remove('active')">Cancel</button>
        <button class="btn btn-primary" onclick="submitAsg('${asgId}')">Upload & Submit Solution 🚀</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
};

window.submitAsg = async function(asgId) {
  await window.CampusDB.submitAssignment(asgId, '', null);
  document.getElementById('assignment-modal').classList.remove('active');
  window.showToast('Assignment submitted successfully for faculty evaluation!', '✅');
  renderProgramDetail();
};

// Project Upvote & Collab
window.upvoteProject = function(projId) {
  const count = window.CampusDB.upvoteProject(projId);
  const el = document.getElementById(`proj-upvotes-${projId}`);
  if (el) el.innerText = count;
  window.showToast('Project upvoted!', '▲');
};

window.openCollabModal = function(projectTitle) {
  window.showToast(`Collaboration request sent to ${projectTitle} team lead!`, '🤝');
};

// Notes Modal Reader
window.openNoteReader = async function(noteId) {
  const note = await window.CampusDB.getNoteById(noteId);
  let modal = document.getElementById('note-reader-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'note-reader-modal';
    modal.className = 'cc-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="cc-modal-box" style="max-width: 760px; max-height: 85vh; display: flex; flex-direction: column; border-color: var(--neon-indigo);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.8rem;">📖</div>
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; color: var(--text-primary); margin: 0;">${note.title}</h3>
            <span style="font-size: 0.78rem; color: var(--neon-cyan);">${note.subject_code} • Written by ${note.author}</span>
          </div>
        </div>
        <button class="modal-close-btn" style="position: static;" onclick="document.getElementById('note-reader-modal').classList.remove('active')">&times;</button>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 10px 6px; font-size: 0.9rem; line-height: 1.75; color: var(--text-secondary);">
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 18px; margin-bottom: 16px; white-space: pre-wrap; font-family: 'Inter', sans-serif;">
${escapeHtml(note.content_markdown || note.summary)}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border-subtle); margin-top: 12px;">
        <span style="font-size: 0.78rem; color: var(--text-muted);">Verified for Semester 6 End-Term Syllabus</span>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" onclick="document.getElementById('note-reader-modal').classList.remove('active')">Close</button>
          <button class="btn btn-primary" onclick="downloadNotePDF('${note.id}', '${escapeHtml(note.title)}')">Download PDF 📥</button>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
};

// Dynamic Academic Year and Semester Filter Engine
window.handleYearFilterChange = function(yearVal) {
  currentSelectedYear = yearVal;
  const semSelect = document.getElementById('filter-academic-sem');
  if (!semSelect) return;

  if (yearVal === '1') {
    semSelect.innerHTML = `
      <option value="all">All Year 1 (Sem 1 & 2)</option>
      <option value="1" selected>Semester 1</option>
      <option value="2">Semester 2</option>
    `;
    currentSelectedSem = '1';
  } else if (yearVal === '2') {
    semSelect.innerHTML = `
      <option value="all">All Year 2 (Sem 3 & 4)</option>
      <option value="3" selected>Semester 3</option>
      <option value="4">Semester 4</option>
    `;
    currentSelectedSem = '3';
  } else if (yearVal === '3') {
    semSelect.innerHTML = `
      <option value="all">All Year 3 (Sem 5 & 6)</option>
      <option value="5">Semester 5</option>
      <option value="6" selected>Semester 6 (Active)</option>
    `;
    currentSelectedSem = '6';
  } else if (yearVal === '4') {
    semSelect.innerHTML = `
      <option value="all">All Year 4 (Sem 7 & 8)</option>
      <option value="7" selected>Semester 7</option>
      <option value="8">Semester 8</option>
    `;
    currentSelectedSem = '7';
  } else {
    semSelect.innerHTML = `
      <option value="all">All Semesters (1 - 8)</option>
      <option value="1">Semester 1</option>
      <option value="2">Semester 2</option>
      <option value="3">Semester 3</option>
      <option value="4">Semester 4</option>
      <option value="5">Semester 5</option>
      <option value="6" selected>Semester 6 (Active)</option>
      <option value="7">Semester 7</option>
      <option value="8">Semester 8</option>
    `;
    currentSelectedSem = '6';
  }

  applyActiveSemesterFilter(currentSelectedSem, yearVal);
};

window.handleSemFilterChange = function(semVal) {
  currentSelectedSem = semVal;
  const yearSelect = document.getElementById('filter-academic-year');
  if (yearSelect) {
    if (semVal === '1' || semVal === '2') {
      yearSelect.value = '1';
      currentSelectedYear = '1';
    } else if (semVal === '3' || semVal === '4') {
      yearSelect.value = '2';
      currentSelectedYear = '2';
    } else if (semVal === '5' || semVal === '6') {
      yearSelect.value = '3';
      currentSelectedYear = '3';
    } else if (semVal === '7' || semVal === '8') {
      yearSelect.value = '4';
      currentSelectedYear = '4';
    }
  }

  applyActiveSemesterFilter(semVal, currentSelectedYear);
};

window.applyActiveSemesterFilter = function(semVal, yearVal) {
  // 1. Update Active Semester Badge in Banner
  const badge = document.getElementById('prog-active-sem-badge');
  if (badge) {
    if (semVal === 'all') {
      badge.textContent = yearVal === 'all' ? 'Active: All Semesters (1 - 8)' : `Active: Year ${yearVal} Term`;
    } else {
      badge.textContent = `Active: Semester ${semVal}`;
    }
  }

  // 2. Tab 1: Re-render Subjects Grid and Header
  const rosterTitle = document.getElementById('prog-roster-title');
  const rosterSubtitle = document.getElementById('prog-roster-subtitle');
  const creditsBadge = document.getElementById('prog-roster-credits-badge');
  const subjectsGrid = document.getElementById('prog-subjects-grid');

  let subjectsToShow = [];
  if (semVal === 'all') {
    if (yearVal === '1') subjectsToShow = [...ALL_SEMESTER_SUBJECTS[1], ...ALL_SEMESTER_SUBJECTS[2]];
    else if (yearVal === '2') subjectsToShow = [...ALL_SEMESTER_SUBJECTS[3], ...ALL_SEMESTER_SUBJECTS[4]];
    else if (yearVal === '3') subjectsToShow = [...ALL_SEMESTER_SUBJECTS[5], ...ALL_SEMESTER_SUBJECTS[6]];
    else if (yearVal === '4') subjectsToShow = [...ALL_SEMESTER_SUBJECTS[7], ...ALL_SEMESTER_SUBJECTS[8]];
    else {
      for (let s = 1; s <= 8; s++) {
        subjectsToShow.push(...ALL_SEMESTER_SUBJECTS[s]);
      }
    }
  } else {
    const semNum = parseInt(semVal);
    subjectsToShow = ALL_SEMESTER_SUBJECTS[semNum] || ALL_SEMESTER_SUBJECTS[6];
  }

  const totalCredits = subjectsToShow.reduce((acc, s) => acc + (s.credits || 0), 0);
  if (rosterTitle) {
    rosterTitle.textContent = semVal === 'all' 
      ? (yearVal === 'all' ? 'All Semesters (1 - 8) Comprehensive Roster' : `Year ${yearVal} Academic Roster`)
      : `Semester ${semVal} Active Academic Roster`;
  }
  if (rosterSubtitle) {
    rosterSubtitle.textContent = `Displaying ${subjectsToShow.length} verified courses with direct links to exams, PYQs, and revision handbooks.`;
  }
  if (creditsBadge) {
    creditsBadge.textContent = `${totalCredits} Total Credits`;
  }

  if (subjectsGrid) {
    subjectsGrid.innerHTML = subjectsToShow.map(sub => `
      <div class="subject-card" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px; border-left: 4px solid ${sub.color}; transition: transform 0.2s, box-shadow 0.2s;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <strong style="font-family: 'JetBrains Mono', monospace; color: ${sub.color}; font-size: 0.95rem;">${sub.code}</strong>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${sub.credits} Credits</span>
        </div>
        <div style="font-weight: 700; color: var(--text-primary); font-size: 0.98rem; margin-bottom: 8px;">${sub.name}</div>
        <div style="display: flex; gap: 6px; font-size: 0.72rem;">
          <span class="tech-pill" style="padding: 2px 8px; cursor: pointer;" onclick="switchProgTab('exams')">⏰ Exam</span>
          <span class="tech-pill" style="padding: 2px 8px; cursor: pointer;" onclick="switchProgTab('pyq-practice')">📝 PYQ</span>
          <span class="tech-pill" style="padding: 2px 8px; cursor: pointer;" onclick="switchProgTab('notes')">📚 Notes</span>
        </div>
      </div>
    `).join('');
  }

  // 3. Tab 2: Filter Exams List
  const examsList = document.getElementById('prog-exams-list');
  if (examsList) {
    const subjectCodes = new Set(subjectsToShow.map(s => s.code));
    let matchingExams = cachedExams.filter(e => semVal === 'all' || subjectCodes.has(e.subject_code));

    if (matchingExams.length === 0) {
      // Fallback: Generate mock exam schedule for the filtered subjects
      matchingExams = subjectsToShow.slice(0, 4).map((sub, idx) => ({
        subject_code: sub.code,
        subject_name: sub.name,
        exam_type: 'End-Term (ETE)',
        exam_date: `2026-06-${15 + idx * 3}`,
        start_time: '09:30 AM',
        end_time: '12:30 PM',
        block: 'Turing Block',
        room_number: `30${idx + 2}`,
        guidelines: 'Standard university examination protocol applies. Calculators allowed per departmental rubric.'
      }));
    }

    examsList.innerHTML = matchingExams.map(e => `
      <div class="exam-card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="exam-badge badge-ete">${e.exam_type}</span>
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--neon-cyan); font-weight: 700;">
                ${e.subject_code}
              </span>
            </div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: var(--text-primary); margin: 0 0 6px;">
              ${e.subject_name}
            </h3>
            <div style="font-size: 0.86rem; color: var(--text-secondary); display: flex; gap: 16px; flex-wrap: wrap;">
              <span>📅 <strong>${e.exam_date}</strong></span>
              <span>⏰ ${e.start_time} – ${e.end_time}</span>
              <span>📍 ${e.block} (${e.room_number})</span>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button onclick="openSeatingModal('${e.subject_code}', '${e.room_number}', '${e.block}')" class="btn btn-secondary" style="padding: 8px 14px; font-size: 0.82rem;">
              🪑 Room Allocation
            </button>
            <button onclick="downloadExamICS('${e.subject_code}', '${e.subject_name}', '${e.exam_date}', '${e.start_time}', '${e.room_number}')" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.82rem;">
              🗓️ Add to Calendar
            </button>
          </div>
        </div>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 10px 14px; margin-top: 16px; font-size: 0.82rem; color: var(--text-muted); display: flex; align-items: center; gap: 10px;">
          <span style="color: var(--neon-amber);">⚠️</span>
          <span><strong>Instructions:</strong> ${e.guidelines}</span>
        </div>
      </div>
    `).join('');
  }

  // 4. Tab 3: Filter PYQs Grid
  const pyqsGrid = document.getElementById('prog-pyqs-grid');
  if (pyqsGrid) {
    const subjectCodes = new Set(subjectsToShow.map(s => s.code));
    let matchingPyqs = cachedPyqs.filter(p => semVal === 'all' || p.semester == semVal || subjectCodes.has(p.subject_code));

    if (matchingPyqs.length === 0) {
      matchingPyqs = subjectsToShow.slice(0, 3).map(sub => ({
        id: `pyq-${sub.code.toLowerCase()}`,
        subject_code: sub.code,
        subject_name: sub.name,
        semester: semVal === 'all' ? 1 : parseInt(semVal),
        exam_type: 'ETE',
        year: '2025',
        title: `${sub.code}: Official End-Term Solved Question Paper`,
        file_name: `${sub.code}_Solved_Paper.pdf`,
        download_count: 850 + Math.floor(Math.random() * 400)
      }));
    }

    pyqsGrid.innerHTML = matchingPyqs.map(p => `
      <div class="exam-card" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span class="exam-badge badge-ete">${p.exam_type} ${p.year}</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--neon-cyan);">${p.subject_code}</span>
          </div>
          <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; color: var(--text-primary); margin: 0 0 6px;">
            ${p.title}
          </h4>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 14px;">
            ${p.subject_name} • Sem ${p.semester} • 📥 ${p.download_count} Downloads
          </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
          <button onclick="previewPYQ('${p.id}', '${escapeHtml(p.title)}', '${p.subject_code}')" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem; flex: 1;">
            📄 Preview
          </button>
          <button onclick="downloadPYQ('${p.id}', '${p.file_name}')" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.78rem; flex: 1;">
            ⬇️ Download PDF
          </button>
        </div>
      </div>
    `).join('');
  }

  // 5. Tab 5: Filter Notes Grid
  const notesGrid = document.getElementById('prog-notes-grid');
  if (notesGrid) {
    const subjectCodes = new Set(subjectsToShow.map(s => s.code));
    let matchingNotes = cachedNotes.filter(n => semVal === 'all' || subjectCodes.has(n.subject_code));

    if (matchingNotes.length === 0) {
      matchingNotes = subjectsToShow.slice(0, 3).map(sub => ({
        id: `note-${sub.code.toLowerCase()}`,
        subject_code: sub.code,
        title: `${sub.code} High-Yield Formula Handbook & Algorithm Reference`,
        summary: `Comprehensive revision guide synthesizing core principles, algorithm proofs, and formula handbooks for ${sub.name}.`,
        author: 'Department Curriculum Board',
        rating: '4.9',
        downloads: 1240 + Math.floor(Math.random() * 300)
      }));
    }

    notesGrid.innerHTML = matchingNotes.map(n => `
      <div class="note-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span class="exam-badge badge-ete" style="font-size: 0.72rem;">${n.subject_code}</span>
            <span style="font-size: 0.75rem; color: var(--neon-amber); font-weight: 700;">★ ${n.rating} (${n.downloads} Downloads)</span>
          </div>

          <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; color: var(--text-primary); margin: 0 0 8px; line-height: 1.3;">
            ${n.title}
          </h3>

          <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
            ${n.summary}
          </p>

          <div style="display: flex; gap: 8px; margin-bottom: 16px; font-size: 0.78rem; color: var(--text-muted);">
            <span>✍️ ${n.author}</span>
            <span>•</span>
            <span style="color: var(--neon-emerald);">Verified Syllabus</span>
          </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
          <button onclick="openNoteReader('${n.id}')" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.82rem; flex: 1;">
            Read Notes Online 📖
          </button>
          <button onclick="downloadNotePDF('${n.id}', '${escapeHtml(n.title)}')" class="btn btn-secondary" style="padding: 8px 14px; font-size: 0.82rem;">
            PDF ⬇️
          </button>
        </div>
      </div>
    `).join('');
  }

  // Toast feedback
  if (window.showToast) {
    const semLabel = semVal === 'all' ? (yearVal === 'all' ? 'All Semesters (1 - 8)' : `Year ${yearVal}`) : `Semester ${semVal}`;
    window.showToast(`Active curriculum filter: ${semLabel}`, '🎓');
  }
};

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
