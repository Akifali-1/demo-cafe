import os
from PIL import Image

PUBLIC_IMAGES_DIR = os.path.join("public", "images")

for fname in os.listdir(PUBLIC_IMAGES_DIR):
    if fname.startswith("cutout-") and fname.endswith(".png"):
        fpath = os.path.join(PUBLIC_IMAGES_DIR, fname)
        im = Image.open(fpath)
        quant = im.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
        quant.save(fpath, format="PNG", optimize=True)
        print(f"Compressed {fname} -> {os.path.getsize(fpath) / 1024:.1f} KB")

total_bytes = sum(os.path.getsize(os.path.join(PUBLIC_IMAGES_DIR, f)) for f in os.listdir(PUBLIC_IMAGES_DIR))
total_mb = total_bytes / (1024 * 1024)
print(f"\nUpdated Total images directory size: {total_mb:.2f} MB (Target < 3.0 MB: {'PASS' if total_mb < 3.0 else 'FAIL'})")

