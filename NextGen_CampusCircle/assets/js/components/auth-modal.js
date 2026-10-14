/**
 * CAMPUS CIRCLE - AUTHENTICATION REQUIRED MODAL
 * Intercepts unauthenticated clicks on university hubs and academic modules.
 * Offers 1-click Student Demo Login with instant redirect or manual sign in.
 */

(function () {
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

  window.showAuthRequiredModal = function (targetUrl, targetName = 'University Academic Hub') {
    // Remove existing if present
    const existing = document.getElementById('cc-auth-gate-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'cc-auth-gate-modal';
    modal.className = 'cc-modal active';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(3, 7, 18, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: modalFadeIn 0.22s ease-out;
    `;

    modal.innerHTML = `
      <div style="
        background: rgba(11, 17, 32, 0.95);
        border: 1px solid rgba(56, 189, 248, 0.35);
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.18);
        border-radius: 20px;
        max-width: 480px;
        width: 100%;
        padding: 32px 28px;
        position: relative;
        text-align: center;
        color: var(--text-primary, #F8FAFC);
      ">
        <button id="auth-gate-close-btn" style="
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary, #94A3B8);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        ">✕</button>

        <!-- Lock Crest with Animated Glow -->
        <div style="
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          border-radius: 18px;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.4);
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        ">
          🔒
        </div>

        <!-- Target Destination Badge -->
        <div style="
          display: inline-block;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 700;
          color: var(--neon-cyan, #00F2FE);
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
        ">
          ${targetName}
        </div>

        <h3 style="
          font-family: 'Outfit', sans-serif;
          font-size: 1.45rem;
          font-weight: 800;
          margin: 0 0 8px;
          color: #F8FAFC;
        ">
          Student Login Required
        </h3>

        <p style="
          font-size: 0.9rem;
          color: var(--text-secondary, #94A3B8);
          line-height: 1.6;
          margin: 0 0 24px;
        ">
          Access to verified exam schedules, question papers, internal assignments, and student forums is restricted to enrolled scholars and faculty.
        </p>

        <!-- 1-Click Student Demo Login Button (Recommended) -->
        <button id="auth-gate-demo-login" style="
          width: 100%;
          padding: 13px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%);
          border: none;
          color: #030712;
          font-size: 0.96rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.35);
          transition: transform 0.18s, box-shadow 0.18s;
          margin-bottom: 12px;
        ">
          <span>⚡</span>
          <span>1-Click Student Demo Login & Continue</span>
        </button>

        <!-- Sign In with Credentials Button -->
        <button id="auth-gate-signin-btn" style="
          width: 100%;
          padding: 11px 20px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #F8FAFC;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.18s, border-color 0.18s;
          margin-bottom: 14px;
        ">
          <span>🔐</span>
          <span>Sign In / Register with Credentials</span>
        </button>

        <button id="auth-gate-cancel-btn" style="
          background: none;
          border: none;
          color: var(--text-muted, #64748B);
          font-size: 0.82rem;
          cursor: pointer;
          text-decoration: underline;
        ">
          Cancel and stay on public directory
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Close logic
    const closeModal = () => modal.remove();
    document.getElementById('auth-gate-close-btn').addEventListener('click', closeModal);
    document.getElementById('auth-gate-cancel-btn').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // 1-Click Student Demo Login Handler
    document.getElementById('auth-gate-demo-login').addEventListener('click', () => {
      if (window.CampusAuth) {
        window.CampusAuth.signIn('abhi.kumar@galgotiasuniversity.edu', 'demo123');
      } else {
        localStorage.setItem('CC_USER_SESSION', JSON.stringify({
          id: 'user-demo-101',
          fullName: 'Abhi Kumar',
          email: 'abhi.kumar@galgotiasuniversity.edu',
          role: 'student',
          university: 'Galgotias University',
          branch: 'Computer Science & Engineering',
          semester: 6,
          avatar: 'A'
        }));
      }

      if (window.showToast) {
        window.showToast('✓ Verified Student Session Active! Entering hub...', '🚀');
      }

      closeModal();
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 350);
    });

    // Regular Sign In Redirect Handler
    document.getElementById('auth-gate-signin-btn').addEventListener('click', () => {
      sessionStorage.setItem('cc_redirect_after_login', targetUrl);
      closeModal();
      if (window.switchMainTab) {
        window.switchMainTab('auth');
      } else {
        window.location.href = `${PREFIX}index.html?tab=auth`;
      }
    });
  };
})();
