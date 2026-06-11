'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin, Phone, Wine, ShoppingBag, Star,
  ChevronRight, Filter, Users, Globe, Tag,
} from 'lucide-react'
import {
  ALL_PRODUCTS, FILTER_LABELS, FILTER_COUNTS,
  type FilterKey, type Product,
} from '@/lib/assortiment-data'

// ─── Placeholders ─────────────────────────────────────────────────────────────
// Categorie-specifieke SVG-placeholders in enoteca-kleurenpalet

function WijnPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-cream to-cream-dark gap-2">
      <svg viewBox="0 0 60 100" width="40" className="text-ink-subtle/40 fill-current">
        <rect x="22" y="0" width="16" height="30" rx="2" />
        <ellipse cx="30" cy="55" rx="20" ry="24" />
        <rect x="26" y="77" width="8" height="20" rx="2" />
        <ellipse cx="30" cy="97" rx="12" ry="3" />
      </svg>
      <span className="text-[9px] uppercase tracking-widest text-ink-subtle/50 font-sans font-medium">
        wijn
      </span>
    </div>
  )
}

function PlankPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-cream to-cream-dark gap-2">
      <svg viewBox="0 0 80 50" width="52" className="text-ink-subtle/35 fill-current">
        <ellipse cx="40" cy="25" rx="36" ry="20" />
        <circle cx="20" cy="20" r="6" className="fill-gold/30" />
        <circle cx="35" cy="30" r="4" className="fill-terracotta/30" />
        <circle cx="52" cy="18" r="5" className="fill-olive/30" />
        <rect x="14" y="22" width="16" height="4" rx="2" className="fill-cream-darker/60" />
      </svg>
      <span className="text-[9px] uppercase tracking-widest text-ink-subtle/50 font-sans font-medium">
        borrelplank
      </span>
    </div>
  )
}

function DelicatessenPlaceholder({ label }: { label?: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-cream to-cream-dark gap-2">
      <svg viewBox="0 0 64 64" width="38" className="text-ink-subtle/35 fill-current">
        <circle cx="32" cy="32" r="28" />
        <circle cx="32" cy="32" r="16" className="fill-cream-darker/50" />
        <circle cx="32" cy="32" r="6" className="fill-gold/40" />
      </svg>
      <span className="text-[9px] uppercase tracking-widest text-ink-subtle/50 font-sans font-medium">
        {label || 'delicatesse'}
      </span>
    </div>
  )
}

// ─── Product-afbeelding met graceful fallback ─────────────────────────────────

function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false)

  if (!product.image_url || failed) {
    if (product.category === 'wijnen')       return <WijnPlaceholder />
    if (product.category === 'borrelplanken') return <PlankPlaceholder />
    if (product.category === 'broodjes')     return <DelicatessenPlaceholder label="broodje" />
    return <DelicatessenPlaceholder label={product.tags[0]} />
  }

  return (
    <Image
      src={product.image_url}
      alt={product.name}
      fill
      className="object-contain transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
      onError={() => setFailed(true)}
    />
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  'Local Hero':   'bg-terracotta text-cream',
  'DOCG':         'bg-ink text-gold-light',
  'Biologisch':   'bg-gold text-cream',
  'Champagne':    'bg-ink text-gold-light',
  'Proefbox':     'bg-gold text-cream',
  'Wijndeal':     'bg-terracotta text-cream',
}

function Badge({ label }: { label: string }) {
  const cls = BADGE_STYLES[label] ?? 'bg-ink-subtle/20 text-ink-muted'
  return (
    <span className={`${cls} text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full`}>
      {label}
    </span>
  )
}

// ─── Smaaktag ─────────────────────────────────────────────────────────────────

function SmaakTag({ tag }: { tag: string }) {
  return (
    <span className="inline-block bg-olive/8 text-olive text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border border-olive/15">
      {tag}
    </span>
  )
}

// ─── Productkaart ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const isWijn       = product.category === 'wijnen'
  const isPlank      = product.category === 'borrelplanken'
  const isLocalHero  = product.is_local_hero

  return (
    <article className="group card-warm flex flex-col overflow-hidden border border-cream-darker/50 hover:border-olive/25 transition-all duration-300">
      {/* Afbeelding — productfoto's uit de webshop staan op wit */}
      <div className={`relative overflow-hidden ${product.image_url ? 'bg-white' : 'bg-cream-dark'} ${isWijn ? 'aspect-[2/3]' : 'aspect-[4/3]'}`}>
        <ProductImage product={product} />
        {/* Badge overlay */}
        {(product.badge || isLocalHero) && (
          <div className="absolute top-3 left-3">
            <Badge label={product.badge || 'Local Hero'} />
          </div>
        )}
        {/* Prijs overlay */}
        <div className="absolute bottom-3 right-3 bg-cream/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-warm-sm">
          <span className="font-serif font-semibold text-ink text-base">
            €{product.price.toFixed(2).replace('.', ',')}
          </span>
          {product.unit && (
            <span className="text-[10px] text-ink-subtle font-sans block leading-none">
              {product.unit}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Meta-info */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {product.country && (
            <span className="flex items-center gap-1 text-[11px] text-ink-subtle font-sans">
              <Globe size={10} strokeWidth={1.5} />
              {product.country}{product.regio ? ` · ${product.regio}` : ''}
            </span>
          )}
          {product.persons && (
            <span className="flex items-center gap-1 text-[11px] text-ink-subtle font-sans">
              <Users size={10} strokeWidth={1.5} />
              {product.persons}
            </span>
          )}
          {product.alcohol && (
            <span className="text-[11px] text-ink-subtle font-sans">
              {product.alcohol}
            </span>
          )}
        </div>

        {/* Naam */}
        <h3 className="font-serif text-lg leading-snug text-ink font-medium">
          {product.name}
        </h3>

        {/* Smaakprofiel */}
        {product.smaak && (
          <p className="text-[11px] font-sans font-semibold uppercase tracking-widest text-olive">
            ✦ {product.smaak}
          </p>
        )}

        {/* Beschrijving */}
        <p className="text-sm text-ink-muted leading-relaxed font-sans line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Tags */}
        {product.druif && (
          <div className="flex flex-wrap gap-1.5">
            <SmaakTag tag={product.druif} />
          </div>
        )}
        {!product.druif && product.tags.slice(0, 3).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map(t => (
              <SmaakTag key={t} tag={t} />
            ))}
          </div>
        )}

        {/* CTA */}
        {isPlank ? (
          <Link
            href="/borrelplanken"
            className="mt-2 flex items-center justify-center gap-2 bg-terracotta text-cream rounded-lg px-4 py-3 text-sm font-medium font-sans hover:bg-terracotta-dark transition-colors"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Aanpassen &amp; bestellen
          </Link>
        ) : (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 bg-olive text-cream rounded-lg px-4 py-3 text-sm font-medium font-sans hover:bg-olive-dark transition-colors"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Bestellen in de webshop
          </a>
        )}
      </div>
    </article>
  )
}

// ─── Filter-tab ───────────────────────────────────────────────────────────────

function FilterTab({
  label, count, active, onClick,
}: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium font-sans
        whitespace-nowrap transition-all duration-200
        ${active
          ? 'bg-olive text-cream shadow-warm-sm'
          : 'bg-cream-dark text-ink-muted hover:bg-cream-darker hover:text-ink border border-cream-darker'}
      `}
    >
      {label}
      <span className={`
        text-[11px] font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center
        ${active ? 'bg-cream/20 text-cream' : 'bg-cream-darker text-ink-subtle'}
      `}>
        {count}
      </span>
    </button>
  )
}

// ─── Delicatessen op-maat banner ──────────────────────────────────────────────

function DelicatessenBanner() {
  return (
    <div className="col-span-full bg-gradient-to-r from-cream-dark via-cream to-cream-dark border border-cream-darker rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="w-14 h-14 rounded-full bg-terracotta/15 flex items-center justify-center shrink-0">
        <Tag size={24} className="text-terracotta" strokeWidth={1.6} />
      </div>
      <div className="flex-1 space-y-1.5">
        <h3 className="font-serif text-xl font-medium text-ink">
          Specifieke wensen? Wij snijden het vers voor u af.
        </h3>
        <p className="text-sm text-ink-muted font-sans leading-relaxed">
          Heeft u een bepaalde kaas, tapas of vleeswaren op het oog? Voeg het als opmerking
          toe aan uw Click &amp; Collect bestelling, of bel direct met Naomi &amp; Melanie.
          Wij helpen u graag aan de ideale delicatesse-selectie op maat.
        </p>
      </div>
      <div className="shrink-0 flex flex-col sm:flex-row gap-3">
        <a
          href="tel:0104767277"
          className="inline-flex items-center gap-2 bg-terracotta text-cream px-5 py-3 rounded-full text-sm font-medium font-sans hover:bg-terracotta-dark transition-colors"
        >
          <Phone size={14} strokeWidth={2} />
          010-4767277
        </a>
        <a
          href="mailto:info@gastrovinorotterdam.nl"
          className="inline-flex items-center gap-2 border border-olive text-olive px-5 py-3 rounded-full text-sm font-medium font-sans hover:bg-olive hover:text-cream transition-colors"
        >
          <MapPin size={14} strokeWidth={2} />
          Nieuwe Binnenweg 335A
        </a>
      </div>
    </div>
  )
}

// ─── Winkel-header metrics ────────────────────────────────────────────────────

function ShopMetric({ icon: Icon, value, label }: {
  icon: React.ComponentType<{ size: number; strokeWidth: number; className?: string }>
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center">
        <Icon size={18} strokeWidth={1.6} className="text-gold-light" />
      </div>
      <div>
        <p className="font-serif font-semibold text-cream text-sm">{value}</p>
        <p className="text-[11px] text-cream/60 font-sans">{label}</p>
      </div>
    </div>
  )
}

// ─── Hoofd-component ──────────────────────────────────────────────────────────

// Volgorde van de secties in de 'alles'-weergave + gridbreedte per categorie
const SECTION_ORDER: FilterKey[] = [
  'wijnen', 'borrelplanken', 'delicatessen', 'broodjes',
  'geschenken', 'alcohol-vrij', 'proeverijen',
]

const GRID_BY_CATEGORY: Partial<Record<FilterKey, string>> = {
  wijnen:        'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  borrelplanken: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  proeverijen:   'sm:grid-cols-2 md:grid-cols-3',
}

export default function AssortimentShop() {
  // Deep-link vanaf andere pagina's: /assortiment?filter=wijnen
  const filterParam = useSearchParams().get('filter')
  const initialFilter: FilterKey =
    filterParam && filterParam in FILTER_LABELS ? (filterParam as FilterKey) : 'alles'
  const [activeFilter, setActiveFilter] = useState<FilterKey>(initialFilter)
  const [sortBy, setSortBy] = useState<'default' | 'prijs-laag' | 'prijs-hoog'>('default')

  const filtered = ALL_PRODUCTS.filter(p =>
    activeFilter === 'alles' || p.category === activeFilter
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'prijs-laag') return a.price - b.price
    if (sortBy === 'prijs-hoog') return b.price - a.price
    return 0
  })

  const showDelicatessenBanner =
    activeFilter === 'alles' || activeFilter === 'delicatessen'

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Pagina-header ── */}
      <div className="bg-olive-deeper text-cream">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <p className="subtitle-vlak">
                Gastrovino Rotterdam · Nieuwe Binnenweg 335A
              </p>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight uppercase tracking-wide">
                Ons Assortiment
              </h1>
              <p className="text-cream/70 font-sans text-base leading-relaxed max-w-lg">
                Het volledige assortiment uit onze webshop: handgeselecteerde wijnen,
                verse borrelplanken, delicatessen, lunch en relatiegeschenken —
                bestellen voor Click &amp; Collect op de Nieuwe Binnenweg.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 shrink-0">
              <ShopMetric icon={Wine}        value={`${FILTER_COUNTS.wijnen} wijnen`}           label="Handgeselecteerd" />
              <ShopMetric icon={Star}        value={`${FILTER_COUNTS.alles} producten`}         label="Uit onze webshop" />
              <ShopMetric icon={ShoppingBag} value="Click & Collect"                            label="Afhalen in de winkel" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter-balk ── */}
      <div className="sticky top-16 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-darker shadow-warm-sm">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <Filter size={14} className="text-ink-subtle shrink-0" strokeWidth={1.8} />
          {(Object.entries(FILTER_LABELS) as [FilterKey, string][]).map(([key, label]) => (
            <FilterTab
              key={key}
              label={label}
              count={FILTER_COUNTS[key]}
              active={activeFilter === key}
              onClick={() => setActiveFilter(key)}
            />
          ))}
          <div className="ml-auto shrink-0">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm font-sans text-ink-muted bg-cream-dark border border-cream-darker rounded-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-olive/40"
            >
              <option value="default">Sortering</option>
              <option value="prijs-laag">Prijs ↑</option>
              <option value="prijs-hoog">Prijs ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Productgrid ── */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Sectie-titel bij filter */}
        {activeFilter !== 'alles' && (
          <div className="mb-8 flex items-baseline gap-3">
            <h2 className="font-serif text-2xl font-medium text-ink">
              {FILTER_LABELS[activeFilter]}
            </h2>
            <span className="text-sm text-ink-muted font-sans">
              {sorted.length} {sorted.length === 1 ? 'product' : 'producten'}
            </span>
          </div>
        )}

        {/* Secties bij 'alles' */}
        {activeFilter === 'alles' ? (
          <div className="space-y-16">
            {SECTION_ORDER.map(key => {
              const sectionProducts = sorted.filter(p => p.category === key)
              if (sectionProducts.length === 0) return null
              return (
                <section key={key}>
                  <div className="flex items-baseline gap-4 mb-7">
                    <h2 className="font-serif text-2xl text-ink uppercase tracking-wide">
                      {FILTER_LABELS[key]}
                    </h2>
                    <span className="text-sm text-ink-subtle font-sans">
                      {sectionProducts.length} {sectionProducts.length === 1 ? 'product' : 'producten'}
                    </span>
                    {key === 'borrelplanken' ? (
                      <Link
                        href="/borrelplanken"
                        className="ml-auto text-sm text-olive font-sans font-medium hover:text-olive-dark transition-colors flex items-center gap-1"
                      >
                        Zelf bouwen <ChevronRight size={13} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveFilter(key)}
                        className="ml-auto text-sm text-olive font-sans font-medium hover:text-olive-dark transition-colors flex items-center gap-1"
                      >
                        Bekijk alles <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                  <div className={`grid gap-5 ${GRID_BY_CATEGORY[key] ?? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                    {sectionProducts.map(p => (
                      <ProductCard key={p.sku} product={p} />
                    ))}
                    {key === 'delicatessen' && <DelicatessenBanner />}
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          /* Gefilterde weergave */
          <div className="space-y-8">
            <div className={`grid gap-5 ${GRID_BY_CATEGORY[activeFilter] ?? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
              {sorted.map(p => <ProductCard key={p.sku} product={p} />)}
              {showDelicatessenBanner && <DelicatessenBanner />}
            </div>
          </div>
        )}
      </div>

      {/* ── Click & Collect uitleg ── */}
      <div className="bg-cream-dark border-t border-cream-darker">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center space-y-4">
          <p className="text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-gold">
            Click &amp; Collect
          </p>
          <h3 className="font-serif text-2xl font-medium text-ink">
            Bestellen &amp; afhalen op de Nieuwe Binnenweg
          </h3>
          <p className="text-ink-muted font-sans text-sm leading-relaxed max-w-md mx-auto">
            Bestelt u via de website? Wij leggen uw order klaar en u haalt het op
            tijdens onze openingstijden. Maandag t/m vrijdag 10:00–18:00 · Zaterdag 10:00–17:00.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="tel:0104767277"
              className="inline-flex items-center gap-2 text-sm font-medium font-sans text-olive hover:text-olive-dark transition-colors"
            >
              <Phone size={13} strokeWidth={2} />
              010-4767277
            </a>
            <span className="text-ink-subtle/40">·</span>
            <a
              href="mailto:info@gastrovinorotterdam.nl"
              className="text-sm font-medium font-sans text-olive hover:text-olive-dark transition-colors"
            >
              info@gastrovinorotterdam.nl
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
