"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export type GateSlide = {
  slug: string;
  place: string;
  title: string;
  image: string;
  alt: string;
  code: string;
  nights: number;
  flight: string;
  months: string;
};

/** Full-height departure-gate hero: crossfading photos, synced "Next stop" pill and a boarding-pass card. */
export function HeroGate({ slides }: { slides: GateSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((d: number) => setI((n) => (n + d + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(1), 6500);
    return () => clearTimeout(t);
  }, [i, paused, go]);

  const s = slides[i];
  return (
    <section
      className="relative mx-2 overflow-hidden rounded-[1.75rem] bg-ink text-white sm:mx-4"
      style={{ minHeight: "max(620px, calc(100svh - 180px))" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured destinations"
    >
      {slides.map((x, k) => (
        <div key={x.slug} className={cn("absolute inset-0 transition-opacity duration-[1400ms]", k === i ? "opacity-100" : "opacity-0")} aria-hidden={k !== i}>
          <Image src={x.image} alt={k === i ? x.alt : ""} fill priority={k === 0} sizes="100vw" quality={85} className={cn("object-cover", k === i && "kenburns")} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

      <Link href="/couples#quiz" className="liquid absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full py-1.5 pr-4 pl-2 text-sm font-bold text-ink transition hover:scale-[1.03] sm:top-6 sm:right-8">
        <span className="grid size-8 place-items-center rounded-full bg-rose-500 text-white"><Heart className="size-4 fill-current" /></span>
        <span><span className="hidden sm:inline">Planning a honeymoon? </span>Find your match</span>
        <ArrowUpRight className="size-4" />
      </Link>
      <div className="relative flex min-h-[inherit] flex-col justify-end px-5 pt-28 pb-36 sm:px-12 sm:pb-40">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="fade-up inline-flex items-center gap-2 text-xs font-bold tracking-[0.28em] uppercase">
              <span className="h-px w-8 bg-sun" /> Pondicherry <ArrowRight className="size-3.5 text-sun" /> the world
            </p>
            <h1 className="fade-up mt-5 font-display text-[2.3rem] leading-[0.9] font-extrabold uppercase sm:text-6xl lg:text-7xl" style={{ animationDelay: "80ms" }}>
              A world worth
              <span className="serif-i mt-1 block text-[2.7rem] leading-[0.9] font-extrabold text-sun sm:text-[5.6rem] lg:text-[7.6rem]">GOING THROUGH.</span>
            </h1>
            <div className="fade-up mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "160ms" }}>
              <span className="text-xs font-bold tracking-[0.25em] text-white/80 uppercase">Next stop</span>
              <span className="inline-flex items-center rounded-full bg-white px-5 py-2 font-display text-xl font-extrabold text-primary uppercase italic sm:text-3xl">
                <span key={s.slug} className="word-swap">{s.place}</span>
              </span>
              <span className="flex gap-1.5">
                <button type="button" onClick={() => go(-1)} aria-label="Previous destination" className="grid size-10 place-items-center rounded-full border border-white/50 backdrop-blur transition hover:bg-white hover:text-ink"><ArrowLeft className="size-4" /></button>
                <button type="button" onClick={() => go(1)} aria-label="Next destination" className="grid size-10 place-items-center rounded-full border border-white/50 backdrop-blur transition hover:bg-white hover:text-ink"><ArrowRight className="size-4" /></button>
              </span>
            </div>
          </div>

          <Link
            href={`/packages/${s.slug}`}
            className="group relative hidden overflow-hidden rounded-2xl border border-white/35 bg-white/12 p-5 backdrop-blur-xl transition hover:bg-white/20 lg:block"
            aria-label={`View ${s.title}`}
          >
            <div className="flex items-center justify-between text-[0.65rem] font-bold tracking-[0.25em] uppercase text-white/80">
              <span>Boarding pass</span>
              <Plane className="size-4 text-sun" />
            </div>
            <div key={s.slug} className="fade-up mt-4 flex items-center justify-between font-display text-4xl leading-none font-extrabold">
              <span>MAA</span>
              <span className="mx-3 flex flex-1 items-center text-white/70"><span className="h-0 flex-1 border-t-2 border-dashed border-white/60" /><Plane className="mx-1 size-5 shrink-0 text-sun" /><span className="h-0 flex-1 border-t-2 border-dashed border-white/60" /></span>
              <span className="text-sun">{s.code}</span>
            </div>
            <p className="mt-5 text-lg font-bold uppercase">{s.title}</p>
            <dl className="mt-3 grid grid-cols-2 gap-3 border-t-2 border-dashed border-white/40 pt-3 text-xs">
              <div><dt className="tracking-widest text-white/60 uppercase">Nights</dt><dd className="mt-0.5 text-sm font-semibold">{s.nights}</dd></div>
              <div><dt className="tracking-widest text-white/60 uppercase">Best in</dt><dd className="mt-0.5 text-sm font-semibold">{s.months}</dd></div>
              <div className="col-span-2"><dt className="tracking-widest text-white/60 uppercase">From Chennai</dt><dd className="mt-0.5 text-sm font-semibold">{s.flight}</dd></div>
            </dl>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-sun">View trip <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
          </Link>
        </div>

        <div className="absolute right-5 bottom-28 left-5 hidden gap-1.5 sm:flex sm:right-12 sm:left-12 lg:bottom-32" role="tablist" aria-label="Choose destination">
          {slides.map((x, k) => (
            <button key={x.slug} type="button" role="tab" aria-selected={k === i} aria-label={x.place} onClick={() => setI(k)} className="group h-6 flex-1">
              <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/30">
                <span className={cn("absolute inset-y-0 left-0 bg-sun", k < i && "w-full", k === i && !paused && "gate-progress", k === i && paused && "w-1/2")} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
