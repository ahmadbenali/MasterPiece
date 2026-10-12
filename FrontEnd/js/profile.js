(() => {
  const form = document.getElementById('profileForm');
  const name = document.getElementById('displayName');
  const phone = document.getElementById('phoneNumber');
  const photo = document.getElementById('profilePhoto');
  const avatar = document.getElementById('profileAvatar');
  const message = document.getElementById('profileMessage');
  let photoData = '';
  let photoPending = false;
  const editDialog = document.getElementById('profileEditDialog');
  const passwordDialog = document.getElementById('passwordEditDialog');
  let snapshot;
  document.querySelectorAll('[data-edit-profile]').forEach(button => button.addEventListener('click', () => {
    snapshot = {name:name.value, phone:phone.value, photo:photoData};
    const type = button.dataset.editProfile;
    const fields = [...form.querySelectorAll('.field')];
    fields.forEach((field,index) => field.hidden = index !== ['nickname','phone','photo'].indexOf(type));
    document.getElementById('removePhoto').hidden = type !== 'photo';
    document.getElementById('profileEditTitle').textContent = {nickname:'Change display name',phone:'Change phone number',photo:'Change profile picture'}[type];
    message.textContent = '';
    editDialog.showModal();
  }));
  editDialog.addEventListener('close', () => {
    if (snapshot) { name.value = snapshot.name; phone.value = snapshot.phone; photoData = snapshot.photo; render(name.value); }
    form.querySelectorAll('input').forEach(input => input.setCustomValidity(''));
  });
  document.querySelectorAll('[data-profile-close]').forEach(button => button.addEventListener('click', () => editDialog.close()));
  document.getElementById('openPasswordEditor').addEventListener('click', () => {
    document.getElementById('passwordEditor').hidden = false;
    document.getElementById('passwordDone').hidden = true;
    passwordDialog.classList.remove('is-complete');
    passwordDialog.setAttribute('aria-labelledby','passwordEditTitle');
    passwordDialog.showModal();
  });
  document.querySelectorAll('[data-password-close]').forEach(button => button.addEventListener('click', () => passwordDialog.close()));
  passwordDialog.addEventListener('close', () => document.getElementById('passwordForm').reset());
  function render(displayName) {
    document.getElementById('profileDisplayName').textContent = displayName;
    document.getElementById('savedNickname').textContent = displayName;
    document.getElementById('savedPhone').textContent = phone.value.trim() || 'Not added';
    avatar.replaceChildren();
    if (photoData) {
      const image = document.createElement('img');
      image.src = photoData;
      image.alt = 'Your profile picture';
      avatar.append(image);
    } else avatar.textContent = displayName.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();
  }
  try {
    const saved = JSON.parse(localStorage.getItem('northbank-preview-profile'));
    if (saved && typeof saved.nickname === 'string' && saved.nickname.trim()) {
      name.value = saved.nickname;
      phone.value = typeof saved.phone === 'string' ? saved.phone : '';
      photoData = /^data:image\/(png|jpeg|webp);base64,/.test(saved.photo || '') ? saved.photo : '';
    }
  } catch {}
  render(name.value);
  photo.addEventListener('change', async () => {
    const file = photo.files[0];
    photo.setCustomValidity('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      photo.setCustomValidity('Choose a JPG, PNG or WebP image smaller than 5 MB.');
      photo.reportValidity();
      return;
    }
    photoPending = true;
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 256;
      const side = Math.min(bitmap.width, bitmap.height);
      canvas.getContext('2d').drawImage(bitmap, (bitmap.width-side)/2, (bitmap.height-side)/2, side, side, 0, 0, 256, 256);
      bitmap.close();
      photoData = canvas.toDataURL('image/png');
      render(name.value.trim() || 'Alex Morgan');
      message.textContent = 'Photo ready. Save profile to keep your changes.';
    } catch {
      photo.setCustomValidity('This image could not be opened. Choose another image.');
      photo.reportValidity();
    } finally { photoPending = false; }
  });
  document.getElementById('removePhoto').addEventListener('click', () => {
    if (photoPending) return;
    photoData = '';
    photo.value = '';
    photo.setCustomValidity('');
    render(name.value.trim() || 'Alex Morgan');
    message.textContent = 'Photo removed. Save profile to keep your changes.';
  });
  name.addEventListener('input', () => name.setCustomValidity(''));
  phone.addEventListener('input', () => phone.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (photoPending) { message.textContent = 'Please wait for your photo to finish processing.'; return; }
    name.setCustomValidity(name.value.trim() ? '' : 'Enter a display name.');
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(!phone.value.trim() || (/^\+?[\d\s().-]+$/.test(phone.value.trim()) && digits.length >= 7 && digits.length <= 15) ? '' : 'Enter a valid phone number with 7–15 digits.');
    if (!form.reportValidity()) return;
    try {
      localStorage.setItem('northbank-preview-profile', JSON.stringify({nickname:name.value.trim(), phone:phone.value.trim(), photo:photoData}));
      render(name.value.trim());
      message.textContent = 'Profile saved on this browser.';
      snapshot = null;
      editDialog.close();
    } catch { message.textContent = 'Unable to save changes. Browser storage may be unavailable or full.'; }
  });
  const passwordForm = document.getElementById('passwordForm');
  const current = document.getElementById('currentPassword');
  const next = document.getElementById('newPassword');
  const confirm = document.getElementById('confirmPassword');
  passwordForm.addEventListener('input', () => { next.setCustomValidity(''); confirm.setCustomValidity(''); document.getElementById('passwordMessage').textContent = ''; });
  passwordForm.addEventListener('submit', event => {
    event.preventDefault();
    next.setCustomValidity(next.value === current.value ? 'Choose a different password.' : '');
    confirm.setCustomValidity(confirm.value === next.value ? '' : 'Passwords do not match.');
    if (!passwordForm.reportValidity()) return;
    passwordForm.reset();
    document.getElementById('passwordEditor').hidden = true;
    document.getElementById('passwordDone').hidden = false;
    passwordDialog.classList.add('is-complete');
    passwordDialog.setAttribute('aria-labelledby','passwordDoneTitle');
    document.querySelector('#passwordDone button').focus();
  });
})();
