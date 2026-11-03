"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { ArrowUpRight, Clock, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export type GlobeStop = { slug: string; title: string; code: string; region: "India" | "International"; flight: string; months: string; location: [number, number] };

const CHENNAI: [number, number] = [13.0827, 80.2707];
const toAngles = ([lat, lng]: [number, number]): [number, number] => [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];

/** WebGL globe (cobe) with flight arcs from Chennai. Picking a destination spins the globe to it. */
export function RouteGlobe({ stops }: { stops: GlobeStop[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const target = useRef<[number, number] | null>(null);
  const drag = useRef<{ x: number; phi: number } | null>(null);
  const [active, setActive] = useState<GlobeStop>(stops.find((s) => s.region === "International") ?? stops[0]);
  const [tab, setTab] = useState<"International" | "India">("International");

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let size = box.offsetWidth;
    let [phi, theta] = toAngles(CHENNAI);
    theta = 0.25;
    const globe = createGlobe(el, {
      devicePixelRatio: dpr, width: size * dpr, height: size * dpr, phi, theta,
      dark: 1, diffuse: 1.4, mapSamples: 16000, mapBrightness: 5, mapBaseBrightness: 0.04,
      baseColor: [0.16, 0.26, 0.82], markerColor: [1, 0.82, 0.25], glowColor: [0.2, 0.32, 0.95],
      markers: [{ location: CHENNAI, size: 0.07, color: [1, 1, 1] }, ...stops.map((s) => ({ location: s.location, size: 0.035 }))],
      arcs: stops.map((s) => ({ from: CHENNAI, to: s.location })),
      arcColor: [1, 0.82, 0.25], arcWidth: 0.5, arcHeight: 0.25, markerElevation: 0.01, opacity: 0.95,
    });

    let visible = true, raf = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(box);
    const ro = new ResizeObserver(() => { size = box.offsetWidth; globe.update({ width: size * dpr, height: size * dpr }); });
    ro.observe(box);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (target.current) {
        const [tp, tt] = target.current;
        // shortest way round
        let d = (tp - phi) % (2 * Math.PI);
        if (d > Math.PI) d -= 2 * Math.PI;
        if (d < -Math.PI) d += 2 * Math.PI;
        phi += d * 0.08;
        theta += (tt - theta) * 0.08;
      } else if (!drag.current && !reduce) {
        phi += 0.0025;
      }
      globe.update({ phi, theta });
    };
    tick();

    const down = (e: PointerEvent) => { drag.current = { x: e.clientX, phi }; target.current = null; el.setPointerCapture(e.pointerId); el.style.cursor = "grabbing"; };
    const move = (e: PointerEvent) => { if (drag.current) phi = drag.current.phi + (e.clientX - drag.current.x) / 180; };
    const up = () => { drag.current = null; el.style.cursor = "grab"; };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    requestAnimationFrame(() => (el.style.opacity = "1"));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      globe.destroy();
    };
  }, [stops]);

  const focus = (s: GlobeStop) => {
    setActive(s);
    const [p, t] = toAngles(s.location);
    target.current = [p, Math.max(-0.4, Math.min(0.6, t * 0.8))];
  };

  const list = stops.filter((s) => s.region === tab);

  return (
    <section className="relative mt-28 overflow-hidden bg-[#070b24] py-20 text-white sm:py-24" aria-labelledby="globe-title">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(30_75_230/.35),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="order-2 lg:order-1">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-sun uppercase"><Plane className="size-3.5" /> Flight routes</p>
          <h2 id="globe-title" className="text-4xl leading-[0.98] font-extrabold sm:text-6xl">From Chennai to <span className="accent-word text-sun">the world</span></h2>
          <p className="mt-4 max-w-md text-white/70">Pick a place to fly there on the globe. Times are typical journeys from Chennai, confirmed in your quote.</p>

          <div className="mt-7 inline-flex rounded-full bg-white/10 p-1" role="tablist" aria-label="Region">
            {(["International", "India"] as const).map((r) => (
              <button key={r} role="tab" aria-selected={tab === r} onClick={() => { setTab(r); const first = stops.find((s) => s.region === r); if (first) focus(first); }}
                className={cn("h-9 rounded-full px-5 text-sm font-bold transition", tab === r ? "bg-sun text-sun-foreground" : "text-white/75 hover:text-white")}>{r}</button>
            ))}
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {list.map((s) => (
              <li key={s.slug}>
                <button type="button" onMouseEnter={() => focus(s)} onFocus={() => focus(s)} onClick={() => focus(s)} aria-pressed={active.slug === s.slug}
                  className={cn("flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition", active.slug === s.slug ? "border-sun bg-sun/15" : "border-white/10 bg-white/5 hover:border-white/30")}>
                  <span className="font-mono text-xs font-bold text-sun">{s.code}</span>
                  <span className="min-w-0 truncate font-semibold">{s.title}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur" aria-live="polite">
            <div className="flex items-center gap-3 font-mono text-sm">
              <span className="rounded-md bg-white px-2 py-0.5 font-bold text-[#070b24]">MAA</span>
              <span className="relative h-px flex-1 border-t-2 border-dashed border-white/30"><Plane className="absolute -top-2.5 left-1/2 size-4 -translate-x-1/2 text-sun" /></span>
              <span className="rounded-md bg-sun px-2 py-0.5 font-bold text-sun-foreground">{active.code}</span>
            </div>
            <p className="mt-4 font-display text-2xl font-extrabold">{active.title}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-white/75"><Clock className="size-4 shrink-0" />{active.flight}</p>
            <p className="mt-1 text-sm text-white/60">Best: {active.months}</p>
            <Link href={`/packages/${active.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-sun hover:underline">See the trip <ArrowUpRight className="size-4" /></Link>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-[560px] lg:order-2">
          <div ref={wrap} className="relative aspect-square w-full">
            <canvas ref={canvas} className="size-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]" aria-label="Globe with flight routes from Chennai" role="img" />
          </div>
          <p className="mt-2 text-center text-xs text-white/50">Drag to spin</p>
        </div>
      </div>
    </section>
  );
}
