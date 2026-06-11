'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Menu, X } from 'lucide-react'
import BrandWordmark from '@/components/BrandWordmark'

const NAV_ITEMS = [
  { href: '/assortiment',   label: 'Assortiment' },
  { href: '/borrelplanken', label: 'Borrelplanken' },
  { href: '/proeverijen',   label: 'Proeverijen' },
  { href: '/catering',      label: 'Catering' },
  { href: '/over-ons',      label: 'Over Ons' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream/92 backdrop-blur-md border-b border-cream-darker shadow-warm-sm">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo — officieel woordmerk */}
        <Link href="/" className="shrink-0 text-ink hover:text-olive transition-colors">
          <BrandWordmark className="text-[13px]" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const active = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-full text-sm font-sans font-medium transition-colors ${
                  active
                    ? 'bg-olive/10 text-olive'
                    : 'text-ink-muted hover:text-ink hover:bg-cream-dark'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Telefoon CTA */}
        <a
          href="tel:0104767277"
          className="hidden md:inline-flex items-center gap-2 bg-terracotta text-cream pl-3.5 pr-4 py-2 rounded-full text-sm font-sans font-medium hover:bg-terracotta-dark transition-colors shrink-0"
        >
          <Phone size={13} strokeWidth={2} />
          010-4767277
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Sluit menu' : 'Open menu'}
          onClick={() => setMobileOpen(o => !o)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-ink-muted hover:bg-cream-dark transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-cream-darker bg-cream animate-fade-in">
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map(item => {
              const active = pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-sans font-medium transition-colors ${
                    active ? 'bg-olive/10 text-olive' : 'text-ink-muted hover:bg-cream-dark'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <a
              href="tel:0104767277"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-terracotta text-cream px-4 py-3 rounded-xl text-sm font-sans font-medium"
            >
              <Phone size={14} strokeWidth={2} />
              Bel 010-4767277
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
