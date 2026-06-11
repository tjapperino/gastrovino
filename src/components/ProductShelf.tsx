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
    nummer: "01",
    tekst: "Van Barolo tot natuurwijn uit Sicilië — kleine producenten, eerlijk verhaal.",
    gradientStops: ["#3a1218", "#5c1e28", "#2a0d10"],
  },
  {
    naam: "Formaggi",
    nummer: "02",
    tekst: "Parmigiano Reggiano 36 maanden, pecorino, gorgonzola dolce.",
    gradientStops: ["#2a1d0c", "#3d2a14", "#1e1508"],
  },
  {
    naam: "Dispensa",
    nummer: "03",
    tekst: "Olijfolie, pasta di Gragnano, antipasti — de Italiaanse voorraadkast.",
    gradientStops: ["#141f0c", "#1e2e10", "#0e160a"],
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
            <article
              key={cat.naam}
              className="gv-card group cursor-pointer"
              onMouseMove={volgLicht}
            >
              {/* Gradient panel vervangt de ontbrekende categoriefoto's */}
              <div className="aspect-[4/5] overflow-hidden relative">
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{
                    background: `linear-gradient(160deg, ${cat.gradientStops[0]}, ${cat.gradientStops[1]} 55%, ${cat.gradientStops[2]})`,
                  }}
                />
                {/* Subtiel grid patroon voor textuur */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, var(--oro) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--oro) 0px, transparent 1px, transparent 40px)",
                  }}
                />
                {/* Groot cijfer als decoratief achtergrond-element */}
                <div className="absolute inset-0 flex items-end justify-end p-4 select-none pointer-events-none">
                  <span
                    className="gv-display leading-none select-none"
                    style={{
                      fontSize: "clamp(6rem, 15vw, 10rem)",
                      color: "var(--oro)",
                      opacity: 0.08,
                    }}
                  >
                    {cat.nummer}
                  </span>
                </div>
                {/* Diagonale gouden lijn ornament */}
                <svg
                  className="absolute top-6 left-6 opacity-25"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden="true"
                >
                  <line x1="0" y1="48" x2="48" y2="0" stroke="var(--oro)" strokeWidth="0.8" />
                  <circle cx="24" cy="24" r="3" stroke="var(--oro)" strokeWidth="0.8" />
                </svg>
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="gv-display text-3xl">{cat.naam}</h3>
                  <span
                    className="font-sans text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: "var(--oro)", opacity: 0.6 }}
                  >
                    {cat.nummer}
                  </span>
                </div>
                <p className="text-sm/relaxed opacity-70">{cat.tekst}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      </div>
    </ScrollReveal>
  );
}
