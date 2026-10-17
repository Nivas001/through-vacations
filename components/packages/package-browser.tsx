"use client";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, LayoutGrid, List, Search, SlidersHorizontal, Sparkles, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { filterPackages, type PackageFilters } from "@/lib/data/packages";
import { monthName } from "@/lib/site";
import type { Region, TravelPackage, TravelStyle } from "@/lib/types";
import { PackageCard } from "./package-card";
import { LinkButton } from "@/components/brand/link-button";
import { cn } from "@/lib/utils";

const styleOptions: TravelStyle[] = ["Couples", "Honeymoon", "Family", "Friends", "Beach", "Nature", "City", "Culture"];
const regions: { v: Region | ""; label: string }[] = [{ v: "", label: "All" }, { v: "India", label: "India" }, { v: "International", label: "International" }];
const MAX_NIGHTS = 10;

type State = { q: string; region: Region | ""; style: TravelStyle | ""; maxNights: number; maxPrice: number; month: number; sort: NonNullable<PackageFilters["sort"]> };
const empty: State = { q: "", region: "", style: "", maxNights: 0, maxPrice: 0, month: 0, sort: "featured" };

export function PackageBrowser({ packages, initial }: { packages: TravelPackage[]; initial: Partial<State> }) {
  const [s, setS] = useState<State>({ ...empty, ...initial });
  const [view, setView] = useState<"grid" | "list">("grid");

  const results = useMemo(
    () =>
      filterPackages(packages, {
        q: s.q,
        region: s.region || undefined,
        style: s.style || undefined,
        maxNights: s.maxNights || undefined,
        maxPrice: s.maxPrice || undefined,
        month: s.month || undefined,
        sort: s.sort,
      }),
    [packages, s],
  );

  function set<K extends keyof State>(k: K, v: State[K]) {
    const next = { ...s, [k]: v };
    setS(next);
    const p = new URLSearchParams();
    (["q", "region", "style", "maxNights", "maxPrice", "month"] as const).forEach((key) => next[key] && p.set(key, String(next[key])));
    window.history.replaceState(null, "", p.size ? `?${p}` : window.location.pathname);
  }
  const reset = () => {
    setS(empty);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const chips: { key: keyof State; label: string }[] = [
    s.style && { key: "style" as const, label: s.style },
    s.maxNights && { key: "maxNights" as const, label: `Up to ${s.maxNights} nights` },
    s.month && { key: "month" as const, label: `Best in ${monthName(s.month)}` },
    s.maxPrice && { key: "maxPrice" as const, label: `Under ₹${s.maxPrice / 1000}k` },
  ].filter(Boolean) as { key: keyof State; label: string }[];
  const clearChip = (k: keyof State) => set(k, (typeof empty[k] === "number" ? 0 : "") as never);

  const stylePicker = (
    <div className="flex max-w-xs flex-wrap gap-2">
      {styleOptions.map((t) => <Chip key={t} on={s.style === t} onClick={() => set("style", s.style === t ? "" : t)}>{t}</Chip>)}
    </div>
  );
  const nightsPicker = (
    <div className="w-64">
      <p className="font-display text-3xl leading-none font-extrabold">{s.maxNights ? `Up to ${s.maxNights}` : "Any"} <span className="serif-i text-xl text-muted-foreground">nights</span></p>
      <Slider className="mt-4" min={2} max={MAX_NIGHTS} step={1} value={[s.maxNights || MAX_NIGHTS]} onValueChange={(v) => { const n = Array.isArray(v) ? v[0] : v; set("maxNights", n >= MAX_NIGHTS ? 0 : n); }} aria-label="Maximum nights" />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>2</span><span>Any</span></div>
    </div>
  );
  const monthPicker = (
    <div className="grid w-64 grid-cols-4 gap-1.5">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
        <button key={m} type="button" aria-pressed={s.month === m} onClick={() => set("month", s.month === m ? 0 : m)} className={cn("h-10 rounded-lg text-sm font-bold transition", s.month === m ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary")}>{monthName(m).slice(0, 3)}</button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="sticky top-[84px] z-30 -mx-1 rounded-[1.25rem] border bg-card/80 p-2.5 backdrop-blur-xl card-lift">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 basis-52">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={s.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Search places, activities…"
              aria-label="Search holidays"
              className="h-11 w-full rounded-full bg-muted pr-4 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="relative hidden grid-cols-3 rounded-full bg-muted p-1 sm:grid" role="tablist" aria-label="Region">
            <span aria-hidden className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-primary transition-transform duration-300" style={{ transform: `translateX(${regions.findIndex((r) => r.v === s.region) * 100}%)` }} />
            {regions.map((r) => (
              <button key={r.label} role="tab" aria-selected={s.region === r.v} type="button" onClick={() => set("region", r.v)} className={cn("relative z-10 h-9 rounded-full px-4 text-sm font-bold transition-colors", s.region === r.v ? "text-primary-foreground" : "text-foreground/70")}>{r.label}</button>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Pop icon={<Sparkles className="size-4" />} label="Style" value={s.style}>{stylePicker}</Pop>
            <Pop icon={<Timer className="size-4" />} label="Length" value={s.maxNights ? `≤ ${s.maxNights}` : ""}>{nightsPicker}</Pop>
            <Pop icon={<CalendarDays className="size-4" />} label="Month" value={s.month ? monthName(s.month).slice(0, 3) : ""}>{monthPicker}</Pop>
          </div>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" className="h-11 border-2 px-4 lg:hidden" />}>
              <SlidersHorizontal /> Filters{chips.length > 0 && ` (${chips.length})`}
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-[1.75rem] p-6">
              <SheetTitle className="font-display text-3xl font-extrabold uppercase">Filters</SheetTitle>
              <div className="space-y-6">
                <div><p className="mb-3 text-xs font-bold tracking-[0.18em] uppercase">Where</p><div className="flex flex-wrap gap-2">{regions.map((r) => <Chip key={r.label} on={s.region === r.v} onClick={() => set("region", r.v)}>{r.label}</Chip>)}</div></div>
                <div><p className="mb-3 text-xs font-bold tracking-[0.18em] uppercase">Style</p>{stylePicker}</div>
                <div><p className="mb-3 text-xs font-bold tracking-[0.18em] uppercase">Length</p>{nightsPicker}</div>
                <div><p className="mb-3 text-xs font-bold tracking-[0.18em] uppercase">Best month</p>{monthPicker}</div>
                {chips.length > 0 && <Button variant="ghost" onClick={reset}><X /> Clear filters</Button>}
              </div>
            </SheetContent>
          </Sheet>

          <select aria-label="Sort" value={s.sort} onChange={(e) => set("sort", e.target.value as State["sort"])} className="h-11 rounded-full bg-muted px-4 text-sm font-medium">
            <option value="featured">Featured first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="duration">Shortest first</option>
          </select>
          <div className="hidden gap-1 rounded-full bg-muted p-1 sm:flex">
            <Button size="icon-sm" variant={view === "grid" ? "default" : "ghost"} aria-label="Grid view" onClick={() => setView("grid")}><LayoutGrid /></Button>
            <Button size="icon-sm" variant={view === "list" ? "default" : "ghost"} aria-label="List view" onClick={() => setView("list")}><List /></Button>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 px-1 text-sm" aria-live="polite">
          <span key={results.length} className="word-swap font-bold">{results.length} {results.length === 1 ? "holiday" : "holidays"}</span>
          {chips.map((c) => (
            <button key={c.key} type="button" onClick={() => clearChip(c.key)} className="inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground">{c.label}<X className="size-3" /></button>
          ))}
          {(chips.length > 0 || s.region || s.q) && <button type="button" onClick={reset} className="text-xs text-muted-foreground underline underline-offset-4">Clear all</button>}
        </div>
      </div>

      {results.length ? (
        <div className={cn("mt-6 grid gap-6", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 lg:grid-cols-2")}>
          {results.map((p) => <PackageCard key={p.id} pkg={p} />)}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-dashed bg-card p-12 text-center">
          <h2 className="text-3xl font-extrabold uppercase">Nothing matches just yet</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">We plan far more trips than we list. Tell us what you have in mind and we will build it.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={reset}>Clear filters</Button>
            <LinkButton href="/plan">Request a custom quote</LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}

function Pop({ icon, label, value, children }: { icon: React.ReactNode; label: string; value: string; children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger className={cn("inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition", value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary")}>
        {icon}{value || label}<ChevronDown className="size-3.5 opacity-70" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-2xl p-4">{children}</PopoverContent>
    </Popover>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn("rounded-full border-2 px-3.5 py-1.5 text-sm font-medium transition", on ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/60")}>
      {children}
    </button>
  );
}
