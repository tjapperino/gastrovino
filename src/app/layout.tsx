import type { Metadata } from 'next'
import { Libre_Baskerville, Jost, Cormorant_Garamond, Archivo } from 'next/font/google'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'

// Huisstijl-typografie (Brand Book 2026): titels in Baskerville,
// basistekst in Century Gothic. Libre Baskerville en Jost zijn de
// dichtstbijzijnde vrij beschikbare equivalenten.
const baskerville = Libre_Baskerville({
  subsets:  ['latin'],
  variable: '--font-serif',
  display:  'swap',
  weight:   ['400', '700'],
  style:    ['normal', 'italic'],
})

const jost = Jost({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
})

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400'],
  variable: '--font-cormorant',
  display:  'swap',
})

const archivo = Archivo({
  subsets:  ['latin'],
  weight:   ['400', '500'],
  variable: '--font-archivo',
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gastrovinorotterdam.nl'),
  title: {
    default:  'Gastrovino Rotterdam',
    template: '%s · Gastrovino Rotterdam',
  },
  description:
    'Dé plek voor wijn, delicatessen & Rotterdamse smaak op de Nieuwe Binnenweg 335A. Borrelplanken, wijnproeverijen en lokale specialiteiten.',
  openGraph: {
    siteName: 'Gastrovino Rotterdam',
    locale:   'nl_NL',
    type:     'website',
    images:   [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Gastrovino Rotterdam' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${baskerville.variable} ${jost.variable} ${cormorant.variable} ${archivo.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
