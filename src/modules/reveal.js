// Reveal Animations: line masks, clip-path image reveals, SVG stroke drawing
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initReveals() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    // When reduced motion is preferred, simple fade in
    gsap.set(".line-mask-inner, .clip-reveal-frame, .clip-reveal-img, .draw-icon", {
      opacity: 1,
      y: 0,
      clipPath: "none",
      scale: 1
    });
    return;
  }

  // 1. Reveal H2 headings by line mask when 25% visible
  const headings = document.querySelectorAll("h2");
  headings.forEach((heading) => {
    const lines = heading.querySelectorAll(".line-mask-inner");
    const scriptAccent = heading.parentElement.querySelector(".script-accent") || heading.querySelector(".script-accent");

    if (lines.length > 0) {
      gsap.set(lines, { y: "110%", opacity: 0 });
      if (scriptAccent) {
        gsap.set(scriptAccent, { opacity: 0, y: 15, rotate: -10 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      tl.to(lines, {
        y: "0%",
        opacity: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)"
      });

      if (scriptAccent) {
        tl.to(
          scriptAccent,
          {
            opacity: 1,
            y: 0,
            rotate: -6,
            duration: 0.8,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)"
          },
          "+=0.2"
        );
      }
    }
  });

  // 2. Feature & Visit Photo Reveals: clip-path inset(100% 0 0 0) -> inset(0 0 0 0) over 1.4s
  const clipFrames = document.querySelectorAll(".clip-reveal-frame");
  clipFrames.forEach((frame) => {
    const img = frame.querySelector(".clip-reveal-img");
    gsap.set(frame, { clipPath: "inset(100% 0 0 0)" });
    if (img) gsap.set(img, { scale: 1.15 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: frame,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.to(frame, {
      clipPath: "inset(0% 0 0 0)",
      duration: 1.4,
      ease: "cubic-bezier(0.16, 1, 0.3, 1)"
    });

    if (img) {
      tl.to(
        img,
        {
          scale: 1,
          duration: 1.4,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)"
        },
        "<"
      );
    }
  });

  // 3. Feature items and Visit cards: slide in with stagger & SVG draw strokes
  const visitCards = document.querySelectorAll(".visit-feature-card");
  if (visitCards.length > 0) {
    gsap.set(visitCards, { x: 40, opacity: 0 });

    ScrollTrigger.create({
      trigger: "#visit-features-list",
      start: "top 78%",
      onEnter: () => {
        gsap.to(visitCards, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)"
        });

        // Trigger stroke draw
        visitCards.forEach((card) => {
          const icons = card.querySelectorAll(".draw-icon");
          icons.forEach((icon) => {
            icon.classList.add("is-drawn");
          });
        });
      }
    });
  }

  // 4. Visit Image slow parallax
  const visitParallaxImg = document.getElementById("visit-parallax-img");
  if (visitParallaxImg) {
    gsap.to(visitParallaxImg, {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: "#visit",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }
}
