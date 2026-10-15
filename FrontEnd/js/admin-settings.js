(() => {
  const key = 'northbank-admin-profile';
  let profile = {name:'Jordan Davis',email:'jordan.davis@example.com',phone:''};
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    for (const field of ['name','email','phone']) if (typeof saved?.[field] === 'string') profile[field] = saved[field];
  } catch {}
  const dialog = document.getElementById('adminSettingsDialog');
  const form = document.getElementById('adminSettingsForm');
  const fields = document.getElementById('adminSettingsFields');
  const done = document.getElementById('adminSettingsDone');
  let editing;
  function render() {
    for (const field of ['name','email','phone']) document.getElementById(`adminSetting-${field}`).textContent = profile[field] || 'Not added';
    const label = document.querySelector('.admin-profile>div');
    if (label) label.firstChild.textContent = profile.name;
  }
  render();
  function input(name,label,type,value='',autocomplete='off') {
    const field = document.createElement('div'); field.className = 'field';
    const caption = document.createElement('label'); caption.htmlFor = `adminEdit-${name}`; caption.textContent = label;
    const control = document.createElement('input');
    control.id = caption.htmlFor; control.name = name; control.type = type; control.value = value; control.required = true; control.autocomplete = autocomplete;
    if (type === 'password' && name === 'newPassword') control.minLength = 12;
    if (type !== 'password') control.maxLength = name === 'phone' ? 25 : 120;
    field.append(caption,control); fields.append(field);
  }
  document.querySelectorAll('[data-admin-edit]').forEach(button => button.addEventListener('click', () => {
    editing = button.dataset.adminEdit;
    fields.replaceChildren();
    form.hidden = false; done.hidden = true;
    dialog.classList.remove('settings-complete');
    document.getElementById('adminSettingsError').textContent = '';
    document.getElementById('adminSettingsTitle').textContent = `Change ${editing}`;
    if (editing === 'password') {
      input('currentPassword','Current password','password','','current-password');
      input('newPassword','New password (at least 12 characters)','password','','new-password');
      input('confirmPassword','Confirm new password','password','','new-password');
    } else input(editing,{name:'Full name',email:'Email address',phone:'Phone number'}[editing],{name:'text',email:'email',phone:'tel'}[editing],profile[editing]);
    document.getElementById('adminSettingsHint').textContent = editing === 'password' ? 'Preview validation only. Your actual sign-in password cannot be changed without an account service.' : 'Saved locally for this preview. Email changes do not update your sign-in credentials.';
    dialog.showModal();
  }));
  ['cancelAdminSettings','doneAdminSettings'].forEach(id => document.getElementById(id).addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => form.reset());
  form.addEventListener('input', event => event.target.setCustomValidity?.(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (editing === 'password') {
      const {currentPassword,newPassword,confirmPassword} = form.elements;
      newPassword.setCustomValidity(currentPassword.value === newPassword.value ? 'Choose a different password.' : '');
      confirmPassword.setCustomValidity(newPassword.value !== confirmPassword.value ? 'Passwords do not match.' : '');
    } else {
      const field = form.elements.namedItem(editing);
      field.setCustomValidity(!field.value.trim() ? 'Enter a value.' : '');
      if (editing === 'phone' && !/^\+?[\d () .-]{7,25}$/.test(field.value.trim())) field.setCustomValidity('Enter a valid phone number.');
    }
    if (!form.reportValidity()) return;
    if (editing !== 'password') {
      const updated = {...profile,[editing]:form.elements.namedItem(editing).value.trim()};
      try { localStorage.setItem(key,JSON.stringify(updated)); profile = updated; render(); }
      catch { document.getElementById('adminSettingsError').textContent = 'Unable to save. Browser storage may be unavailable.'; return; }
    }
    form.reset(); form.hidden = true; done.hidden = false;
    dialog.classList.add('settings-complete');
    document.getElementById('adminSettingsTitle').textContent = editing === 'password' ? 'Password check complete' : 'Details updated';
    document.getElementById('adminSettingsResult').textContent = editing === 'password' ? 'Your password meets the form requirements. Your actual password has not changed in this preview.' : 'Your profile changes are saved in this browser.';
    document.getElementById('doneAdminSettings').focus();
  });
})();
