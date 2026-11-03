"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

/** Counts up to `to` the first time it scrolls into view. */
function NumberTicker({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = animate(0, to, { duration: reduce ? 0 : 1.6, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className="tabular-nums">{n}</span>;
}

const wave = "M0 40 Q 75 10 150 40 T 300 40 T 450 40 T 600 40 T 750 40 T 900 40 T 1050 40 T 1200 40 V 80 H 0 Z";

function Waves({ className, color, dur, opacity = 1 }: { className?: string; color: string; dur: string; opacity?: number }) {
  return (
    <div className={"pointer-events-none absolute inset-x-0 h-20 overflow-hidden " + (className ?? "")} aria-hidden>
      <svg viewBox="0 0 2400 80" preserveAspectRatio="none" className="wave-slide h-full w-[200%]" style={{ ["--dur" as string]: dur, opacity }}>
        <path d={wave} fill={color} transform="translate(0 0)" />
        <path d={wave} fill={color} transform="translate(1200 0)" />
      </svg>
    </div>
  );
}

/** Sand-and-sea band with honest numbers (counted from the catalogue) and rolling waves. */
export function StatsWaves({ stats }: { stats: { value: number; label: string; suffix?: string }[] }) {
  return (
    <section className="relative mt-28 overflow-hidden bg-[linear-gradient(180deg,#fff6dc_0%,#ffe9a8_100%)] pt-20 pb-36 text-[#3b2a05] dark:bg-[linear-gradient(180deg,#2b2410_0%,#3a2f0c_100%)] dark:text-[#ffe9a8]">
      <svg aria-hidden viewBox="0 0 120 160" className="bob absolute top-10 right-[6%] hidden h-40 opacity-25 md:block" fill="currentColor">
        <path d="M58 160c2-40 6-80 18-110l6 2c-11 30-15 69-16 108z" />
        <path d="M78 52c-18-22-46-24-62-14 20-2 40 4 58 20zM80 50c6-26-6-46-22-50 10 14 14 30 18 50zM82 52c20-16 34-12 38-2-14-6-26-4-36 6zM80 52c26-6 36 6 38 22-10-12-22-18-38-18z" />
      </svg>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-bold tracking-[0.25em] uppercase opacity-70">Sun, sand and a plan</p>
        <h2 className="mt-3 max-w-2xl text-4xl leading-[1] font-extrabold sm:text-6xl">Holidays that feel like holidays.</h2>
        <dl className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border border-[#3b2a05]/10 bg-white/50 p-5 backdrop-blur sm:p-6 dark:border-white/10 dark:bg-white/5">
              <dd className="font-display text-5xl font-extrabold sm:text-7xl"><NumberTicker to={s.value} />{s.suffix}</dd>
              <dt className="mt-2 text-sm font-semibold opacity-80">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
      <Waves className="bottom-6" color="#7dd3fc" dur="18s" opacity={0.7} />
      <Waves className="bottom-2" color="#38bdf8" dur="12s" opacity={0.8} />
      <Waves className="-bottom-2" color="var(--background)" dur="22s" />
    </section>
  );
}
