# Gastrovino Rotterdam — projectcontext voor Claude

## Wat is dit?
Next.js 15 statische website (App Router) voor Gastrovino Rotterdam,
een wijn- en delicatessenwinkel op de Nieuwe Binnenweg 335A te Rotterdam.
Eigenaressen: Naomi & Melanie. `next build` levert 12 statische routes
(6 pagina's + sitemap + robots + OG-image + icon). Geen database — alles uit JSON.

## Huisstijl (Brand Book 2026)
Werkelijke tokens staan in `tailwind.config.ts`. Kernkleuren:
- Terracotta #71413D · Gold/koper #B39662 · Crème #FBF1DB
- Olive (Tailwind-token) · Ink (donkerbruin)

Fonts: Libre Baskerville (serif, titels) + Jost (sans, basistekst).
Zie `src/app/layout.tsx` voor font-imports.
`DATA_BLUEPRINT.md` bevat verouderde kleurwaarden — negeren.

## Architectuur
- Productdata: `data/rotterdam_shop_products.json` (90 producten, gescraped)
  → verwerkt in `src/lib/assortiment-data.ts` → exports: ALL_PRODUCTS, WIJNEN,
  BORRELPLANKEN, DELICATESSEN, FILTER_COUNTS, etc.
- Evenementdata: `src/lib/evenementen.ts` — SINGLE SOURCE OF TRUTH voor
  PROEVERIJ_DATUM, UPCOMING_EVENT, EVENEMENTEN, PROEVERIJ_OPTIES.
  Bij datum-wijziging: alleen dit bestand aanpassen.
- Productfoto's: `public/shop/<id>-<idx>.<ext>` (lokaal)
- Sfeer-/winkelfoto's: `public/img/` — geoptimaliseerd (sips, max 1600px)
  vanuit bronmap `foto/` (staat in .gitignore). Winkelinterieur, borrelplanken,
  proeverijen, catering en Naomi & Melanie.
- Merkafbeeldingen: `public/brand/` (logo-rond.png, logo-liggend.png, etc.)

## Pagina's
| Route | Bestand |
|---|---|
| `/` | `src/app/page.tsx` |
| `/assortiment` | `src/app/assortiment/page.tsx` + `src/components/AssortimentShop.tsx` |
| `/borrelplanken` | `src/app/borrelplanken/page.tsx` (statisch, planken uit BORRELPLANKEN) |
| `/proeverijen` | `src/app/proeverijen/page.tsx` + `src/components/ProeverijAanvraag.tsx` |
| `/catering` | `src/app/catering/page.tsx` |
| `/over-ons` | `src/app/over-ons/page.tsx` |

## Bestelflow (MVP: mailto)
De borrelplanken-pagina (statische `<a href="mailto:...">` per plank,
alle planken €7,50 p.p.) en de Proeverij-aanvraag (`ProeverijAanvraag.tsx`,
via `window.location.href`) openen een mail-client naar
info@gastrovinorotterdam.nl. Er is geen backend, geen betaalsysteem,
geen database. De assortimentpagina ondersteunt filter-deep-links:
`/assortiment?filter=wijnen` etc. (keys uit FILTER_LABELS).

## SEO
- `metadataBase`: https://gastrovinorotterdam.nl (layout.tsx)
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`
- Favicon: `src/app/icon.png`
- OG-image: `src/app/opengraph-image.tsx` (ImageResponse, edge runtime)
- JSON-LD LocalBusiness + WineStore: inline in `src/app/page.tsx`

## Ontwikkelcommando's
```bash
npm run dev      # dev-server op http://localhost:3000
npx next build   # statische build — moet altijd groen zijn vóór commit
```

## Git
Repository aangemaakt op 11 juni 2026 (was daarvoor geen git).
Alle commits volgen Conventional Commits (feat/fix/chore/docs).
