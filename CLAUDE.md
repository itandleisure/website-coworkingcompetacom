# Co Working Cómpeta – website

Statische HTML/CSS-website voor Co Working Cómpeta (office space met 2 vaste werkplekken in Cómpeta, Andalusië).
Vervangt de huidige WordPress-site op https://coworkingcompeta.com/.

## Afspraken
- Communiceer met de eigenaar in het **Nederlands**, in eenvoudige taal (beginner met Claude Code).
- Alleen HTML, CSS en een klein beetje vanilla JavaScript. Geen frameworks, geen build-stap.
- Ontwerp: **opgefrist**, maar met dezelfde huisstijl als de oude site.
- Teksten overnemen van de oude site; tikfouten en dubbele stukken mogen verbeterd worden, inhoud niet veranderen zonder overleg.

## Logo (optie B "Wit dorp", gekozen 24-09-2026)
- Oranje cirkel met witte huisjes + Andalusische boogdeur, tekst "CoWorking" (Lato 900, blauw) en "CÓMPETA" (Lato 400, oranje, gespatieerd).
- Staat als **inline SVG** in de header van elke pagina (zodat het Lato-lettertype van de pagina gebruikt wordt). Wijzig je het logo, pas het dan in ALLE 16 index.html-bestanden aan.
- Icoon-bestanden: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `images/logo-co-working-competa-icoon.png` (512px, voor Google).
- `logo-opties.html` is alleen een keuzepagina; niet uploaden.

## Huisstijl
- Lettertype: Lato (zelf gehost in `fonts/`)
- Donkerblauw: `#29394A` (hoofdkleur, tekst)
- Oranje: `#F29222` (accent, knoppen)
- Lichtgrijs: `#F1F1F1` (achtergrondvlakken)
- Kleuren staan als variabelen bovenaan `css/style.css`.

## Structuur
- `index.html` – homepage (NL)
- `wie-huren-hier-een-werkplek/index.html` – huurders (NL)
- `contact/index.html` – contact (NL)
- `en/`, `es/`, `de/` – dezelfde pagina's in Engels, Spaans en Duits (EN/ES met exact dezelfde URL's als de oude site; DE is nieuw):
  - `en/`, `en/who-rents-a-workspace-here/`, `en/contact/`, `en/thank-you/`
  - `es/`, `es/quien-alquila-un-espacio-de-trabajo-aqui/`, `es/contacto/`, `es/gracias/`
  - `de/`, `de/wer-mietet-hier-einen-arbeitsplatz/`, `de/kontakt/`, `de/danke/`
- `bedankt/index.html` – NL bedankpagina na het formulier (alle bedankpagina's: noindex)
- Tekstwijziging? Pas die in ALLE 4 talen aan (en in de FAQ-JSON-LD als het een FAQ is). Aanspreekvorm: NL "je", EN "you", ES "tú", DE "du".
- Header, footer en WhatsApp-knop staan in elke pagina los herhaald: pas ze bij een wijziging in ALLE pagina's aan.
- `css/style.css` – alle opmaak, gedeeld door alle pagina's
- `images/` – foto's en logo

## Contactgegevens
- E-mail: info@coworkingcompeta.com
- WhatsApp: +34 611 026 875 (https://wa.me/34611026875)
- Adres: Calle Paralela Avenida Constitución 4, 29754 Cómpeta (Málaga) — NIET meer "C. San Antonio" (oude site)
- Tarief: **€250** ex IVA per maand (niet €350 zoals op de oude site), min. 6 maanden, daarna maandelijks opzegbaar
- Beschikbaarheid: **1 werkplek vrij** (van de 2 vaste werkplekken; NIET 4 zoals op de oude site)

## Doelgroep (belangrijk voor alle teksten)
- Ondernemers met een **schaalbare business** (product of dienst) die echt willen groeien. De eigenaar wil met die persoon samen optrekken.
- **Niet** voor freelancers/zzp'ers die uren verkopen ("uurtje-factuurtje") en niet voor losse flexplekken.
- Noem geen omzetbedragen op de site; gebruik "schaalbaar", "groeien", "opschalen".

## Hosting
- **Nieuw (in overstap):** GitHub Pages via repository `itandleisure/website-coworkingcompetacom`. Domein `coworkingcompeta.com` staat in `CNAME`; DNS blijft bij Vimexx (MX-records voor mail NIET wijzigen).
  - `_config.yml` sluit CLAUDE.md, tools/ en logo-opties.html uit van de website; `.gitignore` houdt images/origineel/ en images/nieuw/ buiten GitHub.
  - `.htaccess` werkt NIET op GitHub Pages (https-doorsturing regelt GitHub zelf via "Enforce HTTPS").
- Oud: **Vimexx**. Uploaden gaat via FTP of het bestandsbeheer in het Vimexx-controlpanel.
- Het contactformulier gebruikt **FormSubmit** (`https://formsubmit.co/info@coworkingcompeta.com`), omdat statische HTML zelf geen e-mail kan versturen. Na verzenden gaat de bezoeker naar `/bedankt/` (EN/ES: eigen bedankpagina maken).
- De eerste keer dat het formulier op de live site wordt gebruikt, stuurt FormSubmit een activatiemail naar info@; die link moet de eigenaar één keer aanklikken.

## Uploaden / livegang
- `python tools/maak-upload.py` maakt `../coworking-competa-UPLOAD/` en `../coworking-competa-upload.zip` met alleen de bestanden die online horen (zonder CLAUDE.md, tools, images/origineel, images/nieuw, logo-opties.html).
- Inhoud daarvan komt in `public_html` bij Vimexx. Na elke wijziging opnieuw draaien en de gewijzigde bestanden uploaden.
- Oude WordPress-bestanden tijdelijk in `public_html/oud-wordpress/` (afgeschermd via .htaccess); na een paar weken verwijderen.

## Cookies, Analytics en privacy
- Google Analytics **G-T5HDEV8EP7** (zelfde als oude site) via `js/cookies.js`: laadt pas NA "Accepteren"; keuze in localStorage `cookie-keuze`. Teksten van de melding (4 talen) staan in dat bestand.
- Elke pagina laadt `<script src="/js/cookies.js"></script>` vlak voor `</body>`; footer heeft links "Privacy" + knop "Cookie-instellingen" (`data-cookie-instellingen`). Nieuwe pagina's: beide toevoegen.
- Privacyverklaring: `/privacy/`, `/en/privacy/`, `/es/privacidad/`, `/de/datenschutz/`. Toezichthouder: AEPD (Spanje).
- Lato staat op eigen server: `fonts/lato-400|400-italic|700|900.woff2` (latin-subset), `@font-face` bovenaan `css/style.css`. GEEN Google Fonts-links meer gebruiken.
- Eigenaar: Frans van Dokkumburg (IT and Leisure Solutions), NIE Z2699832M — staat in "Wie zijn wij" van de privacyverklaring (LSSI).

## Hulpmiddelen
- `tools/fotos-omzetten.py` – zet een foto om naar WebP met een SEO-naam.
- `images/origineel/` – originele bestanden van de oude WordPress-site (niet uploaden naar Vimexx).

## SEO (op elke pagina toepassen)
- Unieke `<title>` (max ~60 tekens) en `meta description` (max ~155 tekens)
- `canonical` + `hreflang` (nl, en, es, de, x-default) naar de juiste taalversies
- Open Graph-tags (og:title, og:description, og:image, og:url)
- Precies één `<h1>` per pagina, daarna logisch h2/h3
- Elke afbeelding een beschrijvende `alt`-tekst, `width`/`height`, en `loading="lazy"` onder de vouw
- Afbeeldingen als WebP, max. ~200 KB, met beschrijvende bestandsnaam (bv. `werkplek-competa-bureau.webp`)
- Gestructureerde data (JSON-LD): LocalBusiness op elke pagina, FAQPage op de homepage (vragen moeten ook zichtbaar op de pagina staan)
- Nieuwe pagina's toevoegen aan `sitemap.xml`
- Zelfde URL's als de oude WordPress-site behouden; wijzigingen doorsturen met 301 in `.htaccess`

## Foto's
- Nieuwe foto's van de eigenaar komen in `images/nieuw/`. Claude zet ze om naar WebP, geeft ze een SEO-vriendelijke naam en plaatst ze in `images/`.

## Status / nog te doen
- [x] Homepage NL
- [x] Afbeeldingen lokaal in `images/` (WebP), logo bijgesneden, favicon
- [x] Contactformulier naar info@coworkingcompeta.com + bedankpagina
- [ ] Nieuwe foto's van eigenaar verwerken (`images/nieuw/`)
- [x] Pagina's "Wie huren hier een werkplek" en "Contact"
- [x] Engelse, Spaanse en Duitse versies
- [x] Online via GitHub Pages (25-09-2026): DNS bij Vimexx (DirectAdmin) omgezet — A @ naar 185.199.108-111.153, CNAME www naar itandleisure.github.io, oude A/AAAA/TLSA voor @ en www verwijderd
- [ ] "Enforce HTTPS" aanzetten in repo → Settings → Pages zodra het certificaat klaar is
- [ ] Contactformulier testen op de live site + FormSubmit-activatiemail bevestigen
- [ ] Hostingpakket Vimexx omlaag naar alleen mail (pas als alles goed werkt)

## Online zetten (vanaf nu)
- Wijzigingen opslaan en versturen: `git add -A`, `git commit -m "..."`, `git push`. GitHub Pages zet het binnen ~1 minuut live.
- `tools/maak-upload.py` is alleen nog nodig voor de oude FTP-manier.
