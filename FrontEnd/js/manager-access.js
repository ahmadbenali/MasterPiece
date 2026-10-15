// Preview navigation guard. Production permissions must be enforced by a server.
(() => {
  let manager = false;
  try { manager = sessionStorage.getItem('northbank-preview-role') === 'manager'; } catch {}
  if (!manager) location.replace('../admin/admin.html');
})();
