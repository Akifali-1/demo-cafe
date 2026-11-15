// Gallery Module: drag to scroll, arrows, progress indicator, and stagger reveal
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initGallery() {
  const track = document.getElementById("gallery-track");
  const prevBtn = document.getElementById("gallery-prev-btn");
  const nextBtn = document.getElementById("gallery-next-btn");
  const progressFill = document.getElementById("gallery-progress-fill");
  const tiles = document.querySelectorAll(".gallery-tile");

  if (!track) return;

  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Initial reveal when gallery enters view (reveal from right to left, 90ms stagger)
  if (!isReduced && tiles.length > 0) {
    gsap.set(tiles, { x: 50, opacity: 0 });

    ScrollTrigger.create({
      trigger: "#gallery",
      start: "top 75%",
      onEnter: () => {
        gsap.to(tiles, {
          x: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.09,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)"
        });
      }
    });
  }

  // 2. Progress bar tracking
  function updateProgress() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      if (progressFill) progressFill.style.width = "100%";
      return;
    }
    const percent = Math.min(100, Math.max(0, (track.scrollLeft / maxScroll) * 100));
    if (progressFill) {
      progressFill.style.width = `${percent.toFixed(1)}%`;
    }
  }

  track.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  // 3. Arrow buttons (scrollBy tile width + gap)
  function getScrollStep() {
    const first = track.querySelector(".gallery-tile");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    return (first ? first.getBoundingClientRect().width : 300) + gap;
  }

  prevBtn?.addEventListener("click", () => {
    track.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
  });

  nextBtn?.addEventListener("click", () => {
    track.scrollBy({ left: getScrollStep(), behavior: "smooth" });
  });

  // 4. Drag to scroll on desktop with pointer events
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener("mousedown", (e) => {
    isDown = true;
    track.classList.add("is-dragging");
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener("mouseleave", () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("is-dragging");
  });

  track.addEventListener("mouseup", () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("is-dragging");
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    track.scrollLeft = scrollLeft - walk;
  });
}

