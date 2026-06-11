# Gastrovino Rotterdam — Site-audit (11 juni 2026, Fable)

Status: `next build` slaagt zonder fouten of warnings; alle 6 routes prerenderen statisch
(`/`, `/assortiment`, `/borrelplanken`, `/catering`, `/over-ons`, `/proeverijen`).
De huisstijl (Brand Book 2026) is consistent doorgevoerd via Tailwind-tokens.
Onderstaande punten staan op prioriteit, voor afronding met Sonnet.

---

## 🔴 Kritiek — functioneel onaf of misleidend

### 1. De bestelknop van de Borrelplank Builder doet niets
`src/components/BorrelplankBuilder.tsx` (~regel 822): `onOrder={() => setOrdered(true)}`.
De gebruiker krijgt "Bedankt voor je bestelling! … Je ontvangt een bevestiging per e-mail",
maar er wordt **niets verstuurd of opgeslagen**. Dit is een nep-bevestiging.
**Fix (MVP):** zelfde patroon als `ProeverijAanvraag` — een `mailto:` openen met de
samengestelde plank (items, aantallen, totaal, naam/telefoon) als body. Of de
bevestigingstekst herschrijven naar "bel/mail ons om af te ronden".

### 2. "Zelf samenstellen" gebruikt hardgecodeerde, mogelijk fictieve productdata
In `BorrelplankBuilder.tsx` staan `WIJNEN`, `KAZEN` en `SNACKS` hardcoded
(regels 32–168) met eigen SKU's (`GV-LOK-ROTTERDAMSCHE`, `GV-DEL-TRUFFELKAAS`, …),
prijzen en beschrijvingen die **niet uit de gescrapete webshopdata komen**
(`data/rotterdam_shop_products.json`, 90 echte producten). De vaste planken komen
wél uit de echte data (`BORRELPLANKEN` uit `@/lib/assortiment-data`).
**Fix:** wijnen uit `WIJNEN` van `assortiment-data.ts` halen; kazen/snacks ofwel
laten verifiëren door de eigenaresses ofwel duidelijk als "indicatief, prijs in
winkel" markeren. De "Wijn-kaas tip" (regel ~735) noemt bovendien altijd
"Rotterdamsche Oude", ook als die kaas niet geselecteerd is.

### 3. Hero-foto's hotlinken naar de oude site
Homepage (`src/app/page.tsx:238`) en Over Ons (`src/app/over-ons/page.tsx:68`) laden
`https://www.gastrovinorotterdam.nl/data/upload/images/1024-1364-1.jpg` rechtstreeks.
Breekt zodra de oude site offline gaat (wat het doel van dit project lijkt).
**Fix:** afbeelding downloaden naar `public/` en lokaal serveren (er staan al 98
productfoto's lokaal in `public/shop/`).

---

## 🟠 Belangrijk — content & data

### 4. Evenementdatum "19 juni 2026" staat op 5 plekken hardcoded
Over 8 dagen is de site verouderd. Locaties:
- `src/app/page.tsx` — `UPCOMING_EVENT` (regel 49) én NavCard-eyebrow "Volgende datum: 19 juni" (regel 81)
- `src/app/proeverijen/page.tsx` — `EVENEMENTEN[0]` (regel 24) + hero-regel (regel 147) + metadata (regel 11)
- `src/components/ProeverijAanvraag.tsx` — `PROEVERIJ_OPTIES[0]` (regel 7)

**Fix:** één bron maken, bv. `src/lib/evenementen.ts`, en overal importeren.
Overweeg een nette fallback ("Nieuwe datum volgt") als de datum verstreken is.

### 5. Verouderde metadata op /assortiment
`src/app/assortiment/page.tsx`: description zegt "12 handgeselecteerde wijnen" —
het zijn er 43 (van 90 producten totaal). Tekst bijwerken of dynamisch maken met
`FILTER_COUNTS`.

### 6. Vier producten zonder afbeelding
Product-id's 86, 87, 89, 96 in `rotterdam_shop_products.json` hebben geen
`localImages`. Ze vallen terug op SVG-placeholders (werkt), maar check of de
scraper ze miste (`npm run scrape` opnieuw) of dat de webshop ze echt niet heeft.

### 7. Social-links niet geverifieerd
Header/footer linken naar `instagram.com/gastrovinorotterdam`,
`facebook.com/gastrovinorotterdam` en `tiktok.com/@gastrovinorotterdam`.
Controleer of die handles kloppen voordat dit live gaat.

---

## 🟡 SEO — ontbreekt volledig (belangrijk voor een lokale winkel)

8. **Geen `metadataBase`** in `layout.tsx` → OG-tags resolven niet naar absolute URL's.
9. **Geen `sitemap.ts` en `robots.ts`** (App Router maakt dit triviaal).
10. **Geen favicon/app-icon** — `src/app/icon.png` ontbreekt; logo's staan klaar in
    `public/brand/` (logo-rond.png).
11. **Geen OG-afbeelding** (`opengraph-image`) — bij delen via WhatsApp/socials
    (dé kanalen voor deze doelgroep) toont de link nu niets.
12. **Geen JSON-LD `LocalBusiness`/`WineStore` schema** — adres, openingstijden en
    geo staan al als data in `page.tsx` (`STORE`), dus dit is 20 regels werk.
    Grootste SEO-winst voor "wijnwinkel Rotterdam"-zoekverkeer.

---

## 🟢 Klein / netheid

13. **Toegankelijkheid Builder:** product- en plankkaarten zijn klikbare `<div>`'s
    zonder `role`/`tabIndex` — niet met toetsenbord te bedienen. De binnenknop
    ("Voeg toe") vangt dit deels af voor `ProductCard`, maar `VastePlankCard` heeft
    helemaal geen focusbaar element. Maak van de kaart een `<button>` of voeg
    keyboard-handlers toe.
14. **Oude kleurwaarden in hero-gradients:** `page.tsx:182` en `over-ons/page.tsx:40`
    gebruiken nog rgba's van het oude palet (olijfgroen `107,122,62`, terracotta
    `196,113,74`) i.p.v. de Brand Book-kleuren (#71413D / #B39662). Subtiel, maar
    de gloed is nu groenig op een verder warm-bruine site.
15. **DATA_BLUEPRINT.md is verouderd:** beschrijft het oude kleurenpalet
    (#FAF8F5, olive #6B7A3E) en oude fonts (Cormorant/Inter) — de werkelijke
    huisstijl staat in `tailwind.config.ts` + `layout.tsx` (Baskerville/Jost).
    Bijwerken of een notitie bovenaan zetten, anders stuurt het een volgende
    AI-sessie de verkeerde kant op.
16. **Ongebruikte infrastructuur:** `prisma/`, `docker-compose.yml`, `pg`, `pg-mem`,
    `playwright`, `axios`, `@prisma/*` en de seed-scripts worden door de site niet
    gebruikt (alles is statische JSON). Bewust houden voor de scraper mag, maar
    `prisma`/`pg`-spul kan weg als er geen database komt.
17. **Geen git-repository.** Geen versiebeheer, geen vangnet. Eerste actie voor
    Sonnet: `git init` + `.gitignore` (node_modules, .next, .env,
    tsconfig.tsbuildinfo, .DS_Store) + initial commit.
18. **Eigen 404-pagina ontbreekt** (`src/app/not-found.tsx`) — nu kale default die
    niet bij de huisstijl past.
19. **ProeverijAanvraag:** toont "Aanvraag verstuurd!" direct na het openen van de
    mailclient — ook als de gebruiker de mail nooit verstuurt. Copy iets
    voorzichtiger maken ("Je e-mailprogramma is geopend — verstuur de mail om de
    aanvraag af te ronden"). De huidige tekst zegt dit al half; de kop
    "Aanvraag verstuurd!" klopt alleen niet.

---

## Aanbevolen volgorde voor Sonnet

1. `git init` + `.gitignore` + commit huidige staat (#17)
2. Bestelflow Builder echt maken via mailto (#1) en builder-data uit echte bron (#2)
3. Hero-foto's lokaal zetten (#3)
4. Evenementdata centraliseren (#4) + metadata fixen (#5)
5. SEO-pakket: metadataBase, sitemap, robots, icon, OG-image, JSON-LD (#8–12)
6. Rest van 🟢 naar tijd/zin
