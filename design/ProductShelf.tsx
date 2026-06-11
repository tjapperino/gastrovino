"use client";

import { type MouseEvent } from "react";
import ScrollReveal from "./ScrollReveal";

/**
 * Voorbeeldsectie: productcategorieën als stillevens in het licht.
 * Data later uit /data/producten.json halen (zelfde patroon als Eus-menu).
 */
const categorieen = [
  {
    naam: "Vini",
    tekst: "Van Barolo tot natuurwijn uit Sicilië — kleine producenten, eerlijk verhaal.",
    beeld: "/img/cat-vini.jpg",
  },
  {
    naam: "Formaggi",
    tekst: "Parmigiano Reggiano 36 maanden, pecorino, gorgonzola dolce.",
    beeld: "/img/cat-formaggi.jpg",
  },
  {
    naam: "Dispensa",
    tekst: "Olijfolie, pasta di Gragnano, antipasti — de Italiaanse voorraadkast.",
    beeld: "/img/cat-dispensa.jpg",
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
      <section className="mx-auto max-w-6xl px-6 py-28">
        <p className="gv-eyebrow mb-3">Het schap</p>
        <h2 className="gv-display text-[clamp(2.2rem,6vw,4.5rem)]">
          Geselecteerd, geproefd, geliefd
        </h2>
        <hr className="gv-rule my-12" />

        <div className="grid gap-6 md:grid-cols-3">
          {categorieen.map((cat) => (
            <article
              key={cat.naam}
              className="gv-card group cursor-pointer"
              onMouseMove={volgLicht}
            >
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.beeld}
                  alt={cat.naam}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                />
              </div>
              <div className="p-6">
                <h3 className="gv-display text-3xl">{cat.naam}</h3>
                <p className="mt-2 text-sm/relaxed opacity-70">{cat.tekst}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
