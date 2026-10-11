const form = document.getElementById("accessForm");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const title = document.getElementById("formTitle");
let currentMode = "login";
function setMode(mode) {
  currentMode = mode;
  const signup = mode === "signup";
  const roleControls = document.querySelector(".role-buttons");
  if (roleControls) roleControls.hidden = false;
  roleButtons.forEach(button => {
    const role = button.dataset.accessRole === 'admin' ? 'admin' : 'user';
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
    ? "Sign in "
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
    selectedRole === "admin"
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
      selectedRole === "admin" ? "STAFF ACCESS" : "CUSTOMER ACCESS";
}
roleSelect?.addEventListener("change", () => {
  selectedRole = roleSelect.value;
  updateRole();
});
roleButtons.forEach((button) =>
  button.addEventListener("click", () => {
    selectedRole = button.dataset.accessRole;
    if (roleSelect) roleSelect.value = selectedRole;
    updateRole();
  }),
);
updateRole();
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const route = roleSelect || roleButtons.length
    ? selectedRole === "admin"
      ? "../admin/admin.html"
      : "../user/user.html"
    : form.getAttribute("action");
  window.location.assign(route);
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
