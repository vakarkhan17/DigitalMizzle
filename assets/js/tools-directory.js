const tools = Object.entries(window.DMZ_TOOL_GUIDES).map(([id, tool]) => ({ id, ...tool }));
const grid = document.querySelector("#toolGrid");
const search = document.querySelector("#toolSearch");
const filter = document.querySelector("#toolFilter");
function render() {
  const term = search.value.trim().toLowerCase();
  const category = filter.value;
  const matches = tools.filter((tool) => {
    const categoryMatch = category === "All tools" || tool.category === category;
    const textMatch = `${tool.name} ${tool.category} ${tool.platform} ${tool.summary}`.toLowerCase().includes(term);
    return categoryMatch && textMatch;
  });

  grid.innerHTML = matches.length ? matches.map((tool) => `
    <article class="tool-card" data-code="${tool.code}">
      <span class="eyebrow">${tool.category}</span>
      <h2>${tool.name}</h2>
      <div class="tool-card-meta"><span class="chip green">3 learning levels</span><span class="chip">${tool.platform}</span><span class="chip">16 sections</span></div>
      <p>${tool.summary}</p>
      <a class="btn" href="tool-detail.html?tool=${tool.id}">View Complete Guide</a>
    </article>`).join("") : `<div class="empty-state">No tools match this search.</div>`;
}

search.addEventListener("input", render);
filter.addEventListener("change", render);
render();
