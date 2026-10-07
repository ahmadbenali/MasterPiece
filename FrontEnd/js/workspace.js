// Static presentation controls only. No authentication, APIs or data storage.
const navigation = document.getElementById('workspaceLinks');
const toggle = document.getElementById('navToggle');
const logoutLinks = document.querySelectorAll('[data-logout]');
if (logoutLinks.length) {
  const logoutDialog = document.createElement('dialog');
  logoutDialog.className = 'preview-dialog logout-dialog';
  logoutDialog.setAttribute('aria-labelledby', 'logoutTitle');
  logoutDialog.setAttribute('aria-describedby', 'logoutDescription');
  logoutDialog.innerHTML = '<h2 id="logoutTitle">Log out of your account?</h2><p id="logoutDescription">Are you sure you want to log out? You can log in again as a user or admin.</p><div class="logout-dialog-actions"><button type="button" class="btn-wise btn-outline" data-logout-cancel autofocus>Stay logged in</button><button type="button" class="btn-wise btn-dark" data-logout-confirm>Log out</button></div>';
  document.body.append(logoutDialog);
  let logoutDestination;
  logoutLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    logoutDestination = link.href;
    logoutDialog.showModal();
  }));
  logoutDialog.querySelector('[data-logout-cancel]').addEventListener('click', () => logoutDialog.close());
  logoutDialog.querySelector('[data-logout-confirm]').addEventListener('click', () => window.location.assign(logoutDestination));
}
function closeNavigation() {
  navigation?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
}
// Keep connected tabs visible only alongside the green hero.
const workspaceHeader = document.querySelector('.workspace-header');
const workspaceHero = document.querySelector('.workspace-main > .page-hero');
if (workspaceHeader && workspaceHero) {
  let headerFramePending = false;
  function updateHeaderVisibility() {
    headerFramePending = false;
    const hidden = workspaceHero.getBoundingClientRect().bottom <= workspaceHeader.offsetHeight;
    if (workspaceHeader.classList.contains('is-past-hero') === hidden) return;
    workspaceHeader.classList.toggle('is-past-hero', hidden);
    workspaceHeader.inert = hidden;
    if (hidden) closeNavigation();
  }
  function scheduleHeaderVisibility() {
    if (headerFramePending) return;
    headerFramePending = true;
    requestAnimationFrame(updateHeaderVisibility);
  }
  window.addEventListener('scroll', scheduleHeaderVisibility, { passive: true });
  window.addEventListener('resize', scheduleHeaderVisibility);
  window.addEventListener('pageshow', scheduleHeaderVisibility);
  const headerSizeObserver = new ResizeObserver(scheduleHeaderVisibility);
  headerSizeObserver.observe(workspaceHeader);
  headerSizeObserver.observe(workspaceHero);
  updateHeaderVisibility();
}

toggle?.addEventListener('click', () => {
  const expanded = navigation.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
});
document.addEventListener('click', event => {
  if (!event.target.closest('.workspace-links, #navToggle')) closeNavigation();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const expanded = toggle?.getAttribute('aria-expanded') === 'true';
    closeNavigation();
    if (expanded) toggle.focus();
  }
});
document.querySelectorAll('[data-route]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    window.location.href = form.dataset.route;
  });
});
const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
}
document.querySelectorAll('[data-toast]').forEach(button => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});
const dialog = document.getElementById('previewDialog');
document.querySelectorAll('[data-info]').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('dialogCopy').textContent = button.dataset.info;
    dialog.showModal();
  });
});
document.querySelectorAll('.close-dialog, [data-dialog-close]').forEach(button => {
  button.addEventListener('click', () => dialog.close());
});
document.querySelectorAll('[data-search]').forEach(input => {
  const table = input.closest('.card-wise').querySelector('table');
  const empty = document.createElement('p');
  empty.className = 'small-copy mt-3';
  empty.textContent = 'No sample transactions match your search.';
  empty.hidden = true;
  table.parentElement.after(empty);
  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();
    const rows = [...table.querySelectorAll('tbody tr')];
    rows.forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(value); });
    empty.hidden = rows.some(row => !row.hidden);
  });
});
document.querySelector('[data-card-freeze]')?.addEventListener('click', event => {
  const button = event.currentTarget;
  const frozen = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(frozen));
  button.textContent = frozen ? 'Unfreeze card' : 'Freeze card';
  const status = document.getElementById('cardStatus');
  status.textContent = frozen ? 'Frozen · Preview' : 'Active';
  status.classList.toggle('warn', frozen);
  showToast('Card appearance changed for this preview only.');
});
