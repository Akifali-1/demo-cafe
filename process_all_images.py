import os
import io
import time
import urllib.request
from PIL import Image, ImageEnhance, ImageDraw, ImageFont
from rembg import remove, new_session

PUBLIC_IMAGES_DIR = os.path.join("public", "images")
os.makedirs(PUBLIC_IMAGES_DIR, exist_ok=True)

# Warm editorial color grading function
def apply_warm_grade(image):
    # Convert RGBA or RGB
    has_alpha = image.mode == "RGBA"
    if has_alpha:
        r, g, b, a = image.split()
        rgb = Image.merge("RGB", (r, g, b))
    else:
        rgb = image.convert("RGB")
        a = None

    # 1. Warm channel adjustments: slightly boost red, soften blue
    # This brings in the warm summer morning amber/espresso tone
    r_chan, g_chan, b_chan = rgb.split()
    r_chan = r_chan.point(lambda i: min(255, int(i * 1.04 + 2)))
    g_chan = g_chan.point(lambda i: min(255, int(i * 1.01 + 1)))
    b_chan = b_chan.point(lambda i: max(0, int(i * 0.96 - 1)))
    graded_rgb = Image.merge("RGB", (r_chan, g_chan, b_chan))

    # 2. Subtle contrast & saturation adjustment
    enhancer_con = ImageEnhance.Contrast(graded_rgb)
    graded_rgb = enhancer_con.enhance(1.04)
    enhancer_col = ImageEnhance.Color(graded_rgb)
    graded_rgb = enhancer_col.enhance(1.05)

    if has_alpha:
        r2, g2, b2 = graded_rgb.split()
        return Image.merge("RGBA", (r2, g2, b2, a))
    return graded_rgb

# Download helper with browser headers
def download_image(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
    with urllib.request.urlopen(req) as resp:
        return resp.read()

# Cutout processing helper
def process_cutout(session, name, url):
    print(f"--> Processing Cutout: {name} ...")
    raw_data = download_image(url)
    img = Image.open(io.BytesIO(raw_data))

    # Remove background with rembg
    cutout = remove(img, session=session)

    # Trim to tight bounding box
    bbox = cutout.getbbox()
    if bbox:
        cutout = cutout.crop(bbox)

    w, h = cutout.size
    target_height = 1000
    scale = target_height / float(h)
    target_width = int(w * scale)

    resized = cutout.resize((target_width, target_height), Image.Resampling.LANCZOS)

    # Apply warm color grade
    graded = apply_warm_grade(resized)

    # Canvas with padding to keep centered
    canvas_w = target_width + 80
    canvas_h = target_height + 40
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    paste_x = (canvas_w - target_width) // 2
    paste_y = (canvas_h - target_height) // 2
    canvas.paste(graded, (paste_x, paste_y), graded)

    out_path = os.path.join(PUBLIC_IMAGES_DIR, name)
    canvas.save(out_path, format="PNG", optimize=True)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"    Saved {name} ({canvas.size}, {size_kb:.1f} KB)")

# Photo processing helper
def process_photo(name, url, target_width):
    print(f"--> Processing Photo: {name} (target width {target_width}) ...")
    raw_data = download_image(url)
    img = Image.open(io.BytesIO(raw_data))

    w, h = img.size
    scale = target_width / float(w)
    target_height = int(h * scale)

    resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    graded = apply_warm_grade(resized)

    out_path = os.path.join(PUBLIC_IMAGES_DIR, name)
    graded.save(out_path, format="WEBP", quality=78, method=6)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"    Saved {name} ({graded.size}, {size_kb:.1f} KB)")
    return graded

def generate_og_image(base_photo):
    print("--> Generating og-image.jpg (1200 x 630) ...")
    w, h = base_photo.size
    # Crop to 1200 x 630 aspect ratio (1200:630 = 40:21)
    target_aspect = 1200 / 630
    current_aspect = w / float(h)

    if current_aspect > target_aspect:
        # Crop width
        crop_w = int(h * target_aspect)
        left = (w - crop_w) // 2
        cropped = base_photo.crop((left, 0, left + crop_w, h))
    else:
        crop_h = int(w / target_aspect)
        top = (h - crop_h) // 2
        cropped = base_photo.crop((0, top, w, top + crop_h))

    og_img = cropped.resize((1200, 630), Image.Resampling.LANCZOS)

    # Dark warm gradient at bottom
    gradient = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
    draw = ImageDraw.Draw(gradient)
    for y in range(300, 630):
        alpha = int(210 * ((y - 300) / 330.0))
        draw.line([(0, y), (1200, y)], fill=(42, 27, 18, alpha))

    og_composite = Image.alpha_composite(og_img.convert("RGBA"), gradient)

    # Add text overlay
    draw_text = ImageDraw.Draw(og_composite)
    # Simple clean text drawing
    draw_text.text((64, 460), "Demo Cafe", fill=(246, 240, 231, 255))
    draw_text.text((64, 520), "Specialty Iced Coffee & Cold Drinks • Hyderabad", fill=(200, 100, 59, 255))
    draw_text.text((64, 560), "Made fresh to order with filtered water ice.", fill=(234, 223, 207, 240))

    out_path = os.path.join(PUBLIC_IMAGES_DIR, "og-image.jpg")
    og_composite.convert("RGB").save(out_path, format="JPEG", quality=85, optimize=True)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"    Saved og-image.jpg (1200x630, {size_kb:.1f} KB)")

def main():
    start_time = time.time()
    session = new_session("u2netp")

    cutouts = [
        ("cutout-caramel-latte.png", "https://images.pexels.com/photos/11136849/pexels-photo-11136849.jpeg?auto=compress&cs=tinysrgb&w=1200"),
        ("cutout-cold-brew.png", "https://images.pexels.com/photos/17576001/pexels-photo-17576001.jpeg?auto=compress&cs=tinysrgb&w=1200"),
        ("cutout-matcha-latte.png", "https://images.pexels.com/photos/6249729/pexels-photo-6249729.jpeg?auto=compress&cs=tinysrgb&w=1200"),
        ("cutout-mango-cooler.png", "https://images.pexels.com/photos/6063291/pexels-photo-6063291.jpeg?auto=compress&cs=tinysrgb&w=1200"),
        ("cutout-vanilla-iced-coffee.png", "https://images.pexels.com/photos/16496287/pexels-photo-16496287.jpeg?auto=compress&cs=tinysrgb&w=1200"),
        ("cutout-iced-americano.png", "https://images.pexels.com/photos/5741238/pexels-photo-5741238.jpeg?auto=compress&cs=tinysrgb&w=1200"),
        ("cutout-cold-chocolate.png", "https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=1200"),
        ("cutout-lemon-iced-tea.png", "https://images.pexels.com/photos/40594/lemon-tea-cold-beverages-summer-offerings-40594.jpeg?auto=compress&cs=tinysrgb&w=1200")
    ]

    for name, url in cutouts:
        process_cutout(session, name, url)

    photos = [
        ("feature-pour.webp", "https://images.pexels.com/photos/9520626/pexels-photo-9520626.jpeg?auto=compress&cs=tinysrgb&w=1600", 1200),
        ("visit-cafe-interior.webp", "https://images.pexels.com/photos/34896773/pexels-photo-34896773.jpeg?auto=compress&cs=tinysrgb&w=1600", 1200),
        ("gallery-1.webp", "https://images.pexels.com/photos/30617168/pexels-photo-30617168.jpeg?auto=compress&cs=tinysrgb&w=1200", 900),
        ("gallery-2.webp", "https://images.pexels.com/photos/31961245/pexels-photo-31961245.jpeg?auto=compress&cs=tinysrgb&w=1200", 900),
        ("gallery-3.webp", "https://images.pexels.com/photos/30593915/pexels-photo-30593915.jpeg?auto=compress&cs=tinysrgb&w=1200", 900),
        ("gallery-4.webp", "https://images.pexels.com/photos/4913351/pexels-photo-4913351.jpeg?auto=compress&cs=tinysrgb&w=1200", 900),
        ("gallery-5.webp", "https://images.pexels.com/photos/6457517/pexels-photo-6457517.jpeg?auto=compress&cs=tinysrgb&w=1200", 900),
        ("gallery-6.webp", "https://images.pexels.com/photos/34968670/pexels-photo-34968670.jpeg?auto=compress&cs=tinysrgb&w=1200", 900)
    ]

    feature_pour_img = None
    for name, url, width in photos:
        img = process_photo(name, url, width)
        if name == "feature-pour.webp":
            feature_pour_img = img

    if feature_pour_img:
        generate_og_image(feature_pour_img)

    total_bytes = sum(os.path.getsize(os.path.join(PUBLIC_IMAGES_DIR, f)) for f in os.listdir(PUBLIC_IMAGES_DIR))
    total_mb = total_bytes / (1024 * 1024)
    print(f"\n All {len(os.listdir(PUBLIC_IMAGES_DIR))} images processed in {time.time() - start_time:.2f}s!")
    print(f" Total images directory size: {total_mb:.2f} MB (Target < 3.0 MB: {'PASS' if total_mb < 3.0 else 'FAIL'})")

if __name__ == "__main__":
    main()
