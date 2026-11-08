// Main Entry Point
// Boot order: fonts, smooth scroll, reveals, then modules

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSmoothScroll } from "./modules/smoothScroll.js";
import { initReveals } from "./modules/reveal.js";
import { initNav } from "./modules/nav.js";
import { initHero } from "./modules/hero.js";
import { initMenuCarousel } from "./modules/menuCarousel.js";
import { initGallery } from "./modules/gallery.js";
import { initMap } from "./modules/map.js";
import { initOffer } from "./modules/offer.js";

async function bootApp() {
  try {
    // 1. Non-blocking font readiness: refresh ScrollTrigger layout when web fonts load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // 2. Initialize smooth scrolling with Lenis & GSAP ScrollTrigger
    initSmoothScroll();

    // 3. Initialize section reveals & scroll triggers
    initReveals();

    // 4. Initialize application modules
    initNav();
    initHero();
    initMenuCarousel();
    initGallery();
    initMap();
    initOffer();

    console.log("☕ Demo Cafe initialized smoothly.");
  } catch (err) {
    console.error("Boot error:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}
