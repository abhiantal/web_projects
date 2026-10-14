/**
 * CAMPUS CIRCLE - AUTHENTICATION ENGINE
 * Manages Sign In / Sign Up, Role Selection, Session Persistence,
 * and Dynamic Portal View Rendering.
 */

window.CampusAuth = {
  getCurrentUser() {
    try {
      const session = localStorage.getItem('CC_USER_SESSION');
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  signIn(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    // Check stored users or generate authenticated session
    let users = JSON.parse(localStorage.getItem('CC_REGISTERED_USERS') || '[]');
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Default fallback mock user for smooth testing
      user = {
        id: 'user-' + Date.now(),
        fullName: email.split('@')[0],
        email: email,
        role: email.includes('faculty') || email.includes('prof') ? 'teacher' : 'student',
        university: 'Apex Institute of Technology',
        branch: 'Computer Science & Engineering',
        semester: 6,
        avatar: email.charAt(0).toUpperCase()
      };
    }

    localStorage.setItem('CC_USER_SESSION', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('campus-auth-change', { detail: { user } }));
    return { success: true, user };
  },

  signUp(fullName, email, password, role = 'student', university = 'Apex Institute of Technology') {
    if (!fullName || !email || !password) {
      return { success: false, message: 'Please fill out all required fields.' };
    }

    let users = JSON.parse(localStorage.getItem('CC_REGISTERED_USERS') || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists. Please Sign In.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      fullName: fullName.trim(),
      email: email.trim(),
      role: role,
      university: university,
      branch: 'Computer Science & Engineering',
      semester: 6,
      avatar: fullName.trim().charAt(0).toUpperCase()
    };

    users.push(newUser);
    localStorage.setItem('CC_REGISTERED_USERS', JSON.stringify(users));
    localStorage.setItem('CC_USER_SESSION', JSON.stringify(newUser));

    window.dispatchEvent(new CustomEvent('campus-auth-change', { detail: { user: newUser } }));
    return { success: true, user: newUser };
  },

  signOut() {
    localStorage.removeItem('CC_USER_SESSION');
    window.dispatchEvent(new CustomEvent('campus-auth-change', { detail: { user: null } }));
    window.showToast('You have been logged out.', '👋');
    // If on main page, reset to public tab 1
    if (window.switchMainTab) {
      window.switchMainTab('home');
    }
    updateAuthUI();
  }
};

// Global UI Updater based on authentication state
function updateAuthUI() {
  const user = CampusAuth.getCurrentUser();
  const authSlot = document.getElementById('navbar-auth-slot');
  const userGreeting = document.getElementById('user-greeting');
  const userRoleBadge = document.getElementById('user-role-badge');
  const postAuthBanner = document.getElementById('post-auth-banner');
  const publicNavTabs = document.getElementById('public-nav-tabs');
  const authNavTabs = document.getElementById('auth-nav-tabs');

  if (user) {
    // User is Logged In
    if (authSlot) {
      const isSub = window.location.pathname.includes('/pages/');
      const isProf = window.location.pathname.includes('/profile/');
      const profilePath = isProf ? 'profile.html' : (isSub ? '../profile/profile.html' : 'pages/profile/profile.html');

      authSlot.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <a href="${profilePath}" style="display:flex; align-items:center; gap:8px; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); padding:4px 10px; border-radius:20px; text-decoration:none; transition: border-color 0.2s;" title="View & Edit Profile">
            <div style="width:28px; height:28px; border-radius:50%; background:var(--neon-cyan); color:#05070e; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.8rem;">
              ${user.avatar || user.fullName.charAt(0)}
            </div>
            <div style="display:flex; flex-direction:column; line-height:1.2;">
              <span style="font-size:0.78rem; font-weight:700; color:var(--text-primary); max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${user.fullName}</span>
              <span style="font-size:0.65rem; color:var(--neon-emerald); font-weight:700; text-transform:uppercase;">
                ${user.role === 'teacher' ? '👨‍🏫 Faculty' : (user.role === 'admin' ? '🛡️ Admin' : '🎓 Student')}
              </span>
            </div>
          </a>
        </div>
      `;
    }

    if (userGreeting) userGreeting.textContent = user.fullName;
    if (userRoleBadge) {
      userRoleBadge.textContent = user.role === 'teacher' ? 'Verified Faculty' : (user.role === 'admin' ? 'Department Admin' : 'Enrolled Student');
    }
    if (postAuthBanner) postAuthBanner.style.display = 'block';

    // Show Authenticated Navigation
    if (publicNavTabs) publicNavTabs.style.display = 'none';
    if (authNavTabs) authNavTabs.style.display = 'flex';

  } else {
    // User is Logged Out / Public Visitor
    if (authSlot) {
      const isSub = window.location.pathname.includes('/pages/');
      const signInUrl = isSub ? '../../index.html?tab=auth' : 'index.html?tab=auth';
      authSlot.innerHTML = `
        <a href="${signInUrl}" class="btn btn-primary" style="padding: 7px 16px; font-size: 0.85rem; text-decoration: none;">
          Sign In
        </a>
      `;
    }

    if (postAuthBanner) postAuthBanner.style.display = 'none';
    if (publicNavTabs) publicNavTabs.style.display = 'flex';
    if (authNavTabs) authNavTabs.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  window.addEventListener('campus-auth-change', updateAuthUI);
});
