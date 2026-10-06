// Static presentation controls only. No authentication, APIs or data storage.
const navigation = document.getElementById('workspaceLinks');
const toggle = document.getElementById('navToggle');
const moreMenus = [...document.querySelectorAll('.nav-more')];
function closeNavigation() {
  navigation?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  moreMenus.forEach(menu => { menu.open = false; });
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
