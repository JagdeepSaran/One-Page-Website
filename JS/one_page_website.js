/* one_page_website.js
   Simple Lightbox for your One-Page Website gallery
   - Works with any <img class="lb"> in the page (your Gallery section)
   - If an image has data-full="path/to/large.png", uses that; otherwise uses src
   - Keyboard support: Esc closes, ← / → navigate
*/

// Collect images in display order
const thumbs = Array.from(document.querySelectorAll("img.lb"));
if (!thumbs.length) {
  console.warn("Lightbox: no images with class 'lb' found.");
}

// Build overlay only once and append to body
const overlay = document.createElement("div");
overlay.className = "lightbox-overlay";
overlay.innerHTML = `
  <div class="lightbox-content">
    <button class="lightbox-close" aria-label="Close">×</button>
    <button class="lightbox-prev" aria-label="Previous">‹</button>
    <img class="lightbox-image" alt="">
    <button class="lightbox-next" aria-label="Next">›</button>
    <div class="lightbox-caption" role="status" aria-live="polite"></div>
  </div>
`;
document.body.appendChild(overlay);

const imgEl = overlay.querySelector(".lightbox-image");
const capEl = overlay.querySelector(".lightbox-caption");
const btnClose = overlay.querySelector(".lightbox-close");
const btnPrev = overlay.querySelector(".lightbox-prev");
const btnNext = overlay.querySelector(".lightbox-next");

let index = 0;
function fullSrc(el) { return el.dataset.full || el.src; }

function openAt(i) {
  index = (i + thumbs.length) % thumbs.length;
  const t = thumbs[index];
  imgEl.src = fullSrc(t);
  imgEl.alt = t.alt || "";
  capEl.textContent = t.alt || "Image";
  overlay.classList.add("open");
  // prevent body scroll under overlay
  document.documentElement.style.overflow = "hidden";
}

function closeLB() {
  overlay.classList.remove("open");
  imgEl.src = "";
  document.documentElement.style.overflow = "";
}

function next() { openAt(index + 1); }
function prev() { openAt(index - 1); }

// Wire up thumbnail clicks
thumbs.forEach((t, i) => {
  t.style.cursor = "zoom-in";
  t.addEventListener("click", () => openAt(i));
  // Optional: Enter key on focused thumbnail
  t.setAttribute("tabindex", "0");
  t.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAt(i); }
  });
});

// Overlay interactions
btnClose.addEventListener("click", closeLB);
btnNext.addEventListener("click", next);
btnPrev.addEventListener("click", prev);

// Click outside image closes
overlay.addEventListener("click", (e) => {
  const within = e.target.closest(".lightbox-content");
  if (!within) closeLB();
});

// Keyboard controls when open
document.addEventListener("keydown", (e) => {
  if (!overlay.classList.contains("open")) return;
  if (e.key === "Escape") closeLB();
  else if (e.key === "ArrowRight") next();
  else if (e.key === "ArrowLeft") prev();
});

// Optional: make columns adapt to number of images (tip C)
// You likely already have CSS grid styles; this is a tiny helper if needed.
(function adaptGrid() {
  const grid = document.querySelector("#gallery .grid");
  if (!grid) return;
  const count = grid.querySelectorAll("img.lb").length;
  const cols = count % 4 === 0 ? 4 : (count % 3 === 0 ? 3 : 2);
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${cols}, minmax(220px, 1fr))`;
  grid.style.gap = "14px";
})();