const form = document.getElementById("accessForm");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const title = document.getElementById("formTitle");
let currentMode = "login";
function setMode(mode) {
  currentMode = mode;
  const signup = mode === "signup";
  const roleControls = document.querySelector(".role-buttons");
  if (signup) {
    selectedRole = 'personal';
    if (roleSelect) roleSelect.value = selectedRole;
    updateRole();
  }
  if (roleControls) roleControls.hidden = signup;
  roleSelect?.querySelectorAll('option').forEach(option => {
    if (option.value === 'admin') option.disabled = signup;
  });
  roleButtons.forEach(button => {
    const role = {admin:'agent',manager:'manager',personal:'customer'}[button.dataset.accessRole];
    button.textContent = `${signup ? 'Sign up' : 'Log in'} as ${role}`;
  });
  modeButtons.forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.mode === mode)),
  );
  document.getElementById("nameField").hidden = !signup;
  document.getElementById("formDescription").textContent = signup
    ? "Enter your details to get started with northBank."
    : "Enter your registered email and password to proceed.";
  title.textContent = signup ? "Create your account" : title.dataset.loginTitle;
  document.getElementById("submitAccess").textContent = signup
    ? "Create account "
    : "Continue ";
  document.getElementById("modePrompt").textContent = signup
    ? "Already have an account?"
    : "New to northBank?";
  document.getElementById("alternateMode").textContent = signup
    ? "Log in "
    : "Open a new account →";
  document.getElementById("formMessage").hidden = true;
}
modeButtons.forEach((button) =>
  button.addEventListener("click", () => setMode(button.dataset.mode)),
);
document
  .getElementById("alternateMode")
  .addEventListener("click", () =>
    setMode(currentMode === "login" ? "signup" : "login"),
  );
document.getElementById("forgotPassword").addEventListener("click", () => {
  const message = document.getElementById("formMessage");
  message.textContent =
    "This is a sample sign-in screen. Password recovery is unavailable in this preview.";
  message.hidden = false;
});
const roleSelect = document.getElementById("accountRole");
const roleButtons = [...document.querySelectorAll("[data-access-role]")];
let selectedRole = roleSelect?.value || "personal";
function updateRole() {
  if (!roleSelect && !roleButtons.length) return;
  form.elements.email.value =
    selectedRole === "manager" ? "manager@northbank.com" : selectedRole === "admin"
      ? "j.davis@northbank.com"
      : "alex.morgan@email.com";
  roleButtons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.accessRole === selectedRole),
    ),
  );
  const badge = document.querySelector(".access-badge");
  if (badge)
    badge.textContent =
      selectedRole === "manager" ? "MANAGER ACCESS" : selectedRole === "admin" ? "AGENT ACCESS" : "CUSTOMER ACCESS";
}
roleSelect?.addEventListener("change", () => {
  selectedRole = roleSelect.value;
  updateRole();
});
roleButtons.forEach((button) =>
  button.addEventListener("click", () => {
    if (currentMode === 'signup' && button.dataset.accessRole !== 'personal') return;
    selectedRole = button.dataset.accessRole;
    if (roleSelect) roleSelect.value = selectedRole;
    updateRole();
  }),
);
const requestedRole = new URLSearchParams(window.location.search).get('role');
if (['personal','admin','manager'].includes(requestedRole)) selectedRole = requestedRole;
updateRole();
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentMode === 'signup' && selectedRole !== 'personal') return;
  const route = roleSelect || roleButtons.length
    ? selectedRole === "manager" ? "../manager/manager.html" : selectedRole === "admin"
      ? "../admin/admin.html"
      : "../user/user.html"
    : form.getAttribute("action");
  try { sessionStorage.setItem('northbank-preview-role', selectedRole); } catch {}
  window.location.assign(selectedRole === 'manager' ? '../admin/admin.html' : route);
});
if (new URLSearchParams(window.location.search).get("mode") === "signup")
  setMode("signup");

document.getElementById("contactAssistance").addEventListener("click", () => {
  const message = document.getElementById("formMessage");
  message.textContent = "Contact assistance is unavailable in this preview.";
  message.hidden = false;
});

// Decorative floating paths from Hirael Login 03 (Mohammad Shehadeh, MIT).
const pathContainer = document.querySelector('.auth-paths');
if (pathContainer) {
  for (const position of [1, -1]) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 696 316');
    svg.setAttribute('fill', 'none');
    for (let i = 0; i < 36; i++) {
      const path = document.createElementNS(svg.namespaceURI, 'path');
      path.setAttribute('d', `M-${380-i*5*position} -${189+i*6}C-${380-i*5*position} -${189+i*6} -${312-i*5*position} ${216-i*6} ${152-i*5*position} ${343-i*6}C${616-i*5*position} ${470-i*6} ${684-i*5*position} ${875-i*6} ${684-i*5*position} ${875-i*6}`);
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', .5+i*.03);
      path.setAttribute('stroke-opacity', Math.min(.32, .06+i*.008));
      path.setAttribute('pathLength', '1');
      path.style.setProperty('--flow-time', `${20+(Math.sin(i+1)*10000%1+1)%1*10}s`);
      svg.append(path);
    }
    pathContainer.append(svg);
  }
}
