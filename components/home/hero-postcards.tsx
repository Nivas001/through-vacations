"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import { ExternalButton, LinkButton } from "@/components/brand/link-button";
import { Wave } from "@/components/brand/wave";
import { HeroSearch } from "@/components/home/hero-search";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export type PostcardSlide = {
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

/** Resting pose of each card in the fan, from the top card down. Deeper cards are hidden. */
const fan = [
  { x: 0, y: 0, r: -2, s: 1 },
  { x: 28, y: -16, r: 5, s: 0.95 },
  { x: -24, y: -30, r: -7, s: 0.9 },
  { x: 16, y: -42, r: 3, s: 0.86 },
];
const THROW_PX = 110;

/** Home hero: headline on brand blue beside a fanned stack of destination postcards you drag, swipe or tap. */
export function HeroPostcards({ slides, destinations }: { slides: PostcardSlide[]; destinations: string[] }) {
  const router = useRouter();
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dx, setDx] = useState<number | null>(null);
  const [fly, setFly] = useState(0);
  const start = useRef<{ x: number; t: number } | null>(null);
  const moved = useRef(false);

  const go = useCallback((d: number) => setI((k) => (k + d + n) % n), [n]);
  const next = useCallback((dir = -1) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return go(1);
    setFly(dir);
    setTimeout(() => { setFly(0); go(1); }, 320);
  }, [go]);

  useEffect(() => {
    if (paused || dx !== null || fly || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => next(), 6500);
    return () => clearTimeout(t);
  }, [i, paused, dx, fly, next]);

  function release(e: React.PointerEvent) {
    if (!start.current) return;
    const d = e.clientX - start.current.x;
    const speed = Math.abs(d) / Math.max(1, e.timeStamp - start.current.t);
    start.current = null;
    setDx(null);
    if (Math.abs(d) > THROW_PX || (speed > 0.6 && Math.abs(d) > 40)) next(Math.sign(d));
  }

  const s = slides[i];
  return (
    <section className="grain relative mx-2 overflow-hidden rounded-[1.75rem] bg-primary text-white sm:mx-4" aria-label="Through Vacations">
      <Wave className="opacity-[0.07] dark:opacity-[0.05]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-10 px-5 pt-28 pb-10 sm:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="lg:self-end">
          <p className="fade-up inline-flex items-center gap-2 text-xs font-bold tracking-[0.28em] uppercase">
            <span className="h-px w-8 bg-sun" /> Pondicherry <ArrowRight className="size-3.5 text-sun" /> the world
          </p>
          <h1 className="fade-up mt-5 font-display text-[2.6rem] leading-[0.95] font-extrabold sm:text-6xl lg:text-7xl" style={{ animationDelay: "80ms" }}>
            A world worth
            <span className="mt-1 block text-[3rem] leading-[0.92] tracking-[-0.032em] text-sun sm:text-[5.4rem] lg:text-[5.6rem] xl:text-[6.2rem]">going through.</span>
          </h1>
          <p className="fade-up mt-6 max-w-md text-base text-white/80 sm:text-lg" style={{ animationDelay: "140ms" }}>
            Curated holidays across India and beyond, planned by people in Pondicherry. Pick a postcard, or tell us where you want to go.
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div
            className="relative mx-auto grid w-full max-w-[34rem] grid-cols-[minmax(0,1fr)] pt-12 outline-none"
            role="group"
            aria-roledescription="carousel"
            aria-label="Destination postcards"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "ArrowRight") next(-1); if (e.key === "ArrowLeft") go(-1); }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {slides.map((x, k) => {
              const depth = (k - i + n) % n;
              const top = depth === 0;
              const pose = fan[Math.min(depth, fan.length - 1)];
              const live = top && dx !== null;
              const transform = top && fly
                ? `translate(${fly * 140}%, -4%) rotate(${fly * 24}deg)`
                : live
                  ? `translate(${dx}px, 0) rotate(${pose.r + dx / 18}deg)`
                  : `translate(${pose.x}px, ${pose.y}px) rotate(${pose.r}deg) scale(${pose.s})`;
              return (
                <article
                  key={x.slug}
                  aria-hidden={!top}
                  inert={!top}
                  aria-label={top ? `${x.place}, ${k + 1} of ${n}` : undefined}
                  className={cn("postcard col-start-1 row-start-1 self-end select-none", top && "cursor-grab active:cursor-grabbing")}
                  style={{
                    zIndex: n - depth,
                    transform,
                    opacity: (top && fly) || depth >= fan.length ? 0 : 1,
                    transition: live ? "none" : "transform .55s cubic-bezier(.2,.7,.2,1), opacity .4s ease",
                    touchAction: "pan-y",
                  }}
                  onPointerDown={top ? (e) => {
                    if (e.button !== 0) return;
                    start.current = { x: e.clientX, t: e.timeStamp };
                    moved.current = false;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDx(0);
                  } : undefined}
                  onPointerMove={top ? (e) => {
                    if (!start.current) return;
                    const d = e.clientX - start.current.x;
                    if (Math.abs(d) > 6) moved.current = true;
                    setDx(d);
                  } : undefined}
                  onPointerUp={top ? release : undefined}
                  onPointerCancel={top ? () => { start.current = null; setDx(null); } : undefined}
                  onClickCapture={top ? (e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); } } : undefined}
                  onClick={top ? (e) => { if (!(e.target as HTMLElement).closest("a")) router.push(`/packages/${x.slug}`); } : undefined}
                >
                  <div className="relative aspect-[3/2] overflow-hidden rounded-[0.55rem] bg-secondary">
                    <Image src={x.image} alt={x.alt} fill priority={k === 0} sizes="(min-width:1024px) 34rem, 90vw" quality={85} draggable={false} className="pointer-events-none object-cover" />
                    <div className="stamp absolute top-3 right-3 text-center">
                      <div className="rounded-[2px] border border-[#070b24]/25 px-2 pt-1 pb-1.5">
                        <span className="block text-[0.5rem] font-bold tracking-[0.2em] uppercase">Air mail</span>
                        <span className="mt-0.5 block font-mono text-lg leading-none font-bold">{x.code}</span>
                      </div>
                    </div>
                    <Postmark className="absolute top-6 right-[4.6rem] h-14 w-32 text-white/90 drop-shadow-[0_1px_2px_rgb(0_0_0/.35)] sm:right-20 sm:h-16 sm:w-36" />
                  </div>
                  <div className="flex items-end justify-between gap-3 px-1.5 pt-3 pb-0.5 text-[#070b24]">
                    <div className="min-w-0">
                      <p className="truncate font-display text-2xl leading-none font-extrabold sm:text-3xl">{x.place}</p>
                      <p className="mt-1.5 truncate font-mono text-[0.68rem] text-[#4a5075] sm:text-xs">MAA ✈ {x.code} · {x.nights} nights · Best {x.months}</p>
                    </div>
                    <Link href={`/packages/${x.slug}`} draggable={false} className="arrow-link inline-flex shrink-0 items-center gap-1 rounded-full bg-[#1e4be6] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#070b24]">
                      View trip <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-6 flex max-w-[34rem] items-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label="Previous postcard" className="grid size-10 shrink-0 place-items-center rounded-full border border-white/50 transition hover:bg-white hover:text-ink"><ArrowLeft className="size-4" /></button>
            <div className="flex flex-1 gap-1.5" role="tablist" aria-label="Choose destination">
              {slides.map((x, k) => (
                <button key={x.slug} type="button" role="tab" aria-selected={k === i} aria-label={x.place} onClick={() => setI(k)} className="h-6 flex-1">
                  <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/30">
                    <span className={cn("absolute inset-y-0 left-0 bg-sun", k < i && "w-full", k === i && !paused && dx === null && "gate-progress", k === i && (paused || dx !== null) && "w-1/2")} />
                  </span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => next(-1)} aria-label="Next postcard" className="grid size-10 shrink-0 place-items-center rounded-full border border-white/50 transition hover:bg-white hover:text-ink"><ArrowRight className="size-4" /></button>
          </div>
          <p className="mt-2 text-center text-xs text-white/60" aria-live="polite">
            <span className="hidden sm:inline">Drag a postcard aside or tap it to open.</span><span className="sm:hidden">Swipe a postcard or tap it to open.</span> <span className="sr-only">Showing {s.place}.</span>
          </p>
        </div>

        <div className="fade-up lg:col-start-1 lg:self-start" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/plan" variant="sun" size="lg" className="cta-glow h-12 px-7 text-base">Plan a trip <ArrowUpRight /></LinkButton>
            <ExternalButton href={whatsappLink()} variant="outline" size="lg" className="h-12 border-2 border-white bg-transparent px-6 text-base text-white hover:bg-white hover:text-ink">
              <MessageCircle /> WhatsApp us
            </ExternalButton>
          </div>
          <Link href="/couples#quiz" className="arrow-link mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white">
            <span className="grid size-7 place-items-center rounded-full bg-rose-500"><Heart className="size-3.5 fill-current" /></span>
            Planning a honeymoon? Find your match <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-3 pb-3 sm:px-10 sm:pb-8">
        <HeroSearch destinations={destinations} />
      </div>
    </section>
  );
}

/** Round "Pondicherry" postmark with cancellation waves, drawn over the photo. */
function Postmark({ className }: { className?: string }) {
  const id = `pm${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 140 64" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {[18, 28, 38, 48].map((y) => <path key={y} d={`M2 ${y}c9-5 18 5 27 0s18-5 27 0`} />)}
        <circle cx="100" cy="32" r="29" />
        <circle cx="100" cy="32" r="19" strokeWidth="1.2" />
      </g>
      <path id={id} d="M76 32a24 24 0 1 1 48 0a24 24 0 1 1 -48 0" fill="none" />
      <text fill="currentColor" fontSize="7.2" fontWeight="700" letterSpacing="1.4">
        <textPath href={`#${id}`}>PONDICHERRY · INDIA ·</textPath>
      </text>
      <text x="100" y="35.5" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="800">MAA</text>
    </svg>
  );
}
