from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PHOTO = "assets/photos/hamaroyskaftet-guided-ascent-v2.avif"

COPY = {
    "en": {
        "alt": "A climber on a guided ascent of Hamarøyskaftet, wearing a helmet and climbing harness with Vestfjorden behind",
        "caption": "A glimpse from a guided ascent of Hamarøyskaftet. The summit route is technical climbing, not an ordinary hike.",
    },
    "no": {
        "alt": "Klatrer på guidet tur opp Hamarøyskaftet med hjelm og klatresele og Vestfjorden i bakgrunnen",
        "caption": "Et glimt fra en guidet tur opp Hamarøyskaftet. Toppruten er teknisk klatring, ikke en vanlig fottur.",
    },
    "de": {
        "alt": "Kletterer bei einer geführten Besteigung des Hamarøyskaftet mit Helm und Klettergurt und dem Vestfjord im Hintergrund",
        "caption": "Ein Eindruck von einer geführten Besteigung des Hamarøyskaftet. Die Gipfelroute ist technische Kletterei, keine normale Wanderung.",
    },
}

CSS = r'''

/* BP Hamarøyskaftet gallery: real guided-ascent photo + existing mountain overview. */
.hamaroy-gallery{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(260px,.75fr);gap:2px;background:var(--line);overflow:hidden;align-items:stretch}
.hamaroy-gallery .hamaroy-main,.hamaroy-gallery .hamaroy-ascent{min-width:0;min-height:0;margin:0;position:relative;overflow:hidden;background:#d9dedc}
.feature-place .hamaroy-gallery .hamaroy-main img{display:block;width:100%;height:100%;min-height:100%;aspect-ratio:auto;object-fit:cover;object-position:center center}
.feature-place .hamaroy-gallery .hamaroy-ascent img{display:block;width:100%;height:auto;aspect-ratio:3/4;object-fit:cover;object-position:center center}
.hamaroy-gallery figcaption{position:absolute;left:0;right:0;bottom:0;padding:46px 12px 10px;background:linear-gradient(transparent,rgba(5,33,39,.80));color:#fff;font-size:10px;line-height:1.4}
@media(max-width:720px){
 .hamaroy-gallery{grid-template-columns:1fr;gap:2px}
 .feature-place .hamaroy-gallery .hamaroy-main img{height:auto;min-height:0;aspect-ratio:16/9}
 .feature-place .hamaroy-gallery .hamaroy-ascent img{height:auto;aspect-ratio:3/4;object-fit:cover;object-position:center center}
 .hamaroy-gallery figcaption{font-size:11px;padding:48px 14px 12px}
}
'''


def lang_key(doc: BeautifulSoup) -> str:
    lang = ((doc.html.get("lang") if doc.html else "en") or "en").lower()
    if lang.startswith(("nb", "no")):
        return "no"
    if lang.startswith("de"):
        return "de"
    return "en"


def process_page(path: Path) -> None:
    doc = BeautifulSoup(path.read_text(), "html.parser")
    lang = lang_key(doc)
    card = None
    for article in doc.select("article.feature-place"):
        h3 = article.find("h3")
        if h3 and "Hamarøyskaftet" in h3.get_text(" ", strip=True):
            card = article
            break
    if not card:
        raise RuntimeError(f"Hamarøyskaftet feature card not found in {path.name}")

    old_gallery = card.select_one(".hamaroy-gallery")
    if old_gallery:
        # Idempotent refresh: only update the local image/caption if the gallery already exists.
        img = old_gallery.select_one(".hamaroy-ascent img")
        cap = old_gallery.select_one(".hamaroy-ascent figcaption")
        if img:
            img["src"] = PHOTO
            img["alt"] = COPY[lang]["alt"]
            img["width"] = "420"
            img["height"] = "560"
            img["loading"] = "lazy"
            img["decoding"] = "async"
            img["fetchpriority"] = "low"
        if cap:
            cap.string = COPY[lang]["caption"]
    else:
        primary = card.find("img", recursive=False)
        if not primary:
            primary = card.find("img")
        if not primary:
            raise RuntimeError(f"Primary Hamarøyskaftet image not found in {path.name}")

        gallery = doc.new_tag("div")
        gallery["class"] = ["hamaroy-gallery"]
        primary.replace_with(gallery)

        main = doc.new_tag("div")
        main["class"] = ["hamaroy-main"]
        main.append(primary)
        gallery.append(main)

        figure = doc.new_tag("figure")
        figure["class"] = ["hamaroy-ascent"]
        img = doc.new_tag(
            "img",
            src=PHOTO,
            alt=COPY[lang]["alt"],
            width="420",
            height="560",
            loading="lazy",
            decoding="async",
        )
        img["fetchpriority"] = "low"
        figure.append(img)
        caption = doc.new_tag("figcaption")
        caption.string = COPY[lang]["caption"]
        figure.append(caption)
        gallery.append(figure)

    path.write_text(str(doc))


for page in ("index.html", "no.html", "de.html"):
    process_page(ROOT / page)

css = ROOT / "guide-v3.css"
text = css.read_text()
marker = "/* BP Hamarøyskaftet gallery:"
if marker in text:
    text = text.split(marker, 1)[0].rstrip() + "\n"
css.write_text(text + CSS)
