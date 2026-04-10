function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const nb = document.getElementById('nav-' + name);
  if (nb) nb.classList.add('active');
  window.scrollTo(0, 0);
}

function selectService(el) {
  document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

document.querySelectorAll('.timeslot:not(.unavailable)').forEach(t => {
  t.addEventListener('click', function() {
    document.querySelectorAll('.timeslot').forEach(x => x.classList.remove('selected'));
    this.classList.add('selected');
  });
});

document.querySelectorAll('.filter-btn').forEach(b => {
  b.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
  });
});

document.querySelectorAll('.admin-nav-item').forEach(b => {
  b.addEventListener('click', function() {
    document.querySelectorAll('.admin-nav-item').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
  });
});

function showSuccess() {
  document.getElementById('success-overlay').style.display = 'flex';
}

function closeSuccess() {
  document.getElementById('success-overlay').style.display = 'none';
}
