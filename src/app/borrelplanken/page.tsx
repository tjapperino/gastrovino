import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin, Clock, Phone, Mail, ChevronRight, Check,
  Users, Wine, UtensilsCrossed,
} from 'lucide-react'
import { BORRELPLANKEN } from '@/lib/assortiment-data'

export const metadata: Metadata = {
  title: 'Borrelplanken — Vers opgemaakt, voor 2 tot 10 personen',
  description:
    'Verse borrelplanken met kazen, charcuterie, noten en olijven. Voor 2 tot 10 personen, €7,50 p.p. Bestel vooraf en haal af op de Nieuwe Binnenweg 335A in Rotterdam.',
  openGraph: {
    title: 'Borrelplanken · Gastrovino Rotterdam',
    description: 'Vers opgemaakte borrelplanken voor 2–10 personen, €7,50 p.p. Afhalen op de Nieuwe Binnenweg.',
  },
}

const PICKUP_DAYS = [
  { dag: 'Ma – Vr',  tijd: '10:00 – 18:00' },
  { dag: 'Zaterdag', tijd: '10:00 – 17:00' },
]

const PLANK_INHOUD = [
  'Hollandse & buitenlandse kazen',
  'Italiaanse charcuterie, vers afgesneden',
  'Vers gebrande noten',
  'Olijven & tapenades',
  'Altijd dagvers opgemaakt door Naomi & Melanie',
]

// Bestel-mailto per plank — geen backend, de mail is de bestelling (MVP-flow)
function bestelMailto(plank: (typeof BORRELPLANKEN)[number]): string {
  const lines = [
    'Borrelplank bestelling via de website',
    '',
    `Plank: ${plank.name}`,
    `Personen: ${plank.persons}`,
    `Prijs: € ${plank.price.toFixed(2).replace('.', ',')}`,
    '',
    'Specifieke wensen (bijv. vegetarisch, zonder noten): ...',
    'Gewenste afhaaldatum/-tijd: ...',
    '',
    'Ik wil afhalen op de Nieuwe Binnenweg 335A, Rotterdam.',
  ]
  const subject = encodeURIComponent(`Borrelplank bestelling — ${plank.name}`)
  const body = encodeURIComponent(lines.join('\n'))
  return `mailto:info@gastrovinorotterdam.nl?subject=${subject}&body=${body}`
}

function PlankCard({ plank }: { plank: (typeof BORRELPLANKEN)[number] }) {
  const personen = plank.persons?.match(/\d+/)?.[0] ?? ''
  return (
    <div className="flex flex-col rounded-2xl border-2 border-cream-darker bg-cream shadow-warm-sm hover:border-gold/50 hover:shadow-warm transition-all duration-200 overflow-hidden">
      <div className="bg-gradient-to-br from-cream-dark to-cream-darker px-5 py-5 text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs font-sans font-medium text-ink-muted">
          <Users size={13} strokeWidth={1.8} />
          {plank.persons}
        </p>
        <p className="mt-2 font-serif text-3xl font-semibold text-ink">
          € {plank.price.toFixed(2).replace('.', ',').replace(',00', ',-')}
        </p>
        <p className="text-[11px] font-sans text-ink-subtle">€ 7,50 per persoon</p>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-5 py-5 text-center">
        <h3 className="font-serif text-lg font-medium leading-snug text-ink">
          Borrelplank voor {personen}
        </h3>
        <a
          href={bestelMailto(plank)}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-sans font-semibold text-cream transition-colors hover:bg-terracotta-dark"
        >
          <Mail size={14} strokeWidth={2} />
          Bestel deze plank
        </a>
        <p className="text-[11px] font-sans text-ink-subtle -mt-1">
          Vers opgemaakt · afhalen in de winkel
        </p>
      </div>
    </div>
  )
}

export default function BorrelplankenPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ── Hero ── */}
      <section className="bg-olive-deeper text-cream">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.3em] font-sans font-semibold text-gold/80">
              Vers opgemaakt · Nieuwe Binnenweg 335A
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
              Onze Borrelplanken
            </h1>
            <p className="text-cream/70 font-sans text-base leading-relaxed max-w-md">
              Kazen, charcuterie, vers gebrande noten en olijven — dagvers
              samengesteld door Naomi &amp; Melanie. Voor 2 tot 10 personen,
              altijd € 7,50 per persoon.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="#planken"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-sans font-semibold text-cream transition-colors hover:bg-terracotta-dark"
              >
                Kies je formaat
                <ChevronRight size={14} />
              </a>
              <a
                href="tel:0104767277"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-sm font-sans font-medium text-cream transition-colors hover:bg-cream/10"
              >
                <Phone size={13} strokeWidth={2} />
                010-4767277
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-warm-lg">
            <Image
              src="/img/borrelplank-samen.jpg"
              alt="Gasten pakken hapjes van een rijk gevulde Gastrovino borrelplank met kazen, charcuterie en olijven"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Wat ligt erop ── */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-warm order-last md:order-first">
          <Image
            src="/img/borrelplank-gevuld.jpg"
            alt="Rijk gevulde borrelplank met kazen, charcuterie, noten, olijven en verse dips, geserveerd met een glas wijn"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-gold">
            Wat ligt erop?
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink leading-tight">
            Een plank vol smaak, vers uit de winkel
          </h2>
          <ul className="space-y-3">
            {PLANK_INHOUD.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm font-sans text-ink-muted leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-olive/10">
                  <Check size={11} strokeWidth={3} className="text-olive" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm font-sans text-ink-muted leading-relaxed border-l-2 border-gold/40 pl-4">
            Specifieke wensen — vegetarisch, zonder noten, extra kaas?
            Vermeld het bij je bestelling: wij snijden alles vers voor je af.
          </p>
        </div>
      </section>

      {/* ── Formaten ── */}
      <section id="planken" className="bg-cream-dark border-y border-cream-darker scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="text-center mb-10 space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-gold">
              € 7,50 per persoon
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-ink">
              Kies je formaat
            </h2>
            <p className="text-ink-muted max-w-lg mx-auto font-sans text-sm leading-relaxed">
              Bestel per mail en haal je plank af op de Nieuwe Binnenweg 335A.
              Liever even overleggen? Bel ons op 010-4767277.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {BORRELPLANKEN.map(plank => (
              <PlankCard key={plank.sku} plank={plank} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Afhaalinfo ── */}
      <section className="bg-olive-deeper text-cream">
        <div className="mx-auto max-w-6xl px-6 py-12 grid sm:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={18} strokeWidth={1.6} className="text-gold" />
              <h3 className="font-serif text-xl font-medium">Afhalen in de winkel</h3>
            </div>
            <p className="text-sm font-sans text-cream/80">
              Nieuwe Binnenweg 335A, 3021 GJ Rotterdam
            </p>
            <a
              href="https://maps.google.com/?q=Nieuwe%20Binnenweg%20335A%2C%203021%20GJ%20Rotterdam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gold/80 hover:text-gold transition-colors font-sans"
            >
              Route plannen <ChevronRight size={12} />
            </a>
          </div>
          <div className="space-y-2">
            {PICKUP_DAYS.map(d => (
              <div key={d.dag} className="flex items-center gap-3 text-sm font-sans text-cream/80">
                <Clock size={14} className="text-gold shrink-0" strokeWidth={1.8} />
                <span className="font-medium w-24 text-cream">{d.dag}</span>
                <span>{d.tijd}</span>
              </div>
            ))}
            <p className="text-xs text-cream/50 font-sans pt-1">
              Zondag gesloten. Buiten openingstijden? Stuur een e-mail.
            </p>
          </div>
        </div>
      </section>

      {/* ── Cross-sell ── */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid sm:grid-cols-2 gap-5">
        <Link
          href="/assortiment?filter=wijnen"
          className="group card-warm flex items-start gap-4 p-7 border border-cream-darker/60 hover:border-olive/30 transition-all duration-300"
        >
          <div className="rounded-lg p-2.5 bg-olive/10 text-olive shrink-0">
            <Wine size={22} strokeWidth={1.6} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg leading-snug text-ink font-serif">Er een fles wijn bij?</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Wij adviseren graag de perfecte wijn bij je plank — van huiswijn
              tot Amarone DOCG.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium font-sans text-olive group-hover:text-olive-dark transition-colors">
              Bekijk de wijnen <ChevronRight size={13} />
            </span>
          </div>
        </Link>
        <Link
          href="/catering"
          className="group card-warm flex items-start gap-4 p-7 border border-cream-darker/60 hover:border-terracotta/30 transition-all duration-300"
        >
          <div className="rounded-lg p-2.5 bg-terracotta/10 text-terracotta shrink-0">
            <UtensilsCrossed size={22} strokeWidth={1.6} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg leading-snug text-ink font-serif">Groter gezelschap?</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Voor borrels, recepties en bedrijfsevents verzorgen wij catering
              op maat — vraag vrijblijvend een offerte aan.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium font-sans text-terracotta group-hover:text-terracotta-dark transition-colors">
              Naar catering <ChevronRight size={13} />
            </span>
          </div>
        </Link>
      </section>
    </main>
  )
}
