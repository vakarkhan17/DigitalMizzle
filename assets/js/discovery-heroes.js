const typingTarget = document.querySelector("#researchTyping");
const typingText = "Research. Learn. Secure.";

if (typingTarget) {
  let index = 0;

  const type = () => {
    typingTarget.textContent = typingText.slice(0, index);
    index += 1;

    if (index <= typingText.length) {
      window.setTimeout(type, 72);
    }
  };

  type();
}

const list = document.querySelector(".stagger-grid");
const controls = document.querySelectorAll("#search, #filter");

controls.forEach((control) => {
  control.addEventListener("input", () => {
    if (!list) return;
    list.classList.remove("stagger-grid");
    requestAnimationFrame(() => list.classList.add("stagger-grid"));
  });
  control.addEventListener("change", () => {
    if (!list) return;
    list.classList.remove("stagger-grid");
    requestAnimationFrame(() => list.classList.add("stagger-grid"));
  });
});
