/**
 * CAMPUS CIRCLE - COLLAPSIBLE CYBER SIDEBAR CONTROLLER
 * Unifies all fragmented navigation across the entire ecosystem.
 * Features:
 * - Dynamic markup injection if not present
 * - Desktop & mobile slide-out with frosted cyber glass styling
 * - Protected navigation guard for academic cockpit modules
 * - Auth synchronization with CampusAuth
 */

(function () {
  // Determine root relative prefix based on current pathname
  function getPathPrefix() {
    const p = window.location.pathname.replace(/\\/g, '/');
    if (p.includes('/pages/university/') || p.includes('/pages/profile/') || p.includes('/pages/webInfo/')) {
      return '../../';
    }
    if (p.includes('/pages/')) {
      return '../';
    }
    return '';
  }

  const PREFIX = getPathPrefix();

  // Create Sidebar DOM Markup
  function createSidebarMarkup() {
    if (document.getElementById('cc-global-sidebar')) return;

    const user = window.CampusAuth ? window.CampusAuth.getCurrentUser() : null;
    const isAuth = !!user;

    const backdrop = document.createElement('div');
    backdrop.id = 'cc-sidebar-backdrop';
    backdrop.className = 'cc-sidebar-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    const sidebar = document.createElement('aside');
    sidebar.id = 'cc-global-sidebar';
    sidebar.className = 'cc-sidebar';
    sidebar.setAttribute('aria-label', 'Academic Hub Navigation Sidebar');

    sidebar.innerHTML = `
      <div class="cc-sidebar-header">
        <a href="${PREFIX}index.html" class="cc-sidebar-brand">
          <img src="${PREFIX}assets/images/website_logo.png" alt="Campus Circle Logo" class="cc-sidebar-logo">
          <div>
            <div class="cc-sidebar-title">Campus Circle</div>
            <div class="cc-sidebar-subtitle" style="display:flex; align-items:center; gap:4px;">
              <img src="${PREFIX}assets/images/company_logo.png" alt="NextGen" style="width:13px; height:13px; object-fit:contain;">
              <span>Powered by NextGen</span>
            </div>
          </div>
        </a>
        <button class="cc-sidebar-close" id="cc-sidebar-close-btn" aria-label="Close Sidebar" title="Close Sidebar (Esc)">
          ✕
        </button>
      </div>

      <div class="cc-sidebar-body">
        <!-- Section 1: Main Portals -->
        <div class="cc-sidebar-section">
          <div class="cc-sidebar-heading">
            <span>Core Portals</span>
            <span style="font-size:0.6rem; color:var(--neon-cyan);">PUBLIC</span>
          </div>
          <a href="${PREFIX}index.html" class="cc-sidebar-item" data-page="home">
            <span class="cc-sidebar-icon">🏠</span>
            <span class="cc-sidebar-text">Command Center (Home)</span>
          </a>
          <a href="${PREFIX}index.html?tab=universities" class="cc-sidebar-item" data-page="universities">
            <span class="cc-sidebar-icon">🏛️</span>
            <span class="cc-sidebar-text">Universities Directory</span>
            <span class="cc-sidebar-badge cc-badge-active">Top Campuses</span>
          </a>
        </div>

        <!-- Section 2: Academic Cockpit (Protected Modules) -->
        <div class="cc-sidebar-section">
          <div class="cc-sidebar-heading">
            <span>Academic Cockpit</span>
            <span style="font-size:0.6rem; color:${isAuth ? 'var(--neon-emerald)' : 'var(--neon-amber)'};">
              ${isAuth ? '● VERIFIED' : '🔒 PROTECTED'}
            </span>
          </div>

          <a href="${PREFIX}pages/university/program-detail.html?id=galgotias-university&tab=exams" class="cc-sidebar-item" data-require-auth="true" data-page="exams">
            <span class="cc-sidebar-icon">📅</span>
            <span class="cc-sidebar-text">Exam Schedules & Rooms</span>
            ${!isAuth ? '<span class="cc-sidebar-badge cc-badge-locked">Lock</span>' : '<span class="cc-sidebar-badge cc-badge-hot">ETE 2026</span>'}
          </a>

          <a href="${PREFIX}pages/university/program-detail.html?id=galgotias-university&tab=assignments" class="cc-sidebar-item" data-require-auth="true" data-page="assignments">
            <span class="cc-sidebar-icon">📝</span>
            <span class="cc-sidebar-text">Assignments Vault</span>
            ${!isAuth ? '<span class="cc-sidebar-badge cc-badge-locked">Lock</span>' : '<span class="cc-sidebar-badge cc-badge-active">3 Due</span>'}
          </a>

          <a href="${PREFIX}pages/university/program-detail.html?id=galgotias-university&tab=pyq" class="cc-sidebar-item" data-require-auth="true" data-page="pyq">
            <span class="cc-sidebar-icon">📚</span>
            <span class="cc-sidebar-text">PYQ Archive (Solved)</span>
            ${!isAuth ? '<span class="cc-sidebar-badge cc-badge-locked">Lock</span>' : '<span class="cc-sidebar-badge cc-badge-active">Sem 1-8</span>'}
          </a>

          <a href="${PREFIX}pages/university/program-detail.html?id=galgotias-university&tab=pyq" class="cc-sidebar-item" data-require-auth="true" data-page="codelab">
            <span class="cc-sidebar-icon">💻</span>
            <span class="cc-sidebar-text">Interactive Code Lab</span>
            <span class="cc-sidebar-badge cc-badge-active">exam_sem_6</span>
          </a>

          <a href="${PREFIX}pages/university/program-detail.html?id=galgotias-university&tab=projects" class="cc-sidebar-item" data-require-auth="true" data-page="projects">
            <span class="cc-sidebar-icon">🚀</span>
            <span class="cc-sidebar-text">Student Capstones</span>
            <span class="cc-sidebar-badge cc-badge-active">Collab</span>
          </a>

          <a href="${PREFIX}pages/university/project-approval.html" class="cc-sidebar-item" data-require-auth="true" data-page="approval">
            <span class="cc-sidebar-icon">📋</span>
            <span class="cc-sidebar-text">Project Approval Portal</span>
            <span class="cc-sidebar-badge cc-badge-hot">Official Doc</span>
          </a>
        </div>

        <!-- Section 3: Campus Life & Corporate Intel -->
        <div class="cc-sidebar-section">
          <div class="cc-sidebar-heading">
            <span>Campus Life</span>
            <span style="font-size:0.6rem; color:var(--neon-cyan);">LIVE</span>
          </div>

          <a href="${PREFIX}pages/webInfo/community.html" class="cc-sidebar-item" data-page="community">
            <span class="cc-sidebar-icon">📢</span>
            <span class="cc-sidebar-text">Notices & Verified Bulletins</span>
            <span class="cc-sidebar-badge cc-badge-hot">Live Feed</span>
          </a>

          <a href="${PREFIX}pages/university/university-detail.html?id=galgotias-university&tab=placements" class="cc-sidebar-item" data-page="placements">
            <span class="cc-sidebar-icon">💼</span>
            <span class="cc-sidebar-text">Placements & CTC Intel</span>
            <span class="cc-sidebar-badge cc-badge-active">₹1.50 Cr</span>
          </a>

          <a href="${PREFIX}pages/university/university-detail.html?id=galgotias-university&tab=services" class="cc-sidebar-item" data-page="services">
            <span class="cc-sidebar-icon">🏢</span>
            <span class="cc-sidebar-text">Campus Amenities & Labs</span>
          </a>
        </div>

        <!-- Section 4: System, App & Policies -->
        <div class="cc-sidebar-section">
          <div class="cc-sidebar-heading">
            <span>Application & Support</span>
          </div>

          <a href="${PREFIX}pages/webInfo/download.html" class="cc-sidebar-item" data-page="download">
            <span class="cc-sidebar-icon">📱</span>
            <span class="cc-sidebar-text">Download Android APK</span>
            <span class="cc-sidebar-badge cc-badge-active">v1.0.0</span>
          </a>

          <a href="${PREFIX}pages/webInfo/features.html" class="cc-sidebar-item" data-page="features">
            <span class="cc-sidebar-icon">⚡</span>
            <span class="cc-sidebar-text">Platform Architecture</span>
          </a>

          <a href="${PREFIX}pages/webInfo/contact.html" class="cc-sidebar-item" data-page="contact">
            <span class="cc-sidebar-icon">📬</span>
            <span class="cc-sidebar-text">Academic Support Desk</span>
          </a>

          <a href="${PREFIX}pages/profile/delete-account.html" class="cc-sidebar-item" data-page="delete-account">
            <span class="cc-sidebar-icon">🛡️</span>
            <span class="cc-sidebar-text">Data Deletion Portal</span>
          </a>
        </div>
      </div>

      <!-- Sidebar Footer Auth Section -->
      <div class="cc-sidebar-footer" id="cc-sidebar-auth-slot">
        <!-- Rendered dynamically -->
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(sidebar);

    bindSidebarEvents();
    updateSidebarAuth();
  }

  // Update Footer Auth State inside Sidebar
  function updateSidebarAuth() {
    const slot = document.getElementById('cc-sidebar-auth-slot');
    if (!slot) return;

    const user = window.CampusAuth ? window.CampusAuth.getCurrentUser() : null;

    if (user) {
      slot.innerHTML = `
        <div class="cc-sidebar-user-card">
          <div class="cc-sidebar-user-avatar">
            ${user.avatar || user.fullName.charAt(0).toUpperCase()}
          </div>
          <div class="cc-sidebar-user-info">
            <div class="cc-sidebar-user-name">${user.fullName}</div>
            <div class="cc-sidebar-user-meta">${user.university || 'Galgotias University'} • ${user.role || 'Student'}</div>
          </div>
          <button onclick="window.CampusAuth.signOut();" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem; padding:4px;" title="Sign Out">
            🚪
          </button>
        </div>
      `;
    } else {
      slot.innerHTML = `
        <button class="cc-sidebar-auth-btn" onclick="window.closeSidebar(); if(window.switchMainTab){ window.switchMainTab('auth'); } else { window.location.href='${PREFIX}index.html?tab=auth'; }">
          <span>🔐</span>
          <span>Sign In / Student Portal</span>
        </button>
      `;
    }
  }

  // Bind Open, Close, Backdrop, and Auth Guards
  function bindSidebarEvents() {
    const backdrop = document.getElementById('cc-sidebar-backdrop');
    const closeBtn = document.getElementById('cc-sidebar-close-btn');

    if (backdrop) {
      backdrop.addEventListener('click', closeSidebar);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
    }

    // Keyboard Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    });

    // Protected Navigation Interceptor inside Sidebar
    const sidebar = document.getElementById('cc-global-sidebar');
    if (sidebar) {
      sidebar.querySelectorAll('a[data-require-auth="true"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const user = window.CampusAuth ? window.CampusAuth.getCurrentUser() : null;
          if (!user) {
            e.preventDefault();
            closeSidebar();
            if (window.showAuthRequiredModal) {
              window.showAuthRequiredModal(link.getAttribute('href'), link.querySelector('.cc-sidebar-text')?.textContent || 'Academic Module');
            } else {
              window.location.href = `${PREFIX}index.html?tab=auth`;
            }
          }
        });
      });
    }

    // Connect any header triggers safely without double-triggering
    document.querySelectorAll('.sidebar-trigger-btn, [data-sidebar-toggle]').forEach(btn => {
      if (btn._sidebarBound) return;
      btn._sidebarBound = true;
      const onclickAttr = btn.getAttribute('onclick');
      if (onclickAttr && (onclickAttr.includes('toggleSidebar') || onclickAttr.includes('openSidebar'))) {
        return; // Inline onclick already handles this cleanly
      }
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
      });
    });
  }

  function openSidebar() {
    createSidebarMarkup();
    const sidebar = document.getElementById('cc-global-sidebar');
    const backdrop = document.getElementById('cc-sidebar-backdrop');
    if (sidebar && backdrop) {
      sidebar.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      updateSidebarAuth();
    }
  }

  function closeSidebar() {
    const sidebar = document.getElementById('cc-global-sidebar');
    const backdrop = document.getElementById('cc-sidebar-backdrop');
    if (sidebar && backdrop) {
      sidebar.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function toggleSidebar() {
    createSidebarMarkup();
    const sidebar = document.getElementById('cc-global-sidebar');
    if (sidebar && sidebar.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  // Global Exports
  window.openSidebar = openSidebar;
  window.closeSidebar = closeSidebar;
  window.toggleSidebar = toggleSidebar;

  // Listen to auth state changes to re-render sidebar footer
  window.addEventListener('campus-auth-change', () => {
    updateSidebarAuth();
  });

  // Auto initialize on DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSidebarMarkup);
  } else {
    createSidebarMarkup();
  }
})();
