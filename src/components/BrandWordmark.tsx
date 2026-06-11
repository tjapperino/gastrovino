// Het officiële Gastrovino Rotterdam-woordmerk (Brand Book 2026, p.3):
// "GASTROVINO" in Baskerville-kapitalen met daaronder — ROTTERDAM — tussen
// twee lijnen. Als tekst opgebouwd zodat het scherp blijft en de kleur
// meeloopt met currentColor (zwart op licht, roomwit op donker).

export default function BrandWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none select-none ${className}`}>
      <span className="font-serif tracking-[0.13em] text-[1.6em] whitespace-nowrap">
        GASTROVINO
      </span>
      <span className="flex items-center gap-[0.6em] w-full mt-[0.35em]">
        <span aria-hidden className="h-px flex-1 bg-current" />
        <span className="font-serif text-[0.72em] tracking-[0.52em] -mr-[0.52em] whitespace-nowrap">
          ROTTERDAM
        </span>
        <span aria-hidden className="h-px flex-1 bg-current" />
      </span>
    </span>
  )
}
