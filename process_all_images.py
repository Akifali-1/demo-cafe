import io
import os
import requests
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from rembg import remove, new_session
from scipy import ndimage

os.makedirs("public/images", exist_ok=True)

# Use cached local u2net model for fast execution
SESSION = new_session("u2net")

# Verified single-glass cold drinks (NO saucers, NO phones, NO ceramic mugs, full glass visible)
DRINK_SOURCES = {
    "hero-cup-center.png": {
        "url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=85",
        "crop": (0.05, 0.02, 0.95, 0.98),
        "is_hero": True,
    },
    "hero-cup-left.png": {
        "url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=85",
        "crop": (0.08, 0.02, 0.92, 0.96),
        "is_hero": True,
    },
    "hero-cup-right.png": {
        "url": "https://images.unsplash.com/photo-1751563721808-3b81940b88f7?auto=format&fit=crop&w=1200&q=85",
        "crop": (0.05, 0.05, 0.95, 0.95),
        "is_hero": True,
    },
    "cutout-caramel-latte.png": {
        "url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=85",
        "crop": (0.05, 0.02, 0.95, 0.98),
        "is_hero": False,
    },
    "cutout-cold-brew.png": {
        "url": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1000&q=85",
        "crop": (0.08, 0.02, 0.92, 0.96),
        "is_hero": False,
    },
    "cutout-matcha-latte.png": {
        "url": "https://images.unsplash.com/photo-1751563721808-3b81940b88f7?auto=format&fit=crop&w=1000&q=85",
        "crop": (0.05, 0.05, 0.95, 0.95),
        "is_hero": False,
    },
    "cutout-mango-cooler.png": {
        "url": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1000&q=85",
        "crop": (0.10, 0.02, 0.90, 0.96),
        "is_hero": False,
    },
    "cutout-vanilla-iced-coffee.png": {
        "url": "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=1000&q=85",
        "crop": (0.08, 0.02, 0.92, 0.96),
        "is_hero": False,
    },
    "cutout-iced-americano.png": {
        "url": "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=1000&q=85",
        "crop": (0.10, 0.02, 0.90, 0.95),
        "is_hero": False,
    },
    "cutout-cold-chocolate.png": {
        "url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=85",
        "crop": (0.08, 0.02, 0.92, 0.96),
        "is_hero": False,
    },
    "cutout-lemon-iced-tea.png": {
        "url": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1000&q=85",
        "crop": (0.10, 0.02, 0.90, 0.95),
        "is_hero": False,
    },
}


def download_image(url: str) -> Image.Image:
    r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
    r.raise_for_status()
    return Image.open(io.BytesIO(r.content)).convert("RGBA")


def keep_largest_component(rgba_img: Image.Image) -> Image.Image:
    """Removes disconnected background debris, table shadows, and stray objects."""
    arr = np.array(rgba_img)
    alpha = arr[:, :, 3]

    # Strict threshold to strip soft table shadows that rembg leaves behind
    binary = alpha > 75
    labeled, num_features = ndimage.label(binary)
    if num_features > 1:
        sizes = ndimage.sum(binary, labeled, range(1, num_features + 1))
        largest_label = np.argmax(sizes) + 1
        mask = labeled == largest_label
        arr[:, :, 3] = np.where(mask, alpha, 0)
    else:
        arr[:, :, 3] = np.where(binary, alpha, 0)

    # Also trim horizontal shadow flares at the bottom 8% of the mask
    h, w = arr.shape[:2]
    row_widths = np.sum(arr[:, :, 3] > 75, axis=1)
    median_width = np.median(row_widths[row_widths > 0]) if np.any(row_widths > 0) else w
    for y in range(int(h * 0.75), h):
        # If a row near the bottom suddenly flares wider than the cup body (table shadow), clip its sides
        active_x = np.where(arr[y, :, 3] > 75)[0]
        if len(active_x) > median_width * 1.15:
            center_x = w // 2
            half_allowed = int(median_width * 0.48)
            arr[y, : max(0, center_x - half_allowed), 3] = 0
            arr[y, min(w, center_x + half_allowed) :, 3] = 0

    return Image.fromarray(arr)


def process_cutout(img: Image.Image, crop_box: tuple, is_hero: bool) -> Image.Image:
    w, h = img.size
    l, t, r, b = crop_box
    img = img.crop((int(w * l), int(h * t), int(w * r), int(h * b)))

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    cut_bytes = remove(buf.getvalue(), session=SESSION)
    cut = Image.open(io.BytesIO(cut_bytes)).convert("RGBA")

    cut = keep_largest_component(cut)

    # Feather alpha edge 1px so cutout looks studio-smooth
    r_c, g_c, b_c, a_c = cut.split()
    a_c = a_c.filter(ImageFilter.GaussianBlur(radius=0.7))
    cut = Image.merge("RGBA", (r_c, g_c, b_c, a_c))

    # Tight crop to the actual cup pixels
    bbox = cut.getbbox()
    if bbox:
        cut = cut.crop(bbox)

    cut = ImageEnhance.Contrast(cut).enhance(1.05)
    cut = ImageEnhance.Color(cut).enhance(1.06)

    # Standardize onto a fixed canvas so every cup has identical visual weight
    canvas_w, canvas_h = (800, 960) if is_hero else (700, 820)
    max_cup_w = int(canvas_w * (0.72 if is_hero else 0.64))
    max_cup_h = int(canvas_h * (0.86 if is_hero else 0.78))

    cw, ch = cut.size
    scale = min(max_cup_w / cw, max_cup_h / ch)
    new_w, new_h = int(cw * scale), int(ch * scale)
    cut = cut.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    paste_x = (canvas_w - new_w) // 2
    if is_hero:
        # Flush to the very bottom pixel of the canvas for the hero stage
        paste_y = canvas_h - new_h
    else:
        # Centered vertically for the carousel stage so it never droops into text
        paste_y = (canvas_h - new_h) // 2

    canvas.paste(cut, (paste_x, paste_y), cut)
    return canvas


def main():
    for filename, cfg in DRINK_SOURCES.items():
        print(f"Processing {filename}...")
        raw = download_image(cfg["url"])
        out = process_cutout(raw, cfg["crop"], cfg["is_hero"])
        out_path = os.path.join("public/images", filename)
        out.save(out_path, format="PNG", optimize=True)
        print(f"  Saved -> {out_path}")


if __name__ == "__main__":
    main()
