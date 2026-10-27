"use client";

import { useEffect, useRef } from "react";

/**
 * A CSS-rendered 9-ball (black-pole tournament style) that tilts toward the cursor and floats slowly.
 * Can be swapped for a Spline 3D scene later without changing the layout.
 */
export default function NineBall() {
  const wrap = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let frame = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const start = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r) return;
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 1.5)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 1.5)));
    };

    const tick = (now: number) => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const float = Math.sin((now - start) / 1400) * 10;
      if (ball.current) {
        ball.current.style.transform = `translateY(${float}px) rotateX(${-cy * 18}deg) rotateY(${cx * 18}deg)`;
      }
      if (shine.current) {
        shine.current.style.background = `radial-gradient(circle at ${34 + cx * 14}% ${28 + cy * 14}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.25) 12%, rgba(255,255,255,0) 30%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrap} className="relative w-full max-w-[460px] aspect-square [perspective:900px]" aria-hidden="true">
      {/* table shadow */}
      <div className="absolute left-[14%] right-[14%] bottom-[2%] h-[10%] rounded-[50%] bg-black/60 blur-2xl" />
      <div
        ref={ball}
        className="absolute inset-[8%] rounded-full overflow-hidden will-change-transform shadow-[0_60px_120px_rgba(0,0,0,0.6)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Black-style 9-ball: yellow stripe, black poles instead of white */}
        <div className="absolute inset-0 bg-[#0d0d0d]" />
        <div className="absolute inset-x-0 top-[22%] bottom-[22%] bg-ball-1" />
        {/* number disc */}
        <div className="absolute left-1/2 top-1/2 w-[40%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fbfaf5] flex items-center justify-center font-heading font-black text-[#0b0b0b] text-[clamp(52px,8.5vw,104px)] leading-none">
          9
        </div>
        {/* lighting */}
        <div
          ref={shine}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 34% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.25) 12%, rgba(255,255,255,0) 30%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>
    </div>
  );
}
