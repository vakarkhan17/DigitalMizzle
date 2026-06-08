const form = document.querySelector("#contactForm");
const success = document.querySelector("#successMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, textarea")];
  let valid = true;

  fields.forEach((field) => {
    const fieldValid = field.checkValidity();
    field.classList.toggle("invalid", !fieldValid);
    valid = valid && fieldValid;
  });

  if (!valid) {
    fields.find((field) => !field.checkValidity())?.focus();
    success.classList.remove("show");
    return;
  }

  form.reset();
  fields.forEach((field) => field.classList.remove("invalid"));
  success.classList.add("show");
});

form.addEventListener("input", (event) => {
  if (event.target.matches("input, textarea")) {
    event.target.classList.remove("invalid");
    success.classList.remove("show");
  }
});
