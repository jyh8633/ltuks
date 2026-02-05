// Simple slider + mobile drawer + font size toggles
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Footer year
  const y = $("#y");
  if (y) y.textContent = String(new Date().getFullYear());

  // Language dropdown
  const lang = $(".lang");
  const langBtn = $(".lang__btn");
  const langMenu = $(".lang__menu");
  if (lang && langBtn && langMenu) {
    const close = () => {
      langMenu.style.display = "none";
      langBtn.setAttribute("aria-expanded", "false");
    };
    langBtn.addEventListener("click", () => {
      const open = langMenu.style.display === "block";
      langMenu.style.display = open ? "none" : "block";
      langBtn.setAttribute("aria-expanded", open ? "false" : "true");
    });
    $$(".lang__menu li").forEach((li) => {
      li.addEventListener("click", () => {
        langBtn.firstChild.textContent = li.textContent + " ";
        close();
      });
    });
    document.addEventListener("click", (e) => {
      if (!lang.contains(e.target)) close();
    });
  }

  // Font size toggles
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const setFs = (v) => document.documentElement.style.setProperty("--fs", v + "px");
  const getFs = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs")) || 16;

  $$("[data-font]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cur = getFs();
      const next = btn.dataset.font === "up" ? clamp(cur + 1, 14, 19) : clamp(cur - 1, 14, 19);
      setFs(next);
    });
  });

  // Drawer
  const drawer = $(".drawer");
  const openBtn = $(".nav__hamburger");
  const closeBtn = $(".drawer__close");
  const backdrop = $(".drawer__backdrop");
  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
    if (openBtn) openBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };
  if (openBtn) openBtn.addEventListener("click", () => setDrawer(true));
  if (closeBtn) closeBtn.addEventListener("click", () => setDrawer(false));
  if (backdrop) backdrop.addEventListener("click", () => setDrawer(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDrawer(false);
  });

  // Slider
  const slider = $("[data-slider]");
  if (!slider) return;

  const slides = $$(".slide", slider);
  const dots = $$(".dot", slider);
  const prev = $("[data-prev]", slider);
  const next = $("[data-next]", slider);
  let idx = 0;
  let timer = null;

  const render = (n) => {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  };

  const start = () => {
    stop();
    timer = setInterval(() => render(idx + 1), 6000);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  if (prev) prev.addEventListener("click", () => { render(idx - 1); start(); });
  if (next) next.addEventListener("click", () => { render(idx + 1); start(); });

  dots.forEach((d) => {
    d.addEventListener("click", () => {
      const n = parseInt(d.dataset.dot || "0", 10);
      render(n);
      start();
    });
  });

  // Pause on hover/focus
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", start);

  render(0);
  start();
})();
