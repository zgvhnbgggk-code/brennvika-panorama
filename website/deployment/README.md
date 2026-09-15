# Brennvik Panorama – forhåndsvisning på Cloudflare

Dette er den eksisterende nettsiden, ferdig bygget med alle 31 galleribilder og norsk/engelsk innhold. Hele `dist` følger med. Du trenger ikke Python, bildeverktøy eller et nytt nettsideprosjekt for å publisere pakken.

## Siste status – etter første publisering

Pages-prosjektet `brennvik-panorama` er opprettet og første forhåndsvisning er publisert:

- https://preview.brennvik-panorama.pages.dev/
- https://748a93ff.brennvik-panorama.pages.dev

Ikke opprett prosjektet på nytt. Videre oppdateringer lastes opp med `pages deploy .\dist --project-name brennvik-panorama --branch preview` fra nettsidemappen.

Kontrollert i den publiserte versjonen: forside på PC, galleri med 31 bilder, bildefiltrering, åpning, neste bilde, Escape-lukking og engelsk navigasjon. Mobilvisning er ikke kontrollert; testnettleseren tilbyr ikke størrelsesendring eller mobilmodus.

Lodgify-feltet forsvant etter datovalg i testnettleseren. Feilloggen viste `Cannot read properties of undefined (reading 'title')` i leverandørens skript. Bestillingslenken startet med EUR før feilen. Årsaken til det mislykkede prisoppslaget er ikke avklart; leverandørens checkout viste tidligere sikkerhetsverifisering i samme testmiljø.

Kildekoden har nå en egen feilbeskjed utenfor Lodgifys komponent. Den vises også hvis komponenten krasjer etter innlasting. Bestillingslenkene får NOK og beholder eventuelle datoer og gjesteantall. Gjesteetikettene er ryddet opp. Oppdateringen må lastes opp til det eksisterende Pages-prosjektet og testes der. Hele bookingløpet er fortsatt ikke godkjent, og hoveddomenet skal ikke flyttes ennå.

## Opprinnelig klargjøring 15. september 2026

- Kildekode: `zgvhnbgggk-code/brennvika-panorama`, gren `website/brennvik-panorama-preview`, mappe `website`.
- Cloudflare-produkt: Pages, med opplasting av ferdige filer gjennom Wrangler.
- Ønsket prosjektnavn: `brennvik-panorama`. Kontroller eksisterende prosjekter før opprettelse.
- Produksjonsgren: `main`. Forhåndsvisningsgren: `preview`.
- Domenet `brennvikpanorama.no` skal først kobles til etter visuell kontroll og kontroll av bookingløpet.
- Ingen kobling til vaskevarsling, D1, e-post, SMS eller Homey.

Cloudflare-kontoen kunne ikke åpnes fra denne samtalen: koblingen stilte ingen verktøy til rådighet, og Wrangler i arbeidsmiljøet var ikke innlogget. Ingen Cloudflare-ressurser eller DNS-poster er endret. Bruk den eksisterende Wrangler-innloggingen på PC-en.

## 1. Kontroller kontoen og eksisterende prosjekter

Kjør i PowerShell:

```powershell
npx.cmd wrangler@4.131.2 whoami
npx.cmd wrangler@4.131.2 pages project list --json
```

Hvis Wrangler oppgir at du ikke er innlogget, kjør `npx.cmd wrangler@4.131.2 login` og fullfør innloggingen i din egen nettleser. Ikke lim inn passord eller API-nøkler i chatten.

Kontroller at riktig Cloudflare-konto er valgt. Hvis `brennvik-panorama` allerede finnes, kontroller produksjonsgren og oppsett før publisering; behold prosjektets identitet. Hvis det ikke finnes, opprett det slik:

```powershell
npx.cmd wrangler@4.131.2 pages project create brennvik-panorama --production-branch main
```

## 2. Publiser forhåndsvisningen

Pakk ut ZIP-filen og åpne PowerShell i mappen som inneholder `wrangler.jsonc` og `dist`. Kjør:

```powershell
npx.cmd wrangler@4.131.2 pages deploy .\dist --project-name brennvik-panorama --branch preview
```

Bruk den eksakte URL-en som Wrangler returnerer, og kontroller at publiseringen er merket Preview. Denne kommandoen flytter ikke brennvikpanorama.no eller endrer vaskevarslingen.

Forhåndsvisningen er normalt tilgjengelig for alle som har lenken. `noindex`, `robots.txt` og `X-Robots-Tag` ber søkemotorer om å holde den utenfor søkeresultater; de er ikke passordbeskyttelse. Den eksisterende ChatGPT-forhåndsvisningen har fortsatt sin private tilgang.

Direct Upload kan senere automatiseres fra GitHub Actions via Wrangler. Det kan ikke gjøres om til Cloudflares innebygde Git-integrasjon i samme Pages-prosjekt. Det er ikke satt opp automatisk publisering ved GitHub-endringer ennå.

## 3. Kontroller før domenet flyttes

- Mobil og PC: forside, meny, språkbytte, galleri, fullskjermbilder og knappen for bestilling. Kontroller at ingenting klippes eller gir uønsket vannrett rulling.
- Booking: velg ledige datoer og 2–4 gjester på både norsk og engelsk side. Kontroller riktig hytte, datoer, pris/tillegg i NOK og vilkår frem til siste oppsummering før bestilling. Ikke opprett en prøvebestilling eller gjennomfør betaling.
- Direkte bestillingslenke skal fungere når den innebygde modulen ikke lastes.
- Kontroller `/en/overview` og `/en/availability`, som videresendes til de nye engelske sidene.
- Før produksjon: oppdater canonical/hreflang og indeksering for det endelige domenet. Fjern også `X-Robots-Tag: noindex, nofollow` fra produksjonsversjonen.
- Dokumenter nåværende DNS og en tilbakeføringsplan før domenekobling.

Gjennomført her: kontroll av lokale lenker og bildefiler, originalbildenes sjekksummer, alle 31 bilder i begge gallerier, bookinginnstillingene, filgrenser og ZIP-integritet. Visuell mobiltest og hele bookingløpet er ikke godkjent. Lodgifys bestillingsside viste sikkerhetsverifisering i testnettleseren, også etter én ny innlasting.

## Kilde og gjenoppbygging

Fra kildeprosjektet: `python source/build.py`, deretter `python source/package_cloudflare.py /sti/til/brennvik-panorama-cloudflare.zip`. Fra en kildekodekopi uten bilder må først `source/restore_assets.py` kjøres med Pillow installert. Filene `_headers` og `_redirects` legges til i pakken; det endrer ikke den eksisterende ChatGPT-publiseringen.

Dokumentasjon:

- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/functions/wrangler-configuration/
