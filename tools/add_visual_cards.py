from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]

# No AI-generated imagery is used here. These are real photographs of the
# place/subject described in each card and are loaded from their source sites
# only when the visitor scrolls near the card. Grocery information deliberately
# uses map links instead of a decorative photo.
PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="

CARD_MEDIA = [
    {
        "images": [
            {
                "url": "https://v.imgi.no/visitbodo-5081-07f04e663378619a5f251d154ca5b8b8-1920x1275/2023_01_glimma-1-foto-kjell-fredriksen-kopi-scaled.jpg",
                "alt": {
                    "en": "Glimma in Hamarøy, with calm water and mountains reflected in the bay",
                    "no": "Glimma på Hamarøy, med stille vann og fjell som speiler seg i bukta",
                    "de": "Glimma auf Hamarøy mit ruhigem Wasser und Bergen, die sich in der Bucht spiegeln",
                },
            }
        ],
        "sources": [
            ("Visit Bodø · Roundtrip at Glimma", "https://visitbodo.com/en/guide/hikes-in-bodo-salten/roundtrip-at-glimma/")
        ],
    },
    {
        "images": [
            {
                "url": "https://cdn1.blogg.no/content/uploads/sites/333/2020/11/15200301/A06830E2-FDF0-4A43-9EDA-88F8937BBFB1.jpeg",
                "alt": {
                    "en": "Midnight sun over the fjords and mountains of Hamarøy",
                    "no": "Midnattssol over fjordene og fjellene på Hamarøy",
                    "de": "Mitternachtssonne über den Fjorden und Bergen von Hamarøy",
                },
            }
        ],
        "sources": [
            ("FantastiskTurglede · Nordskaret on Hamarøy", "https://fantastiskturglede.blogg.no/nordskaret.html")
        ],
    },
    {
        "images": [
            {
                "url": "https://cdn.sanity.io/images/2w08phbr/production/acfd4e67bdffb5c16f42eb281c3da4bd38ec492a-3002x2000.jpg?auto=format&q=80&w=1200",
                "alt": {
                    "en": "Arctic Salmon Center in Skutvik beside the salmon pens",
                    "no": "Arctic Salmon Center i Skutvik ved laksemerdene",
                    "de": "Arctic Salmon Center in Skutvik neben den Lachszuchtanlagen",
                },
            }
        ],
        "sources": [
            ("Steni · Arctic Salmon Center, Skutvik", "https://www.steni.com/cases/arctic-salmon-center")
        ],
    },
    {
        "images": [
            {
                "url": "https://v.imgi.no/visitbodo-6650-6c8123cc02ee3518230042d4bee03b58-2048x1366/2023_03_sykkel-i-salten_oyhopping_kontrafei-media-2-scaled.jpg",
                "alt": {
                    "en": "Cycling on a quiet coastal road in Steigen and Hamarøy",
                    "no": "Sykling på en rolig kystvei i Steigen og Hamarøy",
                    "de": "Radfahren auf einer ruhigen Küstenstraße in Steigen und Hamarøy",
                },
            },
            {
                "url": "https://cdn.sanity.io/images/jlrwvnbf/commercial/6f56d5d3becf7d5d8daf54bc2f2e05bc6ab5864c-2036x1214.jpg?rect=0,30,2036,1154&w=1500&h=850&auto=format",
                "alt": {
                    "en": "Winter landscape at the Hamsun Centre in Hamarøy",
                    "no": "Vinterlandskap ved Hamsunsenteret på Hamarøy",
                    "de": "Winterlandschaft am Hamsun-Zentrum auf Hamarøy",
                },
            },
        ],
        "sources": [
            ("Visit Bodø · Cycling in Steigen and Hamarøy", "https://visitbodo.com/en/guide/cycling-in-salten/cycling-in-steigen-and-hamaroy/"),
            ("Visit Norway · The Hamsun Centre", "https://www.visitnorway.com/listings/the-hamsun-centre-museum/182902/"),
        ],
    },
    None,
    {
        "images": [
            {
                "url": "https://v.imgi.no/visitbodo-7559-7a1f2be758788e9419d9e78dd655f2bd-2048x1360/2023_01_nesten-pa-toppen-utsikt-mot-stetinden_dsc3866-kopi-1-scaled.jpg",
                "alt": {
                    "en": "A hiker in the mountains of Hamarøy overlooking the fjord",
                    "no": "En turgåer i fjellene på Hamarøy med utsikt over fjorden",
                    "de": "Eine Wanderin in den Bergen von Hamarøy mit Blick über den Fjord",
                },
            }
        ],
        "sources": [
            ("Visit Bodø · Hamarøy", "https://visitbodo.com/reisemal/hamaroy/")
        ],
    },
]

GROCERY = {
    "en": {
        "intro": "Tranøy Landhandel is the handy local option: it is open 24/7 all year, but the range is limited compared with a full-size supermarket. For a larger shop, head to SPAR Hamarøy in Oppeid.",
        "tranoy_note": "Small local grocery · open 24/7 · best for essentials",
        "spar_note": "Larger supermarket in Oppeid · check current opening hours before you drive",
        "map": "Open in",
    },
    "no": {
        "intro": "Tranøy Landhandel er det praktiske nærvalget: butikken er døgnåpen 24/7 hele året, men utvalget er begrenset sammenlignet med et fullverdig supermarked. For større handel anbefaler vi SPAR Hamarøy på Oppeid.",
        "tranoy_note": "Liten lokalbutikk · døgnåpen 24/7 · best for det viktigste",
        "spar_note": "Større dagligvarebutikk på Oppeid · sjekk dagens åpningstid før dere kjører",
        "map": "Åpne i",
    },
    "de": {
        "intro": "Tranøy Landhandel ist die praktische lokale Option: Der Laden ist ganzjährig rund um die Uhr (24/7) geöffnet, hat aber ein kleineres Sortiment als ein großer Supermarkt. Für einen größeren Einkauf empfehlen wir SPAR Hamarøy in Oppeid.",
        "tranoy_note": "Kleiner Dorfladen · 24/7 geöffnet · gut für das Nötigste",
        "spar_note": "Größerer Supermarkt in Oppeid · aktuelle Öffnungszeiten vor der Fahrt prüfen",
        "map": "Öffnen in",
    },
}

STORES = [
    {
        "name": "Tranøy Landhandel",
        "address": "Tranøyveien 1395 · 8297 Tranøy",
        "google": "https://www.google.com/maps/search/?api=1&query=Tran%C3%B8y+Landhandel%2C+Tran%C3%B8yveien+1395%2C+8297+Tran%C3%B8y%2C+Norway",
        "apple": "https://maps.apple.com/?q=Tran%C3%B8y%20Landhandel&address=Tran%C3%B8yveien%201395%2C%208297%20Tran%C3%B8y%2C%20Norway",
        "note": "tranoy_note",
    },
    {
        "name": "SPAR Hamarøy",
        "address": "Vestfjordveien 1606 · 8294 Hamarøy",
        "google": "https://www.google.com/maps/search/?api=1&query=SPAR+Hamar%C3%B8y%2C+Vestfjordveien+1606%2C+8294+Hamar%C3%B8y%2C+Norway",
        "apple": "https://maps.apple.com/?q=SPAR%20Hamar%C3%B8y&address=Vestfjordveien%201606%2C%208294%20Hamar%C3%B8y%2C%20Norway",
        "note": "spar_note",
    },
]

CSS = r'''

/* BP visual explore cards v2: precise real imagery, deferred until near viewport. */
.brand-logo-link{display:flex;align-items:center;min-width:180px;max-width:245px}
.brand-logo{display:block;width:auto;height:54px;max-width:100%;object-fit:contain;object-position:left center}
.other-ideas details.visual-place summary{padding:0;display:grid;grid-template-columns:128px minmax(0,1fr) auto;gap:18px;align-items:center;min-height:112px;overflow:hidden}
.visual-place .place-summary-media{display:grid;grid-template-columns:1fr;align-self:stretch;min-height:112px;background:linear-gradient(135deg,#dfe8e5,#edf1ec);overflow:hidden}
.visual-place .place-summary-media.media-pair{grid-template-columns:1fr 1fr;gap:2px}
.visual-place .place-summary-media img{width:100%;height:100%;min-height:112px;object-fit:cover;opacity:0;transition:opacity .18s ease}
.visual-place .place-summary-media img.remote-loaded{opacity:1}
.visual-place .place-summary-media.remote-failed{background:linear-gradient(135deg,#e6e8e1,#f2eee6)}
.visual-place .place-summary-title{padding:19px 0;font-weight:800;line-height:1.35}
.other-ideas details.visual-place summary::after{margin-right:20px}
.visual-photo-credit{margin-top:14px!important;font-size:10px!important;line-height:1.55!important}
.visual-photo-credit a+a{margin-left:8px}
.other-ideas details.grocery-place summary{grid-template-columns:minmax(0,1fr) auto;padding:22px 20px;min-height:88px}
.grocery-place .place-summary-title{padding:0}
.grocery-place .grocery-badge{display:inline-flex;margin-left:10px;padding:3px 8px;border-radius:999px;background:var(--bluewash);color:var(--sea);font-size:10px;letter-spacing:.08em;font-weight:800;vertical-align:middle}
.store-list{display:grid;gap:12px;margin-top:18px}
.store-row{border:1px solid var(--line);background:var(--paper);border-radius:12px;padding:16px}
.store-row strong,.store-row small{display:block}.store-row small{color:var(--muted);margin-top:3px;line-height:1.55}
.store-map-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.store-map-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:8px 12px;border:1px solid var(--ink);border-radius:7px;text-decoration:none;font-size:12px;font-weight:700}
.store-map-actions a:first-child{background:var(--ink);color:#fff}
@media(max-width:700px){
 .brand-logo-link{min-width:138px;max-width:180px}.brand-logo{height:44px}
 .other-ideas details.visual-place summary{grid-template-columns:108px minmax(0,1fr) auto;gap:14px;min-height:105px}
 .visual-place .place-summary-media,.visual-place .place-summary-media img{min-height:105px}
 .visual-place .place-summary-title{padding:15px 0;font-size:14px}
 .other-ideas details.visual-place summary::after{margin-right:15px}
 .other-ideas details.grocery-place summary{grid-template-columns:minmax(0,1fr) auto;padding:20px 16px;min-height:82px}
}
@media(max-width:390px){
 .other-ideas details.visual-place summary{grid-template-columns:94px minmax(0,1fr) auto;gap:12px}
 .visual-place .place-summary-title{font-size:13px}
}
'''


def language_key(doc: BeautifulSoup) -> str:
    lang = (doc.html.get("lang") if doc.html else "en") or "en"
    if lang.startswith("nb") or lang.startswith("no"):
        return "no"
    if lang.startswith("de"):
        return "de"
    return "en"


def add_source_credit(doc: BeautifulSoup, body, sources):
    old = body.select_one(".visual-photo-credit") if body else None
    if old:
        old.decompose()
    if not body or not sources:
        return
    p = doc.new_tag("p")
    p["class"] = ["photo-credit", "visual-photo-credit"]
    for i, (label, href) in enumerate(sources):
        if i:
            p.append(" · ")
        a = doc.new_tag("a", href=href, target="_blank", rel="noopener noreferrer")
        a.string = label + " ↗"
        p.append(a)
    body.append(p)


def build_grocery_body(doc: BeautifulSoup, body, lang: str):
    if not body:
        return
    c = GROCERY[lang]
    body.clear()
    p = doc.new_tag("p")
    p.string = c["intro"]
    body.append(p)
    listing = doc.new_tag("div")
    listing["class"] = ["store-list"]
    for store in STORES:
        row = doc.new_tag("div")
        row["class"] = ["store-row"]
        name = doc.new_tag("strong")
        name.string = store["name"]
        row.append(name)
        address = doc.new_tag("small")
        address.string = store["address"]
        row.append(address)
        note = doc.new_tag("small")
        note.string = c[store["note"]]
        row.append(note)
        actions = doc.new_tag("div")
        actions["class"] = ["store-map-actions"]
        for label, href in (("Google Maps", store["google"]), ("Apple Maps", store["apple"])):
            a = doc.new_tag("a", href=href, target="_blank", rel="noopener noreferrer")
            a.string = label + " ↗"
            actions.append(a)
        row.append(actions)
        listing.append(row)
    body.append(listing)


def process_page(path: Path) -> None:
    doc = BeautifulSoup(path.read_text(), "html.parser")
    lang = language_key(doc)

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
    for index, card in enumerate(cards[:6]):
        classes = [c for c in card.get("class", []) if c not in ("visual-place", "grocery-place")]
        classes.append("visual-place")
        if index == 4:
            classes.append("grocery-place")
        card["class"] = classes

        summary = card.find("summary", recursive=False)
        if not summary:
            continue
        title = summary.select_one(".place-summary-title")
        title_text = title.get_text(" ", strip=True) if title else summary.get_text(" ", strip=True)
        summary.clear()

        media_spec = CARD_MEDIA[index]
        if media_spec:
            media = doc.new_tag("span")
            media["class"] = ["place-summary-media"]
            if len(media_spec["images"]) > 1:
                media["class"].append("media-pair")
            for image in media_spec["images"]:
                img = doc.new_tag(
                    "img",
                    src=PLACEHOLDER,
                    alt=image["alt"][lang],
                    width="900",
                    height="600",
                    loading="lazy",
                    decoding="async",
                )
                img["data-src"] = image["url"]
                img["fetchpriority"] = "low"
                img["referrerpolicy"] = "no-referrer"
                media.append(img)
            summary.append(media)

        label = doc.new_tag("span")
        label["class"] = ["place-summary-title"]
        label.string = title_text
        if index == 4:
            badge = doc.new_tag("span")
            badge["class"] = ["grocery-badge"]
            badge.string = "24/7"
            label.append(badge)
        summary.append(label)

        body = card.select_one(".detail-body")
        if index == 4:
            build_grocery_body(doc, body, lang)
        elif media_spec:
            add_source_credit(doc, body, media_spec["sources"])

    path.write_text(str(doc))


for page in ("index.html", "no.html", "de.html"):
    process_page(ROOT / page)

css = ROOT / "guide-v3.css"
text = css.read_text()
marker = "/* BP visual explore cards"
if marker in text:
    text = text.split(marker, 1)[0].rstrip() + "\n"
css.write_text(text + CSS)
