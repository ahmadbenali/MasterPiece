(() => {
  const key = 'northbank-preview-transfer';
  let data;
  try { data = JSON.parse(sessionStorage.getItem(key)); } catch {}
  const form = document.getElementById('transferForm');
  if (form) {
    const review = document.getElementById('transferReviewPopup');
    let reviewedValues;
    let returnTimer;
    function returnToTransfer() {
      clearTimeout(returnTimer);
      review.close();
      form.reset();
      setLimit();
      reviewedValues = null;
      document.getElementById('transferReviewContent').hidden = false;
      document.getElementById('transferDone').hidden = true;
      review.classList.remove('is-done');
      review.setAttribute('aria-labelledby', 'transferReviewTitle');
      form.elements.recipient.focus({preventScroll:true});
    }
    document.getElementById('returnToTransfer').addEventListener('click', returnToTransfer);
    review.addEventListener('cancel', event => {
      if (review.classList.contains('is-done')) { event.preventDefault(); returnToTransfer(); }
    });
    ['closeTransferReview','editTransferDetails'].forEach(id => {
      document.getElementById(id).addEventListener('click', () => review.close());
    });
    document.getElementById('confirmTransferSend').addEventListener('click', () => {
      if (!reviewedValues) return;
      try {
        sessionStorage.removeItem(key);
        document.getElementById('transferReviewContent').hidden = true;
        document.getElementById('transferDone').hidden = false;
        review.classList.add('is-done');
        review.setAttribute('aria-labelledby', 'transferDoneTitle');
        document.querySelector('#transferDone h2').id = 'transferDoneTitle';
        const money = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(reviewedValues.amount));
        document.getElementById('transferDoneDetails').textContent = `${money} to ${reviewedValues.recipient}`;
        document.getElementById('returnToTransfer').focus();
        returnTimer = setTimeout(returnToTransfer, 3000);
      } catch { document.getElementById('transferReviewError').textContent = 'Unable to save this preview. Enable browser storage and try again.'; }
    });
    if (data) Object.entries(data).forEach(([name,value]) => {
      const input = form.elements.namedItem(name);
      if (input && typeof value === 'string') input.value = value;
    });
    const amount = form.elements.amount;
    const source = form.elements.source;
    const setLimit = () => { amount.max = source.value.startsWith('Savings') ? '4200' : '8250'; };
    source.addEventListener('change', setLimit);
    setLimit();
    form.addEventListener('submit', event => {
      event.preventDefault();
      const recipient = form.elements.recipient;
      const bank = form.elements.bank;
      const destination = form.elements.destination;
      recipient.setCustomValidity(recipient.value.trim() ? '' : 'Enter the recipient name.');
      bank.setCustomValidity(bank.value.trim() ? '' : 'Enter the bank name.');
      destination.setCustomValidity(/^[A-Za-z0-9 -]{6,34}$/.test(destination.value.trim()) ? '' : 'Enter a sample account number or IBAN using letters and numbers.');
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form));
      Object.keys(values).forEach(name => values[name] = values[name].trim());
      reviewedValues = values;
      const summary = document.getElementById('popupTransferSummary');
      summary.replaceChildren();
      const money = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(values.amount));
      [['Recipient',values.recipient],['Bank',values.bank],['Account / IBAN',values.destination],['From',values.source],['Amount',money],['Fee','$0.00'],['Total',money]].forEach(([label,value]) => {
        const row = document.createElement('div');
        const dt = document.createElement('dt'); dt.textContent = label;
        const dd = document.createElement('dd'); dd.textContent = value;
        row.append(dt,dd); summary.append(row);
      });
      document.getElementById('transferReviewError').textContent = '';
      review.showModal();
    });
    form.addEventListener('input', event => event.target.setCustomValidity?.(''));
    return;
  }
  const summary = document.getElementById('transferSummary');
  const tracking = document.getElementById('transferTracking');
  if (!summary && !tracking) return;
  if (!data || !data.recipient || !data.destination || !Number.isFinite(Number(data.amount)) || Number(data.amount) <= 0) {
    location.replace('transfer.html');
    return;
  }
  const money = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(data.amount));
  if (summary) {
    const entries = [['Recipient',data.recipient],['Recipient bank',data.bank],['Account / IBAN',data.destination],['From',data.source],['Amount',money],['Fee','$0.00'],['Total',money]];
    entries.forEach(([label,value]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd'); dd.textContent = value;
      row.append(dt,dd); summary.append(row);
    });
  }
  if (tracking) {
    document.getElementById('transferReceipt').textContent = `${money} to ${data.recipient} · ${data.bank}`;
    document.getElementById('trackingDescription').textContent = `${money} → ${data.recipient}`;
    document.getElementById('openTracking').addEventListener('click', () => tracking.showModal());
    ['closeTracking','doneTracking'].forEach(id => document.getElementById(id).addEventListener('click', () => tracking.close()));
    tracking.showModal();
  }
})();
