import type { Metadata } from 'next'
import {
  Calendar, Clock, Users, Wine, Sparkles, Coffee,
  MapPin, ChevronRight, Star,
} from 'lucide-react'
import ProeverijAanvraag from '@/components/ProeverijAanvraag'

export const metadata: Metadata = {
  title: 'Wijnproeverijen & High Tea',
  description:
    'Boek een XXL Wijnproeverij, luxe High Tea of besloten Privé Proeverij bij Gastrovino Rotterdam op de Nieuwe Binnenweg 335A. Eerstvolgende editie: vrijdag 19 juni 2026.',
  openGraph: {
    title: 'Wijnproeverijen — Gastrovino Rotterdam',
    description: 'XXL Wijnproeverij, High Tea en Privé Proeverijen op de Nieuwe Binnenweg 335A Rotterdam.',
  },
}

// Actuele evenementen — uit rotterdam_local_content.json (proeverijen-pagina)
const EVENEMENTEN = [
  {
    id:    'xxl',
    icon:  Wine,
    title: 'XXL Wijnproeverij',
    date:  'Vrijdag 19 juni 2026',
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

function EvenementCard({ event }: { event: (typeof EVENEMENTEN)[number] }) {
  const Icon = event.icon
  return (
    <article
      className={`card-warm flex flex-col overflow-hidden border transition-all duration-300 ${
        event.featured
          ? 'border-gold/50 ring-1 ring-gold/30'
          : 'border-cream-darker/60 hover:border-olive/25'
      }`}
    >
      {event.featured && (
        <div className="bg-gold text-ink text-center py-1.5 text-[11px] font-sans font-bold uppercase tracking-[0.2em]">
          ★ Eerstvolgende editie
        </div>
      )}
      <div className="p-7 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between">
          <div className={`rounded-lg p-2.5 ${event.featured ? 'bg-gold/15 text-gold-dark' : 'bg-olive/10 text-olive'}`}>
            <Icon size={22} strokeWidth={1.6} />
          </div>
          <div className="text-right">
            <span className="font-serif text-2xl font-semibold text-ink">{event.price}</span>
            <span className="block text-[10px] font-sans text-ink-subtle">{event.unit}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-xl font-medium text-ink">{event.title}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-sans text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} strokeWidth={1.8} className="text-terracotta" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={11} strokeWidth={1.8} className="text-terracotta" />
              {event.time}
            </span>
          </div>
        </div>

        <p className="text-sm font-sans text-ink-muted leading-relaxed flex-1">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {event.highlights.map(h => (
            <span key={h} className="rounded-full bg-olive/8 border border-olive/15 px-2.5 py-0.5 text-[10px] font-sans font-medium uppercase tracking-wider text-olive">
              {h}
            </span>
          ))}
        </div>

        <a
          href="#aanvragen"
          className={`mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-sans font-semibold transition-colors ${
            event.featured
              ? 'bg-terracotta text-cream hover:bg-terracotta-dark'
              : 'bg-olive text-cream hover:bg-olive-dark'
          }`}
        >
          {event.featured ? 'Reserveer je plek' : 'Vraag aan'}
          <ChevronRight size={14} />
        </a>
      </div>
    </article>
  )
}

export default function ProeverijenPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ── Hero ── */}
      <section className="bg-olive-deeper text-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center space-y-5">
          <p className="text-[11px] uppercase tracking-[0.3em] font-sans font-semibold text-gold/80">
            Proeven · Beleven · Genieten
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
            Wijnproeverijen &amp; High Tea
          </h1>
          <p className="text-cream/70 font-sans text-base leading-relaxed max-w-xl mx-auto">
            Van onze beroemde XXL Wijnproeverij tot een intieme privé-avond met vrienden —
            beleef wijn zoals het bedoeld is, midden op de Nieuwe Binnenweg.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-sans text-gold">
            <Star size={14} className="fill-gold" />
            <span>Eerstvolgende: XXL Wijnproeverij — vrijdag 19 juni 2026</span>
          </div>
        </div>
      </section>

      {/* ── Evenementen ── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {EVENEMENTEN.map(e => <EvenementCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* ── Hoe werkt het ── */}
      <section className="bg-cream-dark border-y border-cream-darker">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="text-center mb-10 space-y-2">
            <p className="ornament-divider text-gold text-[11px] tracking-[0.25em] uppercase font-sans font-semibold justify-center">
              <span>Zo werkt het</span>
            </p>
            <h2 className="font-serif text-3xl font-medium text-ink">Van aanvraag tot proost</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { nr: '1', title: 'Vraag aan',  text: 'Vul het formulier in of bel ons. Vertel over je gezelschap en voorkeuren.' },
              { nr: '2', title: 'Wij plannen', text: 'Naomi & Melanie nemen binnen één werkdag contact op en stemmen alles af.' },
              { nr: '3', title: 'Proost!',     text: 'Kom langs op de Nieuwe Binnenweg en geniet van een onvergetelijke proeverij.' },
            ].map(s => (
              <div key={s.nr} className="text-center space-y-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-olive text-cream font-serif text-xl font-semibold">
                  {s.nr}
                </span>
                <h3 className="font-serif text-lg font-medium text-ink">{s.title}</h3>
                <p className="text-sm font-sans text-ink-muted leading-relaxed max-w-[240px] mx-auto">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Aanvraagformulier ── */}
      <section id="aanvragen" className="mx-auto max-w-3xl px-6 py-16 scroll-mt-24">
        <div className="text-center mb-8 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-gold">
            Reserveren
          </p>
          <h2 className="font-serif text-3xl font-medium text-ink">Vraag jouw proeverij aan</h2>
          <p className="text-sm font-sans text-ink-muted max-w-md mx-auto leading-relaxed">
            Vul het formulier in en wij nemen persoonlijk contact met je op
            om de perfecte proeverij samen te stellen.
          </p>
        </div>
        <ProeverijAanvraag />
      </section>

      {/* ── Locatie-strip ── */}
      <section className="bg-cream-dark border-t border-cream-darker">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-sm font-sans text-ink-muted">
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-terracotta" strokeWidth={1.8} />
            Nieuwe Binnenweg 335A, 3021 GJ Rotterdam
          </span>
          <span className="flex items-center gap-2">
            <Users size={14} className="text-terracotta" strokeWidth={1.8} />
            Groepen tot 25 personen
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} className="text-terracotta" strokeWidth={1.8} />
            Ook op avonden mogelijk
          </span>
        </div>
      </section>
    </main>
  )
}
