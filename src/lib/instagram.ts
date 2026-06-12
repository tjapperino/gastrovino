// ─── Instagram — gecureerde feed ──────────────────────────────────────────────
// Geen API, tokens of externe scripts: de homepage toont onderstaande foto's
// als "Instagram-feed". Verversen = foto's in public/img/ zetten en deze
// lijst bijwerken. Geef een `href` mee om een tegel naar een specifieke
// post te laten linken; zonder `href` linkt de tegel naar het profiel.

export const INSTAGRAM_URL = 'https://www.instagram.com/gastrovinorotterdam/'
export const INSTAGRAM_HANDLE = '@gastrovinorotterdam'

export type InstagramPost = {
  src: string
  alt: string
  href?: string
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    src: '/img/borrelplank-gevuld.jpg',
    alt: 'Rijk gevulde borrelplank met kazen, charcuterie en olijven',
  },
  {
    src: '/img/winkel-wijnwand.jpg',
    alt: 'De wijnwand vol handgeselecteerde flessen in de winkel',
  },
  {
    src: '/img/proeverij-glas.jpg',
    alt: 'Wijnglas tijdens een proeverij bij Gastrovino Rotterdam',
  },
  {
    src: '/img/kaas-vers.jpg',
    alt: 'Verse kazen uit de toonbank',
  },
  {
    src: '/img/proeverij-schenken.jpg',
    alt: 'Wijn wordt ingeschonken tijdens een wijnproeverij',
  },
  {
    src: '/img/borrelplank-rose.jpg',
    alt: 'Borrelplank met een glas rosé erbij',
  },
]
