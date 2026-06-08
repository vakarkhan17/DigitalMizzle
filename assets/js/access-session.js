(function () {
  const ADMIN_EMAIL = "vakar.khan@gmail.com";
  const SESSION_KEY = "dmzMergedPreviewSession";
  const pendingKey = "dmzMergedPreviewPending";
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
    "course-editor.html",
    "blog-editor.html",
    "tools-management.html"
  ]);

  const currentPage = location.pathname.split("/").pop() || "index.html";
  const session = readJson(sessionStorage.getItem(SESSION_KEY));

  function readJson(value) {
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  function saveSession(value) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
  }

  function gateUrl(next) {
    return `access-gate.html?next=${encodeURIComponent(next)}`;
  }

  function redirectToGate() {
    const next = `${currentPage}${location.search}`;
    location.replace(gateUrl(next));
  }

  if (protectedPages.has(currentPage) && !session?.verified) {
    redirectToGate();
    return;
  }

  if (adminPages.has(currentPage) && session?.role !== "admin") {
    location.replace("access-denied.html");
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.toggle("protected-content", protectedPages.has(currentPage) || adminPages.has(currentPage));

    document.querySelectorAll(".admin-only").forEach((element) => {
      element.hidden = session?.role !== "admin";
    });

    document.querySelectorAll(".auth-only").forEach((element) => {
      element.textContent = session?.verified ? "Dashboard" : "Login";
      element.setAttribute("href", session?.verified ? "dashboard.html" : "login.html");
    });

    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || session?.verified) return;
      const url = new URL(link.href, location.href);
      const targetPage = url.pathname.split("/").pop();
      if (protectedPages.has(targetPage)) {
        event.preventDefault();
        location.href = gateUrl(`${targetPage}${url.search}`);
      }
    });

    document.querySelectorAll("[data-show-password]").forEach((button) => {
      button.addEventListener("click", () => {
        const input = button.parentElement.querySelector("input");
        input.type = input.type === "password" ? "text" : "password";
        button.textContent = input.type === "password" ? "Show" : "Hide";
      });
    });

    setupRegister();
    setupVerify();
    setupLogin();
    setupDashboard();
    setupLogout();
  });

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
    password.addEventListener("input", () => {
      const rules = passwordRules(password.value);
      const count = Object.values(rules).filter(Boolean).length;
      Object.entries(rules).forEach(([name, valid]) => {
        document.querySelector(`[data-password-rule="${name}"]`)?.classList.toggle("valid", valid);
      });
      const bar = document.querySelector("#passwordStrengthBar");
      const label = document.querySelector("#passwordStrengthLabel");
      bar.style.width = `${count * 20}%`;
      bar.style.background = count <= 2 ? "#ff6174" : count <= 4 ? "#ffd166" : "#43ff9c";
      label.textContent = count <= 2 ? "Weak" : count <= 4 ? "Medium" : "Strong";
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const rules = passwordRules(String(data.get("password")));
      const message = document.querySelector("#authMessage");
      if (!Object.values(rules).every(Boolean)) {
        message.textContent = "Complete every password requirement.";
        return;
      }
      if (data.get("password") !== data.get("confirm")) {
        message.textContent = "Passwords do not match.";
        return;
      }
      const pending = {
        name: String(data.get("name")).trim(),
        email: String(data.get("email")).trim().toLowerCase(),
        verified: false,
        next: new URLSearchParams(location.search).get("next") || ""
      };
      sessionStorage.setItem(pendingKey, JSON.stringify(pending));
      location.href = "verify-email.html";
    });
  }

  function setupVerify() {
    const verifyButton = document.querySelector("#previewVerify");
    if (!verifyButton) return;
    const pending = readJson(sessionStorage.getItem(pendingKey)) || {
      name: "DigitalMizzle Learner",
      email: "learner@example.com"
    };
    document.querySelector("#verificationEmail").textContent = pending.email;
    verifyButton.addEventListener("click", () => {
      pending.verified = true;
      sessionStorage.setItem(pendingKey, JSON.stringify(pending));
      document.querySelector("#verificationMessage").textContent = "Email verified successfully. Welcome to DigitalMizzle.";
      const next = pending.next ? `&next=${encodeURIComponent(pending.next)}` : "";
      setTimeout(() => location.href = `login.html?verified=1${next}`, 650);
    });
  }

  function setupLogin() {
    const form = document.querySelector("#previewLogin");
    if (!form) return;
    if (new URLSearchParams(location.search).has("verified")) {
      document.querySelector("#authMessage").textContent = "Email verified successfully. You can now log in.";
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const email = String(data.get("email")).trim().toLowerCase();
      const pending = readJson(sessionStorage.getItem(pendingKey));
      if (email !== ADMIN_EMAIL && (!pending?.verified || pending.email !== email)) {
        document.querySelector("#authMessage").textContent = "Verify this account before logging in.";
        return;
      }
      const nextSession = {
        name: email === ADMIN_EMAIL ? "Vakar Khan" : pending.name,
        email,
        verified: true,
        role: email === ADMIN_EMAIL ? "admin" : "user"
      };
      saveSession(nextSession);
      const next = new URLSearchParams(location.search).get("next");
      location.href = next || (nextSession.role === "admin" ? "admin.html" : "dashboard.html");
    });
  }

  function setupDashboard() {
    if (currentPage !== "dashboard.html" || !session) return;
    const progressKeys = Object.keys(localStorage).filter((key) => /Progress/i.test(key));
    const completed = progressKeys.reduce((total, key) => {
      const value = readJson(localStorage.getItem(key));
      return total + (Array.isArray(value) ? value.length : 0);
    }, 0);
    const metrics = {
      courses: progressKeys.filter((key) => /Kali|Ethical/i.test(key)).length,
      lessons: completed,
      blogs: Number(localStorage.getItem("dmzPreviewBlogsRead") || 0),
      tools: progressKeys.filter((key) => /ToolProgress/i.test(key)).length
    };
    const totalProgress = Math.min(100, Math.round((metrics.lessons / 20) * 100));
    setText("#dashboardName", session.name);
    setText("#dashboardEmail", session.email);
    setText("#coursesStarted", metrics.courses);
    setText("#lessonsCompleted", metrics.lessons);
    setText("#blogsRead", metrics.blogs);
    setText("#toolsViewed", metrics.tools);
    setText("#overallProgress", `${totalProgress}%`);
    const bar = document.querySelector("#overallProgressBar");
    if (bar) bar.style.width = `${totalProgress}%`;
    document.querySelector(".admin-only")?.toggleAttribute("hidden", session.role !== "admin");
  }

  function setupLogout() {
    document.querySelectorAll("[data-preview-logout]").forEach((button) => {
      button.addEventListener("click", () => {
        sessionStorage.removeItem(SESSION_KEY);
        location.href = "index.html";
      });
    });
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = String(value);
  }
})();

