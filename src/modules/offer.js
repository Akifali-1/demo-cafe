// Offer Section Module: rotating badge, hover speed acceleration with GSAP tween
import gsap from "gsap";
import { content } from "../data/content.js";

export function initOffer() {
  const badge = document.getElementById("offer-badge");
  const offerBtn = document.getElementById("offer-cta-btn");

  if (!badge) return;

  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set WhatsApp link from content.js
  if (offerBtn) {
    offerBtn.href = `https://wa.me/${content.brand.phoneRaw}?text=${encodeURIComponent(content.offer.message)}`;
  }

  badge.style.cursor = "pointer";
  badge.addEventListener("click", () => {
    window.open(
      `https://wa.me/${content.brand.phoneRaw}?text=${encodeURIComponent(content.offer.message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });

  if (isReduced) return;

  // Continuous 360 rotation every 18s linear forever
  const rotationTween = gsap.to(badge, {
    rotation: 360,
    duration: 18,
    repeat: -1,
    ease: "none",
    transformOrigin: "center center"
  });

  // On hover, timeScale increases so rotation speeds up from 18s to 8s (timeScale 18 / 8 = 2.25)
  badge.addEventListener("mouseenter", () => {
    gsap.to(rotationTween, {
      timeScale: 2.25,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  badge.addEventListener("mouseleave", () => {
    gsap.to(rotationTween, {
      timeScale: 1.0,
      duration: 0.8,
      ease: "power2.inOut"
    });
  });
}
