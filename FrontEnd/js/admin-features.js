(() => {
  const operations = document.createElement('dialog');
  operations.className = 'preview-dialog';
  operations.setAttribute('aria-labelledby','accountOperationTitle');
  operations.innerHTML = '<h2 id="accountOperationTitle"></h2><p id="accountOperationCopy"></p><div class="button-row"><button type="button" class="btn-wise btn-dark" id="accountOperationConfirm">Confirm</button><button type="button" class="btn-wise btn-outline" id="accountOperationCancel" autofocus>Cancel</button></div>';
  let target;
  if (document.querySelector('[data-account-toggle]')) document.body.append(operations);
  document.querySelectorAll('[data-account-toggle]').forEach(button => button.addEventListener('click', () => {
    target = button;
    const label = button.closest('tr').cells[0].textContent;
    const active = button.closest('tr').querySelector('[data-account-status]').textContent === 'Active';
    operations.querySelector('h2').textContent = active ? 'Suspend access?' : 'Reactivate access?';
    operations.querySelector('p').textContent = `${label}: ${active ? 'suspend' : 'reactivate'} this preview record? No live account or linked record will change.`;
    operations.querySelector('#accountOperationConfirm').hidden = false;
    operations.showModal();
  }));
  operations.querySelector('#accountOperationCancel').addEventListener('click', () => operations.close());
  operations.querySelector('#accountOperationConfirm').addEventListener('click', () => {
    if (!target) return;
    const status = target.closest('tr').querySelector('[data-account-status]');
    const active = status.textContent === 'Active';
    status.textContent = active ? 'Suspended' : 'Active';
    target.textContent = active ? 'Reactivate' : 'Suspend';
    operations.close();
    document.getElementById('managementStatus').textContent = 'Preview status updated. No live account changed.';
  });
  const activity = {
    'Checking •••• 1234':['12 Oct · Organic Market · −$45.00','11 Oct · Direct deposit · +$1,200.00'],
    'Savings •••• 5678':['10 Oct · Savings deposit · +$200.00','1 Oct · Interest credit · +$12.00'],
    'Checking •••• 9012':['9 Oct · Card payment · −$75.00','8 Oct · Transfer received · +$500.00']
  };
  document.querySelectorAll('[data-account-activity]').forEach(button => button.addEventListener('click', () => {
    target = null;
    operations.querySelector('h2').textContent = `${button.dataset.accountActivity} · Sample activity`;
    operations.querySelector('p').textContent = activity[button.dataset.accountActivity].join(' · ');
    operations.querySelector('#accountOperationConfirm').hidden = true;
    operations.showModal();
  }));
  document.getElementById('confirmationFilter')?.addEventListener('change', event => {
    const rows = [...document.querySelectorAll('[data-response]')];
    rows.forEach(row => row.hidden = event.target.value !== 'all' && row.dataset.response !== event.target.value);
    document.getElementById('confirmationEmpty').hidden = rows.some(row => !row.hidden);
  });
  const form = document.getElementById('fraudRulesForm');
  if (!form) return;
  let current = {risk:'0.85',amount:'10000',velocity:'5'};
  let next;
  const dialog = document.getElementById('ruleReviewDialog');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.elements.reason.value.trim()) { form.elements.reason.setCustomValidity('Explain the reason for this change.'); form.reportValidity(); return; }
    next = Object.fromEntries(new FormData(form));
    const copy = document.getElementById('ruleReviewCopy');
    copy.replaceChildren();
    for (const [key,label] of Object.entries({risk:'Risk score',amount:'Amount (USD)',velocity:'Transfers / 10 minutes'})) {
      const p = document.createElement('p');
      p.textContent = `${label}: ${current[key]} → ${next[key]}`;
      copy.append(p);
    }
    dialog.showModal();
  });
  form.elements.reason.addEventListener('input', () => form.elements.reason.setCustomValidity(''));
  document.getElementById('cancelRuleChanges').addEventListener('click', () => dialog.close());
  document.getElementById('confirmRuleChanges').addEventListener('click', () => {
    if (!next) return;
    const history = document.getElementById('ruleChangeHistory');
    if (history.querySelector('[colspan]')) history.replaceChildren();
    const time = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Amman',dateStyle:'short',timeStyle:'short'}).format(new Date());
    for (const [key,label] of Object.entries({risk:'Risk score',amount:'Amount (USD)',velocity:'Transfers / 10 minutes'})) {
      if (Number(current[key]) === Number(next[key])) continue;
      const row = document.createElement('tr');
      [time+' · Amman',label,`${current[key]} → ${next[key]}`,next.reason,'Jordan Davis · Preview'].forEach(value => {
        const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
      });
      history.prepend(row);
    }
    current = {...next};
    dialog.close();
    form.elements.reason.value = '';
  });
})();
