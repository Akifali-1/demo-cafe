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

  gsap.set(cupCenter, { x: 0, xPercent: -50, rotate: 0, y: 0 });

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
    );

  // Scroll parallax on the hero cup
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
}
