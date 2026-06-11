import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart, MapPin, ChevronRight, Wine, Nut, Croissant,
  Grape, Coffee, Soup, Star, Store,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Over Ons — Het verhaal van Naomi & Melanie',
  description:
    'Gastrovino Rotterdam is sinds november 2023 geopend op de Nieuwe Binnenweg 335A. Naomi & Melanie verwelkomen je in hun winkel vol wijnen, delicatessen en Rotterdamse specialiteiten.',
  openGraph: {
    title: 'Over Ons · Gastrovino Rotterdam',
    description: 'Het verhaal achter de wijn- en delicatessenwinkel op de Nieuwe Binnenweg 335A.',
  },
}

const ASSORTIMENT_ITEMS = [
  { icon: Wine,      label: 'De beste wijnen',           sub: 'Uit de hele wereld' },
  { icon: Nut,       label: 'Vers gebrande noten',       sub: 'Dagelijks gebrand' },
  { icon: Soup,      label: 'Tapas & vleeswaren',        sub: 'Vers gesneden' },
  { icon: Star,      label: 'Hollandse & buitenlandse kazen', sub: 'Van jong tot extra oud' },
  { icon: Coffee,    label: 'Chocolade & zoet',          sub: 'Ambachtelijk' },
  { icon: Grape,     label: 'Olijfolie & pasta',         sub: "Pasta's uit Gragnano" },
  { icon: Croissant, label: 'Verse delicatessen',        sub: 'Wisselend aanbod' },
  { icon: Heart,     label: 'Rotterdamse producten',     sub: 'Onze Local Heroes' },
]

export default function OverOnsPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 30% 30%, rgba(107,122,62,0.08) 0%, transparent 70%), ' +
              'radial-gradient(ellipse 50% 50% at 90% 80%, rgba(196,113,74,0.07) 0%, transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 grid md:grid-cols-[1fr_400px] gap-12 items-center">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] font-sans font-semibold text-gold">
              Ons verhaal · Sinds november 2023
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-medium text-ink leading-[1.1]">
              Welkom bij<br />
              <span className="italic text-olive">Gastrovino</span> Rotterdam
            </h1>
            <p className="text-lg font-sans text-ink-muted leading-relaxed max-w-lg">
              Dé plek waar je terecht kunt voor de vertrouwde wijnen en de lekkerste
              delicatessen vanuit de hele wereld — met een onmiskenbaar Rotterdams hart.
            </p>
            <div className="flex items-center gap-3 text-sm font-sans text-ink-muted">
              <MapPin size={15} className="text-terracotta" strokeWidth={1.8} />
              Nieuwe Binnenweg 335A, 3021 GJ Rotterdam
            </div>
          </div>

          {/* Winkelfoto */}
          <div className="relative hidden md:block">
            <div className="absolute -inset-4 bg-gradient-to-br from-olive/10 to-terracotta/10 rounded-3xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-warm-lg aspect-[3/4]">
              <Image
                src="https://www.gastrovinorotterdam.nl/data/upload/images/1024-1364-1.jpg"
                alt="De winkel van Gastrovino Rotterdam aan de Nieuwe Binnenweg"
                fill
                className="object-cover"
                sizes="400px"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-cream rounded-xl px-5 py-3.5 shadow-warm-lg border border-cream-darker">
              <p className="text-[10px] uppercase tracking-widest text-ink-subtle font-sans font-medium">Geopend sinds</p>
              <p className="font-serif text-lg font-semibold text-ink">November 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Het verhaal ── */}
      <section className="bg-cream-dark border-y border-cream-darker">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 space-y-8">
          <div className="ornament-divider text-gold text-xs tracking-[0.25em] uppercase font-sans font-medium">
            <span>Naomi &amp; Melanie</span>
          </div>

          <blockquote className="font-serif text-2xl md:text-3xl font-medium text-ink leading-snug text-center italic">
            &ldquo;Kwaliteit en een persoonlijke service staan bij ons centraal.
            Wij adviseren je graag.&rdquo;
          </blockquote>

          <div className="space-y-5 text-base font-sans text-ink-muted leading-relaxed">
            <p>
              In november 2023 openden Naomi &amp; Melanie de deuren van Gastrovino Rotterdam
              op de levendige Nieuwe Binnenweg. Wat begon als een droom — een eigen winkel
              vol mooie wijnen en eerlijke delicatessen — groeide al snel uit tot een vaste
              waarde in Rotterdam-West.
            </p>
            <p>
              Naast de beste wijnen vind je bij ons een breed aanbod aan delicatessen:
              vers gebrande noten, tapas, vleeswaren, Hollandse &amp; buitenlandse kazen,
              chocolade, diverse soorten olijfolie en gedroogde pasta&apos;s. En natuurlijk —
              waar we extra trots op zijn — een uitgebreid assortiment lokale Rotterdamse
              producten van makers uit onze eigen stad.
            </p>
            <p>
              Kom bij ons langs voor de wekelijkse boodschappen, een feestelijke borrelplank,
              een smaakvol cadeau of een uniek relatiegeschenk. De koffie staat klaar,
              en proeven mag altijd.
            </p>
          </div>

          <p className="text-center font-serif text-lg italic text-olive">
            — Team Gastrovino Rotterdam
          </p>
        </div>
      </section>

      {/* ── Wat vind je bij ons ── */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center mb-12 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-gold">
            In de winkel
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink">
            Wat vind je bij ons?
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {ASSORTIMENT_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="card-warm border border-cream-darker/60 p-6 flex flex-col items-center text-center gap-3"
              >
                <span className="w-12 h-12 rounded-full bg-olive/10 flex items-center justify-center text-olive">
                  <Icon size={20} strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-serif text-base font-medium text-ink leading-snug">{item.label}</p>
                  <p className="text-xs font-sans text-ink-subtle mt-0.5">{item.sub}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-olive-deeper text-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center space-y-6">
          <Store size={28} className="mx-auto text-gold" strokeWidth={1.4} />
          <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight">
            Kom langs en proef het zelf
          </h2>
          <p className="text-cream/70 font-sans max-w-md mx-auto leading-relaxed">
            Maandag t/m vrijdag 10:00–18:00 · Zaterdag 10:00–17:00<br />
            Nieuwe Binnenweg 335A, Rotterdam
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/assortiment"
              className="inline-flex items-center gap-2 bg-terracotta text-cream px-7 py-3.5 rounded-full text-sm font-sans font-medium hover:bg-terracotta-dark transition-colors"
            >
              Bekijk het assortiment
              <ChevronRight size={14} />
            </Link>
            <Link
              href="/proeverijen"
              className="inline-flex items-center gap-2 border border-cream/30 text-cream px-7 py-3.5 rounded-full text-sm font-sans font-medium hover:bg-cream/10 transition-colors"
            >
              Boek een proeverij
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
