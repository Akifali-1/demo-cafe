import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initReveal() {
  // 1. Data-reveal groups (generic stagger reveals)
  const groups = document.querySelectorAll('[data-reveal-group]');
  groups.forEach((group) => {
    const items = group.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 84%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // 2. Headings with line-mask reveal
  const headings = document.querySelectorAll('h2');
  headings.forEach((heading) => {
    const lines = heading.querySelectorAll('.line-mask-inner');
    const scriptAccent =
      heading.parentElement?.querySelector('.script-accent') ||
      heading.querySelector('.script-accent');

    if (lines.length > 0) {
      gsap.fromTo(
        lines,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (scriptAccent) {
        gsap.fromTo(
          scriptAccent,
          { opacity: 0, y: 15, rotate: -10 },
          {
            opacity: 1,
            y: 0,
            rotate: -6,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }
  });

  // 3. Photo Clip-Path Reveals (.clip-reveal-frame)
  const clipFrames = document.querySelectorAll('.clip-reveal-frame');
  clipFrames.forEach((frame) => {
    const img = frame.querySelector('.clip-reveal-img');
    gsap.fromTo(
      frame,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: frame,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.15 },
        {
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: frame,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  });

  // 4. Visit feature cards + SVG icon draw
  const visitList = document.querySelector('#visit-features-list');
  if (visitList) {
    const visitCards = visitList.querySelectorAll('.visit-feature-card');
    gsap.fromTo(
      visitCards,
      { x: 30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: visitList,
          start: 'top 82%',
          toggleActions: 'play none none none',
          onEnter: () => {
            visitCards.forEach((card) => {
              card.querySelectorAll('.draw-icon').forEach((icon) => icon.classList.add('is-drawn'));
            });
          },
        },
      }
    );
  }

  // 5. Visit Image slow parallax
  const visitParallaxImg = document.getElementById('visit-parallax-img');
  if (visitParallaxImg) {
    gsap.to(visitParallaxImg, {
      y: -28,
      ease: 'none',
      scrollTrigger: {
        trigger: '#visit',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}

export const initReveals = initReveal;
