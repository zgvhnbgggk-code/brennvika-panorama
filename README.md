# Brennvik panorama — gjesteguide

Statisk, mobiltilpasset gjesteguide på engelsk (`index.html`), norsk (`no.html`) og tysk (`de.html`), publisert fra `main` med GitHub Pages.

## Drift og ytelse
Alle tekster, Wi-Fi-opplysninger og menyer finnes i HTML. Det er ingen JavaScript-basert lasting av innhold, MutationObserver-løkker eller periodisk polling. `guide-v3.js` gir bare kopieringsknapper, menykomfort og bevaring av valgt avsnitt ved språkbytte. Gamle `app.js` og tilleggsskript er beholdt som historisk kilde, men lastes ikke av de nye sidene.

Egne fotografier er lokalt lagret i `assets/photos/` som komprimerte AVIF-bilder. De to fiskebildene er brukerens originale fotografier, uten generativ endring. Kystbildet er kun beskåret og komprimert. Eksterne museums-/Commons-bilder lastes først ved behov og har kildehenvisninger og fallback-lenke.

## Oppdatere innhold
`sections/{en,no,de}-{1,2}.html` inneholder de opprinnelige hytteinstruksene. `tools/build_guide.py` kombinerer disse med opplevelsestekstene og bygger de tre statiske sidene.

```sh
python -m pip install beautifulsoup4
python tools/build_guide.py
```

Kontroller alle språk før du publiserer. Nettstedet må beholde oppdatert informasjon om drikkevann, dør, alarm, varme og kontakt.

## Wi-Fi
Wi-Fi-passordet publiseres etter eierens uttrykkelige ønske. Dette er ikke et skjermet område; `noindex` er ikke adgangskontroll. Når passordet byttes i ruteren, må også teksten i byggeverktøyet og QR-koden i `assets/wifi-qr.png` oppdateres samtidig, og sidene bygges på nytt. Skann QR-koden og kontroller at den har nøyaktig samme SSID/passord som tekstfeltet. Nettstedet endrer ikke ruteren, deaktiverer ikke nettet og oppretter ingen påminnelser.

## Publisering
GitHub Pages bygger fra `main`. Den medfølgende engangsarbeidsflyten `.github/workflows/install-guide-release.yml` pakker ut en kontrollsummert oppgradering, validerer innholdet og ber Pages om et nytt bygg. Den kjører bare når en utgivelsesmanifest legges inn eller manuelt startes. Etter installering fjernes transportfilene; de vanlige HTML-/CSS-/JS-filene er da de publiserte kildene.

## Kontroll
Versjon 3 er lokalt testet i Chromium i bredder 320, 390 og 1440 piksler på alle tre språk: ingen horisontal overflow, ingen JavaScript-feil, fungerende meny, kopiering og språklenker, samt lesbart innhold uten JavaScript. Dette er ikke en måling av faktisk lastetid på gjestenes mobilnett. Fiskeregler lenkes til Fiskeridirektoratets oppdaterte informasjon.
