import Image from 'next/image'
import { INSTAGRAM_HANDLE, INSTAGRAM_POSTS, INSTAGRAM_URL } from '@/lib/instagram'

function IconInstagram({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

export default function InstagramFeed() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center mb-10 space-y-3">
          <div className="ornament-divider text-gold text-xs tracking-[0.25em] uppercase font-sans font-medium">
            <span>Volg ons</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-ink mt-4">
            Gastrovino op Instagram
          </h2>
          <p className="text-ink-muted font-sans max-w-xl mx-auto leading-relaxed">
            Nieuwe wijnen, dagverse borrelplanken en een kijkje achter de schermen —
            volg {INSTAGRAM_HANDLE} en mis niets.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.src}
              href={post.href ?? INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl shadow-warm"
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-cream opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
                <IconInstagram size={26} />
                <span className="sr-only">Bekijk op Instagram</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-sans font-semibold text-cream transition-colors hover:bg-terracotta-dark"
          >
            <IconInstagram />
            Volg {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </section>
  )
}
