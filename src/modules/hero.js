// Hero Section Module: entrance sequence, scroll parallax, magnetic button
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const headingLines = document.querySelectorAll(".hero-heading-line-inner");
  const scriptAccent = document.querySelector(".hero-script-accent");
  const heroMiddleCup = document.getElementById("hero-cup-middle");
  const heroLeftCup = document.getElementById("hero-cup-left");
  const heroRightCup = document.getElementById("hero-cup-right");
  const heroHeading = document.getElementById("hero-title");
  const heroMagneticBtn = document.querySelector(".hero-btn-magnetic");

  if (prefersReduced) {
    // Keep everything clean & visible without animations
    gsap.set([headingLines, scriptAccent, heroMiddleCup, heroLeftCup, heroRightCup], {
      opacity: 1,
      y: 0,
      rotate: -6
    });
    return;
  }

  // Set initial runtime hidden states (middle cup stays at opacity 1 for instant LCP)
  gsap.set(headingLines, { y: "115%", opacity: 0 });
  if (scriptAccent) {
    gsap.set(scriptAccent, { opacity: 0, y: 20, rotate: -10 });
  }
  gsap.set([heroLeftCup, heroRightCup], { y: 30, opacity: 0 });
  gsap.set(heroMiddleCup, { y: 25 });

  // 1. Entrance timeline (~1.4s total)
  const entranceTl = gsap.timeline({ defaults: { ease: "cubic-bezier(0.16, 1, 0.3, 1)" } });

  entranceTl
    .to(headingLines, {
      y: "0%",
      opacity: 1,
      duration: 0.9,
      stagger: 0.08
    })
    .to(
      scriptAccent,
      {
        opacity: 1,
        y: 0,
        rotate: -6,
        duration: 0.8
      },
      "-=0.4"
    )
    .to(
      heroMiddleCup,
      {
        y: 0,
        duration: 0.9
      },
      "-=0.6"
    )
    .to(
      [heroLeftCup, heroRightCup],
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12
      },
      "-=0.7"
    );

  // 2. Hero Scroll Parallax
  // Cups parallax at different speeds: left 0.08, middle 0.16, right 0.05
  if (heroLeftCup) {
    gsap.to(heroLeftCup, {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  if (heroMiddleCup) {
    gsap.to(heroMiddleCup, {
      y: -120,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  if (heroRightCup) {
    gsap.to(heroRightCup, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // Heading moves up at ~0.3 scroll speed and fades to 0.6 opacity
  if (heroHeading) {
    gsap.to(heroHeading, {
      y: -90,
      opacity: 0.6,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // 3. Optional Magnetic pull on primary button (desktop fine pointer only)
  if (heroMagneticBtn && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    heroMagneticBtn.addEventListener("mousemove", (e) => {
      const rect = heroMagneticBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const pullX = Math.max(-6, Math.min(6, x * 0.2));
      const pullY = Math.max(-6, Math.min(6, y * 0.2));

      gsap.to(heroMagneticBtn, {
        x: pullX,
        y: pullY,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    heroMagneticBtn.addEventListener("mouseleave", () => {
      gsap.to(heroMagneticBtn, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: "power2.out"
      });
    });
  }
}
