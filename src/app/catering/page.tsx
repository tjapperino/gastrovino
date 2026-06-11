import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Briefcase, Gift, UtensilsCrossed, Sandwich, Phone, Mail,
  ChevronRight, Check, MapPin, Truck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lunch & Catering — Zakelijke diensten',
  description:
    'Luxe lunch op het werk, borrelplanken voor zakelijke events en op maat gemaakte relatiegeschenken. Gastrovino Rotterdam verzorgt catering voor heel Rotterdam-West.',
  openGraph: {
    title: 'Lunch & Catering · Gastrovino Rotterdam',
    description: 'Zakelijke catering, lunch op het werk en relatiegeschenken vanaf de Nieuwe Binnenweg 335A.',
  },
}

const DIENSTEN = [
  {
    icon: Sandwich,
    title: 'Lunch op het werk',
    description:
      'Verse, luxe belegde broodjes en salades, bezorgd op kantoor in Rotterdam-West. Wekelijks wisselend aanbod met delicatessen uit de winkel — van Italiaanse vleeswaren tot Rotterdamsche Oude.',
    points: ['Vers bereid op de dag zelf', 'Vegetarische opties', 'Vanaf 5 personen'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Borrelplanken voor events',
    description:
      'Op maat samengestelde borrelplanken voor recepties, borrels en zakelijke bijeenkomsten. Van een intieme teamborrel tot een receptie voor tientallen gasten — altijd vers opgemaakt.',
    points: ['2 tot 50+ personen', 'Op locatie of afhalen', 'Wijnadvies inbegrepen'],
  },
  {
    icon: Gift,
    title: 'Relatiegeschenken',
    description:
      'Smaakvolle geschenkpakketten met wijnen en delicatessen, op maat samengesteld binnen jouw budget. Persoonlijk ingepakt, eventueel voorzien van eigen kaart of logo.',
    points: ['Ieder budget', 'Persoonlijke wensen', 'Kerstpakketten mogelijk'],
  },
]

export default function CateringPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ── Hero ── */}
      <section className="bg-olive-deeper text-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center space-y-5">
          <p className="text-[11px] uppercase tracking-[0.3em] font-sans font-semibold text-gold/80">
            Zakelijk · Rotterdam-West
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
            Lunch &amp; Catering
          </h1>
          <p className="text-cream/70 font-sans text-base leading-relaxed max-w-xl mx-auto">
            Van een luxe lunch op kantoor tot borrelplanken voor je bedrijfsborrel
            en relatiegeschenken die indruk maken — wij verzorgen het, vers vanaf
            de Nieuwe Binnenweg.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-sans text-cream/60 pt-2">
            <span className="flex items-center gap-2">
              <Briefcase size={14} className="text-gold" strokeWidth={1.8} />
              B2B &amp; particulier
            </span>
            <span className="flex items-center gap-2">
              <Truck size={14} className="text-gold" strokeWidth={1.8} />
              Bezorging in Rotterdam-West
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-gold" strokeWidth={1.8} />
              Of afhalen in de winkel
            </span>
          </div>
        </div>
      </section>

      {/* ── Diensten ── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {DIENSTEN.map(dienst => {
            const Icon = dienst.icon
            return (
              <article
                key={dienst.title}
                className="card-warm border border-cream-darker/60 hover:border-olive/25 p-7 flex flex-col gap-4"
              >
                <div className="rounded-lg p-2.5 bg-olive/10 text-olive w-fit">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <h2 className="font-serif text-xl font-medium text-ink">{dienst.title}</h2>
                <p className="text-sm font-sans text-ink-muted leading-relaxed flex-1">
                  {dienst.description}
                </p>
                <ul className="space-y-2">
                  {dienst.points.map(p => (
                    <li key={p} className="flex items-center gap-2 text-xs font-sans text-ink-muted">
                      <Check size={12} className="text-olive shrink-0" strokeWidth={2.5} />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Op maat banner ── */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="bg-gradient-to-r from-cream-dark via-cream to-cream-dark border border-cream-darker rounded-2xl p-8 md:p-10 text-center space-y-5">
          <p className="text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-gold">
            Volledig op maat
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink max-w-xl mx-auto leading-snug">
            Vertel ons over jouw gelegenheid — wij maken een voorstel op maat
          </h2>
          <p className="text-sm font-sans text-ink-muted max-w-lg mx-auto leading-relaxed">
            Iedere aanvraag is anders. Bel of mail met Naomi &amp; Melanie en bespreek
            de mogelijkheden: aantal personen, budget, dieetwensen en bezorging.
            Binnen één werkdag ontvang je een persoonlijk voorstel.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <a
              href="tel:0104767277"
              className="inline-flex items-center gap-2 bg-terracotta text-cream px-7 py-3.5 rounded-full text-sm font-sans font-medium hover:bg-terracotta-dark transition-colors"
            >
              <Phone size={14} strokeWidth={2} />
              Bel 010-4767277
            </a>
            <a
              href="mailto:info@gastrovinorotterdam.nl?subject=Catering%20aanvraag"
              className="inline-flex items-center gap-2 border border-olive text-olive px-7 py-3.5 rounded-full text-sm font-sans font-medium hover:bg-olive hover:text-cream transition-colors"
            >
              <Mail size={14} strokeWidth={2} />
              Mail je aanvraag
            </a>
          </div>
        </div>
      </section>

      {/* ── Cross-sell ── */}
      <section className="bg-cream-dark border-t border-cream-darker">
        <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-medium text-ink">
              Zelf een borrelplank samenstellen?
            </h3>
            <p className="text-sm font-sans text-ink-muted mt-1">
              Gebruik onze Borrelplank Builder voor planken van 2 tot 10 personen.
            </p>
          </div>
          <Link
            href="/borrelplanken"
            className="inline-flex items-center gap-2 bg-olive text-cream px-6 py-3 rounded-full text-sm font-sans font-medium hover:bg-olive-dark transition-colors shrink-0"
          >
            Naar de Builder
            <ChevronRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  )
}
