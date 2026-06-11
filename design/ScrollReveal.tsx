"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wikkel elke sectie hierin om het "licht gaat aan"-effect te krijgen.
 * Eénmalig: zodra de sectie 35% in beeld is, blijft hij verlicht.
 *
 * <ScrollReveal><section>…</section></ScrollReveal>
 */
export default function ScrollReveal({
  children,
  threshold = 0.35,
  className = "",
}: {
  children: ReactNode;
  threshold?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-lit");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`gv-reveal ${className}`}>
      {children}
    </div>
  );
}
