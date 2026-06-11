const data = window.DMZ_DATA;
const page = document.body.dataset.page;
const state = {
  users: JSON.parse(localStorage.getItem("dmzUsers") || "[]"),
  session: JSON.parse(localStorage.getItem("dmzSession") || "null"),
  progress: JSON.parse(localStorage.getItem("dmzProgress") || "{}")
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function cardCourse(course) {
  return `
    <article class="card" data-accent="${course.accent}">
      <h3>${course.title}</h3>
      <div class="meta">
        <span class="chip green">${course.category}</span>
        <span class="chip">${course.level}</span>
        <span class="chip">${course.duration}</span>
        <span class="chip ${course.price === "Free" ? "green" : "warn"}">${course.price}</span>
      </div>
      <p>${course.summary}</p>
      <p>${course.lessons} lessons across ${course.modules.length} modules.</p>
      <a class="btn" href="course-detail.html?course=${course.id}">View course</a>
    </article>`;
}

function cardBlog(post) {
  return `
    <article class="card" data-accent="POST">
      <a class="blog-card-media" href="${post.route || `blog-detail.html?post=${post.id}`}">
        <img src="${post.featuredImage || "assets/img/cyber-hero.png"}" alt="" loading="lazy">
      </a>
      <h3>${post.title}</h3>
      <div class="meta">
        <span class="chip green">${post.category}</span>
        <span class="chip">${post.date}</span>
        ${post.readTime ? `<span class="chip">${post.readTime}</span>` : ""}
      </div>
      <p>${post.excerpt}</p>
      <p>${post.tags.map((tag) => `#${tag}`).join(" ")}</p>
      <a class="btn" href="${post.route || `blog-detail.html?post=${post.id}`}">Read article</a>
    </article>`;
}

function cardTool(tool) {
  return `
    <article class="card" data-accent="TOOL">
      <h3>${tool.name}</h3>
      <div class="meta">
        <span class="chip green">${tool.category}</span>
        <span class="chip">${tool.platform}</span>
      </div>
      <p>${tool.description}</p>
      <a class="btn" href="tool-detail.html?tool=${tool.id}">View guide</a>
    </article>`;
}

function renderCards(id, items, renderer) {
  const target = $("#" + id);
  if (target) target.innerHTML = items.map(renderer).join("");
}

function filterList(type) {
  const container = $("[data-list]");
  const search = $("#search");
  const filter = $("#filter");
  if (!container || !search || !filter) return;
  const source = data[type];
  const render = type === "courses" ? cardCourse : type === "blogs" ? cardBlog : cardTool;
  const getCategory = (item) => item.category;
  function run() {
    const term = search.value.toLowerCase();
    const category = filter.value;
    container.innerHTML = source
      .filter((item) => (category === "All" || getCategory(item) === category))
      .filter((item) => JSON.stringify(item).toLowerCase().includes(term))
      .map(render)
      .join("");
  }
  search.addEventListener("input", run);
  filter.addEventListener("change", run);
  run();
}

function setupNav() {
  const nav = $(".nav");
  const menu = $(".menu-button");
  if (menu && nav) menu.addEventListener("click", () => nav.classList.toggle("open"));
  $$(`.nav-links a[href="${location.pathname.split("/").pop() || "index.html"}"]`).forEach((link) => link.classList.add("active"));
  $$(".auth-only").forEach((el) => {
    el.textContent = state.session ? "Dashboard" : "Login";
    el.setAttribute("href", state.session ? "dashboard.html" : "login.html");
  });
}

function initHome() {
  renderCards("featured-courses", data.courses.slice(0, 3), cardCourse);
  renderCards("latest-blogs", data.blogs, cardBlog);
  renderCards("popular-tools", data.tools.slice(0, 3), cardTool);
  const form = $("#newsletter");
  if (form) form.addEventListener("submit", (event) => {
    event.preventDefault();
    $("#newsletterNotice").classList.add("show");
    form.reset();
  });
}

function initCourses() {
  const cats = ["All", ...new Set(data.courses.map((item) => item.category))];
  $("#filter").innerHTML = cats.map((cat) => `<option>${cat}</option>`).join("");
  filterList("courses");
}

function initBlogs() {
  const cats = ["All", ...new Set(data.blogs.map((item) => item.category))];
  $("#filter").innerHTML = cats.map((cat) => `<option>${cat}</option>`).join("");
  filterList("blogs");
}

function initTools() {
  const cats = ["All", ...new Set(data.tools.map((item) => item.category))];
  $("#filter").innerHTML = cats.map((cat) => `<option>${cat}</option>`).join("");
  filterList("tools");
}

function initLearning() {
  const id = new URLSearchParams(location.search).get("course") || data.courses[0].id;
  const course = data.courses.find((item) => item.id === id) || data.courses[0];
  const done = state.progress[course.id] || [];
  $("#courseTitle").textContent = course.title;
  $("#courseMeta").textContent = `${course.category} / ${course.level} / ${course.duration}`;
  $("#courseSummary").textContent = course.summary;
  $("#modules").innerHTML = course.modules.map((module, index) => `
    <button class="module ${done.includes(index) ? "done" : ""}" data-index="${index}">
      ${done.includes(index) ? "Completed" : "Lesson"} ${index + 1}: ${module}
    </button>`).join("");
  const percent = Math.round((done.length / course.modules.length) * 100);
  $("#progress").style.setProperty("--progress", `${percent}%`);
  $("#progressText").textContent = `${percent}% complete`;
  $$("#modules .module").forEach((btn) => btn.addEventListener("click", () => {
    const index = Number(btn.dataset.index);
    const current = new Set(state.progress[course.id] || []);
    current.has(index) ? current.delete(index) : current.add(index);
    state.progress[course.id] = [...current];
    save("dmzProgress", state.progress);
    initLearning();
  }));
}

function initBlogDetail() {
  const id = new URLSearchParams(location.search).get("post") || data.blogs[0].id;
  const post = data.blogs.find((item) => item.id === id) || data.blogs[0];
  document.title = `${post.title} | DigitalMizzle`;
  $("#postTitle").textContent = post.title;
  $("#postMeta").textContent = `${post.author} / ${post.date} / ${post.category}`;
  $("#postIntro").textContent = post.meta;
  $("#related").innerHTML = data.blogs.filter((item) => item.id !== post.id).map(cardBlog).join("");
}

function initToolDetail() {
  const id = new URLSearchParams(location.search).get("tool") || data.tools[0].id;
  const tool = data.tools.find((item) => item.id === id) || data.tools[0];
  document.title = `${tool.name} Guide | DigitalMizzle`;
  $("#toolName").textContent = tool.name;
  $("#toolDesc").textContent = tool.description;
  $("#toolUse").textContent = tool.useCase;
  $("#toolPlatform").textContent = tool.platform;
  $("#toolCommand").textContent = tool.command;
  $("#toolUsage").textContent = tool.usage;
  $("#toolLink").href = tool.link;
}

function initAuth() {
  const form = $("form[data-auth]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const mode = form.dataset.auth;
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").toLowerCase();
    const notice = $(".notice");
    if (mode === "register") {
      state.users.push({ name: fd.get("name"), email, password: fd.get("password"), verified: false, role: "user" });
      save("dmzUsers", state.users);
      notice.textContent = "Verification email queued. Demo link: add ?verify=" + encodeURIComponent(email) + " to login.html to verify.";
      notice.classList.add("show");
      form.reset();
    }
    if (mode === "login") {
      if (new URLSearchParams(location.search).get("verify")) {
        const user = state.users.find((item) => item.email === new URLSearchParams(location.search).get("verify"));
        if (user) user.verified = true;
        save("dmzUsers", state.users);
      }
      const user = state.users.find((item) => item.email === email && item.password === fd.get("password"));
      if (!user) notice.textContent = "No matching account found. Register first or check the password.";
      else if (!user.verified) notice.textContent = "Please verify your email before logging in. Use the demo verification link from registration.";
      else {
        state.session = { email: user.email, name: user.name, role: user.role };
        save("dmzSession", state.session);
        location.href = "dashboard.html";
      }
      notice.classList.add("show");
    }
    if (mode === "forgot") {
      notice.textContent = "Password reset email queued for " + email + " in this demo flow.";
      notice.classList.add("show");
    }
  });
}

function initDashboard() {
  if (!state.session) {
    state.session = { email: "preview@digitalmizzle.test", name: "Preview Operator", role: "user" };
  }
  $("#userName").textContent = state.session.name || state.session.email;
  renderCards("enrolled", data.courses.slice(0, 2), cardCourse);
  renderCards("saved", data.blogs.slice(0, 2), cardBlog);
  $("#logout").addEventListener("click", () => {
    localStorage.removeItem("dmzSession");
    location.href = "index.html";
  });
}

function initAdmin() {
  const admin = state.session?.role === "admin" || state.session?.email === "admin@digitalmizzle.com";
  if (!admin) $("#adminGate").classList.add("show");
  $("#statUsers").textContent = Math.max(state.users.length, 12);
  $("#statCourses").textContent = data.courses.length;
  $("#statBlogs").textContent = data.blogs.length;
  $("#statTools").textContent = data.tools.length;
  $("#activity").innerHTML = data.activities.map((item) => `<li>${item}</li>`).join("");
  $("#adminRows").innerHTML = data.courses.map((item) => `<tr><td>${item.title}</td><td>${item.category}</td><td>${item.level}</td><td>Published</td></tr>`).join("");
  $("#adminCreate").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#adminNotice").classList.add("show");
    event.currentTarget.reset();
  });
}

setupNav();
if (page === "home") initHome();
if (page === "courses") initCourses();
if (page === "blogs") initBlogs();
if (page === "tools") initTools();
if (page === "learning") initLearning();
if (page === "blog-detail") initBlogDetail();
if (page === "tool-detail") initToolDetail();
if (page === "login" || page === "register" || page === "forgot") initAuth();
if (page === "dashboard") initDashboard();
if (page === "admin") initAdmin();
