import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MapPin, Clock, Phone, Mail, ChevronRight,
  Sparkles, Wine, UtensilsCrossed, Calendar,
} from 'lucide-react'
import { FILTER_COUNTS } from '@/lib/assortiment-data'
import { UPCOMING_EVENT, PROEVERIJ_DATUM_KORT } from '@/lib/evenementen'
import Hero from '@/components/Hero'
import WijnOvergang from '@/components/WijnOvergang'
import ProductShelf from '@/components/ProductShelf'

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Gastrovino Rotterdam — Wijn, Delicatessen & Rotterdamse Smaak',
  description:
    'Gastrovino Rotterdam: dé plek op de Nieuwe Binnenweg 335A voor handgeselecteerde wijnen, lokale delicatessen, borrelplanken en wijnproeverijen.',
}

// ─── Statische winkeldata (gescraped van gastrovinorotterdam.nl) ──────────────

const STORE = {
  address:  'Nieuwe Binnenweg 335A',
  postcode: '3021 GJ Rotterdam',
  phone:    '010-4767277',
  email:    'info@gastrovinorotterdam.nl',
  hours: [
    { days: 'Maandag – Vrijdag', time: '10:00 – 18:00' },
    { days: 'Zaterdag',          time: '10:00 – 17:00' },
    { days: 'Zondag',            time: 'Gesloten' },
  ],
}


const NAV_CARDS = [
  {
    href:        '/borrelplanken',
    icon:        UtensilsCrossed,
    accent:      'terracotta' as const,
    eyebrow:     'Nieuw',
    title:       'Borrelplank Builder',
    description: 'Stel stap voor stap jouw perfecte borrelplank samen — of kies een van onze vaste planken voor 2 tot 10 personen (vanaf €15).',
    cta:         'Start de builder',
  },
  {
    href:        '/assortiment',
    icon:        Wine,
    accent:      'olive' as const,
    eyebrow:     `${FILTER_COUNTS.alles} producten uit de webshop`,
    title:       'Wijnen & Delicatessen',
    description: `Ontdek onze ${FILTER_COUNTS.wijnen} handgeselecteerde wijnen, Tomasu sojasaus uit Rotterdam, olijfolie, relatiegeschenken en meer — rechtstreeks uit onze webshop.`,
    cta:         'Bekijk het assortiment',
  },
  {
    href:        '/proeverijen',
    icon:        Sparkles,
    accent:      'gold' as const,
    eyebrow:     `Volgende datum: ${PROEVERIJ_DATUM_KORT}`,
    title:       'Wijnproeverijen',
    description: 'Beleef een onvergetelijke avond met onze XXL Wijnproeverij, intieme Privé-proeverij of een luxe High Tea op de Nieuwe Binnenweg.',
    cta:         'Bekijk evenementen',
  },
]

const ACCENT_STYLES = {
  terracotta: {
    eyebrow:  'text-terracotta',
    icon:     'bg-terracotta/10 text-terracotta',
    cta:      'text-terracotta hover:text-terracotta-dark',
    border:   'hover:border-terracotta/30',
  },
  olive: {
    eyebrow:  'text-olive',
    icon:     'bg-olive/10 text-olive',
    cta:      'text-olive hover:text-olive-dark',
    border:   'hover:border-olive/30',
  },
  gold: {
    eyebrow:  'text-gold',
    icon:     'bg-gold/10 text-gold',
    cta:      'text-gold hover:text-gold-dark',
    border:   'hover:border-gold/30',
  },
}

// ─── Ornamenteel divider ──────────────────────────────────────────────────────

function OrnamentDivider({ label }: { label?: string }) {
  return (
    <div className="ornament-divider text-gold text-xs tracking-[0.25em] uppercase font-sans font-medium">
      {label && <span>{label}</span>}
      {!label && <span>✦</span>}
    </div>
  )
}

// ─── Navigatiekaart ───────────────────────────────────────────────────────────

function NavCard({
  href, icon: Icon, accent, eyebrow, title, description, cta,
}: (typeof NAV_CARDS)[number]) {
  const styles = ACCENT_STYLES[accent]
  return (
    <Link
      href={href}
      className={`group card-warm flex flex-col gap-4 p-7 border border-cream-darker/60 ${styles.border} transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-2.5 ${styles.icon}`}>
          <Icon size={22} strokeWidth={1.6} />
        </div>
        <ChevronRight
          size={16}
          className="text-ink-subtle mt-1 transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
      <div className="space-y-1.5">
        <p className={`text-xs font-medium uppercase tracking-widest font-sans ${styles.eyebrow}`}>
          {eyebrow}
        </p>
        <h3 className="text-xl leading-snug text-ink">{title}</h3>
        <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
      </div>
      <span className={`mt-auto text-sm font-medium font-sans ${styles.cta} flex items-center gap-1`}>
        {cta} <ChevronRight size={13} />
      </span>
    </Link>
  )
}

// ─── Openingstijden-badge ─────────────────────────────────────────────────────

function HoursChip({ days, time }: { days: string; time: string }) {
  const closed = time === 'Gesloten'
  return (
    <div className="flex items-center justify-between gap-8 py-2 border-b border-white/10 last:border-0">
      <span className="text-sm font-sans text-cream/80">{days}</span>
      <span className={`text-sm font-medium font-sans ${closed ? 'text-cream/40' : 'text-cream'}`}>
        {time}
      </span>
    </div>
  )
}

// ─── Hoofd-export ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const jsonLd = {
    '@context':          'https://schema.org',
    '@type':             ['LocalBusiness', 'WineStore'],
    name:                'Gastrovino Rotterdam',
    url:                 'https://gastrovinorotterdam.nl',
    telephone:           STORE.phone,
    email:               STORE.email,
    address: {
      '@type':           'PostalAddress',
      streetAddress:     STORE.address,
      postalCode:        STORE.postcode,
      addressLocality:   'Rotterdam',
      addressCountry:    'NL',
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:   51.9174,
      longitude:   4.4546,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '10:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '10:00', closes: '17:00' },
    ],
    priceRange:  '€€',
    servesCuisine: ['Wine', 'Delicatessen'],
    image:       'https://gastrovinorotterdam.nl/hero-winkel.jpg',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <WijnOvergang />
      <ProductShelf />
      <main>
        {/* ── Evenements-banner ── */}
        <section className="bg-gold/15 border-y border-gold/25">
          <div className="mx-auto max-w-6xl px-6 py-5">
            <Link
              href={UPCOMING_EVENT.href}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 group"
            >
              <div className="flex items-center gap-2 shrink-0">
                <Calendar size={16} className="text-gold" strokeWidth={1.8} />
                <span className="text-xs uppercase tracking-widest font-sans font-semibold text-gold">
                  {UPCOMING_EVENT.label}
                </span>
              </div>
              <div className="flex-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="font-serif font-semibold text-ink text-lg">
                  {UPCOMING_EVENT.title}
                </span>
                <span className="text-sm text-ink-muted font-sans">
                  {UPCOMING_EVENT.date}
                </span>
                <span className="text-sm font-medium text-terracotta font-sans">
                  {UPCOMING_EVENT.price}
                </span>
              </div>
              <span className="hidden sm:flex items-center gap-1 text-sm font-medium text-olive group-hover:text-olive-dark transition-colors font-sans shrink-0">
                Meer info <ChevronRight size={14} />
              </span>
            </Link>
          </div>
        </section>

        {/* ── Navigatiekaarten ── */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-12 space-y-3">
            <OrnamentDivider label="Wat kunnen wij voor u doen?" />
            <h2 className="text-3xl md:text-4xl font-serif text-ink mt-4 uppercase tracking-wide">
              Ontdek Gastrovino Rotterdam
            </h2>
            <p className="text-ink-muted max-w-lg mx-auto font-sans leading-relaxed">
              Van een verse borrelplank op maat tot een proeverij met vrienden —
              wij hebben het allemaal op de Nieuwe Binnenweg.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NAV_CARDS.map((card) => (
              <NavCard key={card.href} {...card} />
            ))}
          </div>
        </section>

        {/* ── Openingstijden & contact-sectie ── */}
        <section className="bg-olive-deeper text-cream">
          <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-[1fr_1fr_1fr] gap-10 md:gap-6">
            {/* Openingstijden */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-5">
                <Clock size={18} strokeWidth={1.6} className="text-gold" />
                <h3 className="font-serif text-xl font-medium">Openingstijden</h3>
              </div>
              {STORE.hours.map((h) => (
                <HoursChip key={h.days} days={h.days} time={h.time} />
              ))}
              <p className="text-xs text-cream/50 font-sans pt-1">
                Buiten openingstijden? Stuur een e-mail.
              </p>
            </div>

            {/* Adres */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={18} strokeWidth={1.6} className="text-gold" />
                <h3 className="font-serif text-xl font-medium">Bezoek ons</h3>
              </div>
              <div className="space-y-1">
                <p className="text-cream font-sans font-medium">{STORE.address}</p>
                <p className="text-cream/70 font-sans text-sm">{STORE.postcode}</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${STORE.address}, ${STORE.postcode}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gold/80 hover:text-gold transition-colors font-sans"
              >
                Route plannen <ChevronRight size={12} />
              </a>
              <p className="text-xs text-cream/50 font-sans leading-relaxed">
                Rotterdam-West, nabij het centrum.<br />
                Parkeren mogelijk in de buurt.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-5">
                <Phone size={18} strokeWidth={1.6} className="text-gold" />
                <h3 className="font-serif text-xl font-medium">Contact</h3>
              </div>
              <div className="space-y-3">
                <a
                  href={`tel:${STORE.phone.replace(/-/g, '')}`}
                  className="flex items-center gap-2 text-sm font-sans text-cream/80 hover:text-cream transition-colors"
                >
                  <Phone size={13} className="shrink-0" />
                  {STORE.phone}
                </a>
                <a
                  href={`mailto:${STORE.email}`}
                  className="flex items-center gap-2 text-sm font-sans text-cream/80 hover:text-cream transition-colors"
                >
                  <Mail size={13} className="shrink-0" />
                  {STORE.email}
                </a>
              </div>
              <div className="pt-2">
                <p className="text-xs text-cream/50 uppercase tracking-widest font-sans mb-3 font-medium">
                  Volg ons
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/gastrovinorotterdam"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:border-gold hover:text-gold transition-colors"
                  >
                    <IconInstagram />
                  </a>
                  <a
                    href="https://www.facebook.com/gastrovinorotterdam"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:border-gold hover:text-gold transition-colors"
                  >
                    <IconFacebook />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Over ons strip ── */}
        <section className="bg-cream-dark border-b border-cream-darker">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center space-y-6">
            <OrnamentDivider label="Ons verhaal" />
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-ink mt-4 max-w-2xl mx-auto leading-tight">
              Kwaliteit en een persoonlijke service staan bij ons centraal
            </h2>
            <p className="text-ink-muted max-w-xl mx-auto font-sans leading-relaxed">
              Naomi &amp; Melanie openden Gastrovino Rotterdam in november 2023 op de
              Nieuwe Binnenweg 335A. Naast de beste wijnen vind je er vers gebrande
              noten, tapas, vleeswaren, Hollandse &amp; buitenlandse kazen, chocolade,
              olijfolie en een uitgebreid assortiment lokale Rotterdamse producten.
            </p>
            <Link
              href="/over-ons"
              className="inline-flex items-center gap-2 text-olive font-medium font-sans text-sm hover:text-olive-dark transition-colors"
            >
              Lees ons verhaal <ChevronRight size={14} />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
