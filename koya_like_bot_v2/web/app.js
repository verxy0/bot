const pages = document.querySelectorAll(".page");
const links = document.querySelectorAll("nav a");
function go(id) {
  pages.forEach((p) => p.classList.toggle("active", p.id === id));
  links.forEach((a) => a.classList.toggle("active", a.dataset.page === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
links.forEach((a) => a.addEventListener("click", () => go(a.dataset.page)));
document
  .querySelectorAll(".toggle")
  .forEach((t) => t.addEventListener("click", () => t.classList.toggle("on")));
document.querySelectorAll(".faq-item").forEach((x) =>
  x.addEventListener("click", () => {
    const b = x.querySelector("strong");
    b.textContent = b.textContent === "+" ? "−" : "+";
  }),
);
document.querySelectorAll(".filter").forEach((f) =>
  f.addEventListener("click", () => {
    document
      .querySelectorAll(".filter")
      .forEach((x) => x.classList.remove("active"));
    f.classList.add("active");
  }),
);
document
  .querySelector(".save")
  .addEventListener("click", () => showToast("Changes saved successfully ✦"));
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.toast);
  window.toast = setTimeout(() => t.classList.remove("show"), 2400);
}
document.getElementById("search").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  document
    .querySelectorAll(".table .tr:not(.th)")
    .forEach(
      (r) =>
        (r.style.display = r.textContent.toLowerCase().includes(q)
          ? "grid"
          : "none"),
    );
});
window.addEventListener("keydown", (e) => {
  if (e.key === "1") go("overview");
  if (e.key === "2") go("analytics");
  if (e.key === "3") go("configuration");
  if (e.key === "4") go("logs");
  if (e.key === "5") go("support");
});
