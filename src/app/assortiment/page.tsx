import type { Metadata } from 'next'
import { Suspense } from 'react'
import AssortimentShop from '@/components/AssortimentShop'
import { FILTER_COUNTS } from '@/lib/assortiment-data'

export const metadata: Metadata = {
  title: 'Assortiment — Wijnen, Borrelplanken & Delicatessen',
  description:
    `Ontdek ons volledige assortiment: ${FILTER_COUNTS.wijnen} handgeselecteerde wijnen, verse borrelplanken voor 2–10 personen en Rotterdamse Local Heroes. Bestellen voor Click & Collect op de Nieuwe Binnenweg 335A.`,
  openGraph: {
    title: 'Assortiment · Gastrovino Rotterdam',
    description: 'Wijnen, borrelplanken & delicatessen. Afhalen op de Nieuwe Binnenweg 335A Rotterdam.',
  },
}

export default function AssortimentPage() {
  // Suspense is vereist voor useSearchParams (filter-deep-links) bij statische build
  return (
    <Suspense>
      <AssortimentShop />
    </Suspense>
  )
}
