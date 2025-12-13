

// window.onload = function () {
//     const parallax = document.querySelector('.parallax');

//     if (parallax) {
//         const content = document.querySelector('.parallax_container');
//         const clouds = document.querySelector('.images-parallax_clouds');
//         const mountains = document.querySelector('.images-parallax_mountains');
//         const human = document.querySelector('.images-parallax_human');

//         const forClouds = 40;
//         const forMountains = 20;
//         const forHuman = 10;

//         const speed = 0.05;

//         let positionX = 0, positionY = 0;
//         let coordXprocent = 0, coordYprocent = 0;

//         function setMouseParallaxStyle() {
//             const distX = coordXprocent - coordYprocent;
//             const distY = coordYprocent - coordXprocent;

//             positionX = positionX + (distX * speed);
//             positionY = positionY + (distY * speed);


//             clouds.style.cssText = 'transform: translate(${positionX / forClouds}%,${positionY / forClouds}%);';
//             mountains.style.cssText = 'transform: translate(${positionX / forMountains}%,${positionY / forMountains}%);';
//             human.style.cssText = 'transform: translate(${positionX / forHuman}%,${positionY / forHuman}%);';

//             requestAnimationFrame(setMouseParallaxStyle);

//             parallax.addEventListener("mousemove", function (e)){
//                 const parallaxWidth = parallax.offsetWidth;
//                 const parallaxHeigth = parallax.offsetHeigth;

//                 const coordX = e.pageX - parallaxWidth / 2;
//                 const coordY = e.pageY - parallaxHeigth / 2;

//                 coordXprocent = coordX / parallaxWidth * 100;
//                 coordYprocent = coordY / parallaxHeigth * 100;

//             };
//             //Parallax scroll

//             let thresholdSets = [];
//             for (let i = 0; i <= 1.0; i += 0.005){
//                 thresholdSets.push(i);
//             }
//             const callback = function (entries, observer) {
//                 const scrollTopProcent = window.pageYOffset / parallax.offsetHeigth * 100;
//                 setParallaxItemsStyle(scrollTopProcent);
//             };
//             const observer = new IntersectionObserver(callback, { threshold: thresholdSets });
//             observer.observe(document.querySelector('.content'));

//             function setParallaxItemsStyle(scrollTopProcent) {
//                 content.style.cssText = 'transform: translate(0%,-${scrollTopProcent / 9}%);';
//                 mountains.parentElement.style.cssText = 'transform: translate(0%,-${scrollTopProcent / 6}%);';
//                 human.parentElement.style.cssText = 'transform: translate(0%,-${scrollTopProcent / 3}%);';
//             }
//         };
//     }
// }


'use strict';

window.addEventListener('load', () => {
  const parallax = document.querySelector('.parallax');

  if (!parallax) return;

  const content = document.querySelector('.parallax_container');
  const clouds = document.querySelector('.images-parallax_clouds');
  const mountains = document.querySelector('.images-parallax_mountains');
  const human = document.querySelector('.images-parallax_human');

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

