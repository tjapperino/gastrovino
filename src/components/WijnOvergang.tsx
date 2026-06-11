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
    <section ref={sectionRef} className="relative h-[70svh] w-full overflow-hidden">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        {motionOk && (
          <>
            <source src="/video/wijn-schenken.webm" type="video/webm" />
            <source src="/video/wijn-schenken.mp4" type="video/mp4" />
          </>
        )}
      </video>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, transparent 40%, var(--nero) 100%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
