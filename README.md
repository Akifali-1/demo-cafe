# Demo Cafe — Premium Independent Cafe Website

A high-performance, editorial single-page website crafted for independent specialty cafes in Hyderabad. Built with pure vanilla JavaScript, CSS custom properties, GSAP 3 with ScrollTrigger, Lenis smooth scrolling, and Leaflet maps.

Designed with an asymmetric, warm editorial layout inspired by summer mornings, specialty espresso roasteries, and artisanal cold brew houses.

---

## 🛠 Tech Stack

- **Vite** (Vanilla JavaScript template — zero React/framework overhead, static production build)
- **Plain CSS3** with design tokens (`tokens.css`, `base.css`, `layout.css`, `sections.css`, `animations.css`)
- **GSAP 3** (`ScrollTrigger`, `ScrollToPlugin`) for physics-based scroll-linked animations and reveals
- **Lenis** for smooth wheel and momentum scrolling connected to GSAP's RAF ticker
- **Leaflet** with OpenStreetMap tiles, custom matcha halo pins, and warm sepia tile filter
- **Google Fonts** (`Bricolage Grotesque`, `Pinyon Script`, `DM Sans` with `display=swap` and preconnect)
- **rembg** + Pillow for transparent drink cutouts with warm editorial color grading

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Static assets will be compiled into the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```
Runs a local preview of the production build at [http://localhost:4173](http://localhost:4173).

---

## 🎨 Customization Guide

### Editing Copy, Prices, Hours, and Locations
All text, drink descriptions, prices in INR, operating hours, addresses, WhatsApp numbers, and social links live in one central location:
```
src/data/content.js
```
The HTML holds semantic structure only. Modifying `src/data/content.js` automatically propagates across the navigation, hero, feature story, interactive menu carousel, locations, WhatsApp links, and footer.

### Changing Brand Colors
All colors are defined as CSS custom properties on `:root` in:
```
src/styles/tokens.css
```
Tokens include:
- `--cream: #F6F0E7` — Main background
- `--paper: #FBF8F3` — Cards, carousel stage showcase
- `--sand: #EADFCF` — Secondary surface background
- `--espresso: #2A1B12` — Primary typography & buttons
- `--mocha: #6B5444` — Secondary body copy
- `--terracotta: #C8643B` — Script accents & interactive highlights
- `--matcha: #8A9A6B` — Matcha highlight & pulsing map halo
- `--line: rgba(42, 27, 18, 0.12)` — Editorial dividers

### Swapping Images and Drink Cutouts
All images live in `public/images/`:
- **Hero Cutout Cluster (Transparent 2x PNG cutouts with ice & condensation):**
  - `hero-cup-center.png` (Iced Caramel Latte, foreground center)
  - `hero-cup-left.png` (Iced Chocolate Frappe, background left)
  - `hero-cup-right.png` (Iced Matcha Latte, background right)
- **Menu Carousel Cutouts (Transparent PNG cutouts, normalized visual height, centered):**
  - `cutout-caramel-latte.png`
  - `cutout-cold-brew.png`
  - `cutout-matcha-latte.png`
  - `cutout-mango-cooler.png`
  - `cutout-vanilla-iced-coffee.png`
  - `cutout-iced-americano.png`
  - `cutout-cold-chocolate.png`
  - `cutout-lemon-iced-tea.png`
- **Section & Gallery Photos (WebP, quality 78, warm grade):**
  - `feature-pour.webp` (1200px wide)
  - `visit-cafe-interior.webp` (1200px wide)
  - `gallery-1.webp` through `gallery-6.webp` (900px wide)
  - `og-image.jpg` (1200 × 630 Open Graph preview)

### Image Processing Scripts
- `process_all_images.py`: Automated download, background removal with rembg, and normalization for stock photos.
- `compress_pngs.py`: 256-color fast-octree alpha quantization script that shrinks total images folder weight to ~2.3 MB.

---

## 📂 Project Architecture

```
demo-cafe/
├── index.html                    # Semantic HTML5 shell with full no-JS fallback
├── package.json                  # Dependencies: gsap, lenis, leaflet, vite
├── README.md                     # Documentation & operational guide
├── public/
│   ├── favicon.svg               # Minimalist cafe cup SVG icon
│   └── images/                   # Optimized WebP photos and PNG drink cutouts
├── src/
│   ├── main.js                   # Application bootstrap & lifecycle orchestrator
│   ├── data/
│   │   └── content.js            # Single source of truth for text, prices, data
│   ├── modules/
│   │   ├── nav.js                # Sticky header, hide-on-scroll, mobile menu
│   │   ├── hero.js               # Entrance timeline, scroll parallax, magnetic CTA
│   │   ├── reveal.js             # Line mask reveals, photo clip paths, stroke draw
│   │   ├── menuCarousel.js       # Shallow elliptical 3D stage & smoothed physics
│   │   ├── gallery.js            # Drag-to-scroll, arrow step, progress tracking
│   │   ├── map.js                # Leaflet map, custom pins, pulsing matcha halo
│   │   ├── offer.js              # Rotating badge, GSAP hover timeScale tween
│   │   └── smoothScroll.js       # Lenis smooth scrolling connected to ScrollTrigger
│   └── styles/
│       ├── tokens.css            # Colors, type scale, radiuses, easing curves
│       ├── base.css              # Reset, typography, button styles, focus rings
│       ├── layout.css            # 12-column grid, responsive breakpoints
│       ├── sections.css          # Editorial layouts for all sections
│       └── animations.css        # Keyframes, line masks, clip paths, reduced motion
```

---

## ⚡ Motion & Interaction Details

1. **Menu Carousel:**
   - Elliptical shallow stage formula:
     $$\theta = (i - \text{current}) \times 0.62$$
     $$x = \sin(\theta) \times r_x, \quad y = (\cos(\theta) - 1) \times r_y$$
     $$\text{scale} = 0.5 + 0.5 \times \cos(\theta), \quad \text{opacity} = 0.2 + 0.8 \times \cos(\theta)$$
   - Active drink floats on an idle sine wave ($4\text{s}$ loop, $6\text{px}$ bob) with synchronized floor shadow scaling.
   - Text updates via a $500\text{ms}$ line-mask vertical slide.
   - 52px circular arrow buttons and interactive dots trigger smooth `gsap.scrollTo` tweens.
   - Autoplay pauses on hover/focus and stops permanently on user interaction.
   - Touch swipe on mobile with a $40\text{px}$ threshold and `touch-action: pan-y`.

2. **Hero Entrance & Parallax:**
   - $1.6\text{s}$ entrance timeline: heading line masks slide up, script accent rotates into place, cutouts rise with $150\text{ms}$ stagger.
   - Multi-speed scroll parallax: Left cup ($0.08$), Middle cup ($0.16$), Right cup ($0.05$).

3. **Gallery Strip:**
   - Scroll-snap horizontal track with desktop drag-to-scroll pointer physics.
   - Dynamic progress bar tracking scroll progress.
   - Hover zoom ($1.06\times$ over $900\text{ms}$) with rising caption overlay.

4. **Map:**
   - Leaflet centered on Hyderabad coordinates `[17.3850, 78.4867]`.
   - Sepia tile grading with pulsing matcha green halo markers.

5. **Accessibility & Reduced Motion:**
   - Supports `prefers-reduced-motion: reduce`: pinning, floating bob, and autoplay are disabled; clean fade transitions are preserved.
   - High contrast ratios ($>14:1$ for body text on cream; $>5.4:1$ for secondary mocha text).
   - High-visibility keyboard focus rings ($2\text{px}$ solid terracotta with $3\text{px}$ offset).

---

## 🚢 Deployment

The project builds to standard static HTML/CSS/JS in `dist/`.

### Deploying to Vercel
1. Push your repository to GitHub or GitLab.
2. Import the project in Vercel:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Click **Deploy**.

Alternatively, deploy via Vercel CLI:
```bash
npx vercel
```

