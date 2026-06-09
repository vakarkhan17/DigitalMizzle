import { supabase } from "./supabase-client.js";

const PENDING_EMAIL_KEY = "dmzPendingVerificationEmail";
const protectedPages = new Set([
  "course-detail.html",
  "ethical-hacking-detail.html",
  "course-learning.html",
  "blog-detail.html",
  "tool-detail.html",
  "dashboard.html"
]);
const adminPages = new Set([
  "admin.html",
  "admin-analytics.html",
  "course-editor.html",
  "blog-editor.html",
  "tools-management.html"
]);

const currentPathName = location.pathname.split("/").pop() || "index";
const currentPage = currentPathName.includes(".")
  ? currentPathName
  : `${currentPathName}.html`;
let currentUser = null;
let currentProfile = null;

initialize();

async function initialize() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  currentUser = session?.user || null;
  currentProfile = currentUser ? await loadProfile(currentUser) : null;

  if (protectedPages.has(currentPage) && !isVerifiedUser()) {
    redirectToGate();
    return;
  }

  if (adminPages.has(currentPage) && currentProfile?.role !== "admin") {
    location.replace("access-denied.html");
    return;
  }

  setupPage();
}

function setupPage() {
  document.body.classList.toggle(
    "protected-content",
    protectedPages.has(currentPage) || adminPages.has(currentPage)
  );

  document.querySelectorAll(".admin-only").forEach((element) => {
    element.hidden = currentProfile?.role !== "admin";
  });

  document.querySelectorAll(".auth-only").forEach((element) => {
    element.textContent = isVerifiedUser() ? "Dashboard" : "Login";
    element.setAttribute("href", isVerifiedUser() ? "dashboard.html" : "login.html");
  });

  document.addEventListener("click", protectLinks);
  setupPasswordVisibility();
  setupRegister();
  setupVerification();
  setupLogin();
  setupForgotPassword();
  setupUpdatePassword();
  setupDashboard();
  setupLogout();
}

function isVerifiedUser() {
  return Boolean(currentUser?.email_confirmed_at);
}

async function loadProfile(user) {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name,email,role,is_disabled")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return {
      full_name: user.user_metadata?.full_name || "DigitalMizzle Learner",
      email: user.email,
      role: "user",
      is_disabled: false
    };
  }

  data.full_name =
    data.full_name?.trim() ||
    user.user_metadata?.full_name?.trim() ||
    "DigitalMizzle Learner";
  data.email = data.email?.trim() || user.email || "";

  if (data.is_disabled) {
    await supabase.auth.signOut();
    return null;
  }

  return data;
}

function gateUrl(next) {
  return `access-gate.html?next=${encodeURIComponent(next)}`;
}

function redirectToGate() {
  location.replace(gateUrl(`${currentPage}${location.search}`));
}

function protectLinks(event) {
  const link = event.target.closest("a[href]");
  if (!link || isVerifiedUser()) return;

  const url = new URL(link.href, location.href);
  const targetPage = url.pathname.split("/").pop();

  if (protectedPages.has(targetPage)) {
    event.preventDefault();
    location.href = gateUrl(`${targetPage}${url.search}`);
  }
}

function setupPasswordVisibility() {
  document.querySelectorAll("[data-show-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      input.type = input.type === "password" ? "text" : "password";
      button.textContent = input.type === "password" ? "Show" : "Hide";
    });
  });
}

function passwordRules(value) {
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value)
  };
}

function setupRegister() {
  const form = document.querySelector("#previewRegister");
  if (!form) return;

  const password = document.querySelector("#newPassword");
  password.addEventListener("input", () => updatePasswordMeter(password.value));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const fullName = String(data.get("name")).trim();
    const email = String(data.get("email")).trim().toLowerCase();
    const passwordValue = String(data.get("password"));
    const message = document.querySelector("#authMessage");
    const submit = form.querySelector('button[type="submit"]');
    const rules = passwordRules(passwordValue);

    if (!Object.values(rules).every(Boolean)) {
      showMessage(message, "Complete every password requirement.", true);
      return;
    }

    if (passwordValue !== data.get("confirm")) {
      showMessage(message, "Passwords do not match.", true);
      return;
    }

    setBusy(submit, true, "Creating account...");
    showMessage(message, "Connecting securely to DigitalMizzle...");

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password: passwordValue,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/login.html?verified=1`
      }
    });

    setBusy(submit, false);

    if (error) {
      showMessage(message, humanizeAuthError(error.message), true);
      return;
    }

    if (signUpData.session) {
      location.href = "dashboard.html";
      return;
    }

    sessionStorage.setItem(PENDING_EMAIL_KEY, email);
    location.href = `verify-email.html?email=${encodeURIComponent(email)}`;
  });
}

function updatePasswordMeter(value) {
  const rules = passwordRules(value);
  const count = Object.values(rules).filter(Boolean).length;

  Object.entries(rules).forEach(([name, valid]) => {
    document.querySelector(`[data-password-rule="${name}"]`)?.classList.toggle("valid", valid);
  });

  const bar = document.querySelector("#passwordStrengthBar");
  const label = document.querySelector("#passwordStrengthLabel");
  if (!bar || !label) return;

  bar.style.width = `${count * 20}%`;
  bar.style.background = count <= 2 ? "#ff6174" : count <= 4 ? "#ffd166" : "#43ff9c";
  label.textContent = count <= 2 ? "Weak" : count <= 4 ? "Medium" : "Strong";
}

function setupVerification() {
  const emailElement = document.querySelector("#verificationEmail");
  const resendButton = document.querySelector("#resendVerification");
  if (!emailElement || !resendButton) return;

  const params = new URLSearchParams(location.search);
  const email = params.get("email") || sessionStorage.getItem(PENDING_EMAIL_KEY) || "";
  emailElement.textContent = email || "your email address";

  resendButton.disabled = !email;
  resendButton.addEventListener("click", async () => {
    const message = document.querySelector("#verificationMessage");
    setBusy(resendButton, true, "Sending...");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${location.origin}/login.html?verified=1`
      }
    });

    setBusy(resendButton, false);
    showMessage(
      message,
      error
        ? humanizeAuthError(error.message)
        : "A new confirmation email has been sent. Check your inbox and spam folder.",
      Boolean(error)
    );
  });
}

function setupLogin() {
  const form = document.querySelector("#previewLogin");
  if (!form) return;

  const message = document.querySelector("#authMessage");
  if (new URLSearchParams(location.search).has("verified")) {
    showMessage(message, "Email confirmed successfully. You can now log in.");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const submit = form.querySelector('button[type="submit"]');
    setBusy(submit, true, "Signing in...");

    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email: String(data.get("email")).trim().toLowerCase(),
      password: String(data.get("password"))
    });

    setBusy(submit, false);

    if (error) {
      showMessage(message, humanizeAuthError(error.message), true);
      return;
    }

    if (!loginData.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      showMessage(message, "Please confirm your email before logging in.", true);
      return;
    }

    const next = new URLSearchParams(location.search).get("next");
    const profile = await loadProfile(loginData.user);
    location.href = next || (profile?.role === "admin" ? "admin.html" : "dashboard.html");
  });
}

function setupForgotPassword() {
  const form = document.querySelector("#forgotPasswordForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const message = document.querySelector("#authMessage");
    const submit = form.querySelector('button[type="submit"]');

    setBusy(submit, true, "Sending...");
    const { error } = await supabase.auth.resetPasswordForEmail(
      String(data.get("email")).trim().toLowerCase(),
      { redirectTo: `${location.origin}/update-password.html` }
    );
    setBusy(submit, false);

    showMessage(
      message,
      error
        ? humanizeAuthError(error.message)
        : "Password reset instructions have been sent. Check your inbox and spam folder.",
      Boolean(error)
    );
  });
}

function setupUpdatePassword() {
  const form = document.querySelector("#updatePasswordForm");
  if (!form) return;

  const password = document.querySelector("#resetPassword");
  password.addEventListener("input", () => updatePasswordMeter(password.value));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const passwordValue = String(data.get("password"));
    const message = document.querySelector("#authMessage");
    const submit = form.querySelector('button[type="submit"]');

    if (!Object.values(passwordRules(passwordValue)).every(Boolean)) {
      showMessage(message, "Complete every password requirement.", true);
      return;
    }

    if (passwordValue !== data.get("confirm")) {
      showMessage(message, "Passwords do not match.", true);
      return;
    }

    setBusy(submit, true, "Updating...");
    const { error } = await supabase.auth.updateUser({ password: passwordValue });
    setBusy(submit, false);

    if (error) {
      showMessage(message, humanizeAuthError(error.message), true);
      return;
    }

    showMessage(message, "Password updated successfully. Redirecting to login...");
    await supabase.auth.signOut();
    setTimeout(() => {
      location.href = "login.html?passwordUpdated=1";
    }, 900);
  });
}

function setupDashboard() {
  if (currentPage !== "dashboard.html" || !currentUser) return;

  const progressKeys = Object.keys(localStorage).filter((key) => /Progress/i.test(key));
  const completed = progressKeys.reduce((total, key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return total + (Array.isArray(value) ? value.length : 0);
    } catch {
      return total;
    }
  }, 0);

  const metrics = {
    courses: progressKeys.filter((key) => /Kali|Ethical/i.test(key)).length,
    lessons: completed,
    blogs: Number(localStorage.getItem("dmzPreviewBlogsRead") || 0),
    tools: progressKeys.filter((key) => /ToolProgress/i.test(key)).length
  };
  const totalProgress = Math.min(100, Math.round((metrics.lessons / 20) * 100));

  setText("#dashboardName", currentProfile?.full_name || "DigitalMizzle Learner");
  setText("#dashboardEmail", currentUser.email);
  setText("#coursesStarted", metrics.courses);
  setText("#lessonsCompleted", metrics.lessons);
  setText("#blogsRead", metrics.blogs);
  setText("#toolsViewed", metrics.tools);
  setText("#overallProgress", `${totalProgress}%`);

  const bar = document.querySelector("#overallProgressBar");
  if (bar) bar.style.width = `${totalProgress}%`;
}

function setupLogout() {
  document.querySelectorAll("[data-preview-logout]").forEach((button) => {
    button.addEventListener("click", async () => {
      await supabase.auth.signOut();
      location.href = "index.html";
    });
  });
}

function setBusy(button, busy, busyLabel = "") {
  if (!button) return;
  if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent;
  button.disabled = busy;
  button.textContent = busy ? busyLabel : button.dataset.defaultLabel;
}

function showMessage(element, text, isError = false) {
  if (!element) return;
  element.textContent = text;
  element.classList.toggle("error", isError);
}

function humanizeAuthError(message) {
  const normalized = message.toLowerCase();
  if (normalized.includes("email not confirmed")) return "Confirm your email before logging in.";
  if (normalized.includes("invalid login credentials")) return "Incorrect email or password.";
  if (normalized.includes("user already registered")) return "An account already exists for this email.";
  if (normalized.includes("rate limit")) return "Too many email requests. Please wait and try again.";
  if (normalized.includes("failed to fetch")) return "Unable to reach the authentication service. Check your connection.";
  return message;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = String(value);
}
