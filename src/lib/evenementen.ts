// Centrale bron voor evenementdata.
// Pas PROEVERIJ_DATUM hier aan als het evenement verandert — nergens anders.

import { Wine, Coffee, Sparkles } from 'lucide-react'

export const PROEVERIJ_DATUM       = 'Vrijdag 19 juni 2026'
export const PROEVERIJ_DATUM_KORT  = '19 juni'

export const UPCOMING_EVENT = {
  label:       'Aankomend evenement',
  title:       'XXL Wijnproeverij',
  date:        PROEVERIJ_DATUM,
  price:       '€24,95 p.p.',
  description:
    'Proef meer dan 7 zorgvuldig geselecteerde wijnen, begeleid door een selectie kazen en een persoonlijke wijnbegeleiding.',
  href:        '/proeverijen',
}

export const EVENEMENTEN = [
  {
    id:    'xxl',
    icon:  Wine,
    title: 'XXL Wijnproeverij',
    date:  PROEVERIJ_DATUM,
    time:  '19:30 – 22:30',
    price: '€24,95',
    unit:  'per persoon',
    featured: true,
    description:
      'Onze grootste proeverij van het voorjaar. Proef ruim 7 zorgvuldig geselecteerde wijnen uit ons assortiment, begeleid door passende kazen en charcuterie. Naomi & Melanie vertellen het verhaal achter ieder huis.',
    highlights: ['7+ wijnen', 'Kaas & charcuterie', 'Persoonlijke begeleiding'],
  },
  {
    id:    'hightea',
    icon:  Coffee,
    title: 'High Tea Deluxe',
    date:  'Op aanvraag',
    time:  'Vanaf 2 personen',
    price: '€34,99',
    unit:  'per persoon',
    featured: false,
    description:
      'Een luxe high tea met huisgemaakte zoetigheden, hartige delicatessen uit de winkel en een verfijnde theeselectie — desgewenst aangevuld met een glas bubbels.',
    highlights: ['Zoet & hartig', 'Verse delicatessen', 'Optioneel: bubbels'],
  },
  {
    id:    'prive',
    icon:  Sparkles,
    title: 'Privé Wijnproeverij',
    date:  'Op aanvraag',
    time:  'Vanaf 6 personen',
    price: '€34,95',
    unit:  'per persoon',
    featured: false,
    description:
      'Een besloten proeverij voor jouw gezelschap — verjaardag, teamuitje of gewoon met vrienden. Stel samen met ons het thema samen: van Italiaanse klassiekers tot Spaanse parels.',
    highlights: ['Besloten gezelschap', 'Thema naar keuze', 'Incl. borrelhapjes'],
  },
]

export const PROEVERIJ_OPTIES = [
  `XXL Wijnproeverij (${PROEVERIJ_DATUM})`,
  'High Tea',
  'Privé Wijnproeverij',
  'Anders / overleg graag',
]
