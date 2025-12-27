"use strict";

window.addEventListener("load", () => {
  // PRELOADER
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    setTimeout(() => preloader.classList.add("hidden"), 800);
  }

  // PARALLAX (mouse + scroll)

  const parallax = document.querySelector(".parallax");
  if (parallax) {
    const content = document.querySelector(".parallax-container");
    const clouds = document.querySelector(".images-parallax-clouds");
    const mountains = document.querySelector(".images-parallax-mountains");
    const human = document.querySelector(".images-parallax-human");

    const forClouds = 40;
    const forMountains = 20;
    const forHuman = 10;

    const speed = 0.05;

    let positionX = 0;
    let positionY = 0;
    let coordXProcent = 0;
    let coordYProcent = 0;

    function setMouseParallaxStyle() {
      const distX = coordXProcent - positionX;
      const distY = coordYProcent - positionY;

      positionX += distX * speed;
      positionY += distY * speed;

      if (clouds) {
        clouds.style.transform = `translate(${positionX / forClouds}%, ${positionY / forClouds}%)`;
      }
      if (mountains) {
        mountains.style.transform = `translate(${positionX / forMountains}%, ${positionY / forMountains}%)`;
      }
      if (human) {
        human.style.transform = `translate(${positionX / forHuman}%, ${positionY / forHuman}%)`;
      }

      requestAnimationFrame(setMouseParallaxStyle);
    }

    parallax.addEventListener("mousemove", (e) => {
      const rect = parallax.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      coordXProcent = (x / rect.width) * 100;
      coordYProcent = (y / rect.height) * 100;
    });

    setMouseParallaxStyle();

    // Parallax on scroll
    const thresholdSets = [];
    for (let i = 0; i <= 1.0; i += 0.005) thresholdSets.push(i);

    function setParallaxItemsStyle(scrollTopProcent) {
      if (content) {
        content.style.transform = `translate(0%, -${scrollTopProcent / 9}%)`;
      }
      if (mountains?.parentElement) {
        mountains.parentElement.style.transform = `translate(0%, -${scrollTopProcent / 6}%)`;
      }
      if (human?.parentElement) {
        human.parentElement.style.transform = `translate(0%, -${scrollTopProcent / 3}%)`;
      }
    }

    const contentBlock = document.querySelector(".content");
    if (contentBlock) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const scrollTopProcent = (window.scrollY / parallax.offsetHeight) * 100;
            setParallaxItemsStyle(scrollTopProcent);
          });
        },
        { threshold: thresholdSets }
      );

      observer.observe(contentBlock);
    }
  }

  // SCROLL INDICATOR

  const links = Array.from(document.querySelectorAll(".si-link"));
  const ids = links.map((a) => a.getAttribute("href")).filter(Boolean);
  const sections = ids.map((id) => document.querySelector(id)).filter(Boolean);

  const progressEl = document.querySelector(".si-progress");

  if (links.length && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        links.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === `#${visible.target.id}`)
        );
      },
      { threshold: [0.2, 0.4, 0.6] }
    );

    sections.forEach((s) => io.observe(s));
  }

  function updateProgress() {
    if (!progressEl) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    progressEl.style.height = `${pct * 100}%`;
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  // BURGER MENU
  const openBtn = document.querySelector("[data-menu-open]");
  const closeBtn = document.querySelector("[data-menu-close]");
  const menu = document.querySelector("[data-menu]");

  if (openBtn && closeBtn && menu) {
    const toggleMenu = () => menu.classList.toggle("is-open");

    openBtn.addEventListener("click", toggleMenu);
    closeBtn.addEventListener("click", toggleMenu);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") menu.classList.remove("is-open");
    });
  }
});
