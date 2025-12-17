'use strict';


window.addEventListener('load', () => {
  const parallax = document.querySelector('.parallax');

  if (!parallax) return;

  const content = document.querySelector('.parallax_container');
  const clouds = document.querySelector('.images_parallax_clouds');
  const mountains = document.querySelector('.images_parallax_mountains');
  const human = document.querySelector('.images_parallax_human');

  const forClouds = 40;
  const forMountains = 20;
  const forHuman = 10;

  const speed = 0.05;

  let positionX = 0;
  let positionY = 0;
  let coordXProcent = 0;
  let coordYProcent = 0;

  // Анимация по движению мыши
  function setMouseParallaxStyle() {
    const distX = coordXProcent - positionX;
    const distY = coordYProcent - positionY;

    positionX = positionX + distX * speed;
    positionY = positionY + distY * speed;

    if (clouds) {
      clouds.style.cssText = `
        transform: translate(${positionX / forClouds}%, ${positionY / forClouds}%);
      `;
    }

    if (mountains) {
      mountains.style.cssText = `
        transform: translate(${positionX / forMountains}%, ${positionY / forMountains}%);
      `;
    }

    if (human) {
      human.style.cssText = `
        transform: translate(${positionX / forHuman}%, ${positionY / forHuman}%);
      `;
    }

    requestAnimationFrame(setMouseParallaxStyle);
  }

  // Слушатель мыши — вешаем ОДИН раз
  parallax.addEventListener('mousemove', e => {
    const parallaxWidth = parallax.offsetWidth;
    const parallaxHeight = parallax.offsetHeight;

    const coordX = e.pageX - parallaxWidth / 2;
    const coordY = e.pageY - parallaxHeight / 2;

    coordXProcent = (coordX / parallaxWidth) * 100;
    coordYProcent = (coordY / parallaxHeight) * 100;
  });

  // Запускаем анимацию
  setMouseParallaxStyle();

  // -------- PARALLAX SCROLL --------

  const thresholdSets = [];
  for (let i = 0; i <= 1.0; i += 0.005) {
    thresholdSets.push(i);
  }

  function setParallaxItemsStyle(scrollTopProcent) {
    if (content) {
      content.style.cssText = `
        transform: translate(0%, -${scrollTopProcent / 9}%);
      `;
    }

    if (mountains && mountains.parentElement) {
      mountains.parentElement.style.cssText = `
        transform: translate(0%, -${scrollTopProcent / 6}%);
      `;
    }

    if (human && human.parentElement) {
      human.parentElement.style.cssText = `
        transform: translate(0%, -${scrollTopProcent / 3}%);
      `;
    }
  }

  const callback = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const scrollTopProcent =
          (window.pageYOffset / parallax.offsetHeight) * 100;
        setParallaxItemsStyle(scrollTopProcent);
      }
    });
  };

  const observer = new IntersectionObserver(callback, {
    threshold: thresholdSets,
  });

  const contentBlock = document.querySelector('.content');
  if (contentBlock) {
    observer.observe(contentBlock);
  }
});

// scroll

const links = Array.from(document.querySelectorAll(".si-link"));
const ids = links.map(a => a.getAttribute("href")).filter(Boolean);
const sections = ids.map(id => document.querySelector(id)).filter(Boolean);

const progressEl = document.querySelector(".si-progress");

const io = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  links.forEach(a => a.classList.toggle(
    "is-active",
    a.getAttribute("href") === `#${visible.target.id}`
  ));
}, { threshold: [0.2, 0.4, 0.6] });

sections.forEach(s => io.observe(s));

function updateProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (window.scrollY / max) : 0;
  progressEl.style.height = `${pct * 100}%`;
}
updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });