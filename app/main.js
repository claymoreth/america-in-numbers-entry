// Router + global state. One state object drives every page: the selected
// year (2020–2025) redraws all charts and year-dependent figures, and the
// archive search filters its table live. Navigation is hash-based so every
// page is reached by a link.

import { VIEWS } from "./views.js";

export const state = { year: 2025, query: "", route: "home" };

const ROUTES = {
  "/": "home",
  "/economy": "economy",
  "/people": "people",
  "/labour": "labour",
  "/archive": "archive",
};

const TITLES = {
  home: "America in Numbers — United States National Statistics",
  economy: "Economy — America in Numbers",
  people: "People — America in Numbers",
  labour: "Labour — America in Numbers",
  archive: "Archive — America in Numbers",
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return ROUTES[hash] || "home";
}

function bindControls() {
  const yearSelect = document.getElementById("year-select");
  if (yearSelect) {
    yearSelect.addEventListener("change", () => {
      const y = Number(yearSelect.value);
      if (y >= 2020 && y <= 2025) {
        state.year = y;
        render();
      }
    });
  }
  const search = document.getElementById("archive-search");
  if (search) {
    search.addEventListener("input", () => {
      state.query = search.value;
      render(false);
      const again = document.getElementById("archive-search");
      if (again) {
        again.focus();
        again.setSelectionRange(again.value.length, again.value.length);
      }
    });
  }
}

function render(scrollTop = true) {
  state.route = currentRoute();
  const view = VIEWS[state.route] || VIEWS.home;
  const app = document.getElementById("app");
  app.innerHTML = view(state);
  document.title = TITLES[state.route];
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === state.route);
    if (a.dataset.route === state.route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  bindControls();
  if (scrollTop) window.scrollTo(0, 0);
}

function initMenu() {
  const btn = document.getElementById("menu-button");
  const nav = document.getElementById("site-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) nav.classList.remove("open");
  });
}

window.addEventListener("hashchange", () => render());
initMenu();
render();
