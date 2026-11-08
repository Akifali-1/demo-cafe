// Smooth Scrolling with Lenis and GSAP integration
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export let lenisInstance = null;

export function initSmoothScroll() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll Progress Bar
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(progressBar, { scaleX: self.progress });
      }
    });
  }

  if (prefersReduced) {
    document.documentElement.classList.add("is-reduced-motion");
    return null;
  }

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });

  // Connect Lenis to ScrollTrigger
  lenisInstance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function scrollToPosition(target, duration = 0.9) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration });
  } else {
    gsap.to(window, {
      scrollTo: target,
      duration,
      ease: "power3.inOut"
    });
  }
}
