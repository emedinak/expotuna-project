/* ================================
   ANIMATION ON SCROLL
================================ */

const elements = document.querySelectorAll("[data-animate]");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
});

elements.forEach(el => observer.observe(el));


/* ================================
   HERO STATS COUNTER
================================ */

const counters = document.querySelectorAll(".counter");

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute("data-target");
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const value = Math.floor(easedProgress * target);

        counter.innerText = counter.dataset.type === "percent"
          ? value + "%" : value + "+";

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = counter.dataset.type === "percent"
            ? target + "%" : target + "+";
        }
      }

      requestAnimationFrame(updateCounter);
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.6 });

counters.forEach(counter => counterObserver.observe(counter));


/* ================================
   NAVBAR SCROLL — solo home
================================ */

const navbar = document.querySelector(".navbar-home");

if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 80);
  });
}


/* ================================
   CERT LOGO LIGHTBOX
================================ */

const certImgs = document.querySelectorAll(".about-certs-logos img");

if (certImgs.length) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9999;
    background:rgba(10,25,50,0.82);
    backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    opacity:0; pointer-events:none;
    transition:opacity 0.25s ease;
  `;

  const overlayImg = document.createElement("img");
  overlayImg.style.cssText = `
    max-width:min(420px, 80vw);
    max-height:80vh;
    object-fit:contain;
    border-radius:12px;
    transform:scale(0.88);
    transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);
  `;

  overlay.appendChild(overlayImg);
  document.body.appendChild(overlay);

  certImgs.forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      overlayImg.src = img.src;
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "all";
      setTimeout(() => overlayImg.style.transform = "scale(1)", 10);
    });
  });

  overlay.addEventListener("click", () => {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlayImg.style.transform = "scale(0.88)";
  });
}


/* ================================
   ABOUT STATS COUNTER
================================ */

const statNumbers = document.querySelectorAll(".stat-number");

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const text = el.innerText;
    const isPercent = text.includes("%");
    const target = parseFloat(text.replace(/[^0-9.]/g, ""));
    const duration = 2000;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const value = Math.floor(eased * target);
      el.innerText = isPercent ? value + "%" : value + "+";
      if (progress < 1) requestAnimationFrame(tick);
      else el.innerText = isPercent ? target + "%" : target + "+";
    }

    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.6 });

statNumbers.forEach(el => statObserver.observe(el));


/* ================================
   HAMBURGER MENU
================================ */

const hamburger = document.getElementById('nav-hamburger');
const navMenu   = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Cerrar al pulsar un link de navegación
  navMenu.querySelectorAll('a:not(.lang-option)').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}