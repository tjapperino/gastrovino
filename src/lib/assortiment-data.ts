// Productdata voor de assortiment-pagina en de borrelplanken-pagina.
// Bron: data/rotterdam_shop_products.json — de volledige scrape van de echte
// webshop (gastrovinorotterdam.nl/webshop), incl. lokaal gedownloade foto's
// in public/shop/. Opnieuw genereren: node src/scripts/scrape-rotterdam-shop.js

import raw from '../../data/rotterdam_shop_products.json'

export type FilterKey =
  | 'alles'
  | 'wijnen'
  | 'borrelplanken'
  | 'delicatessen'
  | 'broodjes'
  | 'geschenken'
  | 'alcohol-vrij'
  | 'proeverijen'

export interface Product {
  sku:          string
  name:         string
  slug:         string
  category:     FilterKey
  shopCategory: string        // originele webshop-categorie
  url:          string        // productpagina op gastrovinorotterdam.nl
  price:        number
  unit?:        string
  image_url?:   string
  images:       string[]
  country?:     string
  regio?:       string
  druif?:       string
  alcohol?:     string
  smaak?:       string
  tags:         string[]
  description:  string
  persons?:     string        // alleen borrelplanken
  is_local_hero: boolean
  badge?:       string
}

interface RawProduct {
  id:               number
  name:             string
  slug:             string
  url:              string
  category:         string
  price:            number
  shortDescription: string
  longDescription:  string
  specs:            Record<string, string>
  localImages:      string[]
}

// Webshop-categorie → filtergroep op de site
const CATEGORY_MAP: Record<string, FilterKey> = {
  'wijnen':                   'wijnen',
  'alcohol-vrij':             'alcohol-vrij',
  'borrelplanken':            'borrelplanken',
  'olijfolie':                'delicatessen',
  'tomasu-soja':              'delicatessen',
  'zoete-lekkernij':          'delicatessen',
  'koken':                    'delicatessen',
  'kookboeken':               'delicatessen',
  'broodjes-en-boodschappen': 'broodjes',
  'relatie-geschenken':       'geschenken',
  'wijnproeverij--high-tea':  'proeverijen',
}

const UNIT_BY_CATEGORY: Partial<Record<FilterKey, string>> = {
  wijnen:        'per fles',
  borrelplanken: 'per plank',
  proeverijen:   'p.p.',
}

// Tomasu wordt in Rotterdam gebrouwen — onze Local Hero in het schap.
const LOCAL_HERO_CATEGORIES = new Set(['tomasu-soja'])

// Sommige shopnamen staan volledig in kapitalen; normaliseer die naar titelvorm.
function titleCase(name: string): string {
  const letters = name.replace(/[^a-zA-Z]/g, '')
  if (!letters || letters !== letters.toUpperCase()) return name
  return name.toLowerCase().replace(/(^|[\s\-'’("/.])[a-z]/g, (c) => c.toUpperCase())
}

function deriveBadge(p: RawProduct): string | undefined {
  if (LOCAL_HERO_CATEGORIES.has(p.category)) return 'Local Hero'
  if (/docg/i.test(p.name)) return 'DOCG'
  if (/\bbio\b|biologisch/i.test(p.name)) return 'Biologisch'
  if (/champagne/i.test(p.name)) return 'Champagne'
  if (/proefbox/i.test(p.name)) return 'Proefbox'
  if (/wijndeal/i.test(p.name)) return 'Wijndeal'
  return undefined
}

function deriveTags(p: RawProduct, category: FilterKey): string[] {
  const tags: string[] = []
  if (p.specs['Smaak']) tags.push(...p.specs['Smaak'].toLowerCase().split(/[,\s]+en\s+|,\s*/).slice(0, 2))
  if (p.specs['Land']) tags.push(p.specs['Land'].toLowerCase())
  if (category === 'broodjes') tags.push('lunch', 'vers belegd')
  if (category === 'geschenken') tags.push('cadeau')
  if (category === 'proeverijen') tags.push('beleving', 'op locatie')
  if (LOCAL_HERO_CATEGORIES.has(p.category)) tags.push('rotterdam')
  return [...new Set(tags.filter(Boolean))]
}

const PLANK_DESCRIPTION =
  'Vers opgemaakte borrelplank met een rijke selectie kazen, charcuterie, ' +
  'ambachtelijke noten en olijven. Altijd dagvers samengesteld door Naomi & Melanie.'

function toProduct(p: RawProduct): Product {
  const category = CATEGORY_MAP[p.category] ?? 'delicatessen'
  const persons = category === 'borrelplanken'
    ? `${p.name.match(/(\d+)\s*person/i)?.[1] ?? ''} personen`
    : undefined

  const description =
    p.shortDescription
    || (category === 'borrelplanken' ? PLANK_DESCRIPTION : '')
    || (p.longDescription.length > 220 ? `${p.longDescription.slice(0, 217)}…` : p.longDescription)

  return {
    sku:          `GVR-${p.id}`,
    name:         titleCase(p.name),
    slug:         p.slug,
    category,
    shopCategory: p.category,
    url:          p.url,
    price:        p.price,
    unit:         UNIT_BY_CATEGORY[category],
    image_url:    p.localImages[0],
    images:       p.localImages,
    country:      p.specs['Land'],
    regio:        p.specs['Regio'],
    druif:        p.specs['Druif'],
    alcohol:      p.specs['Alcohol'],
    smaak:        p.specs['Teaser'] || p.specs['Smaak'],
    tags:         category === 'borrelplanken'
                    ? ['kaas', 'charcuterie', 'noten', 'olijven', 'vers']
                    : deriveTags(p, category),
    description,
    persons,
    is_local_hero: LOCAL_HERO_CATEGORIES.has(p.category),
    badge:        deriveBadge(p),
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const ALL_PRODUCTS: Product[] = (raw as unknown as RawProduct[]).map(toProduct)

export const WIJNEN        = ALL_PRODUCTS.filter(p => p.category === 'wijnen')
export const BORRELPLANKEN = ALL_PRODUCTS
  .filter(p => p.category === 'borrelplanken')
  .sort((a, b) => a.price - b.price)
export const DELICATESSEN  = ALL_PRODUCTS.filter(p => p.category === 'delicatessen')
export const LOCAL_HEROES  = ALL_PRODUCTS.filter(p => p.is_local_hero)

export const FILTER_LABELS: Record<FilterKey, string> = {
  alles:           'Alles',
  wijnen:          'Wijnen',
  borrelplanken:   'Borrelplanken',
  delicatessen:    'Delicatessen & Koken',
  broodjes:        'Lunch & Broodjes',
  geschenken:      'Relatiegeschenken',
  'alcohol-vrij':  'Alcoholvrij',
  proeverijen:     'Proeverijen & High Tea',
}

export const FILTER_COUNTS: Record<FilterKey, number> = Object.fromEntries(
  Object.keys(FILTER_LABELS).map((key) => [
    key,
    key === 'alles'
      ? ALL_PRODUCTS.length
      : ALL_PRODUCTS.filter(p => p.category === key).length,
  ])
) as Record<FilterKey, number>
