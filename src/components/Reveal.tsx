"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades and slides its children in when they scroll into view.
 * Content renders visible on the server, so nothing is hidden without JS.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Only hide elements that start below the fold.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.hidden = "true";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.hidden = "false";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
