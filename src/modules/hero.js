import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND } from '../data/content.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const orderBtns = document.querySelectorAll('[data-wa-order]');
  orderBtns.forEach((btn) => {
    const customMsg = btn.getAttribute('data-wa-message');
    btn.setAttribute('href', buildWhatsAppUrl(customMsg || BRAND.whatsappDefaultMessage));
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

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

  // Lock initial X transforms so GSAP doesn't overwrite CSS positioning
  gsap.set(cupCenter, { xPercent: 0, rotate: 0 });
  gsap.set(cupLeft, { xPercent: -125, rotate: -8 });
  gsap.set(cupRight, { xPercent: 25, rotate: 8 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from([eyebrow, headline, script], {
    opacity: 0,
    y: 28,
    duration: 0.85,
    stagger: 0.1,
  })
    .from(
      [sub, ctas],
      {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.1,
      },
      '-=0.45'
    )
    .from(
      cupCenter,
      {
        opacity: 0,
        y: 60,
        scale: 0.92,
        duration: 0.9,
      },
      '-=0.5'
    )
    .from(
      [cupLeft, cupRight],
      {
        opacity: 0,
        y: 50,
        scale: 0.88,
        duration: 0.85,
        stagger: 0.1,
      },
      '-=0.65'
    );

  // Subtle scroll parallax on cups
  gsap.to(cupCenter, {
    y: -32,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  });

  gsap.to([cupLeft, cupRight], {
    y: -16,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  });
}
