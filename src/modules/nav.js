// Navigation Module: sticky behavior, hide on scroll down, mobile overlay
import gsap from "gsap";

export function initNav() {
  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  let lastScrollY = window.scrollY;
  let isMenuOpen = false;

  // Handle sticky & show/hide on scroll
  function handleScroll(scrollY) {
    if (isMenuOpen) return;

    if (scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    // Scroll down: hide, Scroll up: show
    if (scrollY > 120 && scrollY > lastScrollY + 8) {
      header.classList.add("is-hidden");
    } else if (scrollY < lastScrollY - 8 || scrollY <= 120) {
      header.classList.remove("is-hidden");
    }

    lastScrollY = scrollY;
  }

  // Hook scroll event
  window.addEventListener("scroll", () => handleScroll(window.scrollY), { passive: true });

  // Toggle mobile menu
  function toggleMenu(open) {
    isMenuOpen = typeof open === "boolean" ? open : !isMenuOpen;
    navToggle.classList.toggle("is-active", isMenuOpen);
    navToggle.setAttribute("aria-expanded", isMenuOpen);
    mobileMenu.classList.toggle("is-open", isMenuOpen);
    mobileMenu.setAttribute("aria-hidden", !isMenuOpen);

    if (isMenuOpen) {
      header.classList.remove("is-hidden");
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        mobileLinks,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "";
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => toggleMenu());
  }

  // Close mobile menu on link click
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  // Close on Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) {
      toggleMenu(false);
    }
  });

  return { handleScroll };
}

