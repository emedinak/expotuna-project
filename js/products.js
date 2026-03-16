/* ================================
   BRANDS CAROUSEL — infinite loop
   Duplicates cards so scroll feels seamless
================================ */

const track = document.querySelector(".brands-track");

if (track) {

  // Hide cards whose image fails to load
  track.querySelectorAll(".brand-item img").forEach(img => {
    img.addEventListener("error", () => {
      img.closest(".brand-item").classList.add("hidden");
    });
  });

  // Duplicate items enough times to fill the full viewport width seamlessly
  const originalItems = Array.from(track.querySelectorAll(".brand-item"));

  // Fill with 4 sets of clones to ensure no gap at any screen size
  for (let i = 0; i < 4; i++) {
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
  }

  // Calculate the width of one full set and set animation accordingly
  const setWidth = originalItems.reduce((total, item) => {
    const style = getComputedStyle(item);
    return total + item.offsetWidth + parseInt(style.marginRight || 0) + 50; // 50 = gap
  }, 0);

  // Inject exact scroll distance as CSS variable
  track.style.setProperty("--scroll-width", `-${setWidth}px`);

}


/* ================================
   LIGHTBOX
================================ */

// Create lightbox element and inject into page
const lightbox = document.createElement("div");
lightbox.classList.add("lightbox");
lightbox.innerHTML = `<span class="lightbox-close">&times;</span><img>`;
document.body.appendChild(lightbox);

const lbImg = lightbox.querySelector("img");
const lbClose = lightbox.querySelector(".lightbox-close");

// Open on brand item click
document.querySelector(".brands-track").addEventListener("click", e => {
  const item = e.target.closest(".brand-item");
  if (!item) return;
  const src = item.querySelector("img")?.src;
  if (!src) return;
  lbImg.src = src;
  lightbox.classList.add("active");
});

// Close on backdrop or X click
lightbox.addEventListener("click", e => {
  if (e.target === lightbox || e.target === lbClose) {
    lightbox.classList.remove("active");
    lbImg.src = "";
  }
});

// Close on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    lightbox.classList.remove("active");
    lbImg.src = "";
  }
});


/* ================================
   PRODUCT SLIDERS
================================ */

const sliders = document.querySelectorAll(".product-slider");

sliders.forEach(slider => {

  const images = slider.querySelectorAll(".product-image");
  const next = slider.querySelector(".next");
  const prev = slider.querySelector(".prev");

  let index = 0;

  function showImage(i) {
    images.forEach(img => img.classList.remove("active"));
    images[i].classList.add("active");
  }

  next.addEventListener("click", () => {
    index++;
    if (index >= images.length) index = 0;
    showImage(index);
  });

  prev.addEventListener("click", () => {
    index--;
    if (index < 0) index = images.length - 1;
    showImage(index);
  });

});