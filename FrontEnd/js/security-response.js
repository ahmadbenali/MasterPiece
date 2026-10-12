(() => {
  const buttons = document.querySelectorAll('[data-security-response]');
  if (!buttons.length) return;
  const popup = document.createElement('dialog');
  popup.className = 'preview-dialog security-response-dialog';
  popup.setAttribute('aria-labelledby','securityResponseTitle');
  popup.setAttribute('aria-describedby','securityResponseCopy');
  popup.innerHTML = '<h2 id="securityResponseTitle"></h2><p id="securityResponseCopy"></p><div class="security-result-art" hidden aria-hidden="true"></div><div class="button-row"><button type="button" class="btn-wise btn-dark" data-security-confirm>Confirm</button><button type="button" class="btn-wise btn-outline" data-security-cancel autofocus>Cancel</button></div><button type="button" class="btn-wise btn-dark" data-security-done hidden>Back to security</button>';
  document.body.append(popup);
  const title = popup.querySelector('h2');
  const copy = popup.querySelector('p');
  const art = popup.querySelector('.security-result-art');
  const actions = popup.querySelector('.button-row');
  const confirm = popup.querySelector('[data-security-confirm]');
  const done = popup.querySelector('[data-security-done]');
  let recognized = true;
  buttons.forEach(button => button.addEventListener('click', () => {
    recognized = button.dataset.securityResponse === 'yes';
    popup.classList.remove('security-response-done');
    art.hidden = done.hidden = true;
    art.replaceChildren();
    actions.hidden = false;
    title.textContent = recognized ? 'Was this transfer yours?' : 'Secure your account?';
    copy.textContent = recognized ? 'Confirm that you recognize transfer TX-9024 for $18,450.00 to Helvetia Offshore. This records a preview response only.' : 'Confirm that you do not recognize transfer TX-9024. This previews locking your account; no real account settings will change.';
    confirm.textContent = recognized ? 'Yes, confirm activity' : 'Confirm & secure account';
    popup.showModal();
  }));
  popup.querySelector('[data-security-cancel]').addEventListener('click', () => popup.close());
  done.addEventListener('click', () => popup.close());
  confirm.addEventListener('click', () => {
    actions.hidden = true;
    art.hidden = done.hidden = false;
    popup.classList.add('security-response-done');
    art.innerHTML = recognized
      ? '<svg viewBox="0 0 240 210"><circle cx="120" cy="105" r="92" fill="#c7f5a9"/><circle cx="120" cy="105" r="68" fill="#d9f2c5" stroke="#163300" stroke-width="16"/><path class="security-check" d="m85 105 25 25 48-55" fill="none" stroke="#163300" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>'
      : '<svg viewBox="0 0 240 210"><circle cx="120" cy="105" r="92" fill="#c7f5a9"/><path class="security-lock-shackle" d="M82 100V68a38 38 0 0 1 76 0v32" fill="none" stroke="#163300" stroke-width="14" stroke-linecap="round"/><rect x="64" y="93" width="112" height="86" rx="18" fill="#163300"/><circle cx="120" cy="126" r="10" fill="#9fe870"/><path d="M120 132v17" stroke="#9fe870" stroke-width="7" stroke-linecap="round"/></svg>';
    title.textContent = recognized ? 'Activity confirmed' : 'Account locked · preview';
    copy.textContent = recognized ? 'You recognized this sample transfer. No real transaction was approved.' : 'Your security response is complete in this preview. No real account was locked.';
    done.focus();
  });
})();
