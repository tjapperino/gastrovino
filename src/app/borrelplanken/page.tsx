import type { Metadata } from 'next'
import BorrelplankBuilder from '@/components/BorrelplankBuilder'

export const metadata: Metadata = {
  title: 'Borrelplank Builder — Stel jouw plank samen',
  description:
    'Kies een vaste borrelplank (2–10 personen, vanaf €15) of stel zelf jouw perfecte plank samen met wijnen, kazen en Rotterdamse Local Heroes. Click & Collect op de Nieuwe Binnenweg 335A.',
  openGraph: {
    title: 'Borrelplank Builder · Gastrovino Rotterdam',
    description: 'Vaste planken of zelf samenstellen — altijd vers opgemaakt. Afhalen op de Nieuwe Binnenweg.',
  },
}

export default function BorrelplankenPage() {
  return <BorrelplankBuilder />
}
