import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const copy = hero.querySelectorAll('.hero__eyebrow, .hero__line, .hero__script, .hero__sub, .hero__ctas, .hero__stats');
  const disc = hero.querySelector('.hero__disc');
  const cups = {
    left: hero.querySelector('.hero__cup--left'),
    center: hero.querySelector('.hero__cup--center'),
    right: hero.querySelector('.hero__cup--right'),
  };
  const rot = { left: -7, center: 0, right: 7 };

  // The cups are centred on their own left edge via xPercent; GSAP owns the transform.
  Object.entries(cups).forEach(([k, el]) => el && gsap.set(el, { xPercent: -50, rotate: rot[k] }));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from(copy, { opacity: 0, y: 24, duration: 0.8, stagger: 0.08 })
    .from(disc, { scale: 0.7, opacity: 0, duration: 1, xPercent: 0 }, 0.1)
    .from(cups.center, { opacity: 0, y: 60, duration: 0.9 }, 0.35)
    .from([cups.left, cups.right], { opacity: 0, y: 50, duration: 0.9, stagger: 0.1 }, 0.5);

  // Gentle parallax: side cups drift at different speeds
  [[cups.center, -26], [cups.left, -44], [cups.right, -14]].forEach(([el, y]) => {
    if (!el) return;
    gsap.to(el, {
      y,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5 },
    });
  });
}
