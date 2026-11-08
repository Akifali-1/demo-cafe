import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const eyebrow = hero.querySelector('.hero__eyebrow');
  const headline = hero.querySelector('.hero__headline');
  const script = hero.querySelector('.hero__script');
  const sub = hero.querySelector('.hero__sub');
  const ctas = hero.querySelector('.hero__ctas');

  const cupCenter = hero.querySelector('.hero__cup--center');
  const cupLeft = hero.querySelector('.hero__cup--left');
  const cupRight = hero.querySelector('.hero__cup--right');

  // Lock explicit xPercent so GSAP keeps the trio centered with equal spacing
  const isMobile = window.innerWidth <= 640;
  const leftX = isMobile ? -88 : -90;
  const rightX = isMobile ? 12 : 18;

  gsap.set(cupCenter, { x: 0, xPercent: -50, rotate: 0, y: 0 });
  gsap.set(cupLeft, { x: 0, xPercent: leftX, rotate: -6, y: 0 });
  gsap.set(cupRight, { x: 0, xPercent: rightX, rotate: 6, y: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from([eyebrow, headline, script], {
    opacity: 0,
    y: 24,
    duration: 0.8,
    stagger: 0.1,
  })
    .from(
      [sub, ctas],
      {
        opacity: 0,
        y: 18,
        duration: 0.65,
        stagger: 0.08,
      },
      '-=0.4'
    )
    .from(
      cupCenter,
      {
        opacity: 0,
        y: 50,
        scale: 0.92,
        duration: 0.85,
      },
      '-=0.45'
    )
    .from(
      [cupLeft, cupRight],
      {
        opacity: 0,
        y: 40,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.08,
      },
      '-=0.6'
    );

  // Scroll parallax on the 3 hero cups
  gsap.to(cupCenter, {
    y: -28,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    },
  });

  gsap.to(cupLeft, {
    y: -14,
    xPercent: leftX - 6,
    rotate: -9,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    },
  });

  gsap.to(cupRight, {
    y: -14,
    xPercent: rightX + 6,
    rotate: 9,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    },
  });
}
