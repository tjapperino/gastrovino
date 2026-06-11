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

      {/* Tekst laag */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="gv-eyebrow mb-6">Vini &amp; delicatesse · Rotterdam</p>
        <h1 className="gv-display text-[clamp(3.5rem,14vw,11rem)]">
          Gastrovino
        </h1>
        <p className="mt-6 max-w-md text-base/relaxed opacity-80">
          Italiaanse wijnen en delicatessen, persoonlijk geselecteerd
          door Naomi &amp; Melanie.
        </p>
      </div>

      {/* Scroll-cue: dunne gouden lijn die zachtjes ademt */}
      <div
        className="absolute bottom-8 left-1/2 h-12 w-px -translate-x-1/2 animate-pulse motion-reduce:animate-none"
        style={{ background: "var(--oro)", opacity: 0.6 }}
        aria-hidden="true"
      />
    </section>
  );
}
