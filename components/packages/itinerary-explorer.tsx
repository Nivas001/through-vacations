"use client";
import { useEffect, useRef, useState } from "react";
import { BedDouble, Lightbulb, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DayPace, ItineraryDay } from "@/lib/types";

const paceStyle: Record<DayPace, string> = {
  Easy: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  Active: "bg-sun/40 text-amber-900 dark:text-sun",
  Adventure: "bg-primary text-primary-foreground",
  "Travel day": "bg-foreground/10 text-foreground",
  Free: "bg-secondary text-secondary-foreground",
};

export function ItineraryExplorer({ days }: { days: ItineraryDay[] }) {
  const [active, setActive] = useState(0);
  const [only, setOnly] = useState<DayPace | null>(null);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const paces = [...new Set(days.map((d) => d.pace).filter(Boolean))] as DayPace[];
  const pct = days.length > 1 ? (active / (days.length - 1)) * 100 : 0;

  return (
    <div>
      {paces.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="mr-1 text-muted-foreground">Pace of each day:</span>
          {paces.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setOnly(only === p ? null : p)}
              className={cn("rounded-full px-3 py-1 font-medium transition", paceStyle[p], only === p && "ring-2 ring-brand")}
              aria-pressed={only === p}
            >
              {p} · {days.filter((d) => d.pace === p).length}
            </button>
          ))}
          {only && <button type="button" onClick={() => setOnly(null)} className="text-muted-foreground underline underline-offset-4">Show all</button>}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[64px_1fr]">
        {/* route rail */}
        <div className="relative hidden lg:block">
          <div className="sticky top-28 mx-auto flex h-[min(60vh,420px)] w-10 flex-col items-center">
            <div className="relative w-0.5 flex-1 rounded-full bg-border">
              <div className="absolute inset-x-0 top-0 rounded-full bg-brand transition-[height] duration-500" style={{ height: `${pct}%` }} />
              <span
                className="absolute left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground shadow-lg shadow-brand/40 transition-[top] duration-500"
                style={{ top: `${pct}%` }}
              >
                {active + 1}
              </span>
              {days.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Jump to day ${i + 1}`}
                  onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className={cn("absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background transition hover:scale-150", i <= active ? "border-brand" : "border-muted-foreground/40")}
                  style={{ top: `${days.length > 1 ? (i / (days.length - 1)) * 100 : 0}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <ol className="space-y-5">
          {days.map((d, i) => {
            const dim = only !== null && d.pace !== only;
            return (
              <li
                key={d.title}
                data-i={i}
                ref={(el) => { refs.current[i] = el; }}
                className={cn("rounded-3xl border-2 bg-card p-6 transition duration-500 sm:p-8", i === active && !dim && "border-primary shadow-2xl shadow-primary/15", dim && "scale-[0.98] opacity-35")}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-outline font-display text-7xl leading-none font-extrabold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Day {i + 1}</span>
                  {d.pace && <span className={cn("ml-auto rounded-full px-3 py-1 text-xs font-semibold", paceStyle[d.pace])}>{d.pace}</span>}
                </div>
                <h3 className="mt-3 text-3xl leading-[1] font-extrabold sm:text-4xl">{d.title}</h3>
                <p className="mt-3 max-w-2xl text-muted-foreground">{d.description}</p>
                {d.overnight && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold text-muted-foreground">
                    <BedDouble className="size-3.5 text-brand" /> {d.overnight === "Departure" ? "Departure day" : `Overnight: ${d.overnight}`}
                  </p>
                )}
                {d.stops && (
                  <ul className="mt-5 flex flex-wrap items-center gap-2">
                    {d.stops.map((s, k) => (
                      <li key={s} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
                        {k === 0 && <MapPin className="size-3.5 text-brand" />}
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                {d.tip && (
                  <p className="mt-5 flex gap-3 rounded-2xl bg-accent p-4 text-sm text-accent-foreground ring-1 ring-sun/60">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span><b className="font-semibold">Planner&apos;s note.</b> {d.tip}</span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
