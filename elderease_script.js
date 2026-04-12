// ===== PAGE NAVIGATION =====
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const nb = document.getElementById('nav-' + name);
  if (nb) nb.classList.add('active');
  window.scrollTo(0, 0);
}

// ===== SERVICE SELECTION =====
function selectService(el) {
  document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  const serviceName = el.querySelector('strong').textContent;
  updateCostSummary(serviceName);
}

// ===== COST SUMMARY UPDATE =====
const servicePrices = {
  'Hospital Visit':   { base: 300, duration: 150, platform: 30 },
  'Medicine Pickup':  { base: 150, duration: 50,  platform: 20 },
  'Grocery Shopping': { base: 200, duration: 80,  platform: 25 },
  'Daily Errand':     { base: 250, duration: 100, platform: 25 },
};

function updateCostSummary(serviceName) {
  const prices = servicePrices[serviceName];
  if (!prices) return;
  const total = prices.base + prices.duration + prices.platform;
  const rows = document.querySelectorAll('.cost-row');
  if (rows.length >= 4) {
    rows[0].querySelector('span:first-child').textContent = serviceName + ' — Base fee';
    rows[0].querySelector('span:last-child').textContent  = '₹' + prices.base;
    rows[1].querySelector('span:last-child').textContent  = '₹' + prices.duration;
    rows[2].querySelector('span:last-child').textContent  = '₹' + prices.platform;
    rows[3].querySelector('span:last-child').textContent  = '₹' + total;
  }
  const sdRows = document.querySelectorAll('.sd-row');
  if (sdRows.length >= 5) {
    sdRows[4].querySelector('span:last-child').textContent = '₹' + total;
  }
  const sdService = document.querySelector('.sd-row:nth-child(2) span:last-child');
  if (sdService) sdService.textContent = serviceName;
}

// ===== TIME SLOT SELECTION =====
function initTimeSlots() {
  document.querySelectorAll('.timeslot:not(.unavailable)').forEach(t => {
    t.addEventListener('click', function () {
      document.querySelectorAll('.timeslot').forEach(x => x.classList.remove('selected'));
      this.classList.add('selected');
      const sdTime = document.querySelector('.sd-row:nth-child(4) span:last-child');
      if (sdTime) {
        const dateInput = document.querySelector('input[type="date"]');
        const dateVal = dateInput ? formatDate(dateInput.value) : '';
        sdTime.textContent = dateVal + ', ' + this.textContent;
      }
    });
  });
}

function formatDate(val) {
  if (!val) return '';
  const d = new Date(val);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ===== BOOKING STEP PROGRESS =====
function updateBookingSteps(step) {
  const steps = document.querySelectorAll('.bstep');
  steps.forEach((s, i) => {
    s.classList.remove('done', 'current');
    if (i < step) s.classList.add('done');
    else if (i === step) s.classList.add('current');
  });
}

function initBookingStepTracking() {
  document.querySelectorAll('.service-option').forEach(o => {
    o.addEventListener('click', () => updateBookingSteps(1));
  });
  document.querySelectorAll('.timeslot:not(.unavailable)').forEach(t => {
    t.addEventListener('click', () => updateBookingSteps(2));
  });
}

// ===== DASHBOARD FILTER =====
function initDashboardFilter() {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      filterBookings(this.textContent.trim().toLowerCase());
    });
  });
}

function filterBookings(filter) {
  document.querySelectorAll('#bookings-tbody tr').forEach(row => {
    const statusEl = row.querySelector('.status-badge');
    if (!statusEl) return;
    const status = statusEl.textContent.trim().toLowerCase();
    if (filter === 'all') row.style.display = '';
    else if (filter === 'upcoming') row.style.display = (status === 'pending' || status === 'in progress') ? '' : 'none';
    else if (filter === 'completed') row.style.display = status === 'completed' ? '' : 'none';
  });
}

// ===== ADMIN NAV =====
function initAdminNav() {
  document.querySelectorAll('.admin-nav-item').forEach(b => {
    b.addEventListener('click', function () {
      document.querySelectorAll('.admin-nav-item').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// ===== SUCCESS POPUP =====
function showSuccess() {
  const name = document.querySelector('.booking-container input[type="text"]');
  const age  = document.querySelector('.booking-container input[type="number"]');
  if (name && name.value.trim() === '') { showToast("Please enter the elder's name.", 'error'); name.focus(); return; }
  if (age && (age.value === '' || age.value < 1)) { showToast('Please enter a valid age.', 'error'); age.focus(); return; }
  if (!document.querySelector('.timeslot.selected')) { showToast('Please select a time slot first.', 'error'); return; }
  const bookingId = '#EE-' + (Math.floor(Math.random() * 900) + 2900);
  document.querySelector('.sd-row:nth-child(1) span:last-child').textContent = bookingId;
  const assistants = ['Ravi Kumar', 'Sunita Mishra', 'Mohan Rao'];
  document.querySelector('.sd-row:nth-child(3) span:last-child').textContent = assistants[Math.floor(Math.random() * assistants.length)];
  updateBookingSteps(3);
  document.getElementById('success-overlay').style.display = 'flex';
}

function closeSuccess() {
  document.getElementById('success-overlay').style.display = 'none';
}

// ===== TOAST =====
function showToast(message, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const colors = { success: { bg: 'var(--sage)', icon: '✅' }, error: { bg: '#C0392B', icon: '❌' }, info: { bg: 'var(--teal)', icon: 'ℹ️' } };
  const c = colors[type] || colors.success;
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.style.cssText = `position:fixed;bottom:30px;right:30px;z-index:9999;background:${c.bg};color:#fff;padding:16px 24px;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.2);display:flex;align-items:center;gap:10px;animation:slideUp .3s ease;max-width:360px`;
  toast.innerHTML = `<span>${c.icon}</span><span>${message}</span>`;
  const style = document.createElement('style');
  style.textContent = `@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
}

// ===== AUTH HELPER =====
function applyLoginState(user) {
  const navBtn = document.getElementById('nav-login');
  if (navBtn) {
    navBtn.textContent = 'Sign Out';
    navBtn.onclick = function () { localStorage.removeItem('ee_loggedIn'); location.reload(); };
  }
  const greet = document.getElementById('dash-greeting');
  if (greet) greet.textContent = 'Good morning, ' + (user.name || user.phone) + ' 👋';
  const adminBtn = document.getElementById('nav-admin');
  if (adminBtn) adminBtn.style.display = user.isAdmin ? '' : 'none';
}

// ===== LOAD USER BOOKINGS FROM MONGODB =====
async function loadUserBookings(phone) {
  if (!phone) return;
  try {
    const res  = await fetch('/api/getbookings?phone=' + encodeURIComponent(phone));
    const data = await res.json();
    if (!data.success) return;
    const bookings = data.bookings;
    const tbody = document.getElementById('bookings-tbody');
    if (!tbody) return;

    if (bookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-light)">No bookings yet. <a href="#" onclick="showPage('booking')">Book your first service</a></td></tr>`;
    } else {
      tbody.innerHTML = bookings.map(b => `
        <tr>
          <td>#${b.bookingId}</td>
          <td>${b.service || '—'}</td>
          <td>—</td>
          <td>${b.date || '—'}${b.time ? ', ' + b.time : ''}</td>
          <td>₹${b.amount || 0}</td>
          <td><span class="status-badge s-pending">${b.status}</span></td>
          <td>—</td>
        </tr>`).join('');
    }

    // Update stats
    const upcoming  = bookings.filter(b => b.status === 'Pending' || b.status === 'In Progress').length;
    const completed = bookings.filter(b => b.status === 'Completed').length;
    const spent     = bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + (b.amount || 0), 0);
    const upEl = document.getElementById('stat-upcoming');  if (upEl) upEl.textContent = upcoming;
    const coEl = document.getElementById('stat-completed'); if (coEl) coEl.textContent = completed;
    const spEl = document.getElementById('stat-spent');     if (spEl) spEl.textContent = '₹' + spent.toLocaleString();
  } catch(e) { console.error('Failed to load bookings', e); }
}

// ===== LOGIN / REGISTER =====
function initAuthToggle() {
  const toggleBtn = document.querySelector('.auth-toggle button');
  const authTitle = document.querySelector('.auth-card h2');
  const authSub   = document.querySelector('.auth-card .auth-sub');
  const authBtn   = document.querySelector('.auth-btn');
  let isRegister  = false;

  if (!toggleBtn || !authBtn) return;

  toggleBtn.addEventListener('click', function () {
    isRegister = !isRegister;
    if (isRegister) {
      authTitle.textContent = 'Create Account';
      authSub.textContent   = "Register to manage your elder's care";
      authBtn.textContent   = 'Register';
      toggleBtn.textContent = 'Sign in instead';
      if (!document.getElementById('reg-name-group')) {
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';
        nameGroup.id = 'reg-name-group';
        nameGroup.innerHTML = '<label>Full Name</label><input type="text" placeholder="Your full name">';
        document.querySelector('.auth-form').prepend(nameGroup);
      }
    } else {
      authTitle.textContent = 'Welcome Back';
      authSub.textContent   = "Sign in to manage your elder's care";
      authBtn.textContent   = 'Sign In';
      toggleBtn.textContent = 'Register here';
      const nameGroup = document.getElementById('reg-name-group');
      if (nameGroup) nameGroup.remove();
    }
  });

  authBtn.addEventListener('click', async function () {
    const inputs = document.querySelectorAll('.auth-form input');
    if (isRegister) {
      const name     = inputs[0]?.value.trim();
      const phone    = inputs[1]?.value.trim();
      const password = inputs[2]?.value.trim();
      if (!name || !phone || !password) { showToast('Please fill in all fields.', 'error'); return; }
      try {
        const res  = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, password }) });
        const data = await res.json();
        if (data.success) {
          showToast('Account created! Please sign in. 🌿', 'success');
          toggleBtn.click();
        } else {
          showToast(data.error || 'Registration failed', 'error');
        }
      } catch(e) { showToast('Something went wrong.', 'error'); }
    } else {
      const phone    = inputs[0]?.value.trim();
      const password = inputs[1]?.value.trim();
      if (!phone || !password) { showToast('Please fill in all fields.', 'error'); return; }
      try {
        const res  = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, password }) });
        const data = await res.json();
        if (data.success) {
          const isAdmin = data.phone === 'ramdwarampudi19@gmail.com';
          const user = { name: data.name, phone: data.phone, isAdmin };
          localStorage.setItem('ee_loggedIn', JSON.stringify(user));
          applyLoginState(user);
          loadUserBookings(user.phone);
          showToast('Signed in successfully! 🌿', 'success');
          setTimeout(() => showPage('dashboard'), 1000);
        } else {
          showToast(data.error || 'Invalid credentials', 'error');
        }
      } catch(e) { showToast('Something went wrong.', 'error'); }
    }
  });
}

// ===== HOME SERVICE CARDS =====
function initHomeServiceCards() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function () {
      const serviceName = this.querySelector('h3').textContent.trim();
      showPage('booking');
      setTimeout(() => {
        document.querySelectorAll('.service-option').forEach(opt => {
          opt.classList.remove('selected');
          if (opt.querySelector('strong').textContent.trim() === serviceName) {
            opt.classList.add('selected');
            updateCostSummary(serviceName);
          }
        });
        updateBookingSteps(1);
      }, 100);
    });
  });
}

// ===== ADMIN ASSIGN =====
function initAdminAssign() {
  document.querySelectorAll('.admin-card .btn-sm').forEach(btn => {
    if (btn.textContent.trim() === 'Assign') {
      btn.addEventListener('click', function () {
        const row = this.closest('tr');
        const id  = row ? row.querySelector('td').textContent : '';
        this.textContent = '✓ Assigned';
        this.style.background = 'var(--teal)';
        this.disabled = true;
        showToast('Booking ' + id + ' assigned!', 'success');
      });
    }
  });
}

// ===== DATE INPUT =====
function initDateInput() {
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
    dateInput.addEventListener('change', function () {
      document.querySelectorAll('.timeslot').forEach(t => t.classList.remove('selected'));
    });
  }
}

// ===== HERO BUTTONS =====
function initHeroButtons() {
  const registerBtn = document.querySelector('.btn-secondary');
  if (registerBtn) {
    registerBtn.addEventListener('click', function () {
      showPage('login');
      setTimeout(() => {
        const toggleBtn = document.querySelector('.auth-toggle button');
        const authTitle = document.querySelector('.auth-card h2');
        if (authTitle && authTitle.textContent === 'Welcome Back' && toggleBtn) toggleBtn.click();
      }, 100);
    });
  }
}

function initFormSync() {}

// ===== BOOKING API =====
function initBookingApi() {
  const bookBtn = document.querySelector('.btn-book');
  if (!bookBtn) return;
  bookBtn.addEventListener('click', async function () {
    const elderName    = document.querySelector('input[placeholder="e.g. Ramaiah Garu"]')?.value.trim();
    const date         = document.querySelector('input[type="date"]')?.value;
    const service      = document.querySelector('.service-option.selected .so-text strong')?.textContent;
    const time         = document.querySelector('.timeslot.selected')?.textContent;
    const instructions = document.querySelector('textarea')?.value.trim();
    if (!elderName || !date) { showToast('Please fill elder name and date.', 'error'); return; }
    const saved = localStorage.getItem('ee_loggedIn');
    const userPhone = saved ? JSON.parse(saved).phone : 'guest';
    try {
      const res  = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ elderName, service, date, time, instructions, amount: 480, userPhone }) });
      const data = await res.json();
      if (data.success) {
        showSuccess();
        loadUserBookings(userPhone);
      } else {
        showToast(data.error || 'Booking failed', 'error');
      }
    } catch(e) { showToast('Something went wrong.', 'error'); }
  });
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', function () {
  initTimeSlots();
  initBookingStepTracking();
  initDashboardFilter();
  initAdminNav();
  initAuthToggle();
  initHomeServiceCards();
  initAdminAssign();
  initDateInput();
  initHeroButtons();
  initFormSync();
  initBookingApi();

  // Hide admin panel by default
  const adminBtn = document.getElementById('nav-admin');
  if (adminBtn) adminBtn.style.display = 'none';

  // Restore login state on page load
  const saved = localStorage.getItem('ee_loggedIn');
  if (saved) {
    try {
      const user = JSON.parse(saved);
      applyLoginState(user);
      loadUserBookings(user.phone);
    } catch(e) {}
  }
});
