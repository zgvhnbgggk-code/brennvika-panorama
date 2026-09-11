from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]

IMAGES = [
    ("assets/photos/coast-summer.avif", 1000, 786),
    ("assets/photos/tranoy-lighthouse.webp", 1100, 725),
    ("assets/photos/salmon-farm.webp", 603, 360),
    ("assets/photos/aurora.webp", 960, 640),
    ("assets/photos/grocery-store.webp", 521, 380),
    ("assets/photos/hamaroyskaftet.webp", 1100, 825),
]

CREDITS = [
    None,
    None,
    ("Photo: Marius Fiskum / Wikimedia Commons · CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Lakseoppdrett.jpg"),
    None,
    ("Photo: Wikimedia Commons · Sulitjelma Coop shop", "https://commons.wikimedia.org/wiki/File:Interior_from_Sulitjelma_Coop_shop.jpg"),
    None,
]

CSS = r'''

/* BP visual explore cards: local, lazy-loaded imagery without sacrificing load speed. */
.brand-logo-link{display:flex;align-items:center;min-width:180px;max-width:245px}
.brand-logo{display:block;width:auto;height:54px;max-width:100%;object-fit:contain;object-position:left center}
.other-ideas details.visual-place summary{padding:0;display:grid;grid-template-columns:128px minmax(0,1fr) auto;gap:18px;align-items:center;min-height:112px;overflow:hidden}
.visual-place .place-summary-media{display:block;align-self:stretch;min-height:112px;background:var(--paper2);overflow:hidden}
.visual-place .place-summary-media img{width:100%;height:100%;min-height:112px;object-fit:cover}
.visual-place .place-summary-title{padding:19px 0;font-weight:800;line-height:1.35}
.other-ideas details.visual-place summary::after{margin-right:20px}
.visual-photo-credit{margin-top:14px!important}
@media(max-width:700px){
 .brand-logo-link{min-width:138px;max-width:180px}.brand-logo{height:44px}
 .other-ideas details.visual-place summary{grid-template-columns:108px minmax(0,1fr) auto;gap:14px;min-height:105px}
 .visual-place .place-summary-media,.visual-place .place-summary-media img{min-height:105px}
 .visual-place .place-summary-title{padding:15px 0;font-size:14px}
 .other-ideas details.visual-place summary::after{margin-right:15px}
}
@media(max-width:390px){
 .other-ideas details.visual-place summary{grid-template-columns:94px minmax(0,1fr) auto;gap:12px}
 .visual-place .place-summary-title{font-size:13px}
}
'''


def process_page(path: Path) -> None:
    doc = BeautifulSoup(path.read_text(), "html.parser")

    brand = doc.select_one("a.wordmark")
    if brand:
        brand.clear()
        brand["class"] = ["wordmark", "brand-logo-link"]
        logo = doc.new_tag(
            "img",
            src="assets/logo.webp",
            alt="Skoglund Heim AS",
            width="260",
            height="88",
        )
        logo["class"] = ["brand-logo"]
        brand.append(logo)

    cards = doc.select(".other-ideas > details.place")
    for card, (src, w, h), credit in zip(cards, IMAGES, CREDITS):
        classes = list(card.get("class", []))
        if "visual-place" not in classes:
            classes.append("visual-place")
        card["class"] = classes

        summary = card.find("summary", recursive=False)
        if not summary:
            continue
        title = summary.get_text(" ", strip=True)
        summary.clear()

        media = doc.new_tag("span")
        media["class"] = ["place-summary-media"]
        img = doc.new_tag(
            "img",
            src=src,
            alt="",
            width=str(w),
            height=str(h),
            loading="lazy",
            decoding="async",
        )
        img["fetchpriority"] = "low"
        media.append(img)

        label = doc.new_tag("span")
        label["class"] = ["place-summary-title"]
        label.string = title
        summary.append(media)
        summary.append(label)

        if credit:
            body = card.select_one(".detail-body")
            if body and not body.select_one(".visual-photo-credit"):
                p = doc.new_tag("p")
                p["class"] = ["photo-credit", "visual-photo-credit"]
                a = doc.new_tag("a", href=credit[1], target="_blank", rel="noopener noreferrer")
                a.string = credit[0] + " ↗"
                p.append(a)
                body.append(p)

    path.write_text(str(doc))


for page in ("index.html", "no.html", "de.html"):
    process_page(ROOT / page)

css = ROOT / "guide-v3.css"
text = css.read_text()
if "BP visual explore cards" not in text:
    css.write_text(text + CSS)
