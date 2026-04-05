#!/usr/bin/env python3
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image


@dataclass(frozen=True)
class CropSpec:
    left: int
    top: int
    right: int
    bottom: int
    trim_threshold: int | None = None
    pad: int = 16


SPECS: dict[str, CropSpec] = {
    "castle-moon": CropSpec(90, 175, 592, 526, trim_threshold=8, pad=18),
    "dragon": CropSpec(520, 188, 858, 390, trim_threshold=8, pad=18),
    "knight": CropSpec(625, 350, 920, 705, trim_threshold=8, pad=18),
    "book": CropSpec(625, 720, 885, 1045, trim_threshold=8, pad=18),
    "raven": CropSpec(700, 1050, 965, 1215, trim_threshold=8, pad=18),
    "flame-sword-altar": CropSpec(55, 545, 445, 835, trim_threshold=8, pad=18),
    "ritual-controls-stack": CropSpec(20, 780, 500, 1060, trim_threshold=1, pad=12),
    "enter-the-abyss-button": CropSpec(20, 880, 470, 980, trim_threshold=None, pad=12),
    "unseal-the-relic-button": CropSpec(92, 970, 413, 1050, trim_threshold=None, pad=12),
    "abyss-seal": CropSpec(436, 970, 506, 1050, trim_threshold=None, pad=12),
    "ornament-mid": CropSpec(30, 1084, 508, 1138, trim_threshold=8, pad=16),
    "ornament-narrow": CropSpec(35, 1148, 496, 1180, trim_threshold=8, pad=16),
    "ornament-wide": CropSpec(30, 1198, 506, 1258, trim_threshold=8, pad=16),
}


def trim_crop(image: Image.Image, threshold: int, pad: int) -> Image.Image:
    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return image
    cropped = image.crop(bbox)
    output = Image.new("RGBA", (cropped.width + pad * 2, cropped.height + pad * 2), (0, 0, 0, 0))
    output.alpha_composite(cropped, (pad, pad))
    return output


def main() -> None:
    source = Path("/mnt/c/Users/LEO/Downloads/Pack d'actifs de fantasy sombre.png")
    output_dir = Path("public/reference-crops/dark-fantasy-pack")
    output_dir.mkdir(parents=True, exist_ok=True)

    image = Image.open(source).convert("RGBA")

    for name, spec in SPECS.items():
        cropped = image.crop((spec.left, spec.top, spec.right, spec.bottom))
        if spec.trim_threshold is not None:
            cropped = trim_crop(cropped, spec.trim_threshold, spec.pad)
        elif spec.pad:
            padded = Image.new("RGBA", (cropped.width + spec.pad * 2, cropped.height + spec.pad * 2), (0, 0, 0, 0))
            padded.alpha_composite(cropped, (spec.pad, spec.pad))
            cropped = padded
        cropped.save(output_dir / f"{name}.png")

    print(output_dir)


if __name__ == "__main__":
    main()
