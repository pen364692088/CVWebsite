#!/usr/bin/env python3

from pathlib import Path
import zipfile


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ZIP = Path("/mnt/c/Users/LEO/Downloads/dark_fantasy_split_assets_clean_v2.zip")

MAPPING = {
  "hero/castle_moon.png": "public/reference-crops/dark-fantasy-pack/castle-moon.png",
  "hero/dragon.png": "public/reference-crops/dark-fantasy-pack/dragon.png",
  "characters/knight.png": "public/reference-crops/dark-fantasy-pack/knight.png",
  "props/sword_bonfire.png": "public/reference-crops/dark-fantasy-pack/flame-sword-altar.png",
  "props/book.png": "public/reference-crops/dark-fantasy-pack/book.png",
  "creatures/raven_source_cropped.png": "public/reference-crops/dark-fantasy-pack/raven.png",
  "ui/round_seal.png": "public/reference-crops/dark-fantasy-pack/abyss-seal.png",
  "ui/enter_button.png": "public/reference-crops/dark-fantasy-pack/enter-the-abyss-button.png",
  "ui/unseal_button.png": "public/reference-crops/dark-fantasy-pack/unseal-the-relic-button.png",
  "ui/divider_01.png": "public/reference-crops/dark-fantasy-pack/divider_01.png",
  "ui/divider_02.png": "public/reference-crops/dark-fantasy-pack/divider_02.png",
  "ui/divider_03.png": "public/reference-crops/dark-fantasy-pack/divider_03.png",
  "ui/divider_04.png": "public/reference-crops/dark-fantasy-pack/divider_04.png",
  "ui/title_block.png": "public/reference-crops/dark-fantasy-pack/title-block.png",
  "fx/embers_mid_overlay.png": "public/atmosphere/embers-mid-overlay.png",
  "fx/embers_bottom_arc.png": "public/atmosphere/embers-bottom-arc.png",
}


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Import dark fantasy split assets v2 into repo public directories")
    parser.add_argument(
        "zip_path",
        nargs="?",
        default=str(DEFAULT_ZIP),
        help="Path to dark_fantasy_split_assets_clean_v2.zip",
    )

    args = parser.parse_args()
    zip_path = Path(args.zip_path)
    if not zip_path.exists():
        raise SystemExit(f"Missing zip: {zip_path}")

    with zipfile.ZipFile(zip_path) as zipf:
        for source, destination in MAPPING.items():
            target = ROOT / destination
            try:
                data = zipf.read(source)
            except KeyError:
                # keep one-shot import tolerant to minor filename drift
                missing = source
                print(f"Skipping missing entry: {missing}")
                continue

            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)

    print("Imported dark fantasy v2 assets from", zip_path)


if __name__ == "__main__":
    main()
