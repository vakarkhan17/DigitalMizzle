document.documentElement.classList.add("premium-preview");

document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".workspace-nav a").forEach((link) => {
    if (link.getAttribute("href") === path) link.classList.add("active");
  });

  document.querySelectorAll("[data-preview-form]").forEach((form) => {
    form.addEventListener("input", () => {
      const title = form.querySelector("[name=title]")?.value || "Untitled draft";
      const category = form.querySelector("[name=category]")?.value || "Uncategorized";
      const preview = document.querySelector("[data-live-preview]");
      if (!preview) return;
      preview.querySelector("[data-preview-title]").textContent = title;
      preview.querySelector("[data-preview-category]").textContent = category;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const notice = document.querySelector("[data-editor-notice]");
      if (notice) {
        notice.textContent = "Preview draft saved locally. No production data was changed.";
        notice.classList.add("show");
      }
    });
  });
});
