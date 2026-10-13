(() => {
  const dialog = document.getElementById('managementDeleteDialog');
  const status = document.getElementById('managementStatus');
  const undo = document.getElementById('undoManagementDelete');
  let pending;
  let deleted;
  function filter(section) {
    const query = section.querySelector('[data-management-search]').value.trim().toLowerCase();
    const rows = [...section.querySelectorAll('tbody tr')];
    rows.forEach(row => row.hidden = row.dataset.deleted === 'true' || !row.textContent.toLowerCase().includes(query));
    section.querySelector('[data-management-empty]').hidden = rows.some(row => !row.hidden);
  }
  document.querySelectorAll('[data-management-search]').forEach(input => input.addEventListener('input', () => filter(input.closest('[data-management-section]'))));
  document.querySelectorAll('[data-delete-kind]').forEach(button => button.addEventListener('click', () => {
    pending = button;
    document.getElementById('managementDeleteTitle').textContent = `Delete ${button.dataset.deleteKind}?`;
    document.getElementById('managementDeleteCopy').textContent = `Remove ${button.dataset.deleteLabel} from this preview list? Linked users and accounts will remain unchanged. You can undo this preview deletion.`;
    dialog.showModal();
  }));
  document.getElementById('cancelManagementDelete').addEventListener('click', () => dialog.close());
  document.getElementById('confirmManagementDelete').addEventListener('click', () => {
    if (!pending) return;
    deleted = pending.closest('tr');
    deleted.dataset.deleted = 'true';
    const label = pending.dataset.deleteLabel;
    dialog.close();
    filter(deleted.closest('[data-management-section]'));
    status.textContent = `${label} deleted from the preview list.`;
    undo.hidden = false;
    undo.focus();
    pending = null;
  });
  undo.addEventListener('click', () => {
    if (!deleted) return;
    delete deleted.dataset.deleted;
    filter(deleted.closest('[data-management-section]'));
    status.textContent = 'Last deletion undone.';
    deleted.querySelector('button').focus();
    deleted = null;
    undo.hidden = true;
  });
})();
