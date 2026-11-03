"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export type RingItem = { slug: string; title: string; image: string; sub: string };

/** A ring of holiday cards on a 3D cylinder that turns as you scroll; the card facing you is described below. */
export function DestinationRing({ items }: { items: RingItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const n = items.length;
  const step = 360 / n;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -360 + step]);
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [-14, -6, -14]);
  const [front, setFront] = useState(0);
  useMotionValueEvent(rotate, "change", (r) => setFront(((Math.round(-r / step) % n) + n) % n));
  const f = items[front];

  return (
    // Radius fits 12 cards edge to edge: r = w / (2 tan(15deg)) plus a small gap.
    <section ref={ref} className={(reduce ? "relative mt-28" : "relative mt-28 h-[300vh]") + " [--ring-r:285px] [--ring-w:140px] sm:[--ring-r:385px] sm:[--ring-w:190px]"} aria-label="Places we plan">
      <div className={reduce ? "" : "sticky top-0 flex h-dvh flex-col justify-center overflow-hidden"}>
        <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-secondary-foreground uppercase"><span className="size-2 rounded-full bg-sun ring-2 ring-sun/40" />Places we plan</p>
          <h2 className="text-4xl leading-[1] font-extrabold sm:text-6xl">One turn of the <span className="accent-word text-brand">wheel</span></h2>
        </div>

        <div className="relative mx-auto mt-4 h-[320px] w-full [perspective:1400px] sm:mt-8 sm:h-[470px]">
          <motion.div className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]" style={{ rotateY: reduce ? -20 : rotate, rotateX: reduce ? -8 : tilt }}>
            {items.map((it, i) => (
              <div key={it.slug} className="absolute top-0 left-0 [backface-visibility:hidden]"
                style={{ transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(var(--ring-r))` }}>
                <Link href={`/packages/${it.slug}`} tabIndex={i === front ? 0 : -1} aria-hidden={i !== front}
                  className={"block w-[var(--ring-w)] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-[0_24px_50px_-20px_rgb(7_11_36/.6)] transition-transform duration-300 dark:border-white/80 " + (i === front ? "scale-105" : "")}>
                  <span className="relative block aspect-[3/4]"><Image src={it.image} alt="" fill sizes="220px" className="object-cover" /></span>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mx-auto mt-4 min-h-28 max-w-md px-4 text-center sm:mt-8" aria-live="polite">
          <p className="font-display text-3xl font-extrabold">{f.title}</p>
          <p className="mt-1 text-muted-foreground">{f.sub}</p>
          <Link href={`/packages/${f.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">See this holiday <ArrowUpRight className="size-4" /></Link>
          <div className="mt-4 flex justify-center gap-1" aria-hidden>{items.map((it, i) => <span key={it.slug} className={"h-1.5 rounded-full transition-all " + (i === front ? "w-6 bg-primary" : "w-1.5 bg-border")} />)}</div>
        </div>
      </div>
    </section>
  );
}
