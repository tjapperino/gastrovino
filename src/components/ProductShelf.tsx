"use client";

import { type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

/**
 * Productcategorieën als stillevens in het licht.
 * Foto's komen uit de echte webshop-scrape (public/shop/).
 */
const categorieen = [
  {
    naam: "Vini",
    nummer: "01",
    tekst: "Van huiswijn tot Amarone DOCG en Champagne — handgeselecteerd, met een eerlijk verhaal.",
    beeld: "/shop/137-0.png",
    alt: "Wijnproefbox met flessen van kleine producenten",
    href: "/assortiment?filter=wijnen",
    cta: "Bekijk de wijnen",
  },
  {
    naam: "Formaggi",
    nummer: "02",
    tekst: "Hollandse en buitenlandse kazen — van Rotterdamsche Oude tot Vacherin Mont d'Or.",
    beeld: "/shop/154-0.jpeg",
    alt: "Romige Vacherin Mont d'Or met vers brood",
    href: "/borrelplanken",
    cta: "Proef ze op de borrelplank",
  },
  {
    naam: "Dispensa",
    nummer: "03",
    tekst: "Olijfolie, Tomasu-sojasaus uit Rotterdam, dolci en antipasti — de Italiaanse voorraadkast.",
    beeld: "/shop/42-0.jpg",
    alt: "Italiaans delicatessenpakket met spumante en antipasti",
    href: "/assortiment?filter=delicatessen",
    cta: "Ontdek de delicatessen",
  },
];

function volgLicht(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
}

export default function ProductShelf() {
  return (
    <ScrollReveal>
      <div style={{ background: "var(--nero)", color: "var(--candela)" }}>
      <section className="mx-auto max-w-6xl px-6 py-28">
        <p className="gv-eyebrow mb-3">Het schap</p>
        <h2 className="gv-display text-[clamp(2.2rem,6vw,4.5rem)]">
          Geselecteerd, geproefd, geliefd
        </h2>
        <hr className="gv-rule my-12" />

        <div className="grid gap-6 md:grid-cols-3">
          {categorieen.map((cat) => (
            <Link
              key={cat.naam}
              href={cat.href}
              className="gv-card group block"
              onMouseMove={volgLicht}
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src={cat.beeld}
                  alt={cat.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-75 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                />
                {/* Donkere verloop onderaan zodat tekst en kader leesbaar blijven */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(19,16,16,0.25), transparent 35%, transparent 60%, rgba(19,16,16,0.75))",
                  }}
                />
                <span
                  className="absolute top-5 right-5 font-sans text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: "var(--oro)", opacity: 0.85 }}
                >
                  {cat.nummer}
                </span>
              </div>
              <div className="p-6">
                <h3 className="gv-display text-3xl">{cat.naam}</h3>
                <p className="mt-2 text-sm/relaxed opacity-70">{cat.tekst}</p>
                <span
                  className="mt-4 inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase transition-opacity opacity-70 group-hover:opacity-100"
                  style={{ color: "var(--oro)" }}
                >
                  {cat.cta}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </ScrollReveal>
  );
}
