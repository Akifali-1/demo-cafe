// Menu Carousel Module: shallow elliptical ring, smoothed physics, active drink floating,
// line-mask text transitions, keyboard, swipe, and ScrollTrigger integration.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { content } from "../data/content.js";
import { scrollToPosition } from "./smoothScroll.js";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function initMenuCarousel() {
  const items = content.menu.items;
  const itemsCount = items.length;

  const wrapper = document.getElementById("menu-carousel-wrapper");
  const stage = document.getElementById("menu-stage");
  const ellipseStage = document.getElementById("menu-ellipse-stage");
  const container = document.getElementById("menu-items-container");
  const counterEl = document.getElementById("menu-counter");
  const prevBtn = document.getElementById("menu-prev-btn");
  const nextBtn = document.getElementById("menu-next-btn");
  const dotsContainer = document.getElementById("menu-dots");
  const floorShadow = document.getElementById("menu-floor-shadow");
  const spotlight = document.querySelector(".menu-spotlight");

  const nameEl = document.getElementById("menu-active-name");
  const descEl = document.getElementById("menu-active-desc");
  const priceEl = document.getElementById("menu-active-price");
  const orderLink = document.getElementById("menu-active-order");

  if (!wrapper || !stage || !container) return;

  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Geometry constants
  const THETA_STEP = 0.62; // radians per step
  let current = 0;
  let target = 0;
  let activeIndex = 0;
  let hasUserInteracted = false;
  let autoplayTimer = null;
  let isHovered = false;
  let isFocused = false;
  let scrollTriggerInstance = null;

  // Set wrapper height: 100vh + (items - 1) * 60vh
  wrapper.style.height = `calc(100vh + ${(itemsCount - 1) * 60}vh)`;

  // Generate drink elements
  container.innerHTML = "";
  const drinkElements = [];

  items.forEach((item, i) => {
    const el = document.createElement("div");
    el.className = "menu-drink-item";
    el.id = `drink-item-${i}`;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `${item.name}, ${item.price} rupees`);
    el.setAttribute("tabindex", "0");

    el.innerHTML = `
      <img
        src="${item.cutout}"
        alt="${item.alt || item.name}"
        class="menu-drink-cutout"
        width="240"
        height="310"
        loading="${i < 3 ? 'eager' : 'lazy'}"
        decoding="async"
      />
    `;

    el.addEventListener("click", () => {
      hasUserInteracted = true;
      stopAutoplay();
      scrollToIndex(i);
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        hasUserInteracted = true;
        stopAutoplay();
        scrollToIndex(i);
      }
    });

    container.appendChild(el);
    drinkElements.push(el);
  });

  // Generate dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    items.forEach((item, i) => {
      const dot = document.createElement("button");
      dot.className = `menu-card-dot ${i === 0 ? "is-active" : ""}`;
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Go to ${item.name}`);
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");

      dot.addEventListener("click", () => {
        hasUserInteracted = true;
        stopAutoplay();
        scrollToIndex(i);
      });

      dotsContainer.appendChild(dot);
    });
  }

  // Text update with line mask animation
  function updateActiveDrink(idx) {
    if (idx === activeIndex && nameEl.textContent === items[idx].name) return;
    activeIndex = idx;
    const item = items[idx];

    // Counter
    if (counterEl) {
      counterEl.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(itemsCount).padStart(2, "0")}`;
    }

    // Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".menu-card-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === idx);
        dot.setAttribute("aria-selected", i === idx ? "true" : "false");
      });
    }

    // Floating idle class on active element
    drinkElements.forEach((el, i) => {
      if (i === idx) {
        el.classList.add("is-floating");
      } else {
        el.classList.remove("is-floating");
      }
    });

    if (floorShadow) {
      floorShadow.classList.add("is-shadow-pulsing");
    }

    // Text Transition: 500ms line-mask slide
    if (nameEl && descEl) {
      gsap.to([nameEl, descEl], {
        y: -14,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          nameEl.textContent = item.name;
          descEl.textContent = item.description;
          if (priceEl) priceEl.textContent = `₹${item.price}`;
          if (orderLink) {
            orderLink.href = `https://wa.me/${content.brand.phoneRaw}?text=${encodeURIComponent(`Hi, I would like to order the ${item.name} from Demo Cafe.`)}`;
          }

          gsap.fromTo(
            [nameEl, descEl],
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }
          );
        }
      });
    }
  }

  // Scroll to index helper
  function scrollToIndex(index) {
    const clamped = Math.max(0, Math.min(itemsCount - 1, index));
    if (scrollTriggerInstance) {
      const start = scrollTriggerInstance.start;
      const end = scrollTriggerInstance.end;
      const y = start + (clamped / (itemsCount - 1)) * (end - start);
      scrollToPosition(y, 0.9);
    } else {
      target = clamped;
    }
  }

  // Reduced motion mode fallback
  if (isReduced) {
    stage.classList.add("is-reduced-motion");
    drinkElements[0].classList.add("is-active");

    prevBtn?.addEventListener("click", () => {
      const nextIdx = (activeIndex - 1 + itemsCount) % itemsCount;
      switchReducedDrink(nextIdx);
    });

    nextBtn?.addEventListener("click", () => {
      const nextIdx = (activeIndex + 1) % itemsCount;
      switchReducedDrink(nextIdx);
    });

    function switchReducedDrink(idx) {
      drinkElements.forEach((el, i) => {
        el.classList.toggle("is-active", i === idx);
      });
      updateActiveDrink(idx);
    }

    updateActiveDrink(0);
    return;
  }

  // Desktop & Mobile Pinned ScrollTrigger
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: wrapper,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.8,
    snap: {
      snapTo: 1 / (itemsCount - 1),
      duration: { min: 0.25, max: 0.6 },
      ease: "power2.out"
    },
    onUpdate: (self) => {
      target = self.progress * (itemsCount - 1);
    }
  });

  // Smoothing Render Loop (rAF)
  let rafId;
  function updateCarousel() {
    const diff = target - current;
    if (Math.abs(diff) > 0.0005) {
      current += diff * 0.1;
    } else {
      current = target;
    }

    const stageWidth = ellipseStage ? ellipseStage.clientWidth : 960;
    const stageHeight = ellipseStage ? ellipseStage.clientHeight : 380;
    const isMobile = window.innerWidth <= 600;

    // Tune ellipse radiuses inside the showcase card
    const rx = isMobile ? 0.35 * stageWidth : 0.38 * stageWidth;
    const ry = isMobile ? 0.18 * stageHeight : 0.22 * stageHeight;
    const maxOffset = isMobile ? 1.6 : 2.4;

    drinkElements.forEach((el, i) => {
      const o = i - current;
      const absO = Math.abs(o);

      if (absO > maxOffset) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        return;
      }

      el.style.visibility = "visible";
      el.style.pointerEvents = absO < 0.5 ? "auto" : "none";

      const theta = o * THETA_STEP;
      const x = Math.sin(theta) * rx;
      const y = (Math.cos(theta) - 1) * ry; // Recedes smoothly upward
      const scale = 0.5 + 0.5 * Math.cos(theta);
      const opacity = Math.min(1, Math.max(0, 0.2 + 0.8 * Math.cos(theta)));
      const blur = (1 - Math.cos(theta)) * 6;
      const zIndex = Math.round(Math.cos(theta) * 100);

      el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = zIndex;

      if (blur > 0.5) {
        el.style.filter = `blur(${blur.toFixed(1)}px)`;
      } else {
        el.style.filter = "none";
      }
    });

    // Floor shadow tracking under active drink
    if (floorShadow) {
      const activeO = Math.round(current) - current;
      const shadowX = Math.sin(activeO * THETA_STEP) * rx;
      floorShadow.style.transform = `translateX(calc(-50% + ${shadowX.toFixed(2)}px)) scale(${Math.max(0.7, 1 - Math.abs(activeO) * 0.3).toFixed(2)})`;
    }

    // Spotlight tracking behind active drink
    if (spotlight) {
      const activeO = Math.round(current) - current;
      const spotX = Math.sin(activeO * THETA_STEP) * rx * 0.35;
      spotlight.style.transform = `translate(calc(-50% + ${spotX.toFixed(2)}px), -50%)`;
    }

    // Active drink change threshold
    const roundedActive = Math.round(current);
    if (roundedActive !== activeIndex && roundedActive >= 0 && roundedActive < itemsCount) {
      updateActiveDrink(roundedActive);
    }

    rafId = requestAnimationFrame(updateCarousel);
  }

  rafId = requestAnimationFrame(updateCarousel);

  // Buttons
  prevBtn?.addEventListener("click", () => {
    hasUserInteracted = true;
    stopAutoplay();
    scrollToIndex(activeIndex - 1);
  });

  nextBtn?.addEventListener("click", () => {
    hasUserInteracted = true;
    stopAutoplay();
    scrollToIndex(activeIndex + 1);
  });

  // Keyboard navigation
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      hasUserInteracted = true;
      stopAutoplay();
      scrollToIndex(activeIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      hasUserInteracted = true;
      stopAutoplay();
      scrollToIndex(activeIndex + 1);
    }
  });

  // Autoplay Logic
  function startAutoplay() {
    if (hasUserInteracted || autoplayTimer) return;
    autoplayTimer = setInterval(() => {
      if (!isHovered && !isFocused && scrollTriggerInstance && scrollTriggerInstance.isActive) {
        const nextIdx = (activeIndex + 1) % itemsCount;
        scrollToIndex(nextIdx);
      }
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  stage.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  stage.addEventListener("mouseleave", () => {
    isHovered = false;
  });

  stage.addEventListener("focus", () => {
    isFocused = true;
  });

  stage.addEventListener("blur", () => {
    isFocused = false;
  });

  // Start initial autoplay after 5 seconds
  setTimeout(startAutoplay, 5000);

  // Touch Swipe for Mobile (40px threshold, horizontal only)
  let startX = 0;
  let startY = 0;
  let isSwiping = false;

  stage.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
      }
    },
    { passive: true }
  );

  stage.addEventListener(
    "touchend",
    (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Ensure horizontal swipe dominant
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        hasUserInteracted = true;
        stopAutoplay();
        if (deltaX < 0) {
          scrollToIndex(activeIndex + 1);
        } else {
          scrollToIndex(activeIndex - 1);
        }
      }
    },
    { passive: true }
  );

  // Initialize first drink info
  updateActiveDrink(0);

  return () => {
    cancelAnimationFrame(rafId);
    stopAutoplay();
    scrollTriggerInstance?.kill();
  };
}

