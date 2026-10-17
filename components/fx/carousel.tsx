"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Slide = { src: string; alt?: string; caption?: string };

/** Swipeable photo carousel: native scroll-snap (touch swipe), drag with a mouse, arrows, dots and keys. */
export function Carousel({ slides, className, aspect = "aspect-[16/10]", priority }: { slides: Slide[]; className?: string; aspect?: string; priority?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const go = useCallback((n: number) => {
    const el = track.current;
    if (!el) return;
    const next = (n + slides.length) % slides.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }, [slides.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => setI(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);

  return (
    <div className={cn("group/c relative", className)} role="group" aria-roledescription="carousel" aria-label="Photo gallery">
      <div
        ref={track}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); }}
        onPointerDown={(e) => { if (e.pointerType === "mouse" && track.current) { drag.current = { x: e.clientX, left: track.current.scrollLeft }; track.current.style.scrollSnapType = "none"; } }}
        onPointerMove={(e) => { if (drag.current && track.current) track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x); }}
        onPointerUp={() => { if (drag.current && track.current) { drag.current = null; track.current.style.scrollSnapType = ""; go(Math.round(track.current.scrollLeft / track.current.clientWidth)); } }}
        onPointerLeave={() => { if (drag.current && track.current) { drag.current = null; track.current.style.scrollSnapType = ""; go(Math.round(track.current.scrollLeft / track.current.clientWidth)); } }}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory overflow-x-auto rounded-[inherit] active:cursor-grabbing"
      >
        {slides.map((s, k) => (
          <figure key={s.src} className={cn("relative w-full shrink-0 snap-center overflow-hidden", aspect)} aria-label={`${k + 1} of ${slides.length}`}>
            <Image src={s.src} alt={s.alt ?? ""} fill priority={priority && k === 0} sizes="(min-width:1024px) 60vw, 100vw" quality={85} draggable={false} className="pointer-events-none object-cover" />
            {s.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-sm text-white sm:p-6">{s.caption}</figcaption>}
          </figure>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button type="button" aria-label="Previous photo" onClick={() => go(i - 1)} className="liquid absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 place-items-center rounded-full text-ink opacity-0 transition group-hover/c:opacity-100 focus-visible:opacity-100 sm:grid"><ArrowLeft className="size-5" /></button>
          <button type="button" aria-label="Next photo" onClick={() => go(i + 1)} className="liquid absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 place-items-center rounded-full text-ink opacity-0 transition group-hover/c:opacity-100 focus-visible:opacity-100 sm:grid"><ArrowRight className="size-5" /></button>
          <div className="absolute top-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur">{i + 1} / {slides.length}</div>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" role="tablist">
            {slides.map((s, k) => (
              <button key={s.src} type="button" role="tab" aria-selected={k === i} aria-label={`Photo ${k + 1}`} onClick={() => go(k)} className={cn("h-1.5 rounded-full bg-white/60 transition-all", k === i ? "w-6 bg-white" : "w-1.5 hover:bg-white")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
