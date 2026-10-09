const form = document.getElementById("accessForm");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const title = document.getElementById("formTitle");
let currentMode = "login";
function setMode(mode) {
  currentMode = mode;
  const signup = mode === "signup";
  if (signup && roleButtons.length) {
    selectedRole = "personal";
    updateRole();
  }
  const roleControls = document.querySelector(".role-buttons");
  if (roleControls) roleControls.hidden = signup;
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
    setMode("login");
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
