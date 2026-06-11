# Gastrovino Rotterdam — Data & Design Blueprint
> **Single Source of Truth** · Versie 2.1 · 11 juni 2026
>
> ⚠️ **Kleurenpalet hieronder is verouderd.** Het werkelijke palet staat in
> `tailwind.config.ts` (tokens: terracotta #71413D, gold #B39662, cream #FBF1DB, olive).
> Typografie: Libre Baskerville (serif) + Jost (sans), geconfigureerd in `src/app/layout.tsx`.

Dit document is de definitieve architectuurreferentie voor het Gastrovino Rotterdam Next.js platform. Alle technische besluiten, design-keuzes en content-structuur staan hier vastgelegd.

---

## 1. Brand Identity & Design System

### 1.1 Officiële naam & positionering
- **Naam:** Gastrovino Rotterdam
- **Tagline:** *Dé plek voor wijn, delicatessen & Rotterdamse smaak*
- **Locatie:** Nieuwe Binnenweg 335A, 3021 GJ Rotterdam
- **Opening:** November 2023
- **Contactpersonen:** Naomi & Melanie

### 1.2 Stijlrichtlijn — Warme Italiaanse Enoteca

> **Absoluut geen dark-mode of kille tech-vibe.** De volledige visuele taal is warm, landelijk en luxueus — geïnspireerd op een authentieke Italiaanse enoteca.

| Token | Waarde | Gebruik |
| :--- | :--- | :--- |
| `--color-background` | `#FAF8F5` | Paginaachtergrond (warm crème/linen) |
| `--color-surface` | `#F3EDE4` | Kaart- en sectieachtergrond |
| `--color-surface-raised` | `#EDE4D6` | Hover-states, borders |
| `--color-olive` | `#6B7A3E` | Primaire accentkleur (zacht olijfgroen) |
| `--color-olive-light` | `#8C9E52` | Links, actieve nav-items |
| `--color-terracotta` | `#C4714A` | Highlight, CTA-buttons |
| `--color-terracotta-dark` | `#A85A35` | Button-hover |
| `--color-gold` | `#C9973F` | Badges, sterren, premium labels |
| `--color-gold-light` | `#E4B86A` | Decoratieve accenten |
| `--color-ink` | `#2C2416` | Primaire bodytekst (warm zwart) |
| `--color-ink-muted` | `#6B5D4F` | Secundaire tekst, onderschriften |
| `--color-ink-subtle` | `#A0907F` | Placeholders, disabled |

**Typografie:**
- **Koppen (h1–h3):** `Cormorant Garamond` of `Playfair Display` (serif) — Italiaans vakmanschap, klasse
- **Sub-koppen (h4–h6):** `Cormorant Garamond Medium` of kleine versaals (letter-spacing: 0.08em)
- **Bodytekst:** `Inter` of `DM Sans` (400/500) — maximale leesbaarheid
- **Accenten/labels:** `DM Serif Display Italic` of `Cormorant Garamond Italic`

**Visueel DNA:**
- Ruime whitespace, geen kille zwarte vlakken
- Zachte schaduwen (`box-shadow: 0 2px 12px rgba(44,36,22,0.08)`)
- Afgeronde hoeken: `border-radius: 12px` (kaarten), `8px` (buttons)
- Subtiele textuur-overlays op hero-secties (linen/papier-achtig)
- Foto's met warme kleurgrading (verhoogd contrast, licht gebronsd)

---

## 2. Tech Stack

| Laag | Technologie | Versie |
| :--- | :--- | :--- |
| Framework | Next.js App Router | 15.x (Turbopack) |
| Taal | TypeScript | 6.x |
| Styling | Tailwind CSS | v3.4 |
| UI-iconen | Lucide React | latest |
| Database ORM | Prisma | 7.x |
| DB Adapter | `@prisma/adapter-pg` + `pg` | latest |
| Database | PostgreSQL 16 (Docker) | `postgres:16-alpine` |
| HTTP scraping | Axios + Cheerio | latest |
| JS-rendering scraping | Playwright | 1.44+ |
| Fonts | Google Fonts (Cormorant Garamond, Inter) | via `next/font` |

**Prisma 7 breking change:** `url` staat NIET in `schema.prisma`. De connection string leeft uitsluitend in `prisma.config.ts` via `PrismaPg` adapter.

---

## 3. Databronnen

| Bron | URL | Type | Scraper |
| :--- | :--- | :--- | :--- |
| Landelijke webshop | gastrovinoshop.nl | Magento + AngularJS | Playwright |
| Rotterdam lokale winkel | gastrovinorotterdam.nl | Shoppagina.nl CMS | Axios + Cheerio |

### 3.1 Scraped output — beschikbare data

**`/data/scraped_products.json`** — 12 rode wijnen (gastrovinoshop.nl)
- 3x Ventopuro (Spanje, Garnacha)
- 3x Borsao (Spanje, Campo de Borja)
- 3x Ribera del Duero (Spanje, Tempranillo)
- 3x Italiaans DOCG (druif varieert)
- Prijs incl. BTW via `.price-including-tax .price`
- Specs via `#product-attribute-specs-table tr`

**`/data/rotterdam_local_content.json`** — 6 pagina's lokale content
- Homepage: sfeer, 11 afbeeldingen, 4 events
- Over Ons: winkelgeschiedenis, team (Naomi & Melanie), adres
- Proeverijen: 3 producten + events (zie §5)
- Lunch/Catering: 7 paragrafen zakelijke diensten
- Borrelplanken: 5 vaste planken + detailpagina's (€15–€75)
- Contact: `010-4767277`, `info@gastrovinorotterdam.nl`, `Nieuwe Binnenweg 335A 3021 GJ Rotterdam`

---

## 4. Database Schema (Prisma 7)

```prisma
enum Source {
  LANDELIJK   // Gescraped van gastrovinoshop.nl
  LOKAAL      // Rotterdam-eigen product (Local Hero)
  HYBRIDE     // Landelijk product met lokale prijs-override
}

model Product {
  id              String    @id @default(cuid())
  sku             String    @unique  // "GV-{magento-urlkey}" of "GV-LOK-{naam}"
  name            String
  slug            String    @unique
  source          Source    @default(LANDELIJK)
  price_fysiek    Float?
  price_online    Float?
  stock_rotterdam Int?      @default(0)
  is_local_hero   Boolean   @default(false)
  gastronomy_tags String[]  // smaakprofielen voor wijn-spijs matching
  category        String?   // "wijn" | "kaas" | "delicatesse" | "bier" | "borrelplank"
  images          String[]  // array van absolute URLs
  description     String?   @db.Text
  spec_land       String?   // bv. "Spanje"
  spec_regio      String?   // bv. "Ribera del Duero"
  spec_druif      String?   // bv. "Tempranillo"
  spec_alcohol    String?   // bv. "14%"
  spec_wijn_spijs String?   // bv. "Vlees, Wild"
  specs           Json?     // overige key-value specs
  source_url      String?
  scraped_at      DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  clickCollectSlots ClickCollectSlot[]

  @@index([category])
  @@index([is_local_hero])
  @@index([spec_land])
  @@index([spec_druif])
}

model ClickCollectSlot {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  dag       String  // "Maandag t/m Vrijdag" | "Zaterdag"
  openTijd  String  // "10:00"
  sluitTijd String  // "18:00"
}
```

### 4.1 Local Heroes — vaste seed-data

| SKU | Naam | Prijs | Tags | Categorie |
| :--- | :--- | :--- | :--- | :--- |
| `GV-LOK-KLEPPER` | Klepper & Klepper Drop | €2,95 | drop, zoet, lokaal, rotterdam | delicatesse |
| `GV-LOK-ROTTERDAMSCHE` | Rotterdamsche Oude | €7,50 | kaas, oud, pittig, nootachtig, lokaal, rotterdam | kaas |
| `GV-LOK-CANNOLI` | Cannoli's Italiaanse | €4,95 | zoet, gebak, italiaans, ricotta, rotterdam | delicatesse |
| `GV-LOK-PELGRIM` | Pelgrim Brouwerij Stadsblond | €3,25 | bier, blond, lokaal, ambachtelijk, delfshaven, rotterdam | bier |

Alle 4 Local Heroes hebben Click & Collect slots: Ma–Vr 10:00–18:00 · Za 10:00–17:00.

### 4.2 Conflict-resolutie
- **Afbeelding & beschrijving:** Landelijke kwaliteit heeft voorrang
- **Prijs & voorraad:** Lokale Rotterdamse data overschrijft ALTIJD de landelijke

---

## 5. Pagina Architectuur

### 5.1 `/` — Homepage

**Doel:** Warm welkom, positionering, directe conversie-ingangen.

**Content (uit rotterdam_local_content.json):**
- Hero: sfeerbeelden Nieuwe Binnenweg 335A (uit `homepage.images`)
- Intro: *"Gastrovino Rotterdam is since november 2023 geopend op de Nieuwe Binnenweg 335A. Dé plek voor vertrouwde wijnen en de lekkerste delicatessen vanuit de hele wereld."*
- Openingstijden: Ma–Vr 10:00–18:00 · Za 10:00–17:00
- Directe CTA-blokken: → Borrelplank Bouwen · → Proeverijen · → Assortiment
- Event-highlight: XXL Wijnproeverij vrijdag 19 juni 2026 (€24,95)

**Componenten:** `HeroSection`, `OpeningsTijden`, `CtaGrid`, `EventBanner`

---

### 5.2 `/over-ons` — Het Verhaal

**Doel:** Vertrouwen opbouwen, SEO-waarde behouden van de Over Ons pagina.

**Content (uit `over-ons` pagina):**
- Titel: *"Welkom bij Gastrovino Rotterdam"*
- Tekst: opener november 2023, Nieuwe Binnenweg 335A, Naomi & Melanie
- Kernzin: *"Kwaliteit en een persoonlijke service staan bij ons centraal."*
- Socialmedia-links: Instagram, Facebook, TikTok
- Visueel: warme interieurbeelden van de winkel

**Componenten:** `StorySection`, `TeamIntro`, `SocialLinks`

---

### 5.3 `/borrelplanken` — Borrelplank Builder

**Doel:** Interactief configuratietool voor de ultieme borrelplank.

**Twee modi:**
1. **Vaste planken** — de 5 originele planken van de winkel (€15–€75, 2–10 personen):
   - Borrelplank 2 personen — €15
   - Borrelplank 4 personen — €25
   - Borrelplank 6 personen — €40
   - Borrelplank 8 personen — €55
   - Borrelplank 10 personen — €75
   - Inhoud: kaas, charcuterie, noten, olijven — altijd vers opgemaakt

2. **Zelf bouwen** — 3-staps wizard:
   - Stap 1: Kies je wijn (4 wijnen, radio-select)
   - Stap 2: Kies je kaas (Rotterdamsche Oude + varianten, qty)
   - Stap 3: Kies je snacks (delicatessen, qty)
   - Sidebar: real-time prijs, Click & Collect CTA

**Styling:** Warme crème achtergrond, terracotta CTA-buttons, goud voor selected-state, Cormorant Garamond titels.

**Componenten:** `BorrelplankBuilder` (Client Component), `VastePlankKiezer`, `ProductCard`, `PrijsSidebar`

---

### 5.4 `/assortiment` — De Wijnkaart & Delicatessen

**Doel:** Database-gedreven catalogus met filter- en zoekfunctie.

**Producten:**
- 12 landelijke rode wijnen (gescraped van gastrovinoshop.nl)
- 4 Rotterdamse Local Heroes (handmatig geseed)

**Filteropties:**
- Type: Wijn · Kaas · Delicatessen · Bier
- Land: Spanje · Italië · Nederland (Rotterdam)
- Druif: Tempranillo · Garnacha · Nero d'Avola · …
- Local Hero: toggle ✦

**Per wijn-kaart tonen:**
- Naam, vintage, druif, land/regio
- Prijs (incl. BTW)
- Smaaktags (gastronomy_tags)
- Flabel-afbeelding
- "Local Hero" badge (goud) indien van toepassing

**Data-flow:** `prisma.product.findMany()` in Server Component → client-side filter via `useState`

**Componenten:** `AssortimentGrid`, `ProductCard`, `FilterBar`, `LocalHeroBadge`

---

### 5.5 `/proeverijen` — Evenementen & Proeverijen

**Doel:** Tickets/aanmeldingen voor wijnproeverijen en high teas.

**Actuele evenementen (uit `proeverijen` pagina):**

| Evenement | Prijs | Details |
| :--- | :--- | :--- |
| XXL Wijnproeverij | €24,95 p.p. | Vrijdag 19 juni 2026 |
| High Tea | €34,99 p.p. | Op aanvraag |
| Privé Wijnproeverij | €34,95 p.p. | Op aanvraag (min. 6 pers.) |

*(Opmerking: ook Klaverjassen-avond gesignaleerd op 13 juni 2026)*

**Paginasecties:**
- Uitgelicht evenement (hero met datum-countdown)
- Evenementen-grid met tickets/aanmeldknop
- Beschrijving van de proeverij-formaten
- **Aanvraagformulier:** naam, e-mail, aantal personen, datum-voorkeur, opmerkingen → `mailto:info@gastrovinorotterdam.nl` of API-route

**Componenten:** `EvenementHero`, `EvenementGrid`, `AanvraagFormulier`

---

### 5.6 `/catering` — Lunch & Zakelijke Diensten

**Doel:** B2B dienstverlening voor Rotterdam-West.

**Content (uit `lunch-catering` pagina):**
- Lunch op het werk
- Op maat gemaakte delicatessen-pakketten
- Relatiegeschenken
- Unieke borrelplanken voor zakelijke events

**Paginasecties:**
- Diensten-overzicht (3 kolommen)
- "Op maat" aanvraagformulier
- Referenties / sfeerbeelden
- Contact: `010-4767277` · `info@gastrovinorotterdam.nl`

**Componenten:** `DienstenGrid`, `OpMaatFormulier`, `ContactBar`

---

## 6. SEO & Metadata Structuur

Elke pagina exporteert `metadata` via Next.js App Router:

```typescript
// Voorbeeld voor /proeverijen
export const metadata: Metadata = {
  title: 'Wijnproeverijen & High Tea | Gastrovino Rotterdam',
  description: 'Geniet van onze XXL Wijnproeverij, High Tea of een besloten Privé Proeverij op de Nieuwe Binnenweg 335A Rotterdam. Boek nu.',
  openGraph: {
    title: 'Wijnproeverijen — Gastrovino Rotterdam',
    description: '...',
    url: 'https://gastrovinorotterdam.nl/proeverijen',
    siteName: 'Gastrovino Rotterdam',
    locale: 'nl_NL',
    type: 'website',
  },
}
```

**Prioritaire zoekwoorden:**
- "wijnproeverij Rotterdam"
- "borrelplank Rotterdam Nieuwe Binnenweg"
- "wijn en delicatessen Rotterdam-West"
- "Gastrovino Rotterdam"

---

## 7. Click & Collect Model

Alle producten met een `ClickCollectSlot` zijn afhaalbaar op:

> **Gastrovino Rotterdam · Nieuwe Binnenweg 335A · 3021 GJ Rotterdam**
> Ma–Vr: 10:00–18:00 · Za: 10:00–17:00
> Tel: 010-4767277

Workflow: klant configureert → kiest slot → bestelling per e-mail bevestigd (MVP). Betaling in de winkel bij afhaal.

---

## 8. Scripts & Tooling

| Script | Commando | Functie |
| :--- | :--- | :--- |
| `scrape` | `node src/scripts/scraper.js` | Playwright-scrape van gastrovinoshop.nl |
| `scrape:local` | `node src/scripts/scrape-rotterdam-local.js` | Axios+Cheerio-scrape van gastrovinorotterdam.nl |
| `seed:mem` | `npm run seed:mem` | Seed validatie in pg-mem (geen DB nodig) |
| `seed` | `npm run seed` | Live seed naar PostgreSQL |
| `db:up` | `docker-compose up -d` | Start PostgreSQL container |
| `db:migrate` | `npx prisma migrate dev --name init` | Migreer schema naar live DB |
| `dev` | `npm run dev` | Next.js dev-server met Turbopack |

---

## 9. Omgevingsvariabelen

```env
DATABASE_URL="postgresql://gastrovino:gastrovino@localhost:5432/gastrovino?schema=public"
```

`prisma.config.ts` laadt deze variabele via `PrismaPg` adapter — de `url` mag NIET in `schema.prisma` staan (Prisma 7 breaking change).

---

*Laatste update: 9 juni 2026 — Versie 2.0 na volledige datascrape van gastrovinorotterdam.nl*
