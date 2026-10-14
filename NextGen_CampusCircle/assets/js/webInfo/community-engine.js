/**
 * CAMPUS CIRCLE - COMMUNITY & NOTICE FEED ENGINE
 * Real-time university bulletins, verified faculty announcements, and academic Q&A.
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadCampusPosts('ALL');
  initCommunityTabs();
});

let currentPosts = [];

async function loadCampusPosts(category = 'ALL') {
  const container = document.getElementById('posts-container');
  if (!container) return;

  currentPosts = await window.CampusDB.getCampusPosts(category);

  if (currentPosts.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
        <p style="font-size:1.2rem; margin-bottom:8px;">No campus notices in this channel yet.</p>
        <span style="font-size:0.9rem;">Be the first to share an announcement!</span>
      </div>
    `;
    return;
  }

  container.innerHTML = currentPosts.map(post => {
    return `
      <div class="exam-card" style="margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:rgba(56,189,248,0.12); color:var(--neon-cyan); display:flex; align-items:center; justify-content:center; font-weight:700;">
              ${post.author.charAt(0)}
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:0.88rem; font-weight:600; color:var(--text-primary);">${post.author}</span>
                ${post.is_official_faculty ? `
                  <span style="background:rgba(16,185,129,0.15); color:var(--neon-emerald); border:1px solid rgba(16,185,129,0.3); font-size:0.65rem; padding:2px 6px; border-radius:10px; font-weight:700;">
                    ✓ Faculty Verified
                  </span>
                ` : ''}
              </div>
              <span style="font-size:0.75rem; color:var(--text-muted);">${post.timestamp}</span>
            </div>
          </div>

          <span class="exam-badge" style="background:rgba(99,102,241,0.12); color:var(--neon-indigo); border:1px solid rgba(99,102,241,0.25);">
            ${post.category}
          </span>
        </div>

        <h3 style="font-family:'Outfit',sans-serif; font-size:1.22rem; font-weight:700; color:var(--text-primary); margin-bottom:8px;">${post.title}</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">
          ${post.content}
        </p>

        <div style="display:flex; align-items:center; justify-content:space-between; padding-top:12px; border-top:1px solid var(--border-subtle);">
          <button class="upvote-btn" onclick="upvotePost('${post.id}')">
            <span>👍 Helpful</span> <span id="post-upvotes-${post.id}">${post.upvotes}</span>
          </button>
          
          <button class="btn btn-secondary" style="font-size:0.78rem; padding:6px 12px;" onclick="sharePost('${post.title}')">
            🔗 Share
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function initCommunityTabs() {
  const tabs = document.querySelectorAll('.post-tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      loadCampusPosts(cat);
    });
  });
}

window.upvotePost = function(postId) {
  const count = window.CampusDB.upvoteCampusPost(postId);
  const el = document.getElementById(`post-upvotes-${postId}`);
  if (el) el.textContent = count;
  window.showToast('Marked as helpful!', '👍');
};

window.sharePost = function(title) {
  navigator.clipboard.writeText(window.location.href);
  window.showToast(`Link to "${title}" copied!`, '🔗');
};

window.openNewPostModal = function() {
  let modal = document.getElementById('new-post-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'new-post-modal';
    modal.className = 'cc-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="cc-modal-box">
      <button class="modal-close-btn" onclick="document.getElementById('new-post-modal').classList.remove('active')">&times;</button>
      <div style="font-size:2rem; margin-bottom:8px;">📢</div>
      <h3 style="font-family:'Outfit',sans-serif; font-size:1.3rem; margin-bottom:4px; color:var(--text-primary);">Create Campus Announcement</h3>
      <span style="font-size:0.85rem; color:var(--neon-cyan);">Post to University Community</span>

      <div style="margin:20px 0; display:flex; flex-direction:column; gap:14px;">
        <div>
          <label style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:600; margin-bottom:6px;">Channel / Category</label>
          <select id="new-post-cat" class="filter-select" style="width:100%;">
            <option value="Academic Discussion">Academic Discussion</option>
            <option value="Project Collab">Project Collab</option>
            <option value="Internship">Internship Alert</option>
            <option value="Official Notice">Official Notice</option>
            <option value="Lost & Found">Lost & Found</option>
          </select>
        </div>

        <div>
          <label style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:600; margin-bottom:6px;">Title</label>
          <input type="text" id="new-post-title" class="filter-input" style="width:100%;" placeholder="Headline for your bulletin">
        </div>

        <div>
          <label style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:600; margin-bottom:6px;">Announcement Content</label>
          <textarea id="new-post-content" class="filter-input" style="width:100%; height:110px; resize:none;" placeholder="Write details, contact info, guidelines, or questions..."></textarea>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px;">
        <button class="btn btn-secondary" style="padding:8px 16px; font-size:0.85rem;" onclick="document.getElementById('new-post-modal').classList.remove('active')">Cancel</button>
        <button class="btn btn-primary" style="padding:8px 20px; font-size:0.85rem;" onclick="publishPost()">Publish Announcement</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
};

window.publishPost = function() {
  const cat = document.getElementById('new-post-cat').value;
  const title = document.getElementById('new-post-title').value.trim();
  const content = document.getElementById('new-post-content').value.trim();

  if (!title || !content) {
    alert('Please enter both title and content for your announcement.');
    return;
  }

  window.CampusDB.createCampusPost(title, cat, content, 'Student Contributor');
  document.getElementById('new-post-modal').classList.remove('active');
  window.showToast('Announcement posted to Campus Circle!', '📢');
  loadCampusPosts('ALL');
};
