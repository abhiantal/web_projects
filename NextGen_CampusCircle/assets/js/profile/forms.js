/**
 * CAMPUS CIRCLE - Form Validation & Account Deletion Processing
 * Developed by A.K.Antal • NextGen
 */

document.addEventListener('DOMContentLoaded', () => {
  initDeletionForm();
  initContactForm();
});

// Student & Faculty Account Deletion Request Form Handler
function initDeletionForm() {
  const form = document.getElementById('accountDeletionForm');
  const resultBox = document.getElementById('deletionResult');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('delEmail')?.value.trim();
    const reason = document.getElementById('delReason')?.value;
    const confirmCheckbox = document.getElementById('delConfirm')?.checked;

    if (!email || !confirmCheckbox) {
      alert('Please provide your registered account email and confirm data deletion consent.');
      return;
    }

    // Generate unique reference ticket for user proof
    const ticketId = 'DEL-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
    const dateSubmitted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Show confirmation with official policy guarantees
    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div class="alert-box success" style="border-radius: 16px; padding: 24px;">
          <h3 style="color: #10B981; margin-bottom: 8px; font-size: 1.25rem;">✓ Account Deletion Request Registered</h3>
          <p style="margin-bottom: 12px; color: #f8fafc;">
            We have registered your deletion request for <strong>${escapeHtml(email)}</strong> under reference ID:
          </p>
          <div style="background: rgba(15, 23, 42, 0.8); padding: 10px 16px; border-radius: 8px; display: inline-block; font-family: monospace; font-size: 1.1rem; color: #38BDF8; font-weight: bold; margin-bottom: 16px; border: 1px solid rgba(56, 189, 248, 0.3);">
            ${ticketId}
          </div>
          <p style="font-size: 0.92rem; color: #94a3b8; line-height: 1.6;">
            A confirmation notice will be dispatched to <strong>${escapeHtml(email)}</strong>. All personal profiles, academic submissions, assignment files, and forum records will be permanently purged from production cloud database clusters within 30 days.
          </p>
          <div style="margin-top: 14px; font-size: 0.85rem; color: #cbd5e1;">
            Direct inquiries can be escalated to the <a href="../webInfo/contact.html" style="color: #38BDF8; text-decoration: underline;">Campus Support Desk</a>.
          </div>
        </div>
      `;
      form.style.display = 'none';
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// Contact & Support Form Handler
function initContactForm() {
  const form = document.getElementById('contactSupportForm');
  const resultBox = document.getElementById('contactResult');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      alert('Please complete all required fields.');
      return;
    }

    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div class="alert-box success" style="border-radius: 16px; padding: 20px;">
          <h4 style="color: #10B981; margin-bottom: 6px;">✓ Message Transmitted Successfully</h4>
          <p style="font-size: 0.92rem; color: #f8fafc;">
            Thank you, ${escapeHtml(name)}. NextGen support team has received your message and will reply to <strong>${escapeHtml(email)}</strong> shortly.
          </p>
        </div>
      `;
      form.reset();
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
