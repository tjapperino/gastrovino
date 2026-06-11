"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fullscreen chiaroscuro-hero.
 * Assets (later via Higgsfield genereren, daarna comprimeren):
 *   /public/video/hero-stilleven.webm  (max ~2 MB, 1080p, 6-8s loop)
 *   /public/video/hero-stilleven.mp4   (fallback Safari)
 *   /public/img/hero-poster.jpg        (eerste frame, ~100 kB)
 * Tot die er zijn werkt de poster + gradient als volwaardige stille hero.
 */
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    setMotionOk(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMotionOk(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (motionOk) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [motionOk]);

  return (
    <section className="relative h-svh w-full overflow-hidden">
      {/* Video laag */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/img/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        {motionOk && (
          <>
            <source src="/video/hero-stilleven.webm" type="video/webm" />
            <source src="/video/hero-stilleven.mp4" type="video/mp4" />
          </>
        )}
      </video>

      {/* Vignet: trekt het beeld het donker in, tekst blijft leesbaar */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, transparent 40%, var(--nero) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Tekst laag — expliciete lichte kleur: tekst moet leesbaar zijn op het donkere beeld */}
      <div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ color: "var(--candela)" }}
      >
        {/* Decoratieve flanken rond eyebrow */}
        <div className="flex items-center gap-4 mb-6" aria-hidden="true">
          <div className="h-px w-10" style={{ background: "color-mix(in srgb, var(--oro) 45%, transparent)" }} />
          <p className="gv-eyebrow">Vini &amp; delicatesse · Rotterdam</p>
          <div className="h-px w-10" style={{ background: "color-mix(in srgb, var(--oro) 45%, transparent)" }} />
        </div>

        <h1 className="gv-display text-[clamp(3.5rem,14vw,11rem)]">
          Gastrovino
        </h1>

        <p className="mt-6 max-w-md text-base/relaxed" style={{ opacity: 0.72 }}>
          Italiaanse wijnen en delicatessen, persoonlijk geselecteerd
          door Naomi &amp; Melanie.
        </p>

        {/* Ornament onder tekst */}
        <p className="mt-8 text-xs tracking-[0.4em] uppercase font-sans" style={{ color: "var(--oro)", opacity: 0.55 }}>
          ✦
        </p>
      </div>

      {/* Scroll-cue: muis-icoon, eleganter dan een lijn */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <svg
          width="20"
          height="32"
          viewBox="0 0 20 32"
          fill="none"
          style={{ color: "var(--oro)", opacity: 0.5 }}
        >
          <rect x="1" y="1" width="18" height="30" rx="9" stroke="currentColor" strokeWidth="1.2" />
          <rect x="9" y="7" width="2" height="6" rx="1" fill="currentColor" className="animate-bounce motion-reduce:animate-none" />
        </svg>
      </div>
    </section>
  );
}
