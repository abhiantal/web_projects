/**
 * CAMPUS CIRCLE - UNIVERSITY DIRECTORY & MULTI-TAB DETAIL ENGINE
 * Renders:
 * 1. Universities directory card grid & live search bar ("screech bar") on index.html
 * 2. 5-Tab University Detail Hub (university-detail.html):
 *    - Tab 1: University (Heritage, stats, governance, rankings)
 *    - Tab 2: Program (Degree programs, click navigates to program-detail.html)
 *    - Tab 3: Services ("serviss" - Library, Hostels, Sports, Health, Transit, Incubation)
 *    - Tab 4: Placements ("plasmants" - CTC metrics, placement rate, top recruiters)
 *    - Tab 5: ERP ("erp" - Attendance meter, fee e-receipts, SGPA transcript, course register)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // If on main page with universities tab
  if (document.getElementById('universities-grid')) {
    await renderUniversities();
    initUniversitySearch();
  }

  // If on university detail page
  if (document.getElementById('uni-detail-container')) {
    await renderUniversityDetail();
  }
});

let allUniversities = [];

// ==========================================================================
// 1. RENDER UNIVERSITIES ON MAIN DIRECTORY PAGE (INDEX.HTML TAB 2)
// ==========================================================================
let currentFilter = 'ALL';

async function renderUniversities(query = '') {
  const grid = document.getElementById('universities-grid');
  if (!grid) return;

  allUniversities = await window.CampusDB.getUniversities(query);

  let filtered = allUniversities;
  if (currentFilter === 'NIRF') {
    filtered = allUniversities.filter(u => u.ranking_nirf && u.ranking_nirf.includes('NIRF'));
  } else if (currentFilter === 'PLACEMENTS') {
    filtered = allUniversities.filter(u => {
      const highest = u.placements && u.placements.highest_package;
      return highest && (highest.includes('Cr') || parseInt(highest) >= 30);
    });
  } else if (currentFilter === 'TECH') {
    filtered = allUniversities.filter(u => u.programs && u.programs.some(p => p.name.includes('B.Tech') || p.name.includes('Computer')));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <div style="font-size: 2.8rem; margin-bottom: 10px;">🏛️</div>
        <p style="font-size: 1.25rem; margin-bottom: 6px; color: var(--text-primary); font-weight: 700;">No institutions match your search criteria</p>
        <span style="font-size: 0.9rem;">Try adjusting your query or resetting filter categories.</span>
      </div>
    `;
    return;
  }

  const isUserLoggedIn = !!(window.CampusAuth && window.CampusAuth.getCurrentUser());

  grid.innerHTML = filtered.map(u => {
    // Extract clean badges
    const accreditations = (u.accreditation || 'UGC Recognized').split('•').map(s => s.trim()).filter(Boolean);
    const primaryAccred = accreditations[0] || 'NAAC Accredited';
    const secondaryAccred = accreditations[1] || 'UGC Approved';

    return `
      <div class="uni-cyber-card" onclick="navigateToUniversity('${u.slug || u.id}')" style="
        background: rgba(11, 17, 32, 0.85);
        border: 1px solid rgba(56, 189, 248, 0.22);
        border-radius: 20px;
        padding: 26px 24px;
        backdrop-filter: blur(16px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
        transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.24s, box-shadow 0.24s;
      " onmouseenter="this.style.transform='translateY(-6px)'; this.style.borderColor='rgba(56, 189, 248, 0.5)'; this.style.boxShadow='0 18px 45px rgba(0,0,0,0.6), 0 0 25px rgba(56, 189, 248, 0.15)';" onmouseleave="this.style.transform='translateY(0)'; this.style.borderColor='rgba(56, 189, 248, 0.22)'; this.style.boxShadow='0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)';">
        
        <!-- Top Ambient Glow -->
        <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>

        <div>
          <!-- Header Status & Accreditations Badge Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span style="background: rgba(16, 185, 129, 0.14); border: 1px solid rgba(16, 185, 129, 0.35); color: #34D399; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 8px; letter-spacing: 0.3px;">
                🏆 ${escapeHtml(primaryAccred)}
              </span>
              <span style="background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); color: #38BDF8; font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 8px;">
                ${escapeHtml(secondaryAccred)}
              </span>
            </div>

            <span style="background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); color: #C084FC; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 8px;">
              ${escapeHtml(u.ranking_nirf || 'Top Ranked')}
            </span>
          </div>

          <!-- University Identity Block -->
          <div style="display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px;">
            <div style="
              width: 52px;
              height: 52px;
              border-radius: 14px;
              background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2));
              border: 1px solid rgba(56, 189, 248, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.8rem;
              flex-shrink: 0;
              box-shadow: 0 0 16px rgba(56, 189, 248, 0.2);
            ">
              🏛️
            </div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin: 0; line-height: 1.2;">
                  ${escapeHtml(u.name)}
                </h3>
                <span title="Verified Institutional Partner" style="color: var(--neon-cyan); font-size: 0.95rem;">✓</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span>📍 ${escapeHtml(u.location)}</span>
                <span>•</span>
                <span>Est. ${u.established_year}</span>
                <span>•</span>
                <span style="color: var(--neon-emerald); font-weight: 600;">Active Semester 6 Hub</span>
              </div>
            </div>
          </div>

          <!-- Campus Heritage Description -->
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 18px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${escapeHtml(u.history)}
          </p>

          <!-- 3-Box Corporate Placement Intel Strip -->
          <div style="
            background: var(--bg-surface-elevated);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 12px 14px;
            margin-bottom: 18px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            text-align: center;
          ">
            <div style="border-right: 1px solid var(--border-subtle); padding-right: 8px;">
              <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700; margin-bottom: 2px;">Highest CTC</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.12rem; font-weight: 800; color: var(--neon-emerald);">${escapeHtml(u.placements.highest_package.includes('/') ? u.placements.highest_package.split('/')[0].replace(/PA/i, '').replace(/\(International\)/i, '').trim() : u.placements.highest_package)}</div>
            </div>
            <div style="border-right: 1px solid var(--border-subtle); padding-right: 8px;">
              <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700; margin-bottom: 2px;">Average CTC</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.12rem; font-weight: 700; color: var(--neon-cyan);">${escapeHtml(u.placements.average_package)}</div>
            </div>
            <div>
              <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700; margin-bottom: 2px;">Placement %</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.12rem; font-weight: 700; color: var(--neon-amber);">${escapeHtml(u.placements.placement_rate)}</div>
            </div>
          </div>

          <!-- Academic Degrees Chips -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
            ${(u.programs || []).slice(0, 2).map(p => `
              <span style="font-size: 0.74rem; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); padding: 4px 10px; border-radius: 8px; color: var(--text-primary); font-weight: 600;">
                🎓 ${escapeHtml(p.name)}
              </span>
            `).join('')}
            ${u.programs && u.programs.length > 2 ? `
              <span style="font-size: 0.74rem; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); padding: 4px 8px; border-radius: 8px; color: var(--neon-cyan);">
                +${u.programs.length - 2} More Degrees
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Card Footer with Authentication Guard Indicator -->
        <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          gap: 12px;
          flex-wrap: wrap;
        ">
          <span style="font-size: 0.8rem; color: var(--text-secondary);">
            👥 ${(u.student_count || 15000).toLocaleString()} Scholars • ${escapeHtml(u.faculty_ratio || '1:15')} Faculty
          </span>

          <button type="button" style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            border: 1px solid ${isUserLoggedIn ? 'var(--neon-cyan)' : 'rgba(245, 158, 11, 0.4)'};
            background: ${isUserLoggedIn ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.12)'};
            color: ${isUserLoggedIn ? 'var(--neon-cyan)' : '#FBBF24'};
            transition: all 0.2s;
          ">
            <span>${isUserLoggedIn ? '⚡ Launch Cockpit' : '🔒 Sign In to Access'}</span>
            <span>→</span>
          </button>
        </div>

      </div>
    `;
  }).join('');
}

function initUniversitySearch() {
  const searchInput = document.getElementById('university-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      renderUniversities(query);
    });
  }

  // Category filter buttons
  document.querySelectorAll('.uni-filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.uni-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter') || 'ALL';
      renderUniversities(searchInput ? searchInput.value.trim() : '');
    });
  });
}

// ==========================================================================
// PROTECTED NAVIGATION GUARD: REQUIRE LOGIN BEFORE NAVIGATING
// ==========================================================================
window.navigateToUniversity = function(slugOrId, targetTab = 'university') {
  const user = window.CampusAuth ? window.CampusAuth.getCurrentUser() : null;
  const isInUniFolder = window.location.pathname.includes('/university/') || window.location.pathname.includes('\\university\\');
  const target = isInUniFolder ? 'university-detail.html' : 'pages/university/university-detail.html';
  const targetUrl = `${target}?id=${encodeURIComponent(slugOrId)}&tab=${encodeURIComponent(targetTab)}`;

  // CRITICAL REQUIREMENT: Gated navigation only when user is logged in
  if (!user) {
    const uni = allUniversities.find(u => u.slug === slugOrId || u.id === slugOrId);
    const uniName = uni ? uni.name : 'University Academic Hub';

    if (window.showAuthRequiredModal) {
      window.showAuthRequiredModal(targetUrl, uniName);
      return;
    }
  }

  // User is authenticated -> proceed to university hub
  window.location.href = targetUrl;
};

window.navigateToProgram = function(uniSlug, progSlug) {
  const isInUniFolder = window.location.pathname.includes('/university/') || window.location.pathname.includes('\\university\\');
  const target = isInUniFolder ? 'program-detail.html' : 'pages/university/program-detail.html';
  window.location.href = `${target}?uni=${encodeURIComponent(uniSlug)}&prog=${encodeURIComponent(progSlug)}`;
};

// ==========================================================================
// 2. RENDER 5-TAB UNIVERSITY DETAIL PAGE (UNIVERSITY-DETAIL.HTML)
// ==========================================================================
async function renderUniversityDetail() {
  const container = document.getElementById('uni-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const idOrSlug = urlParams.get('id') || 'galgotias-university';
  const initialTab = urlParams.get('tab') || 'university';

  const uni = await window.CampusDB.getUniversityById(idOrSlug);
  const services = await window.CampusDB.getUniversityServices(uni.slug);
  const erp = await window.CampusDB.getUniversityERP(uni.slug);

  document.title = `${uni.name} – Campus Circle Profile & Academic Portal`;

  container.innerHTML = `
    <!-- Top Return Breadcrumb -->
    <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
      <a href="../../index.html?tab=universities" style="color: var(--neon-cyan); text-decoration: none; font-size: 0.88rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
        ← Back to All Universities Directory
      </a>
      <span style="font-size: 0.8rem; color: var(--text-muted);">
        Campus Circle ID: <strong style="color: var(--text-secondary);">${uni.slug}</strong>
      </span>
    </div>

    <!-- Campus Hero Banner -->
    <div class="radar-banner" style="margin-bottom: 28px; padding: 34px 38px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px;">
        <div style="display: flex; align-items: center; gap: 22px;">
          <div style="width: 76px; height: 76px; border-radius: 20px; background: rgba(56, 189, 248, 0.15); color: var(--neon-cyan); display: flex; align-items: center; justify-content: center; font-size: 2.7rem; border: 2px solid rgba(56, 189, 248, 0.35); flex-shrink: 0;">
            🏛️
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px;">
              <span class="exam-badge badge-ete">${uni.ranking_nirf}</span>
              <span style="background: rgba(16,185,129,0.15); color: var(--neon-emerald); border: 1px solid rgba(16,185,129,0.3); font-size: 0.72rem; padding: 3px 9px; border-radius: 10px; font-weight: 700;">
                ✓ ${uni.accreditation}
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Est. ${uni.established_year}</span>
            </div>
            <h1 style="font-family: 'Outfit', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 800; color: var(--text-primary); margin: 0 0 6px;">
              ${uni.name}
            </h1>
            <div style="font-size: 0.9rem; color: var(--text-secondary); display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
              <span>📍 ${uni.location}</span>
              <span>•</span>
              <span>🌳 ${uni.campus_area || 'Sprawling Green Campus'}</span>
              <span>•</span>
              <span>🌐 <a href="${uni.website_url}" target="_blank" style="color: var(--neon-cyan); text-decoration: none;">${uni.website_url.replace('https://', '')}</a></span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button onclick="switchUniTab('program')" class="btn btn-secondary" style="padding: 10px 18px; font-size: 0.88rem;">
            🎓 Explore Programs (${uni.programs.length})
          </button>
          <button onclick="switchUniTab('erp')" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.88rem;">
            📊 Student ERP Portal
          </button>
        </div>
      </div>
    </div>

    <!-- SECTION 1: UNIVERSITY OVERVIEW & HERITAGE -->
    <section class="academic-tab-pane active" id="uni-pane-university" style="display: block; margin-bottom: 48px;">
      <!-- 4 Quick Campus Metric Counters -->
      <div class="stats-grid" style="margin-bottom: 32px;">
        <div class="stat-card stat-emerald">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            ${(() => {
              const hp = uni.placements.highest_package;
              if (hp.includes('/')) {
                const parts = hp.split('/');
                const primary = parts[0].replace(/PA/i, '').replace(/\(International\)/i, '').trim();
                const secondary = parts[1].replace(/\(National\)/i, '').replace(/PA/i, '').trim();
                return `
                  <span class="stat-value" style="font-size: 1.5rem; line-height: 1.15;">${primary}</span>
                  <span style="font-size: 0.72rem; color: var(--neon-emerald); font-weight: 700; margin-top: 3px; letter-spacing: 0.2px;">🌐 Intl · ${secondary} Nat</span>
                `;
              }
              return `<span class="stat-value">${hp}</span>`;
            })()}
            <span class="stat-label">Highest Placement Package</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <span class="stat-value">${uni.placements.average_package}</span>
            <span class="stat-label">Average Placement CTC</span>
          </div>
        </div>
        <div class="stat-card stat-indigo">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">${uni.student_count.toLocaleString()}</span>
            <span class="stat-label">Enrolled Scholars</span>
          </div>
        </div>
        <div class="stat-card stat-amber">
          <div class="stat-icon">👨‍🏫</div>
          <div class="stat-info">
            <span class="stat-value">${uni.faculty_ratio}</span>
            <span class="stat-label">Faculty-to-Student Ratio</span>
          </div>
        </div>
      </div>

      <!-- History & Heritage Section -->
      <div class="exam-card" style="padding: 34px; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="font-size: 1.8rem;">📜</div>
          <div>
            <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.45rem; color: var(--text-primary); margin: 0;">
              University Heritage & Institutional Milestones
            </h2>
            <span style="font-size: 0.82rem; color: var(--text-muted);">
              Decades of Pioneering Academic Excellence and Global Technological Research
            </span>
          </div>
        </div>

        <p style="font-size: 0.96rem; color: var(--text-secondary); line-height: 1.85; margin-bottom: 22px;">
          ${uni.history}
        </p>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 22px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px;">
          <div>
            <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700;">Year Founded</span>
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${uni.established_year}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700;">NIRF National Standing</span>
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--neon-cyan); margin-top: 4px;">${uni.ranking_nirf}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700;">National Accreditation</span>
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--neon-emerald); margin-top: 4px;">${uni.accreditation}</div>
          </div>
          <div>
            <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700;">Faculty Strength</span>
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--neon-indigo); margin-top: 4px;">${uni.faculty_count} Professors</div>
          </div>
        </div>
      </div>

      <!-- Campus Governance & Leadership -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        <div class="exam-card" style="padding: 26px;">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(99, 102, 241, 0.15); color: var(--neon-indigo); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              🎖️
            </div>
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700;">Chancellor & Patron</div>
              <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.15rem; color: var(--text-primary); margin: 0;">
                ${uni.chancellor || 'Dr. Vikram Malhotra, Ph.D.'}
              </h3>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
            Guiding strategic research directions, global university collaborations, and technology incubation initiatives.
          </p>
        </div>

        <div class="exam-card" style="padding: 26px;">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(56, 189, 248, 0.15); color: var(--neon-cyan); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              🎓
            </div>
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700;">Vice-Chancellor & Academic Head</div>
              <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.15rem; color: var(--text-primary); margin: 0;">
                ${uni.vice_chancellor || 'Prof. Ananya Sen, D.Sc.'}
              </h3>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
            Overseeing curriculum design, continuous assessment frameworks, examination integrity, and faculty development.
          </p>
        </div>
      </div>
    </section>

    <!-- SECTION 2: ACADEMIC DEGREES & PROGRAMS -->
    <section class="academic-tab-pane active" id="uni-pane-program" style="display: block; margin-bottom: 48px;">
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: var(--text-primary); margin: 0 0 4px;">
            Academic Degrees & Programs
          </h2>
          <span style="font-size: 0.85rem; color: var(--text-secondary);">
            Click any program card to access its dedicated <strong>Program Detail Page</strong> with Exams, PYQs, Practice Sets, Assignments, Projects, and Notes.
          </span>
        </div>
        <span class="tech-pill" style="font-size: 0.8rem; padding: 6px 14px; background: rgba(56, 189, 248, 0.1); border-color: var(--neon-cyan); color: var(--neon-cyan); font-weight: 700;">
          ${uni.programs.length} Programs Active
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px;">
        ${uni.programs.map((p, idx) => `
          <div class="project-card" style="cursor: pointer; border-color: ${idx === 0 ? 'rgba(56, 189, 248, 0.4)' : 'var(--border-subtle)'};" onclick="navigateToProgram('${uni.slug}', '${p.slug || 'btech-cse'}')">
            <div>
              <div class="project-header" style="margin-bottom: 12px;">
                <span style="background: rgba(56, 189, 248, 0.12); color: var(--neon-cyan); border: 1px solid rgba(56, 189, 248, 0.25); font-size: 0.72rem; padding: 3px 8px; border-radius: 8px; font-weight: 700;">
                  ${p.degree || 'Degree Program'}
                </span>
                <span class="exam-badge badge-ete" style="font-size: 0.7rem;">
                  ⏱️ ${p.duration}
                </span>
              </div>

              <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.32rem; color: var(--text-primary); margin: 0 0 8px; line-height: 1.3;">
                ${p.name}
              </h3>

              <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
                ${p.description || 'Full-time rigorous curriculum integrating foundational mathematics, core computing algorithms, and hands-on laboratory projects.'}
              </p>

              <!-- Seat & Credit Matrix -->
              <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 8px 12px; flex: 1;">
                  <div style="font-size: 0.68rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Seat Capacity</div>
                  <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${p.seats} Seats</div>
                </div>
                <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 8px 12px; flex: 1;">
                  <div style="font-size: 0.68rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Graduation Credits</div>
                  <div style="font-size: 1rem; font-weight: 700; color: var(--neon-emerald);">${p.credits || 160} Credits</div>
                </div>
              </div>

              <!-- Specializations -->
              <div style="margin-bottom: 16px;">
                <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 700; margin-bottom: 8px;">
                  Specialization Electives:
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  ${(p.specializations || []).map(s => `<span class="tech-pill" style="font-size: 0.72rem;">${s}</span>`).join('')}
                </div>
              </div>
            </div>

            <div class="project-footer" style="padding-top: 14px; border-top: 1px solid var(--border-subtle); margin-top: 8px;">
              <span style="font-size: 0.8rem; color: var(--neon-cyan); font-weight: 600;">
                Includes Sem 6 Exams, PYQs & Notes
              </span>
              <a href="program-detail.html?uni=${encodeURIComponent(uni.slug)}&prog=${encodeURIComponent(p.slug || 'btech-cse')}" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.8rem;" onclick="event.stopPropagation();">
                Open Program Hub →
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- SECTION 3: CAMPUS SERVICES & FACILITIES -->
    <section class="academic-tab-pane active" id="uni-pane-services" style="display: block; margin-bottom: 48px;">
      <div style="margin-bottom: 24px;">
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: var(--text-primary); margin: 0 0 4px;">
          Campus Services & Student Facilities
        </h2>
        <span style="font-size: 0.85rem; color: var(--text-secondary);">
          State-of-the-art campus infrastructure supporting holistic learning, student housing, health, transit, and startup innovation.
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px;">
        ${services.map(s => `
          <div class="exam-card" style="padding: 26px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(56, 189, 248, 0.12); color: var(--neon-cyan); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; border: 1px solid rgba(56, 189, 248, 0.25);">
                  ${s.icon}
                </div>
                <span class="exam-badge badge-ete" style="font-size: 0.72rem;">
                  ${s.category}
                </span>
              </div>

              <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.22rem; color: var(--text-primary); margin: 0 0 8px;">
                ${s.name}
              </h3>

              <div style="font-size: 0.8rem; color: var(--neon-cyan); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                <span>⏰ ${s.timing}</span>
                <span>•</span>
                <span>📍 ${s.location.split('-')[0]}</span>
              </div>

              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
                ${s.description}
              </p>

              <!-- Feature checklist -->
              <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px;">
                ${(s.features || []).map(f => `
                  <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--neon-emerald); font-weight: bold;">✓</span>
                    <span>${f}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
                ${s.stats}
              </span>
              <button onclick="handleServiceAction('${s.name}', '${s.action_label}')" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.8rem;">
                ${s.action_label} ⚡
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- SECTION 4: PLACEMENT RECORDS & DRIVES -->
    <section class="academic-tab-pane active" id="uni-pane-placements" style="display: block; margin-bottom: 48px;">
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: var(--text-primary); margin: 0 0 4px;">
            Verified Placement Records & Corporate Drives
          </h2>
          <span style="font-size: 0.85rem; color: var(--text-secondary);">
            Audited CTC packages, annual recruiter hiring drives, and international tech offers for graduating scholars.
          </span>
        </div>
        <span class="exam-badge" style="background: rgba(16,185,129,0.15); color: var(--neon-emerald); font-size: 0.9rem; padding: 6px 16px; border: 1px solid rgba(16,185,129,0.3);">
          🌟 ${uni.placements.placement_rate} Placement Ratio
        </span>
      </div>

      <!-- Placement Metrics Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; margin-bottom: 32px;">
        <div class="erp-card" style="text-align: center; border-color: rgba(16, 185, 129, 0.35);">
          <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); font-weight: 700;">Highest International / Domestic</span>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.7rem; font-weight: 800; color: var(--neon-emerald); margin-top: 6px;">
            ${uni.placements.highest_package}
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; display: block;">Top 1% Tier-1 Offer</span>
        </div>

        <div class="erp-card" style="text-align: center;">
          <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); font-weight: 700;">Overall Average CTC</span>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.7rem; font-weight: 800; color: var(--neon-cyan); margin-top: 6px;">
            ${uni.placements.average_package}
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; display: block;">Across All CSE & IT Batches</span>
        </div>

        <div class="erp-card" style="text-align: center;">
          <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); font-weight: 700;">Median CTC Package</span>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.7rem; font-weight: 800; color: var(--neon-amber); margin-top: 6px;">
            ${uni.placements.median_package}
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; display: block;">50th Percentile Benchmark</span>
        </div>

        <div class="erp-card" style="text-align: center;">
          <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); font-weight: 700;">Total Offers Extended</span>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.7rem; font-weight: 800; color: var(--neon-indigo); margin-top: 6px;">
            ${uni.placements.total_offers}
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; display: block;">${uni.placements.international_offers || '30+ Global Offers'}</span>
        </div>
      </div>

      <!-- Marquee Corporate Recruiters -->
      <div class="exam-card" style="padding: 32px; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
          <div style="font-size: 1.6rem;">🏢</div>
          <div>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: var(--text-primary); margin: 0;">
              Marquee Tech Enterprises & Corporate Recruiters
            </h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              Companies conducting annual campus interviews, high-CTC hackathons, and pre-placement offers
            </span>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px;">
          ${uni.placements.top_recruiters.map(r => `
            <div style="background: var(--bg-surface-elevated); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 12px 20px; display: flex; align-items: center; gap: 10px; transition: all 0.2s;">
              <span style="font-size: 1.2rem;">🏢</span>
              <div>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${r}</div>
                <div style="font-size: 0.7rem; color: var(--neon-cyan);">Tier-1 Tech Partner</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Placement Trends by Sector -->
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 22px;">
          <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.05rem; color: var(--text-primary); margin: 0 0 14px;">
            Sector-Wise Recruitment Share (2025–2026 Season)
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                <span style="color: var(--text-secondary);">Full-Stack & Cloud</span>
                <span style="color: var(--neon-cyan); font-weight: 700;">42%</span>
              </div>
              <div class="attendance-progress-track">
                <div class="attendance-progress-bar good" style="width: 42%;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                <span style="color: var(--text-secondary);">AI & Machine Learning</span>
                <span style="color: var(--neon-emerald); font-weight: 700;">28%</span>
              </div>
              <div class="attendance-progress-track">
                <div class="attendance-progress-bar good" style="width: 28%;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                <span style="color: var(--text-secondary);">Systems & Security</span>
                <span style="color: var(--neon-indigo); font-weight: 700;">18%</span>
              </div>
              <div class="attendance-progress-track">
                <div class="attendance-progress-bar good" style="width: 18%;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                <span style="color: var(--text-secondary);">Fintech & Quant</span>
                <span style="color: var(--neon-amber); font-weight: 700;">12%</span>
              </div>
              <div class="attendance-progress-track">
                <div class="attendance-progress-bar warning" style="width: 12%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: STUDENT ERP ACADEMIC PORTAL -->
    <section class="academic-tab-pane active" id="uni-pane-erp" style="display: block; margin-bottom: 48px;">
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: var(--text-primary); margin: 0 0 4px;">
            ${uni.short_name} University ERP Academic Portal
          </h2>
          <span style="font-size: 0.85rem; color: var(--text-secondary);">
            Integrated ERP module simulating live attendance radar, fee receipts, digital semester transcripts, and registered courses.
          </span>
        </div>
        <span class="exam-badge badge-ete" style="font-size: 0.78rem;">
          ⚡ Live Student Session: ${erp.student_profile.roll_number}
        </span>
      </div>

      <!-- Student Profile Strip -->
      <div class="erp-card" style="margin-bottom: 24px; padding: 22px 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 18px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--neon-cyan), var(--neon-indigo)); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: #05070e; font-weight: 800;">
              AK
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; color: var(--text-primary); margin: 0;">
                  ${erp.student_profile.student_name}
                </h3>
                <span class="tech-pill" style="font-size: 0.72rem; color: var(--neon-emerald); border-color: rgba(16,185,129,0.3);">
                  Active Student
                </span>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">
                Roll: <strong style="color: var(--text-primary); font-family: 'JetBrains Mono', monospace;">${erp.student_profile.roll_number}</strong> • ${erp.student_profile.program} (Sem ${erp.student_profile.semester})
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 20px; align-items: center;">
            <div style="text-align: right;">
              <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Cumulative CGPA</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.45rem; font-weight: 800; color: var(--neon-emerald);">
                ${erp.student_profile.cgpa} / 10.0
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Overall Attendance</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.45rem; font-weight: 800; color: var(--neon-cyan);">
                ${erp.student_profile.overall_attendance}%
              </div>
            </div>
            <button onclick="openTranscriptModal()" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.82rem;">
              📜 Grade Transcript
            </button>
          </div>
        </div>
      </div>

      <!-- Grid: Attendance Meter + Fee Payment Status -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; margin-bottom: 28px;">
        
        <!-- Attendance Breakdown -->
        <div class="exam-card" style="padding: 26px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.4rem;">🎯</span>
              <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.18rem; color: var(--text-primary); margin: 0;">
                Subject-Wise Attendance Radar
              </h3>
            </div>
            <span style="font-size: 0.75rem; color: var(--neon-emerald); font-weight: 700; background: rgba(16,185,129,0.12); padding: 3px 8px; border-radius: 6px;">
              Min 75% Required
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${erp.attendance.map(a => `
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.84rem; margin-bottom: 3px;">
                  <span style="font-weight: 600; color: var(--text-primary);">
                    ${a.code} – ${a.name}
                  </span>
                  <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${a.percentage >= 85 ? 'var(--neon-emerald)' : 'var(--neon-amber)'};">
                    ${a.percentage}% (${a.attended}/${a.total})
                  </span>
                </div>
                <div class="attendance-progress-track">
                  <div class="attendance-progress-bar ${a.percentage >= 85 ? 'good' : 'warning'}" style="width: ${a.percentage}%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-top: 3px;">
                  <span>Mentor: ${a.mentor}</span>
                  <span style="color: ${a.percentage >= 85 ? 'var(--neon-emerald)' : 'var(--neon-amber)'}; font-weight: 600;">${a.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Fee Receipts & Payment Gateways -->
        <div class="exam-card" style="padding: 26px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.4rem;">🧾</span>
              <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.18rem; color: var(--text-primary); margin: 0;">
                Fee Receipts & Payment Records
              </h3>
            </div>
            <span style="font-size: 0.75rem; color: var(--neon-cyan); font-weight: 600;">
              All Dues Cleared
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${erp.fee_receipts.map(r => `
              <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">${r.term}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                    Receipt No: <strong style="font-family: 'JetBrains Mono', monospace; color: var(--text-secondary);">${r.receipt_no}</strong> • ${r.payment_date}
                  </div>
                </div>
                <div style="text-align: right; display: flex; align-items: center; gap: 12px;">
                  <div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-weight: 800; color: var(--neon-emerald); font-size: 1rem;">${r.amount}</div>
                    <div style="font-size: 0.7rem; color: var(--neon-emerald); font-weight: 600;">✓ ${r.status}</div>
                  </div>
                  <button onclick="openReceiptModal('${r.receipt_no}', '${r.term}', '${r.amount}', '${r.payment_date}', '${r.mode}')" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.75rem;">
                    PDF 📄
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </section>
  `;

  // Auto scroll to requested section if URL has tab parameter
  if (initialTab && initialTab !== 'university') {
    setTimeout(() => {
      const targetPane = document.getElementById(`uni-pane-${initialTab}`);
      if (targetPane) targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
}

// Section smooth scroll navigator (replaces clunky secondary tab switching)
window.switchUniTab = function(tabName) {
  const targetPane = document.getElementById(`uni-pane-${tabName}`);
  if (targetPane) {
    targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const url = new URL(window.location);
  url.searchParams.set('tab', tabName);
  window.history.replaceState({}, '', url);
};

window.navigateToProgram = function(uniSlug, progSlug) {
  window.location.href = `program-detail.html?uni=${encodeURIComponent(uniSlug)}&prog=${encodeURIComponent(progSlug)}`;
};

window.handleServiceAction = function(serviceName, actionLabel) {
  window.showToast(`${actionLabel} opened for ${serviceName}. Access grant verified.`, '⚡');
};

// Fee Receipt Modal
window.openReceiptModal = function(receiptNo, term, amount, date, mode) {
  let modal = document.getElementById('receipt-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'receipt-modal';
    modal.className = 'cc-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="cc-modal-box" style="max-width: 540px; border-color: var(--neon-cyan);">
      <button class="modal-close-btn" onclick="document.getElementById('receipt-modal').classList.remove('active')">&times;</button>
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 2.2rem; margin-bottom: 6px;">🏛️</div>
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.35rem; color: var(--text-primary); margin: 0;">Official University E-Receipt</h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Campus Circle Enterprise Resource Planning (ERP)</span>
      </div>

      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px; margin-bottom: 20px; font-size: 0.88rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Receipt Number:</span>
          <strong style="font-family: 'JetBrains Mono', monospace; color: var(--neon-cyan);">${receiptNo}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Fee Category:</span>
          <strong style="color: var(--text-primary);">${term}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Date of Transaction:</span>
          <span>${date}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Payment Mode:</span>
          <span>${mode}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px dashed var(--border-subtle); margin-top: 10px;">
          <span style="font-weight: 700; color: var(--text-primary);">Total Paid Amount:</span>
          <strong style="font-family: 'JetBrains Mono', monospace; font-size: 1.25rem; color: var(--neon-emerald);">${amount}</strong>
        </div>
      </div>

      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn btn-secondary" onclick="document.getElementById('receipt-modal').classList.remove('active')">Close</button>
        <button class="btn btn-primary" onclick="window.print()">Print Official Receipt 🖨️</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
};

// Grade Transcript Modal
window.openTranscriptModal = function() {
  let modal = document.getElementById('transcript-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'transcript-modal';
    modal.className = 'cc-modal';
    document.body.appendChild(modal);
  }

  const erp = MOCK_DATA.erp;

  modal.innerHTML = `
    <div class="cc-modal-box" style="max-width: 620px; border-color: var(--neon-emerald);">
      <button class="modal-close-btn" onclick="document.getElementById('transcript-modal').classList.remove('active')">&times;</button>
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
        <div style="font-size: 2rem;">📜</div>
        <div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.35rem; color: var(--text-primary); margin: 0;">Consolidated Academic Grade Card</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Verified Controller of Examinations Transcript</span>
        </div>
      </div>

      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; display: flex; justify-content: space-between; font-size: 0.85rem;">
        <div>
          <div>Student: <strong style="color: var(--text-primary);">${erp.student_profile.student_name}</strong></div>
          <div>Roll: <strong style="font-family: 'JetBrains Mono', monospace; color: var(--neon-cyan);">${erp.student_profile.roll_number}</strong></div>
        </div>
        <div style="text-align: right;">
          <div>CGPA: <strong style="color: var(--neon-emerald); font-family: 'JetBrains Mono', monospace; font-size: 1.1rem;">${erp.student_profile.cgpa}</strong></div>
          <div>Credits: <strong style="color: var(--text-primary);">${erp.student_profile.credits_completed} / ${erp.student_profile.total_credits}</strong></div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.85rem;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); text-align: left;">
            <th style="padding: 8px 10px;">Semester</th>
            <th style="padding: 8px 10px;">Earned Credits</th>
            <th style="padding: 8px 10px;">SGPA Score</th>
            <th style="padding: 8px 10px;">Performance</th>
          </tr>
        </thead>
        <tbody>
          ${erp.transcripts.map(t => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 8px 10px; font-weight: 600; color: var(--text-primary);">${t.semester}</td>
              <td style="padding: 8px 10px; color: var(--text-secondary);">${t.credits}</td>
              <td style="padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--neon-emerald);">${t.sgpa}</td>
              <td style="padding: 8px 10px; color: var(--text-muted);">${t.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn btn-secondary" onclick="document.getElementById('transcript-modal').classList.remove('active')">Close</button>
        <button class="btn btn-primary" onclick="window.print()">Download Certified Transcript 📄</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
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
