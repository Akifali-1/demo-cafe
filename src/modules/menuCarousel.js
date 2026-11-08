import { gsap } from 'gsap';
import { MENU_ITEMS, BRAND } from '../data/content.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';

export function initMenuCarousel() {
  const section = document.querySelector('#menu');
  if (!section) return;

  const stage = section.querySelector('[data-carousel-stage]');
  const titleEl = section.querySelector('[data-carousel-title]');
  const descEl = section.querySelector('[data-carousel-desc]');
  const priceEl = section.querySelector('[data-carousel-price]');
  const orderEl = section.querySelector('[data-carousel-order]');
  const counterEl = section.querySelector('[data-carousel-counter]');
  const dotsWrap = section.querySelector('[data-carousel-dots]');
  const prevBtn = section.querySelector('[data-carousel-prev]');
  const nextBtn = section.querySelector('[data-carousel-next]');

  const items = MENU_ITEMS;
  const total = items.length;
  let activeIndex = 0;

  // Build item DOM nodes
  const itemEls = items.map((item, idx) => {
    const div = document.createElement('div');
    div.className = 'carousel__item';
    div.dataset.index = idx;
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '-1');
    div.setAttribute('aria-label', `Select ${item.name}`);

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.loading = idx < 3 ? 'eager' : 'lazy';
    img.decoding = 'async';

    div.appendChild(img);
    stage.appendChild(div);

    div.addEventListener('click', () => {
      if (idx !== activeIndex) goTo(idx);
    });

    return div;
  });

  // Build pagination dots
  const dotEls = items.map((item, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'carousel__dot';
    btn.setAttribute('aria-label', `Go to ${item.name}`);
    btn.addEventListener('click', () => goTo(idx));
    dotsWrap.appendChild(btn);
    return btn;
  });

  function getSpread() {
    const w = window.innerWidth;
    if (w < 520) return 120;
    if (w < 820) return 175;
    if (w < 1100) return 220;
    return 255;
  }

  // Shortest circular distance so both left and right sides always show neighbour cups
  function getWrappedOffset(index, active, length) {
    let diff = index - active;
    const half = Math.floor(length / 2);
    if (diff > half) diff -= length;
    if (diff < -half) diff += length;
    return diff;
  }

  function layoutItems(animate = true) {
    const spread = getSpread();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dur = animate && !reduced ? 0.65 : 0;

    itemEls.forEach((el, i) => {
      const offset = getWrappedOffset(i, activeIndex, total);
      const abs = Math.abs(offset);
      const visible = abs <= 2;

      const x = offset * spread;
      const y = abs === 0 ? -6 : abs === 1 ? 14 : 28;
      const scale = abs === 0 ? 1.08 : abs === 1 ? 0.68 : 0.46;
      const opacity = !visible ? 0 : abs === 0 ? 1 : abs === 1 ? 0.55 : 0.25;
      const blur = abs === 0 ? 0 : abs === 1 ? 2.5 : 5;
      const zIndex = 10 - abs;

      el.style.zIndex = String(zIndex);
      el.style.pointerEvents = visible ? 'auto' : 'none';

      gsap.to(el, {
        xPercent: -50,
        yPercent: -50,
        x,
        y,
        scale,
        opacity,
        filter: `blur(${blur}px) drop-shadow(0 18px 28px rgba(28, 17, 13, 0.20))`,
        duration: dur,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  }

  function updateMeta(animate = true) {
    const item = items[activeIndex];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const applyContent = () => {
      titleEl.textContent = item.name;
      descEl.textContent = item.description;
      priceEl.textContent = `${BRAND.currency}${item.price}`;
      orderEl.href = buildWhatsAppUrl(
        `Hi ${BRAND.name}! I'd like to order the ${item.name} (${BRAND.currency}${item.price}).`
      );
      const pad = (n) => String(n).padStart(2, '0');
      counterEl.textContent = `${pad(activeIndex + 1)} / ${pad(total)}`;

      dotEls.forEach((d, idx) => {
        d.classList.toggle('is-active', idx === activeIndex);
      });
    };

    if (!animate || reduced) {
      applyContent();
      return;
    }

    gsap.to([titleEl, descEl, priceEl], {
      opacity: 0,
      y: 8,
      duration: 0.16,
      ease: 'power2.in',
      onComplete: () => {
        applyContent();
        gsap.fromTo(
          [titleEl, descEl, priceEl],
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.32, stagger: 0.04, ease: 'power2.out' }
        );
      },
    });
  }

  function goTo(index, animate = true) {
    activeIndex = (index + total) % total;
    layoutItems(animate);
    updateMeta(animate);
  }

  prevBtn?.addEventListener('click', () => goTo(activeIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(activeIndex + 1));

  // Keyboard navigation
  section.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(activeIndex + 1);
    }
  });

  // Touch swipe support
  let startX = 0;
  let startY = 0;
  let tracking = false;

  stage.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    },
    { passive: true }
  );

  stage.addEventListener(
    'touchend',
    (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) goTo(activeIndex + 1);
        else goTo(activeIndex - 1);
      }
    },
    { passive: true }
  );

  // Relayout on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => layoutItems(false), 120);
  });

  // Initial render
  gsap.set(itemEls, { xPercent: -50, yPercent: -50 });
  goTo(0, false);
}
