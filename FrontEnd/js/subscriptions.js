(() => {
  const confirmation = document.getElementById('subscriptionDialog');
  let pendingSwitch = null;
  document.querySelectorAll('[data-subscription]').forEach(control => {
    control.addEventListener('click', () => {
      pendingSwitch = control;
      const enabled = control.getAttribute('aria-checked') === 'true';
      const action = enabled ? 'Turn off' : 'Turn on';
      document.getElementById('subscriptionTitle').textContent = `${action} ${control.dataset.subscription}?`;
      document.getElementById('subscriptionDescription').textContent = enabled
        ? `Confirm turning off recurring payments for ${control.dataset.subscription}.`
        : `Confirm turning on recurring payments for ${control.dataset.subscription}.`;
      document.getElementById('confirmSubscription').textContent = action;
      confirmation.returnValue = '';
      confirmation.showModal();
    });
  });
  confirmation.addEventListener('close', () => {
    if (!pendingSwitch) return;
    if (confirmation.returnValue === 'confirm') {
      const enabled = pendingSwitch.getAttribute('aria-checked') !== 'true';
      pendingSwitch.setAttribute('aria-checked', String(enabled));
      const status = pendingSwitch.closest('tr').querySelector('.status-badge');
      status.textContent = enabled ? 'Active' : 'Paused';
      status.classList.toggle('warn', !enabled);
      showToast(`${pendingSwitch.dataset.subscription} ${enabled ? 'turned on' : 'turned off'} in this preview.`);
    }
    pendingSwitch.focus({ preventScroll: true });
    pendingSwitch = null;
  });
})();
