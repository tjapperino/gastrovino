import type { Metadata } from 'next'
import AssortimentShop from '@/components/AssortimentShop'

export const metadata: Metadata = {
  title: 'Assortiment — Wijnen, Borrelplanken & Delicatessen',
  description:
    'Ontdek ons volledige assortiment: 12 handgeselecteerde wijnen uit Spanje, Chili en Italië, verse borrelplanken voor 2–10 personen en Rotterdamse Local Heroes. Bestellen voor Click & Collect op de Nieuwe Binnenweg 335A.',
  openGraph: {
    title: 'Assortiment · Gastrovino Rotterdam',
    description: 'Wijnen, borrelplanken & delicatessen. Afhalen op de Nieuwe Binnenweg 335A Rotterdam.',
  },
}

export default function AssortimentPage() {
  return <AssortimentShop />
}
