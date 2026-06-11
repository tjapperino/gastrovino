"use client";

import { useEffect, useRef, useState } from "react";

export default function WijnOvergang() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    setMotionOk(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMotionOk(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (visible && motionOk) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [visible, motionOk]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[55svh] w-full overflow-hidden"
      style={{ background: "var(--nero)" }}
    >
      {/* Video laag — pauzeert als niet zichtbaar, valt terug op --nero achtergrond */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        aria-hidden="true"
      >
        {motionOk && (
          <>
            <source src="/video/wijn-schenken.webm" type="video/webm" />
            <source src="/video/wijn-schenken.mp4" type="video/mp4" />
          </>
        )}
      </video>

      {/* Vignet: donkerder aan de randen, tekst in het centrum leesbaar */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 50% 50%, transparent 30%, rgba(19,16,16,0.88) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Inhoud: uitspraak rechtvaardigt de video */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        style={{ color: "var(--candela)" }}
      >
        <p className="gv-eyebrow mb-8">Onze filosofie</p>
        <blockquote className="gv-display text-[clamp(1.6rem,3.8vw,3.2rem)] max-w-3xl leading-[1.15]">
          Elke fles heeft een verhaal &mdash;<br className="hidden sm:block" /> wij kiezen alleen de mooiste.
        </blockquote>
        <cite
          className="mt-8 text-xs not-italic font-sans tracking-[0.25em] uppercase"
          style={{ color: "var(--oro)", opacity: 0.75 }}
        >
          Naomi &amp; Melanie
        </cite>
      </div>
    </section>
  );
}
