"""Restore verified source photographs and responsive derivatives for a fresh checkout."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib, json, urllib.request
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist'

def fetch(url, destination, expected_hash=None):
    destination.parent.mkdir(parents=True, exist_ok=True)
    if not destination.exists():
        with urllib.request.urlopen(url, timeout=45) as response:
            destination.write_bytes(response.read())
    if expected_hash:
        actual = hashlib.sha256(destination.read_bytes()).hexdigest()
        if actual != expected_hash:
            raise ValueError(f'Source bytes changed for {destination.name}; review before replacing')

def restore(photo):
    original = OUT / photo['full'].lstrip('/')
    fetch(photo['original_url'], original, photo['original_sha256'])
    with Image.open(original) as source:
        image = ImageOps.exif_transpose(source).convert('RGB')
        for key, width, quality in [('small', 640, 80), ('image', 1280, 86), ('large', 1920, 88)]:
            variant = image.copy()
            if variant.width > width:
                variant = variant.resize((width, round(variant.height * width / variant.width)), Image.Resampling.LANCZOS)
            destination = OUT / photo[key].lstrip('/')
            destination.parent.mkdir(parents=True, exist_ok=True)
            variant.save(destination, 'WEBP', quality=quality, method=6)
    return photo['full']

if __name__ == '__main__':
    photos = json.loads((ROOT / 'source/gallery.json').read_text())
    with ThreadPoolExecutor(max_workers=6) as pool:
        for filename in pool.map(restore, photos):
            print('Restored', filename)
    fetch('https://zgvhnbgggk-code.github.io/brennvika-panorama/assets/logo.webp', OUT / 'assets/logo.webp')
    for asset in json.loads((ROOT / 'source/credits.json').read_text()):
        fetch(asset['download'], OUT / asset['file'].lstrip('/'))
