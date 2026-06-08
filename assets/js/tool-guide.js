const guides = window.DMZ_TOOL_GUIDES;
const params = new URLSearchParams(location.search);
const toolId = guides[params.get("tool")] ? params.get("tool") : "nmap";
const tool = guides[toolId];
const levelNames = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
let level = localStorage.getItem(`dmzToolLevel-${toolId}`) || "beginner";
if (!levelNames[level]) level = "beginner";
let completed = new Set(JSON.parse(localStorage.getItem(`dmzToolProgress-${toolId}-${level}`) || "[]"));

const sectionDefinitions = [
  ["overview", "Tool Overview", () => overviewContent()],
  ["does", "What the Tool Does", () => listContent(tool.does, "Core capabilities")],
  ["why", "Why Security Professionals Use It", () => paragraphContent(tool.why)],
  ["platforms", "Supported Platforms", () => listContent(tool.platforms, "Supported environments")],
  ["installation", "Installation Methods", () => installationContent()],
  ["beginner-guide", "Beginner Guide", () => levelGuideContent("beginner")],
  ["intermediate-guide", "Intermediate Guide", () => levelGuideContent("intermediate")],
  ["advanced-guide", "Advanced Guide", () => levelGuideContent("advanced")],
  ["examples", "Safe Practice Examples", () => examplesContent()],
  ["mistakes", "Common Mistakes", () => listContent(tool.mistakes, "Avoid these mistakes")],
  ["best-practices", "Best Practices", () => listContent(tool.best, "Professional habits")],
  ["use-cases", "Real-World Defensive Use Cases", () => listContent(tool.usecases, "Defensive applications")],
  ["troubleshooting", "Troubleshooting", () => troubleshootingContent()],
  ["faqs", "FAQs", () => faqContent()],
  ["quiz", "Mini Quiz", () => quizContent()],
  ["takeaways", "Key Takeaways", () => takeawaysContent()]
];

const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
function depthIntro(subject) {
  if (level === "beginner") return `${subject} This view explains terminology in plain language, breaks the workflow into small steps, and keeps every exercise on localhost or a learner-owned lab.`;
  if (level === "advanced") return `${subject} This view adds professional methodology, evidence quality, performance or operational context, documentation, confidence, limitations, and defensive reporting.`;
  return `${subject} This view connects each action to a practical objective, explains important options, and adds troubleshooting and repeatable lab workflow guidance.`;
}

function commandBlock(commands, label = "Safe local-lab commands") {
  return `<div class="command-block"><div class="command-head"><span>${label}</span><button class="copy-command" type="button" data-copy>Copy</button></div><pre><code>${escapeHtml(commands)}</code></pre></div>`;
}

function overviewContent() {
  return `<p>${depthIntro(tool.overview)}</p>
    <div class="content-grid">
      <div class="content-box"><h3>Category</h3><p>${tool.category}</p></div>
      <div class="content-box"><h3>Platform</h3><p>${tool.platform}</p></div>
      <div class="content-box"><h3>Learning mode</h3><p>${levelNames[level]} / educational and defensive</p></div>
      <div class="content-box"><h3>Authorized scope</h3><p>Localhost, learner-owned labs, supplied PCAPs, or written-permission environments.</p></div>
    </div>
    <div class="safe-note"><strong>Safety boundary</strong>Do not apply this guide to public targets, real accounts, third-party traffic, or systems outside written scope.</div>`;
}

function paragraphContent(text) {
  return `<p>${depthIntro(text)}</p><div class="takeaway"><strong>Professional perspective</strong>The tool supports a defensive objective only when its output is validated, documented, and interpreted in context.</div>`;
}

function listContent(items, title) {
  return `<p>${depthIntro(`${title} vary by environment and must remain tied to an authorized objective.`)}</p><div class="content-box"><h3>${title}</h3><ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul></div>`;
}

function installationContent() {
  return `<p>${depthIntro("Install software only from trusted repositories or the official vendor. Record versions so results can be reproduced.")}</p>
    <div class="content-box"><h3>Installation paths</h3><ul>${tool.installation.methods.map((item) => `<li>${item}</li>`).join("")}</ul></div>
    ${commandBlock(tool.installation.commands, "Install and verify")}
    <div class="safe-note"><strong>Supply-chain reminder</strong>Avoid random binaries and unreviewed install scripts. Verify the source, package, and version.</div>`;
}

function levelGuideContent(targetLevel) {
  const profile = tool[targetLevel];
  const selected = targetLevel === level;
  return `<p>${profile.guide}</p>
    ${selected ? `<span class="chip green">Current selected level</span>` : `<span class="chip">Switch to ${levelNames[targetLevel]} for the full depth</span>`}
    <div class="content-grid">
      <div class="content-box"><h3>Workflow</h3><ol>${profile.workflow.map((item) => `<li>${item}</li>`).join("")}</ol></div>
      <div class="content-box"><h3>Options and concepts</h3><ul>${profile.options.map((item) => `<li>${item}</li>`).join("")}</ul></div>
    </div>
    ${commandBlock(profile.commands)}
    <div class="content-box"><h3>Expected results</h3><p>${profile.expected}</p></div>
    ${targetLevel === "beginner" ? `<div class="visual-placeholder"><div><strong>Visual learning placeholder</strong>${profile.visual}</div></div>` : ""}
    <div class="takeaway"><strong>${levelNames[targetLevel]} focus</strong>${targetLevel === "advanced" ? "Validate assumptions, preserve evidence, tune responsibly, and state confidence and limitations." : targetLevel === "intermediate" ? "Connect commands to a repeatable workflow and troubleshoot from evidence." : "Understand what each step means before moving forward."}</div>`;
}

function examplesContent() {
  const profile = tool[level];
  return `<p>${depthIntro("Practice examples are intentionally limited to safe local and defensive scenarios.")}</p>
    <div class="content-box"><h3>Approved examples</h3><ul>${tool.examples.map((item) => `<li>${item}</li>`).join("")}</ul></div>
    ${commandBlock(profile.commands)}
    <div class="content-box"><h3>Expected output</h3><p>${profile.expected}</p></div>`;
}

function troubleshootingContent() {
  return `<p>${depthIntro("Troubleshoot by preserving the original error, validating environment and scope, and changing one variable at a time.")}</p>
    <div class="content-grid">${tool.troubleshooting.map((item, index) => `<div class="content-box"><h3>Check ${String(index + 1).padStart(2, "0")}</h3><p>${item}</p></div>`).join("")}</div>`;
}

function faqContent() {
  return `<div class="faq-list">${tool.faqs.map(([question, answer]) => `<details class="faq-item"><summary>${question}</summary><p>${answer}</p></details>`).join("")}</div>`;
}

function quizContent() {
  return `<div class="quiz">${tool.quiz.map((question, questionIndex) => `
    <div class="quiz-card">
      <p>${questionIndex + 1}. ${question[0]}</p>
      <div class="quiz-options">${question[1].map((option, optionIndex) => `<label><input type="radio" name="quiz-${questionIndex}" value="${optionIndex}"><span>${option}</span></label>`).join("")}</div>
      <button class="reveal-answer" type="button" data-answer>Reveal answer</button>
      <div class="quiz-answer">Correct answer: <strong>${question[1][question[2]]}</strong></div>
    </div>`).join("")}</div>`;
}

function takeawaysContent() {
  return `<div class="content-grid">${tool.takeaways.map((item, index) => `<div class="content-box"><h3>Takeaway ${String(index + 1).padStart(2, "0")}</h3><p>${item}</p></div>`).join("")}</div>
    <div class="takeaway"><strong>Final reminder</strong>Use ${tool.name} only for defensive learning and explicitly authorized work. Good methodology matters more than command volume.</div>`;
}

function renderGuide() {
  document.title = `${tool.name} Guide | DigitalMizzle`;
  document.querySelector("#toolCategory").textContent = `${tool.category} / Tool knowledge base`;
  document.querySelector("#toolName").textContent = tool.name;
  document.querySelector("#toolSummary").textContent = tool.summary;
  document.querySelector("#toolMeta").innerHTML = `<span class="chip green">${levelNames[level]}</span><span class="chip">${tool.platform}</span><span class="chip">16 guide sections</span><span class="chip">Defensive use</span>`;
  document.querySelector("#heroCommand").textContent = tool.heroCommand;
  document.querySelector("#toolStatus").textContent = tool.status;

  document.querySelector("#guideSections").innerHTML = sectionDefinitions.map(([id, title, renderer], index) => `
    <details class="guide-section" id="${id}" data-section="${id}" ${index === 0 ? "open" : ""}>
      <summary><span class="section-index">${String(index + 1).padStart(2, "0")}</span><h2>${title}</h2><span>${levelNames[level]}</span></summary>
      <div class="section-body">${renderer()}
        <div class="section-complete"><span>Mark this section complete for the ${levelNames[level]} guide.</span><button class="btn complete-button ${completed.has(id) ? "done" : ""}" type="button" data-complete="${id}">${completed.has(id) ? "Completed" : "Mark Complete"}</button></div>
      </div>
    </details>`).join("");

  document.querySelector("#sectionNav").innerHTML = sectionDefinitions.map(([id, title], index) => `<a href="#${id}">${String(index + 1).padStart(2, "0")} ${title}</a>`).join("");
  document.querySelectorAll("[data-level]").forEach((button) => button.classList.toggle("active", button.dataset.level === level));
  updateProgress();
}

function renderRelated() {
  document.querySelector("#relatedTools").innerHTML = Object.entries(guides).filter(([id]) => id !== toolId).map(([id, item]) => `
    <article class="related-card"><span class="eyebrow">${item.category}</span><h3>${item.name}</h3><p>${item.summary}</p><a class="btn" href="tool-detail.html?tool=${id}">Open Guide</a></article>`).join("");
}

function updateProgress() {
  const percent = Math.round((completed.size / sectionDefinitions.length) * 100);
  document.querySelector("#progressText").textContent = `${percent}%`;
  document.querySelector("#progressBar").style.width = `${percent}%`;
  localStorage.setItem(`dmzToolProgress-${toolId}-${level}`, JSON.stringify([...completed]));
}

document.querySelector(".difficulty-selector").addEventListener("click", (event) => {
  const button = event.target.closest("[data-level]");
  if (!button || button.dataset.level === level) return;
  level = button.dataset.level;
  localStorage.setItem(`dmzToolLevel-${toolId}`, level);
  completed = new Set(JSON.parse(localStorage.getItem(`dmzToolProgress-${toolId}-${level}`) || "[]"));
  renderGuide();
});

document.querySelector("#guideSearch").addEventListener("input", (event) => {
  const term = event.target.value.trim().toLowerCase();
  document.querySelectorAll(".guide-section").forEach((section) => {
    const match = section.textContent.toLowerCase().includes(term);
    section.hidden = !match;
    if (term && match) section.open = true;
  });
});

document.querySelector("#resetProgress").addEventListener("click", () => {
  completed.clear();
  renderGuide();
});

document.querySelector("#guideSections").addEventListener("click", async (event) => {
  const copy = event.target.closest("[data-copy]");
  if (copy) {
    await navigator.clipboard.writeText(copy.closest(".command-block").querySelector("code").textContent);
    copy.textContent = "Copied";
    setTimeout(() => { copy.textContent = "Copy"; }, 1200);
    return;
  }
  const answer = event.target.closest("[data-answer]");
  if (answer) {
    answer.nextElementSibling.classList.toggle("visible");
    answer.textContent = answer.nextElementSibling.classList.contains("visible") ? "Hide answer" : "Reveal answer";
    return;
  }
  const complete = event.target.closest("[data-complete]");
  if (complete) {
    const id = complete.dataset.complete;
    completed.has(id) ? completed.delete(id) : completed.add(id);
    complete.classList.toggle("done", completed.has(id));
    complete.textContent = completed.has(id) ? "Completed" : "Mark Complete";
    updateProgress();
  }
});

renderGuide();
renderRelated();

