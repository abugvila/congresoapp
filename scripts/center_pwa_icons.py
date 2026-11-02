"""Prepare centered, safe-margin app icons from the official Congress emblem."""
from pathlib import Path
from PIL import Image

SOURCE = Path("public/app-movil/logo-congreso.png")
OUTPUT = Path("out/app-movil")

def run():
    image = Image.open(SOURCE).convert("RGB")
    # The official logo also includes text below the emblem; omit that region.
    emblem = image.crop((0, 0, image.width, round(image.height * 0.82)))
    pixels = emblem.load()
    bounds = [emblem.width, emblem.height, -1, -1]
    for y in range(emblem.height):
        for x in range(emblem.width):
            r, g, b = pixels[x, y]
            if min(r, g, b) < 225:
                bounds[0] = min(bounds[0], x)
                bounds[1] = min(bounds[1], y)
                bounds[2] = max(bounds[2], x)
                bounds[3] = max(bounds[3], y)
    if bounds[2] < bounds[0]:
        raise ValueError("Official emblem could not be detected")
    emblem = emblem.crop((bounds[0], bounds[1], bounds[2] + 1, bounds[3] + 1))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for size in (192, 512):
        icon = Image.new("RGB", (size, size), "white")
        # Symmetric 12% padding and safe area for rounded Android icons.
        max_side = round(size * 0.76)
        scaled = emblem.copy()
        scaled.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
        icon.paste(scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2))
        icon.save(OUTPUT / ("icon-" + str(size) + ".png"), optimize=True)
    print("Centered PWA icons exported")

if __name__ == "__main__":
    run()
