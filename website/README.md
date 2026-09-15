# Brennvik Panorama

Norwegian and English website for Brennvik Panorama, owned by Skoglund Heim AS.

## Content and design

The visual reference is the existing guest guide at https://zgvhnbgggk-code.github.io/brennvika-panorama/. The design retains its sea-green palette, warm paper surfaces, serif headings and owner logo. Gallery photographs come from the existing Lodgify website; their original URLs and checksums are recorded in `source/gallery.json`.

`dist/` contains the complete static website. There are no application accounts, analytics pixels, database, stored guest records or custom payment handling. The official Lodgify booking integration handles availability and reservations. The guest guide is linked as a separate website.

## Rebuild

For a source-only GitHub checkout, install Pillow and run `python source/restore_assets.py` first to restore verified gallery bytes and responsive variants. Then run `python source/build.py` after editing the bilingual content or photo choices. It writes the Norwegian and English routes to `dist/`. Gallery captions, original URLs and local image variants live in `source/gallery.json`; page image choices live in `source/visuals.json`. Verified public booking settings live in `source/booking.json`.

Serve `dist/` as the public root. Keep the correct page paths when deploying. Photo originals and responsive versions are tracked in this Site repository.

## Publication status

The initial release is a private preview. `noindex,nofollow` and `robots.txt` deliberately prevent indexing during review. Before the public domain is connected, confirm the intended domain, update indexing and canonical/hreflang metadata, and verify the booking flow through the final pre-payment summary. No live reservations or payment tests are part of the preview build.

The former website contains conflicting maximum occupancy statements. The current public Lodgify model confirms four guests and two double beds; this site uses those values. The owner has confirmed a floor area of 49 m² in prior project instructions, even though the old provider metadata has an inconsistent area-unit flag.

## Updating content

- Main content and translations: `source/build.py`.
- Visual styles and responsive layout: `dist/site.css`.
- Mobile navigation, lightbox and gallery filters: `dist/site.js`.
- Authoritative operational guest instructions: the separate guest guide.
- Booking rates, limits, availability and policies: Lodgify.

Source photos are real photographs; no AI imagery is used.

## Cloudflare preview preparation

The existing site can be uploaded to Cloudflare Pages without rebuilding its design. `wrangler.jsonc` defines the Pages output directory. Follow `deployment/README.md` for the account check and preview deployment. Run `python source/package_cloudflare.py /absolute/path/brennvik-panorama-cloudflare.zip` to validate and package the complete prebuilt site, provider-specific preview headers, redirects and upload instructions.

The owner published the initial Cloudflare Pages preview on September 15: https://preview.brennvik-panorama.pages.dev/ (deployment https://748a93ff.brennvik-panorama.pages.dev). Reuse Pages project `brennvik-panorama`, production branch `main`, preview branch `preview`. Do not create it again. The primary domain has not been moved by this work. Desktop, gallery controls and English navigation were checked in the live preview. Mobile rendering and the complete booking flow remain pending. The Lodgify widget failed after date selection in the test browser and initially used EUR; `dist/booking.js` now provides independent failure feedback and keeps checkout links in NOK. This guard still requires uploading and browser verification on Cloudflare. It does not repair or approve Lodgify’s live price service.
