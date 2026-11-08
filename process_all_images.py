import os
import io
import requests
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from rembg import remove, new_session

os.makedirs("public/images", exist_ok=True)

# Use cached local u2net model for fast execution
SESSION = new_session("u2net")

# Curated clean single-cup photography with optional pre-crop (left, top, right, bottom) ratios
CUTOUTS = {
    "hero-cup-center.png": (
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=85",
        (0.15, 0.08, 0.85, 0.95)
    ),
    "hero-cup-left.png": (
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=85",
        (0.18, 0.10, 0.82, 0.95)
    ),
    "hero-cup-right.png": (
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=85",
        (0.18, 0.12, 0.82, 0.92)
    ),
    "cutout-caramel-latte.png": (
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=85",
        (0.18, 0.08, 0.82, 0.94)
    ),
    "cutout-cold-brew.png": (
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1000&q=85",
        (0.15, 0.08, 0.85, 0.95)
    ),
    "cutout-matcha-latte.png": (
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=85",
        (0.20, 0.10, 0.80, 0.88)
    ),
    "cutout-mango-cooler.png": (
        "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1000&q=85",
        (0.18, 0.08, 0.82, 0.94)
    ),
    "cutout-vanilla-iced-coffee.png": (
        "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=1000&q=85",
        (0.15, 0.08, 0.85, 0.94)
    ),
    "cutout-iced-americano.png": (
        "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=1000&q=85",
        (0.18, 0.08, 0.82, 0.94)
    ),
    "cutout-cold-chocolate.png": (
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=85",
        (0.18, 0.10, 0.82, 0.95)
    ),
    "cutout-lemon-iced-tea.png": (
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1000&q=85",
        (0.18, 0.08, 0.82, 0.94)
    ),
}

def download_image(url: str) -> Image.Image:
    headers = {"User-Agent": "Mozilla/5.0"}
    r = requests.get(url, headers=headers, timeout=30)
    r.raise_for_status()
    return Image.open(io.BytesIO(r.content)).convert("RGBA")

def clean_and_normalize_cutout(img: Image.Image, crop_box: tuple, is_hero: bool = False) -> Image.Image:
    w, h = img.size
    l, t, r, b = crop_box
    img = img.crop((int(w * l), int(h * t), int(w * r), int(h * b)))

    # Remove background with alpha matting for clean glass edges
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    out_bytes = remove(
        buf.getvalue(),
        session=SESSION,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=8,
    )
    cut = Image.open(io.BytesIO(out_bytes)).convert("RGBA")

    # Clean low-alpha noise halo
    arr = np.array(cut)
    alpha = arr[:, :, 3]
    alpha = np.where(alpha < 35, 0, alpha)
    arr[:, :, 3] = alpha
    cut = Image.fromarray(arr)

    # Smooth alpha edge slightly
    r_ch, g_ch, b_ch, a_ch = cut.split()
    a_ch = a_ch.filter(ImageFilter.GaussianBlur(radius=0.8))
    cut = Image.merge("RGBA", (r_ch, g_ch, b_ch, a_ch))

    # Tight bounding box trim so cup sits flush and centered
    bbox = cut.getbbox()
    if bbox:
        cut = cut.crop(bbox)

    # Slight contrast & color pop for studio look
    cut = ImageEnhance.Contrast(cut).enhance(1.06)
    cut = ImageEnhance.Color(cut).enhance(1.08)

    # Normalize onto a standardized canvas (800x1000)
    canvas_w, canvas_h = (900, 1100) if is_hero else (800, 1000)
    target_h = int(canvas_h * (0.88 if is_hero else 0.82))
    target_w = int(canvas_w * 0.78)

    cw, ch = cut.size
    scale = min(target_w / cw, target_h / ch)
    new_w, new_h = int(cw * scale), int(ch * scale)
    cut = cut.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    paste_x = (canvas_w - new_w) // 2
    # Hero cups sit flush at bottom (canvas_h - new_h); carousel cups sit centered with bottom anchor
    paste_y = (canvas_h - new_h) if is_hero else (canvas_h - new_h - int(canvas_h * 0.06))
    canvas.paste(cut, (paste_x, paste_y), cut)
    return canvas

def main():
    for filename, (url, crop_box) in CUTOUTS.items():
        print(f"Processing {filename}...")
        try:
            raw = download_image(url)
            is_hero = filename.startswith("hero-cup")
            processed = clean_and_normalize_cutout(raw, crop_box, is_hero=is_hero)
            out_path = os.path.join("public/images", filename)
            processed.save(out_path, format="PNG", optimize=True)
            print(f"  -> Saved {out_path}")
        except Exception as e:
            print(f"  [!] Failed {filename}: {e}")

if __name__ == "__main__":
    main()
