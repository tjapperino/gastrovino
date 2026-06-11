import Link from 'next/link'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'
import BrandWordmark from '@/components/BrandWordmark'

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

function IconTiktok() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

const FOOTER_NAV = [
  { href: '/assortiment',   label: 'Assortiment' },
  { href: '/borrelplanken', label: 'Borrelplank Builder' },
  { href: '/proeverijen',   label: 'Proeverijen & High Tea' },
  { href: '/catering',      label: 'Lunch & Catering' },
  { href: '/over-ons',      label: 'Over Ons' },
]

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-cream/70">
      <div className="mx-auto max-w-6xl px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Merk */}
        <div className="space-y-4">
          <BrandWordmark className="text-[11px] text-cream" />
          <p className="text-sm font-sans leading-relaxed text-cream/60">
            Dé plek voor wijn, delicatessen &amp; Rotterdamse smaak.
            Sinds november 2023 op de Nieuwe Binnenweg.
          </p>
          <div className="flex gap-3 pt-1">
            <a
              href="https://www.instagram.com/gastrovinorotterdam"
              target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold transition-colors"
            >
              <IconInstagram />
            </a>
            <a
              href="https://www.facebook.com/gastrovinorotterdam"
              target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold transition-colors"
            >
              <IconFacebook />
            </a>
            <a
              href="https://www.tiktok.com/@gastrovinorotterdam"
              target="_blank" rel="noopener noreferrer" aria-label="TikTok"
              className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold transition-colors"
            >
              <IconTiktok />
            </a>
          </div>
        </div>

        {/* Navigatie */}
        <div className="space-y-4">
          <h4 className="font-serif text-cream text-base font-medium">Ontdek</h4>
          <nav className="flex flex-col gap-2.5">
            {FOOTER_NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-sans text-cream/60 hover:text-gold transition-colors w-fit"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Openingstijden */}
        <div className="space-y-4">
          <h4 className="font-serif text-cream text-base font-medium flex items-center gap-2">
            <Clock size={15} className="text-gold" strokeWidth={1.6} />
            Openingstijden
          </h4>
          <div className="space-y-2 text-sm font-sans">
            <div className="flex justify-between gap-4">
              <span className="text-cream/60">Ma – Vr</span>
              <span className="text-cream/90">10:00 – 18:00</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-cream/60">Zaterdag</span>
              <span className="text-cream/90">10:00 – 17:00</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-cream/60">Zondag</span>
              <span className="text-cream/40">Gesloten</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-serif text-cream text-base font-medium flex items-center gap-2">
            <MapPin size={15} className="text-gold" strokeWidth={1.6} />
            Bezoek ons
          </h4>
          <div className="space-y-2.5 text-sm font-sans">
            <p className="text-cream/90">Nieuwe Binnenweg 335A<br /><span className="text-cream/60">3021 GJ Rotterdam</span></p>
            <a href="tel:0104767277" className="flex items-center gap-2 text-cream/60 hover:text-gold transition-colors w-fit">
              <Phone size={12} /> 010-4767277
            </a>
            <a href="mailto:info@gastrovinorotterdam.nl" className="flex items-center gap-2 text-cream/60 hover:text-gold transition-colors w-fit">
              <Mail size={12} /> info@gastrovinorotterdam.nl
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-sans text-cream/40">
            © {new Date().getFullYear()} Gastrovino Rotterdam — Nieuwe Binnenweg 335A, 3021 GJ Rotterdam
          </p>
          <p className="text-xs font-sans text-cream/40">
            Click &amp; Collect · Persoonlijke service · Lokale trots
          </p>
        </div>
      </div>
    </footer>
  )
}
