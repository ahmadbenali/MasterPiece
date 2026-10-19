(() => {
  const labels = {approve:'Approve transaction',reject:'Reject transaction',hold:'Keep on hold'};
  const statuses = {approve:'Approved · Preview',reject:'Rejected · Preview',hold:'On hold · Preview'};
  const form = document.getElementById('transactionDecisionForm');
  if (!form) {
    const output = document.getElementById('savedDecision');
    if (!output) return;
    const tx = location.pathname.includes('2048') ? 'TX-2048' : 'TX-9024';
    try {
      const saved = JSON.parse(sessionStorage.getItem(`northbank-decision-${tx}`));
      if (!saved || !labels[saved.decision]) return;
      output.textContent = labels[saved.decision];
      document.getElementById('savedDecisionStatus').textContent = statuses[saved.decision];
      document.getElementById('savedDecisionReason').textContent = saved.reason;
      document.getElementById('savedDecisionLock').textContent = saved.lock ? 'Locked · Preview' : 'Unchanged';
    } catch {}
    return;
  }
  const dialog = document.getElementById('decisionConfirmDialog');
  let pending;
  form.elements.reason.addEventListener('input', () => form.elements.reason.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    form.elements.reason.setCustomValidity(form.elements.reason.value.trim() ? '' : 'Explain your decision.');
    if (!form.reportValidity()) return;
    pending = {decision:form.elements.decision.value,reason:form.elements.reason.value.trim(),lock:form.elements.lockAccount.checked};
    const summary = document.getElementById('decisionConfirmation'); summary.replaceChildren();
    [['Transaction',form.dataset.transaction],['Decision',labels[pending.decision]],['Reason',pending.reason],['Account access',pending.lock ? 'Lock access' : 'Leave unchanged']].forEach(([label,value]) => {
      const row = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd');
      dt.textContent = label; dd.textContent = value; row.append(dt,dd); summary.append(row);
    });
    dialog.showModal();
  });
  document.getElementById('cancelDecision').addEventListener('click', () => dialog.close());
  document.getElementById('confirmDecision').addEventListener('click', () => {
    if (!pending) return;
    try {
      sessionStorage.setItem(`northbank-decision-${form.dataset.transaction}`,JSON.stringify(pending));
      location.assign(form.dataset.destination);
    } catch {
      dialog.close(); document.getElementById('decisionError').textContent = 'Unable to save the preview decision. Browser storage may be unavailable.';
    }
  });
})();
