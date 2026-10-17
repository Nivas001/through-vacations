"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BoardRow = {
  slug: string;
  name: string;
  region: "India" | "International";
  code: string;
  months: string;
  flight: string;
  trips: number;
  image: string;
  tagline: string;
};

const tabs = ["All", "India", "International"] as const;

/** Departure-board list: mono codes, flip-in rows, and a sticky photo that follows hover or focus. */
export function DepartureBoard({ rows }: { rows: BoardRow[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const list = rows.filter((r) => tab === "All" || r.region === tab);
  const [active, setActive] = useState(0);
  const cur = list[Math.min(active, list.length - 1)];

  return (
    <div>
      <div className="relative inline-grid grid-cols-3 rounded-full bg-card p-1 card-lift border" role="tablist" aria-label="Region">
        <span aria-hidden className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-primary transition-transform duration-300" style={{ transform: `translateX(${tabs.indexOf(tab) * 100}%)` }} />
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} type="button" onClick={() => { setTab(t); setActive(0); }} className={cn("relative z-10 h-10 rounded-full px-5 text-sm font-bold transition-colors", tab === t ? "text-primary-foreground" : "text-foreground/70")}>{t}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[1.5rem] bg-[#070b24] text-white">
          <div className="hidden grid-cols-[4.5rem_1fr_9rem_5rem_2rem] gap-3 border-b border-white/15 px-5 py-3 text-[0.65rem] font-bold tracking-[0.25em] text-sun uppercase sm:grid">
            <span>Code</span><span>Destination</span><span>Best months</span><span className="text-right">Trips</span><span />
          </div>
          <ul key={tab}>
            {list.map((r, i) => (
              <li key={r.slug} className="board-row" style={{ animationDelay: `${i * 45}ms` }}>
                <Link
                  href={`/destinations/${r.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={cn("group grid grid-cols-[4rem_1fr_2rem] items-center gap-3 border-b border-white/10 px-5 py-4 transition sm:grid-cols-[4.5rem_1fr_9rem_5rem_2rem]", cur?.slug === r.slug ? "bg-primary" : "hover:bg-white/5")}
                >
                  <span className="font-mono text-xl font-bold tracking-widest text-sun">{r.code}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-xl leading-none font-extrabold sm:text-2xl">{r.name}</span>
                    <span className="serif-i block truncate text-base text-white/70">{r.tagline}</span>
                  </span>
                  <span className="hidden font-mono text-xs text-white/80 sm:block">{r.months}</span>
                  <span className="hidden text-right font-mono text-sm sm:block">{String(r.trips).padStart(2, "0")}</span>
                  <ArrowUpRight className="size-5 text-sun transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {cur && (
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="card-lift relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-secondary">
                {list.map((r) => (
                  <Image key={r.slug} src={r.image} alt={r.slug === cur.slug ? r.name : ""} fill sizes="35vw" quality={85} className={cn("object-cover transition-opacity duration-500", r.slug === cur.slug ? "opacity-100" : "opacity-0")} />
                ))}
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="font-mono text-xs tracking-[0.3em] text-sun">MAA → {cur.code}</p>
                  <p className="serif mt-1 text-5xl leading-none">{cur.name}</p>
                  <p className="mt-2 text-sm text-white/80">From Chennai: {cur.flight}</p>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
