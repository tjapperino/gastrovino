'use client'

import { useState } from 'react'
import {
  MapPin, Clock, ShoppingBag, Check, ChevronRight, ChevronLeft,
  Plus, Minus, Star, Users, Sparkles, UtensilsCrossed, Hammer,
} from 'lucide-react'
import { BORRELPLANKEN } from '@/lib/assortiment-data'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BorrelProduct {
  sku: string
  name: string
  subtitle: string
  description: string
  price: number
  tags: string[]
  emoji: string
  land?: string
  druif?: string
  alcohol?: string
  spijsAdvies?: string
  isLocalHero?: boolean
  badge?: string
}

type Mode = 'vast' | 'zelf'

// ─── Product data (scraped + seed data) ──────────────────────────────────────

const WIJNEN: BorrelProduct[] = [
  {
    sku: 'GV-VENTOPURO-CARMENERE-SINGLE-VINEYARD',
    name: 'Ventopuro Carmenère',
    subtitle: 'Single Vineyard · Chili',
    description: 'Vol en krachtig met intense aroma\'s van rijp fruit, chocolade en kruidigheden. Zachte tannines.',
    price: 10.95,
    tags: ['vol', 'krachtig', 'kruidig'],
    emoji: '🍷',
    land: 'Chili',
    druif: 'Carmenère',
    alcohol: '14%',
    spijsAdvies: "pasta's, rood vlees",
  },
  {
    sku: 'GV-BORSAO-TRES-PICOS',
    name: 'Borsao Tres Picos',
    subtitle: 'Campo de Borja · Spanje',
    description: 'Elegant en soepel met rijpe rode vruchten, subtiele specerijen en een lange afdronk.',
    price: 21.95,
    tags: ['soepel', 'fruitig', 'elegant'],
    emoji: '🍷',
    land: 'Spanje',
    druif: 'Garnacha',
    alcohol: '13,5%',
    spijsAdvies: 'lam, gegrild vlees',
    badge: 'Bestseller',
  },
  {
    sku: 'GV-BARBERA-D-ASTI-LA-GENA-DOCG',
    name: "Barbera d'Asti La Gena",
    subtitle: 'DOCG · Piemonte, Italië',
    description: 'Expressief met kersen, pruimen en lichte kruidigheid. Levendige zuurgraad, ideaal bij de Italiaanse keuken.',
    price: 21.95,
    tags: ['vol', 'fruitig', 'italiaans'],
    emoji: '🍷',
    land: 'Italië',
    druif: 'Barbera',
    alcohol: '13,5%',
    spijsAdvies: 'antipasti, pasta, kaas',
    badge: 'DOCG',
  },
  {
    sku: 'GV-RIBERA-DEL-DUERO-TIERRAS-DE-CAIR',
    name: 'Tierras de Cair',
    subtitle: 'Ribera del Duero · Spanje',
    description: 'Een monumentale wijn. Diepe structuur, rijke tannines, oneindig lange afdronk. Voor de echte kenner.',
    price: 49.95,
    tags: ['rijk', 'complex', 'premium'],
    emoji: '🍷',
    land: 'Spanje',
    druif: 'Tempranillo',
    alcohol: '14,5%',
    spijsAdvies: 'ribeye, gerijpte kaas',
    badge: 'Premium',
  },
]

const KAZEN: BorrelProduct[] = [
  {
    sku: 'GV-LOK-ROTTERDAMSCHE',
    name: 'Rotterdamsche Oude',
    subtitle: '36 maanden gerijpt',
    description: 'Authentieke Rotterdamse boerenkaas met diepe, nootachtige smaak en tyrosine-kristallen. Een echte karakterkaas.',
    price: 7.50,
    tags: ['pittig', 'nootachtig', 'gerijpt'],
    emoji: '🧀',
    land: 'Nederland',
    spijsAdvies: 'rode wijn, port',
    isLocalHero: true,
    badge: 'Local Hero',
  },
  {
    sku: 'GV-DEL-TRUFFELKAAS',
    name: 'Truffelkaas uit Piëmonte',
    subtitle: 'Zwarte zomertruffel · Italië',
    description: 'Zachte, romige kaas dooraderd met fijne zwarte zomertruffel. Aards-nootachtig karakter.',
    price: 9.95,
    tags: ['romig', 'truffel', 'luxe'],
    emoji: '🧀',
    land: 'Italië',
    spijsAdvies: 'barbera, prosecco',
    badge: 'Premium',
  },
]

const SNACKS: BorrelProduct[] = [
  {
    sku: 'GV-LOK-PELGRIM',
    name: 'Pelgrim Stadsblond',
    subtitle: 'Delfshaven · Rotterdam',
    description: 'Ambachtelijk stadsblond van Pelgrim Brouwerij in Delfshaven. Fris, licht fruitig, gebrouwen op historische grond.',
    price: 3.25,
    tags: ['blond', 'fris', 'ambachtelijk'],
    emoji: '🍺',
    land: 'Nederland',
    alcohol: '5,0%',
    spijsAdvies: 'bitterballen, vis',
    isLocalHero: true,
    badge: 'Local Hero',
  },
  {
    sku: 'GV-LOK-KLEPPER',
    name: 'Klepper & Klepper Drop',
    subtitle: 'Ambachtelijk · Rotterdam',
    description: 'Handgemaakte drop van het Rotterdamse huismerk. Zoet, taai en onweerstaanbaar. Exclusief bij Gastrovino.',
    price: 2.95,
    tags: ['zoet', 'drop', 'lokaal'],
    emoji: '🍬',
    land: 'Nederland',
    spijsAdvies: 'port, dessertwijn',
    isLocalHero: true,
    badge: 'Local Hero',
  },
  {
    sku: 'GV-DEL-PECANNOTEN',
    name: 'Gebrande Pecannoten',
    subtitle: 'Rozemarijn & zeezout',
    description: 'Dagelijks vers gebrande pecannoten met Provençaalse rozemarijn. Het perfecte knabbelgoed bij de wijn.',
    price: 6.50,
    tags: ['knapperig', 'kruidig', 'vers'],
    emoji: '🥜',
    land: 'Nederland',
    spijsAdvies: 'alle wijnen',
  },
  {
    sku: 'GV-DEL-TAGGIASCHE-OLIJVEN',
    name: 'Taggiasca Olijven',
    subtitle: 'Ligurië · Italië',
    description: 'Kleine, milde Taggiasca-olijven uit de Ligurische kust, bewaard in aromatische olijfolie met tijm.',
    price: 5.95,
    tags: ['mild', 'fruitig', 'tapas'],
    emoji: '🫒',
    land: 'Italië',
    spijsAdvies: 'witte & rode wijn',
  },
]

const STEPS = [
  { id: 1, label: 'Kies de basis',     sub: 'Wijn' },
  { id: 2, label: 'Kaas & Karakter',   sub: 'Kaas' },
  { id: 3, label: 'De Afwerking',      sub: 'Extra\'s' },
]

const PICKUP_DAYS = [
  { dag: 'Ma – Vr',  tijd: '10:00 – 18:00' },
  { dag: 'Zaterdag', tijd: '10:00 – 17:00' },
]

// ─── Kleine bouwstenen ────────────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-olive/8 border border-olive/15 px-2.5 py-0.5 text-[10px] font-sans font-medium uppercase tracking-wider text-olive">
      {label}
    </span>
  )
}

function BadgePill({ label }: { label: string }) {
  const styles: Record<string, string> = {
    'Local Hero': 'bg-terracotta text-cream',
    'Premium':    'bg-ink text-gold',
    'DOCG':       'bg-olive text-cream',
    'Bestseller': 'bg-gold text-ink',
    'Populair':   'bg-terracotta text-cream',
    'Feestelijk': 'bg-gold text-ink',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-wider ${styles[label] ?? 'bg-cream-darker text-ink-muted'}`}>
      {label === 'Local Hero' && <Star size={9} className="fill-current" />}
      {label}
    </span>
  )
}

// ─── Productkaart (wizard) ────────────────────────────────────────────────────

interface ProductCardProps {
  product: BorrelProduct
  selected: boolean
  onToggle: () => void
  selectionType: 'radio' | 'checkbox'
  quantity?: number
  onIncrement?: () => void
  onDecrement?: () => void
}

function ProductCard({
  product, selected, onToggle, selectionType,
  quantity = 0, onIncrement, onDecrement,
}: ProductCardProps) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-cream transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-gold shadow-warm-lg'
          : 'border-cream-darker hover:border-olive/30 shadow-warm-sm hover:shadow-warm'
      }`}
      onClick={onToggle}
    >
      {/* Bovenrand */}
      <div className="bg-cream-dark px-5 pt-5 pb-6">
        <div className="flex items-start justify-between">
          <span className="text-4xl leading-none">{product.emoji}</span>
          <div className="flex flex-col items-end gap-1.5">
            {product.badge && <BadgePill label={product.badge} />}
            {selected && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold shadow-warm-sm">
                <Check className="h-3.5 w-3.5 text-ink" strokeWidth={3} />
              </span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-serif text-lg font-medium leading-snug text-ink">{product.name}</h3>
          <p className="mt-0.5 text-xs font-sans text-ink-muted">{product.subtitle}</p>
        </div>
      </div>

      {/* Inhoud */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <p className="text-xs font-sans leading-relaxed text-ink-muted">{product.description}</p>

        {(product.druif || product.alcohol || product.land) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-sans text-ink-subtle">
            {product.land    && <span>📍 {product.land}</span>}
            {product.druif   && <span>🍇 {product.druif}</span>}
            {product.alcohol && <span>{product.alcohol} vol.</span>}
          </div>
        )}

        {product.spijsAdvies && (
          <p className="text-[11px] font-sans text-ink-subtle">
            <span className="text-olive font-medium">Lekker bij: </span>{product.spijsAdvies}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {product.tags.map(t => <Tag key={t} label={t} />)}
        </div>

        {/* Prijs + actie */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-cream-darker">
          <span className="font-serif text-lg font-semibold text-ink">
            € {product.price.toFixed(2).replace('.', ',')}
          </span>

          {selectionType === 'checkbox' && selected && onIncrement && onDecrement ? (
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <button
                onClick={onDecrement}
                aria-label="Minder"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-cream-darker text-ink-muted transition hover:border-olive hover:text-olive"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-5 text-center text-sm font-sans font-semibold text-ink">{quantity}</span>
              <button
                onClick={onIncrement}
                aria-label="Meer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-olive text-cream transition hover:bg-olive-dark"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onToggle() }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-sans font-semibold transition ${
                selected
                  ? 'bg-gold/15 text-gold-dark hover:bg-gold/25'
                  : 'bg-olive text-cream hover:bg-olive-dark'
              }`}
            >
              {selected ? (
                <><Check className="h-3 w-3" /> Geselecteerd</>
              ) : (
                <><Plus className="h-3 w-3" /> Voeg toe</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Vaste plank-kaart ────────────────────────────────────────────────────────

function VastePlankCard({
  plank, selected, onSelect,
}: { plank: typeof BORRELPLANKEN[number]; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-cream transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-gold shadow-warm-lg'
          : 'border-cream-darker hover:border-olive/30 shadow-warm-sm hover:shadow-warm'
      }`}
    >
      {/* Decoratieve kop */}
      <div className="bg-gradient-to-br from-cream-dark to-cream-darker px-5 pt-6 pb-7 text-center relative">
        {plank.badge && (
          <div className="absolute top-3 right-3"><BadgePill label={plank.badge} /></div>
        )}
        {selected && (
          <span className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gold shadow-warm-sm">
            <Check className="h-3.5 w-3.5 text-ink" strokeWidth={3} />
          </span>
        )}
        <div className="flex justify-center mb-3">
          <svg viewBox="0 0 80 50" width="64" className="text-ink-subtle/40 fill-current">
            <ellipse cx="40" cy="25" rx="36" ry="20" />
            <circle cx="20" cy="20" r="6" className="fill-gold/40" />
            <circle cx="35" cy="30" r="4" className="fill-terracotta/40" />
            <circle cx="52" cy="18" r="5" className="fill-olive/40" />
          </svg>
        </div>
        <p className="flex items-center justify-center gap-1.5 text-xs font-sans font-medium text-ink-muted">
          <Users size={12} strokeWidth={1.8} />
          {plank.persons}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <h3 className="font-serif text-lg font-medium leading-snug text-ink text-center">
          {plank.name}
        </h3>
        <p className="text-xs font-sans leading-relaxed text-ink-muted text-center">
          {plank.description}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {plank.tags.slice(0, 4).map(t => <Tag key={t} label={t} />)}
        </div>
        <div className="mt-auto pt-3 border-t border-cream-darker text-center">
          <span className="font-serif text-2xl font-semibold text-ink">
            € {plank.price.toFixed(2).replace('.', ',')}
          </span>
          <span className="block text-[10px] font-sans text-ink-subtle">per plank · vers opgemaakt</span>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  mode:          Mode
  vastePlank:    typeof BORRELPLANKEN[number] | null
  selectedWijn:  BorrelProduct | null
  kaasCounts:    Record<string, number>
  snackCounts:   Record<string, number>
  totalPrice:    number
  canOrder:      boolean
  onOrder:       () => void
  ordered:       boolean
}

function Sidebar({
  mode, vastePlank, selectedWijn, kaasCounts, snackCounts,
  totalPrice, canOrder, onOrder, ordered,
}: SidebarProps) {
  const hasItems = (mode === 'vast' && vastePlank) ||
    (mode === 'zelf' && (selectedWijn || Object.values(kaasCounts).some(c => c > 0) || Object.values(snackCounts).some(c => c > 0)))

  return (
    <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-cream-darker bg-cream shadow-warm overflow-hidden">
      {/* Kop */}
      <div className="bg-olive-deeper px-6 py-5">
        <div className="flex items-center gap-2 mb-0.5">
          <UtensilsCrossed className="h-4 w-4 text-gold" strokeWidth={1.8} />
          <h2 className="font-serif text-base font-medium text-cream">
            Jouw Borrelplank
          </h2>
        </div>
        <p className="text-xs font-sans text-cream/60">Samengesteld voor Click &amp; Collect</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Itemlijst */}
        <div className="min-h-[120px] space-y-3">
          {!hasItems ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <span className="text-3xl">🍽️</span>
              <p className="text-sm font-sans text-ink-subtle leading-relaxed">
                {mode === 'vast'
                  ? 'Kies een van onze vaste planken'
                  : 'Voeg producten toe om je plank samen te stellen'}
              </p>
            </div>
          ) : (
            <>
              {mode === 'vast' && vastePlank && (
                <SidebarItem
                  emoji="🍽️"
                  name={vastePlank.name}
                  subtitle={`${vastePlank.persons} · vers opgemaakt`}
                  price={vastePlank.price}
                  qty={1}
                />
              )}
              {mode === 'zelf' && (
                <>
                  {selectedWijn && (
                    <SidebarItem
                      emoji={selectedWijn.emoji}
                      name={selectedWijn.name}
                      subtitle={selectedWijn.subtitle}
                      price={selectedWijn.price}
                      qty={1}
                    />
                  )}
                  {KAZEN.map(k => kaasCounts[k.sku] > 0 && (
                    <SidebarItem
                      key={k.sku} emoji={k.emoji} name={k.name} subtitle={k.subtitle}
                      price={k.price} qty={kaasCounts[k.sku]} isHero={k.isLocalHero}
                    />
                  ))}
                  {SNACKS.map(s => snackCounts[s.sku] > 0 && (
                    <SidebarItem
                      key={s.sku} emoji={s.emoji} name={s.name} subtitle={s.subtitle}
                      price={s.price} qty={snackCounts[s.sku]} isHero={s.isLocalHero}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {/* Totaal */}
        <div className="border-t border-cream-darker pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-sans font-medium text-ink-muted">Totaal</span>
            <span className="font-serif text-3xl font-semibold text-ink">
              € {totalPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* CTA */}
        {ordered ? (
          <div className="rounded-xl bg-olive/10 border border-olive/25 p-4 text-center animate-fade-in">
            <p className="font-serif text-base font-medium text-olive mb-1">Bedankt voor je bestelling! 🎉</p>
            <p className="text-xs font-sans text-ink-muted leading-relaxed">
              We leggen je plank klaar. Je ontvangt een bevestiging per e-mail —
              afhalen kan tijdens openingstijden op de Nieuwe Binnenweg 335A.
            </p>
          </div>
        ) : (
          <button
            disabled={!canOrder}
            onClick={onOrder}
            className={`w-full rounded-xl py-4 text-sm font-sans font-semibold tracking-wide transition-all duration-200 ${
              canOrder
                ? 'bg-terracotta text-cream hover:bg-terracotta-dark shadow-warm active:scale-[0.99]'
                : 'bg-cream-darker text-ink-subtle cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="mr-2 inline-block h-4 w-4" />
            Bestel voor Click &amp; Collect
          </button>
        )}

        {/* Afhaalinfo */}
        <div className="rounded-xl bg-cream-dark p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-sans font-medium text-ink">
            <MapPin className="h-3.5 w-3.5 text-terracotta shrink-0" />
            Nieuwe Binnenweg 335A, Rotterdam
          </div>
          {PICKUP_DAYS.map(d => (
            <div key={d.dag} className="flex items-center gap-2 text-xs font-sans text-ink-muted">
              <Clock className="h-3.5 w-3.5 text-ink-subtle shrink-0" />
              <span className="font-medium w-20">{d.dag}</span>
              <span>{d.tijd}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function SidebarItem({ emoji, name, subtitle, price, qty, isHero }: {
  emoji: string; name: string; subtitle: string; price: number; qty: number; isHero?: boolean
}) {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <span className="text-xl shrink-0 mt-0.5">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-xs font-sans font-medium text-ink leading-snug">{name}</p>
          {isHero && <Star className="h-3 w-3 fill-gold text-gold shrink-0" />}
        </div>
        <p className="text-[11px] font-sans text-ink-subtle truncate">{subtitle}{qty > 1 ? ` ×${qty}` : ''}</p>
      </div>
      <span className="text-xs font-sans font-semibold text-ink shrink-0">
        € {(price * qty).toFixed(2).replace('.', ',')}
      </span>
    </div>
  )
}

// ─── Hoofdcomponent ───────────────────────────────────────────────────────────

export default function BorrelplankBuilder() {
  const [mode, setMode] = useState<Mode>('vast')
  const [vastePlank, setVastePlank] = useState<typeof BORRELPLANKEN[number] | null>(null)
  const [step, setStep] = useState(1)
  const [selectedWijn, setSelectedWijn] = useState<BorrelProduct | null>(null)
  const [ordered, setOrdered] = useState(false)

  const [kaasCounts, setKaasCounts] = useState<Record<string, number>>(
    Object.fromEntries(KAZEN.map(k => [k.sku, 0]))
  )
  const [snackCounts, setSnackCounts] = useState<Record<string, number>>(
    Object.fromEntries(SNACKS.map(s => [s.sku, 0]))
  )

  const zelfTotal =
    (selectedWijn?.price ?? 0) +
    KAZEN.reduce((sum, k)  => sum + k.price * (kaasCounts[k.sku]  ?? 0), 0) +
    SNACKS.reduce((sum, s) => sum + s.price * (snackCounts[s.sku] ?? 0), 0)

  const totalPrice = mode === 'vast' ? (vastePlank?.price ?? 0) : zelfTotal

  const canOrder = mode === 'vast'
    ? !!vastePlank
    : (!!selectedWijn || Object.values(kaasCounts).some(c => c > 0) || Object.values(snackCounts).some(c => c > 0))

  const adjustCount = (
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    sku: string,
    delta: number,
  ) => {
    setter(prev => ({ ...prev, [sku]: Math.max(0, (prev[sku] ?? 0) + delta) }))
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setOrdered(false)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Pagina-kop ── */}
      <div className="bg-olive-deeper text-cream">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] font-sans font-semibold text-gold/80">
            Vers opgemaakt · Nieuwe Binnenweg 335A
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
            De Borrelplank Builder
          </h1>
          <p className="text-cream/70 font-sans text-base leading-relaxed max-w-xl mx-auto">
            Kies een van onze beproefde vaste planken — of stel zelf jouw perfecte
            combinatie samen met wijnen, kazen en Rotterdamse Local Heroes.
          </p>

          {/* Mode-switch */}
          <div className="inline-flex rounded-full bg-cream/10 p-1.5 mt-2">
            <button
              type="button"
              onClick={() => switchMode('vast')}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-sans font-medium transition-all ${
                mode === 'vast'
                  ? 'bg-cream text-ink shadow-warm-sm'
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              <Sparkles size={14} strokeWidth={2} />
              Vaste planken
            </button>
            <button
              type="button"
              onClick={() => switchMode('zelf')}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-sans font-medium transition-all ${
                mode === 'zelf'
                  ? 'bg-cream text-ink shadow-warm-sm'
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              <Hammer size={14} strokeWidth={2} />
              Zelf samenstellen
            </button>
          </div>
        </div>
      </div>

      {/* ── Hoofdgrid ── */}
      <div className="mx-auto max-w-6xl px-6 py-10 grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* ── Links: kiezer ── */}
        <div>
          {mode === 'vast' ? (
            /* ── Vaste planken ── */
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl font-medium text-ink">
                  Onze vaste borrelplanken
                </h2>
                <p className="text-sm font-sans text-ink-muted mt-1 leading-relaxed">
                  Altijd vers opgemaakt met diverse kazen, charcuterie, noten en olijven.
                  Specifieke wensen? Vermeld het bij je bestelling — wij snijden het vers voor je af.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {BORRELPLANKEN.map(plank => (
                  <VastePlankCard
                    key={plank.sku}
                    plank={plank}
                    selected={vastePlank?.sku === plank.sku}
                    onSelect={() => { setVastePlank(prev => prev?.sku === plank.sku ? null : plank); setOrdered(false) }}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* ── Zelf samenstellen (wizard) ── */
            <div className="space-y-6 animate-fade-in">
              {/* Stappen-indicator */}
              <div className="flex items-center gap-2">
                {STEPS.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(s.id)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-sans font-medium transition-all ${
                        step === s.id
                          ? 'bg-olive text-cream shadow-warm-sm'
                          : step > s.id
                            ? 'bg-olive/15 text-olive'
                            : 'bg-cream-dark text-ink-subtle border border-cream-darker'
                      }`}
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        step === s.id ? 'bg-cream text-olive' : step > s.id ? 'bg-olive text-cream' : 'bg-cream-darker text-ink-subtle'
                      }`}>
                        {step > s.id ? <Check size={10} strokeWidth={3} /> : s.id}
                      </span>
                      <span className="hidden sm:inline">{s.sub}</span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className={`h-px w-6 transition-colors ${step > s.id ? 'bg-olive/40' : 'bg-cream-darker'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Stap-kop */}
              <div>
                <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-gold mb-1">
                  Stap {step} van 3
                </p>
                <h2 className="font-serif text-2xl font-medium text-ink">
                  {STEPS[step - 1].label}
                </h2>
                <p className="mt-1 text-sm font-sans text-ink-muted">
                  {step === 1 && 'Kies de wijn die de basis vormt van je borrelplank.'}
                  {step === 2 && 'Voeg karaktervolle kazen toe — van Rotterdamse Oude tot Piëmontese truffel.'}
                  {step === 3 && 'Maak je plank compleet met ambachtelijke snacks en Rotterdamse specialiteiten.'}
                </p>
              </div>

              {/* Stap 1: Wijnen */}
              {step === 1 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-slide-in">
                  {WIJNEN.map(wijn => (
                    <ProductCard
                      key={wijn.sku}
                      product={wijn}
                      selected={selectedWijn?.sku === wijn.sku}
                      onToggle={() => { setSelectedWijn(prev => prev?.sku === wijn.sku ? null : wijn); setOrdered(false) }}
                      selectionType="radio"
                    />
                  ))}
                </div>
              )}

              {/* Stap 2: Kaas */}
              {step === 2 && (
                <div className="flex flex-col gap-4 animate-slide-in">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {KAZEN.map(kaas => (
                      <ProductCard
                        key={kaas.sku}
                        product={kaas}
                        selected={kaasCounts[kaas.sku] > 0}
                        onToggle={() => { adjustCount(setKaasCounts, kaas.sku, kaasCounts[kaas.sku] > 0 ? -kaasCounts[kaas.sku] : 1); setOrdered(false) }}
                        selectionType="checkbox"
                        quantity={kaasCounts[kaas.sku]}
                        onIncrement={() => adjustCount(setKaasCounts, kaas.sku, 1)}
                        onDecrement={() => adjustCount(setKaasCounts, kaas.sku, -1)}
                      />
                    ))}
                  </div>

                  {selectedWijn && (
                    <div className="rounded-xl border border-gold/30 bg-gold/8 p-4">
                      <p className="text-xs font-sans font-semibold text-gold-dark mb-1">✦ Wijn-kaas tip</p>
                      <p className="text-xs font-sans text-ink-muted leading-relaxed">
                        De Rotterdamsche Oude (36 mnd) en {selectedWijn.name} vormen een perfect duo —
                        de pittige kaas balanceert de {selectedWijn.tags[0]} smaak van de wijn prachtig.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Stap 3: Extra's */}
              {step === 3 && (
                <div className="flex flex-col gap-4 animate-slide-in">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {SNACKS.map(snack => (
                      <ProductCard
                        key={snack.sku}
                        product={snack}
                        selected={snackCounts[snack.sku] > 0}
                        onToggle={() => { setSnackCounts(prev => ({ ...prev, [snack.sku]: prev[snack.sku] > 0 ? 0 : 1 })); setOrdered(false) }}
                        selectionType="checkbox"
                        quantity={snackCounts[snack.sku]}
                        onIncrement={() => adjustCount(setSnackCounts, snack.sku, 1)}
                        onDecrement={() => adjustCount(setSnackCounts, snack.sku, -1)}
                      />
                    ))}
                  </div>

                  {canOrder && !ordered && (
                    <div className="rounded-xl border border-olive/25 bg-olive/8 p-5 animate-fade-in">
                      <p className="font-serif text-base font-medium text-ink mb-1">Je plank is bijna klaar ✦</p>
                      <p className="text-xs font-sans text-ink-muted leading-relaxed">
                        Klik op <strong className="text-terracotta">Bestel voor Click &amp; Collect</strong> in
                        het overzicht om je plank te bestellen. Afhalen op de Nieuwe Binnenweg 335A.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Wizard-navigatie */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="flex items-center gap-2 rounded-full border border-cream-darker px-5 py-2.5 text-xs font-sans font-medium text-ink-muted transition hover:border-olive/40 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Vorige stap
                </button>

                <div className="flex gap-1.5">
                  {STEPS.map(s => (
                    <div
                      key={s.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        step === s.id ? 'w-6 bg-olive' : step > s.id ? 'w-3 bg-olive/40' : 'w-3 bg-cream-darker'
                      }`}
                    />
                  ))}
                </div>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => Math.min(3, s + 1))}
                    className="flex items-center gap-2 rounded-full bg-olive px-6 py-2.5 text-xs font-sans font-semibold text-cream transition hover:bg-olive-dark active:scale-95"
                  >
                    Volgende stap
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="w-[120px]" aria-hidden />
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Rechts: overzicht ── */}
        <Sidebar
          mode={mode}
          vastePlank={vastePlank}
          selectedWijn={selectedWijn}
          kaasCounts={kaasCounts}
          snackCounts={snackCounts}
          totalPrice={totalPrice}
          canOrder={canOrder}
          onOrder={() => setOrdered(true)}
          ordered={ordered}
        />
      </div>
    </div>
  )
}
