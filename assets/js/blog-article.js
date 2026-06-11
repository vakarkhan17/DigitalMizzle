import { supabase } from "./supabase-client.js";
import { BLOG_ARTICLES } from "./blog-articles-data.js";

const article = BLOG_ARTICLES[document.body.dataset.article];
const $ = (selector, root = document) => root.querySelector(selector);

if (!article) {
  location.replace("blogs.html");
} else {
  initializeArticle();
}

async function initializeArticle() {
  fillHero();
  renderArticle();
  renderRelated();
  setupReadingProgress();
  setupCopyButtons();
  setupMobileToc();
  revealSections();

  let verified = false;
  try {
    const { data } = await supabase.auth.getSession();
    verified = Boolean(data.session?.user?.email_confirmed_at);
  } catch {
    verified = false;
  }

  $("#fullArticle").hidden = !verified;
  $("#articleGate").hidden = verified;
  $("#accessLabel").textContent = verified ? "Verified member access" : "Public preview";

  if (verified) {
    const read = new Set(JSON.parse(localStorage.getItem("dmzBlogsRead") || "[]"));
    read.add(document.body.dataset.article);
    localStorage.setItem("dmzBlogsRead", JSON.stringify([...read]));
  }
}

function fillHero() {
  $("#articleCategory").textContent = article.category;
  $("#articleTitle").textContent = article.title;
  $("#articleDek").textContent = article.dek;
  $("#articleAuthor").textContent = article.author;
  $("#articleDate").textContent = article.date;
  $("#articleReadTime").textContent = article.readTime;
  $("#articleTags").innerHTML = article.tags.map((tag) => `<span>${tag}</span>`).join("");
  document.body.dataset.accent = article.accent;
}

function renderArticle() {
  const preview = renderSection(article.preview, true);
  $("#previewArticle").innerHTML = preview;
  $("#fullArticle").innerHTML = `
    ${article.sections.map((section) => renderSection(section)).join("")}
    <section class="article-section key-takeaways reveal" id="key-takeaways">
      <span class="section-code">FINAL BRIEF</span>
      <h2>Key takeaways</h2>
      <ul>${article.takeaways.map((item) => `<li>${item}</li>`).join("")}</ul>
    </section>`;

  const tocItems = [
    { id: article.preview.id, title: article.preview.title },
    ...article.sections.map(({ id, title }) => ({ id, title })),
    { id: "key-takeaways", title: "Key takeaways" }
  ];
  const links = tocItems
    .map((item, index) => `<a href="#${item.id}"><span>${String(index + 1).padStart(2, "0")}</span>${item.title}</a>`)
    .join("");
  $("#tocLinks").innerHTML = links;
  $("#mobileTocLinks").innerHTML = links;
}

function renderSection(section, isPreview = false) {
  const paragraphs = (section.paragraphs || []).map((text) => `<p>${text}</p>`).join("");
  const bullets = section.bullets?.length
    ? `<ul>${section.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : "";
  const commands = (section.commands || []).map((command) => `
    <div class="command-block">
      <div class="command-top"><span>SAFE LOCAL COMMANDS</span><button type="button" data-copy-command>Copy</button></div>
      <pre><code>${escapeHtml(command.code)}</code></pre>
      <p class="command-explanation"><strong>What this does:</strong> ${command.explanation}</p>
    </div>`).join("");
  const subsections = (section.subsections || []).map((item) => `
    <div class="subsection">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </div>`).join("");
  const subheading = section.h3 ? `<h3>${section.h3}</h3>` : "";
  const safety = section.safety
    ? `<aside class="safety-note"><strong>Ethical and safety note</strong><p>${section.safety}</p></aside>`
    : "";
  const takeaway = section.takeaway
    ? `<p class="section-takeaway"><strong>Key takeaway:</strong> ${section.takeaway}</p>`
    : "";

  return `
    <section class="article-section reveal${isPreview ? " public-preview" : ""}" id="${section.id}">
      <span class="section-code">${isPreview ? "PUBLIC PREVIEW" : "MEMBER ARTICLE"}</span>
      <h2>${section.title}</h2>
      ${paragraphs}${subheading}${bullets}${subsections}${commands}${safety}${takeaway}
    </section>`;
}

function renderRelated() {
  const related = Object.entries(BLOG_ARTICLES)
    .filter(([slug]) => slug !== document.body.dataset.article)
    .map(([, item]) => `
      <a class="related-card reveal" href="${item.route}">
        <span>${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.dek}</p>
        <strong>Read public preview <span aria-hidden="true">→</span></strong>
      </a>`)
    .join("");
  $("#relatedArticles").innerHTML = related;
}

function setupReadingProgress() {
  const bar = $("#readingProgress");
  const update = () => {
    const height = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = `${height > 0 ? (scrollY / height) * 100 : 0}%`;
  };
  addEventListener("scroll", update, { passive: true });
  update();
}

function setupCopyButtons() {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-command]");
    if (!button) return;
    const code = button.closest(".command-block").querySelector("code").textContent;
    await navigator.clipboard.writeText(code);
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = "Copy";
    }, 1400);
  });
}

function setupMobileToc() {
  const button = $("#mobileTocButton");
  const panel = $("#mobileTocLinks");
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    panel.hidden = open;
  });
  panel.addEventListener("click", () => {
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
  });
}

function revealSections() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
