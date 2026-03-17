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
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  // Calculate the width of one full set and set animation accordingly
  const setWidth = originalItems.reduce((total, item) => {
    const style = getComputedStyle(item);
    return total + item.offsetWidth + parseInt(style.marginRight || 0) + 30; // 30 = gap
  }, 0);

  // Inject exact scroll distance as CSS variable
  track.style.setProperty("--scroll-width", `-${setWidth}px`);

  // Pause on hover
  track.addEventListener("mouseenter", () => track.style.animationPlayState = "paused");
  track.addEventListener("mouseleave", () => track.style.animationPlayState = "running");

}


/* ================================
   LIGHTBOX
================================ */

const lightbox = document.createElement("div");
lightbox.classList.add("lightbox");
lightbox.innerHTML = `
  <div class="lightbox-overlay"></div>
  <div class="lightbox-content">
    <button class="lightbox-close">&times;</button>
    <img>
  </div>
`;
document.body.appendChild(lightbox);

const lbImg     = lightbox.querySelector("img");
const lbClose   = lightbox.querySelector(".lightbox-close");
const lbOverlay = lightbox.querySelector(".lightbox-overlay");

function openLightbox(src) {
  lbImg.src = src;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  lbImg.src = "";
}

// Open on brand item click (covers originals + clones)
if (track) {
  track.addEventListener("click", e => {
    const item = e.target.closest(".brand-item");
    if (!item) return;
    const src = item.querySelector("img")?.src;
    if (!src) return;
    openLightbox(src);
  });
}

// Close on overlay, X button, or Escape
lbOverlay.addEventListener("click", closeLightbox);
lbClose.addEventListener("click", closeLightbox);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});