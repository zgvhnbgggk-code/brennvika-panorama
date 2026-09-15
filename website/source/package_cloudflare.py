"""Validate and package the existing static site for a Cloudflare Pages preview.

No account access or deployment takes place. Reuse source/build.py to generate
HTML before packaging. The archive contains dist/, wrangler.jsonc and instructions.
"""
from pathlib import Path
import argparse
import hashlib
import json
from urllib.parse import unquote, urlsplit
from html.parser import HTMLParser
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
        self.ids = set()
        self.duplicate_ids = []
        self.gallery_photos = set()
        self.images_without_alt = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.duplicate_ids.append(attrs["id"])
            self.ids.add(attrs["id"])
        if "data-photo" in attrs:
            self.gallery_photos.add(attrs["data-photo"])
        if tag == "img" and "alt" not in attrs:
            self.images_without_alt += 1
        for name in ("src", "href"):
            if attrs.get(name):
                self.references.append(attrs[name])
        for variant in attrs.get("srcset", "").split(","):
            if variant.strip():
                self.references.append(variant.strip().split()[0])


def public_files():
    files = {}
    for path in sorted(DIST.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(DIST)
        if any(part.startswith(".") for part in relative.parts):
            continue
        if path.suffix.lower() not in {".html", ".css", ".js", ".jpg", ".jpeg", ".webp", ".txt", ".svg", ".png"}:
            raise ValueError(f"Unexpected public file: {relative}")
        files[relative.as_posix()] = path.read_bytes()
    # Provider-specific files are packaged without changing the existing Sites preview.
    files["_headers"] = (ROOT / "deployment/cloudflare-headers.txt").read_bytes()
    files["_redirects"] = (ROOT / "deployment/cloudflare-redirects.txt").read_bytes()
    return files


def validate(files):
    errors = []
    pages = {}
    reference_count = 0
    for name, data in files.items():
        if len(data) > 25 * 1024 * 1024:
            errors.append(f"Exceeds the Pages 25 MiB file limit: {name}")
        if name.endswith(".html"):
            page = Page()
            page.feed(data.decode("utf-8"))
            pages[name] = page
            if page.duplicate_ids or page.images_without_alt:
                errors.append(f"Duplicate IDs or missing image alt attributes: {name}")
    if len(files) > 1000:
        errors.append("Too many files for the dashboard upload option")
    for name, page in pages.items():
        for ref in page.references:
            parts = urlsplit(ref)
            if parts.scheme or parts.netloc:
                continue
            reference_count += 1
            target = unquote(parts.path)
            target = target.lstrip("/") if target.startswith("/") else (Path(name).parent / target).as_posix()
            if not parts.path:
                target = name
            elif parts.path.endswith("/") or target == ".":
                target = target.rstrip("/") + "/index.html" if target not in {"", "."} else "index.html"
            if target not in files:
                errors.append(f"Missing target in {name}: {ref}")
            elif parts.fragment and target in pages and unquote(parts.fragment) not in pages[target].ids:
                errors.append(f"Missing fragment in {name}: {ref}")
    photos = json.loads((ROOT / "source/gallery.json").read_text(encoding="utf-8"))
    expected = {str(i) for i in range(31)}
    if len(photos) != 31:
        errors.append("Expected all 31 source photographs")
    for name in ("galleri/index.html", "en/gallery/index.html"):
        if name not in pages or pages[name].gallery_photos != expected:
            errors.append(f"Incomplete gallery: {name}")
    for photo in photos:
        for key in ("full", "small", "image", "large"):
            if photo[key].lstrip("/") not in files:
                errors.append(f"Missing gallery image: {photo[key]}")
        full = files.get(photo["full"].lstrip("/"), b"")
        if hashlib.sha256(full).hexdigest() != photo["original_sha256"]:
            errors.append(f"Original photo checksum mismatch: {photo['full']}")
    for name in ("bestill/index.html", "en/book/index.html"):
        content = files.get(name, b"").decode("utf-8")
        for marker in ('data-rental-id="828625"', 'data-website-id="667832"', 'data-currency-code="NOK"', 'data-slug="dan-skoglund"', 'renderBookNowBox.js'):
            if marker not in content:
                errors.append(f"Missing booking setting in {name}: {marker}")
    for name in pages:
        if name != "404.html" and 'content="noindex,nofollow"' not in files[name].decode("utf-8"):
            errors.append(f"Missing preview indexing restriction: {name}")
    if b"Disallow: /" not in files.get("robots.txt", b""):
        errors.append("Missing preview robots.txt")
    if errors:
        raise ValueError("\n".join(errors))
    return {"html_pages": len(pages), "public_files": len(files), "checked_local_references": reference_count,
            "gallery_photos": len(photos), "largest_file_bytes": max(map(len, files.values())),
            "total_public_bytes": sum(map(len, files.values())),
            "browser_qa": "pending", "booking_end_to_end": "pending"}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path, help="ZIP archive path outside dist/")
    args = parser.parse_args()
    output = args.output.resolve()
    if output.is_relative_to(DIST):
        parser.error("Keep archives outside the public directory")
    files = public_files()
    report = validate(files)
    archive_files = {"dist/" + name: data for name, data in files.items()}
    archive_files["wrangler.jsonc"] = (ROOT / "wrangler.jsonc").read_bytes()
    archive_files["LES-MEG.md"] = (ROOT / "deployment/README.md").read_bytes()
    archive_files["validation.json"] = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    hashes = {name: hashlib.sha256(data).hexdigest() for name, data in sorted(archive_files.items())}
    archive_files["SHA256SUMS.json"] = (json.dumps(hashes, indent=2) + "\n").encode("utf-8")
    output.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(output, "w", compression=ZIP_DEFLATED, compresslevel=6) as archive:
        for name, data in sorted(archive_files.items()):
            archive.writestr(name, data)
    with ZipFile(output) as archive:
        if archive.testzip() is not None:
            raise ValueError("Archive verification failed")
    report.update(archive=str(output), archive_bytes=output.stat().st_size,
                  archive_sha256=hashlib.sha256(output.read_bytes()).hexdigest())
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
