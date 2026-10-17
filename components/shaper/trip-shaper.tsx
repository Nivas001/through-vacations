"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Baby, Check, CloudSun, Minus, Plus, Users, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { monthName } from "@/lib/site";
import { effort, effortLabel, packing, paperwork, season, shape, type Pace } from "@/lib/shaper";
import type { TravelPackage } from "@/lib/types";
import { cn } from "@/lib/utils";

const paces: Pace[] = ["Relaxed", "Balanced", "Packed"];
const seasonStyle = {
  great: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  shoulder: "bg-sun/50 text-amber-900 dark:text-sun",
  off: "bg-rose-500/15 text-rose-800 dark:text-rose-300",
} as const;
const seasonLabel = { great: "Great season", shoulder: "Shoulder season", off: "Off-season" } as const;

export function TripShaper({ packages, initial }: { packages: TravelPackage[]; initial?: string }) {
  const [slug, setSlug] = useState(packages.find((p) => p.slug === initial)?.slug ?? packages[0].slug);
  const pkg = packages.find((p) => p.slug === slug)!;
  const [days, setDays] = useState(pkg.days);
  const [month, setMonth] = useState(pkg.bestMonths[0] ?? 12);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [seniors, setSeniors] = useState(false);
  const [pace, setPace] = useState<Pace>("Balanced");
  const [ticked, setTicked] = useState<Record<string, boolean>>({});

  const input = { days, month, adults, kids, seniors, pace };
  const e = useMemo(() => effort(pkg, input), [pkg, days, month, adults, kids, seniors, pace]); // eslint-disable-line react-hooks/exhaustive-deps
  const sea = season(pkg, month);
  const shaped = shape(pkg, days);
  const plan = new URLSearchParams({ trip: pkg.slug, days: String(days), month: String(month), adults: String(adults), kids: String(kids) });

  function pick(p: TravelPackage) {
    setSlug(p.slug);
    setDays(p.days);
    setMonth(p.bestMonths[0] ?? month);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:items-start">
      {/* controls */}
      <div className="card-lift space-y-7 rounded-[1.5rem] border bg-card p-5 sm:p-6 lg:sticky lg:top-28">
        <div>
          <Label n="1">Where</Label>
          <div className="mt-3 grid max-h-[17rem] grid-cols-2 gap-2 overflow-y-auto pr-1">
            {packages.map((p) => (
              <button key={p.slug} type="button" onClick={() => pick(p)} aria-pressed={p.slug === slug} className={cn("group relative h-16 overflow-hidden rounded-xl border-2 text-left transition", p.slug === slug ? "border-primary" : "border-transparent hover:border-primary/40")}>
                <Image src={p.image} alt="" fill sizes="180px" className="object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                <span className="absolute bottom-1.5 left-2 right-2 truncate text-xs font-bold text-white uppercase">{p.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label n="2">Days you have</Label>
          <p className="mt-2 font-display text-5xl leading-none font-extrabold">{days} <span className="serif-i text-2xl text-muted-foreground">days</span></p>
          <Slider className="mt-4" min={2} max={14} step={1} value={[days]} onValueChange={(v) => setDays(Array.isArray(v) ? v[0] : v)} aria-label="Days available" />
          <p className="mt-2 text-xs text-muted-foreground">This route works best in {pkg.facts?.nights[0]} to {pkg.facts?.nights[1]} nights.</p>
        </div>
        <div>
          <Label n="3">When</Label>
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <button key={m} type="button" onClick={() => setMonth(m)} aria-pressed={month === m} className={cn("relative h-10 rounded-lg text-xs font-bold transition", month === m ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary")}>
                {monthName(m).slice(0, 3)}
                {pkg.bestMonths.includes(m) && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-sun" />}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground"><span className="mr-1 inline-block size-1.5 rounded-full bg-sun" /> Best months for this trip</p>
        </div>
        <div>
          <Label n="4">Who is going</Label>
          <div className="mt-3 grid gap-2">
            <Counter icon={<Users className="size-4" />} label="Adults" value={adults} min={1} max={12} onChange={setAdults} />
            <Counter icon={<Baby className="size-4" />} label="Children" value={kids} min={0} max={8} onChange={setKids} />
            <label className="flex cursor-pointer items-center justify-between rounded-xl bg-muted px-3 py-2.5 text-sm font-medium">
              Senior travellers
              <input type="checkbox" checked={seniors} onChange={(ev) => setSeniors(ev.target.checked)} className="size-4 accent-[var(--primary)]" />
            </label>
          </div>
        </div>
        <div>
          <Label n="5">Pace</Label>
          <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl bg-muted p-1">
            {paces.map((p) => (
              <button key={p} type="button" onClick={() => setPace(p)} aria-pressed={pace === p} className={cn("h-10 rounded-lg text-sm font-bold transition", pace === p ? "bg-card shadow card-lift" : "text-muted-foreground")}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* results */}
      <div className="space-y-6">
        <div className="grain relative overflow-hidden rounded-[1.75rem] bg-primary p-6 text-white sm:p-10">
          <p className="text-xs font-bold tracking-[0.25em] text-white/75 uppercase">{pkg.destination} · {days} days · {monthName(month)}</p>
          <div className="mt-4 flex flex-wrap items-end gap-6">
            <p className="font-display text-8xl leading-[0.8] font-extrabold sm:text-9xl" aria-label={`Effort ${e.score} out of 5`}>{e.score}<span className="text-3xl text-white/60">/5</span></p>
            <div>
              <p className="font-display text-4xl leading-none font-extrabold text-sun sm:text-5xl">{e.label}</p>
              <p className="mt-2 text-sm text-white/80">Planning effort. Higher means more hours on the move and more to organise.</p>
            </div>
          </div>
          <div className="mt-7 flex gap-1.5" role="img" aria-label={`Effort meter: ${effortLabel(e.score)}`}>
            {[1, 2, 3, 4, 5].map((n) => <span key={n} className={cn("h-3 flex-1 rounded-full transition-colors duration-500", n <= e.score ? "bg-sun" : "bg-white/20")} />)}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Panel title="What drives it">
            <ul className="space-y-4">
              {e.parts.map((p) => (
                <li key={p.label}>
                  <div className="flex justify-between text-sm font-bold"><span>{p.label}</span></div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${Math.max(6, p.value * 100)}%` }} /></div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Season check">
            <p className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold", seasonStyle[sea.level])}><CloudSun className="size-4" /> {seasonLabel[sea.level]}</p>
            <p className="mt-3 text-sm text-muted-foreground">{sea.note}</p>
            <p className="mt-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">Best months</p>
            <p className="mt-1 text-sm">{pkg.bestMonths.map((m) => monthName(m).slice(0, 3)).join(", ")}</p>
          </Panel>
        </div>

        <Panel title={`Your ${days}-day shape`}>
          <p className="text-sm text-muted-foreground">
            {shaped.days.some((d) => !d.kept)
              ? `The published route has ${pkg.itinerary.length} days. With ${days}, we would keep the highlighted days and fold the rest.`
              : shaped.extra > 0
                ? `You have ${shaped.extra} more day${shaped.extra > 1 ? "s" : ""} than the published route. A planner would add a free day or an extra stop.`
                : "The published route fits your days."}
          </p>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {shaped.days.map((d) => (
              <li key={d.index} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition", d.kept ? "bg-card" : "border-dashed opacity-45")}>
                <span className="font-display text-xl font-extrabold text-brand">{String(d.index + 1).padStart(2, "0")}</span>
                <span className={cn("flex-1 truncate", !d.kept && "line-through")}>{d.title}</span>
                {d.kept ? <Check className="size-4 text-brand" /> : <X className="size-4" />}
              </li>
            ))}
            {Array.from({ length: shaped.extra }, (_, k) => (
              <li key={`x${k}`} className="flex items-center gap-3 rounded-xl border border-dashed border-sun bg-sun/10 px-3 py-2.5 text-sm"><span className="font-display text-xl font-extrabold">+</span> Extra day: free time or a side trip</li>
            ))}
          </ol>
        </Panel>

        <div className="grid gap-6 md:grid-cols-2">
          <Panel title="Paperwork">
            <Checklist items={paperwork(pkg)} ticked={ticked} setTicked={setTicked} />
          </Panel>
          <Panel title="Packing">
            <Checklist items={packing(pkg, month)} ticked={ticked} setTicked={setTicked} />
          </Panel>
        </div>

        <Panel title="Usually included">
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {pkg.inclusions.slice(0, 6).map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-brand" />{x}</li>)}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Inclusions vary by package and are confirmed in your personal quote.</p>
        </Panel>

        <div className="flex flex-wrap items-center gap-4 rounded-[1.5rem] bg-sun p-6 text-sun-foreground sm:p-8">
          <div className="flex-1">
            <p className="font-display text-3xl leading-none font-extrabold">Happy with this shape?</p>
            <p className="mt-2 text-sm opacity-80">Send it to a planner. Your choices come with you, prices arrive in your personal quote.</p>
          </div>
          <Link href={`/plan?${plan}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-bold text-white transition hover:bg-white hover:text-ink">Send to a planner <ArrowUpRight className="size-4" /></Link>
        </div>
        <p className="text-xs text-muted-foreground">Planning effort guide only. It uses typical flight times and our published routes, so real timings are confirmed in your quote.</p>
      </div>
    </div>
  );
}

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase"><span className="grid size-5 place-items-center rounded-full bg-sun text-[0.65rem] text-sun-foreground">{n}</span>{children}</p>;
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card-lift rounded-[1.5rem] border bg-card p-5 sm:p-6"><h2 className="mb-4 text-2xl font-extrabold">{title}</h2>{children}</section>;
}
function Counter({ icon, label, value, min, max, onChange }: { icon: React.ReactNode; label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
      <span className="flex items-center gap-2 text-sm font-medium">{icon}{label}</span>
      <span className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="grid size-8 place-items-center rounded-full bg-card disabled:opacity-40"><Minus className="size-4" /></button>
        <span className="w-4 text-center font-bold">{value}</span>
        <button type="button" aria-label={`More ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="grid size-8 place-items-center rounded-full bg-card disabled:opacity-40"><Plus className="size-4" /></button>
      </span>
    </div>
  );
}
function Checklist({ items, ticked, setTicked }: { items: string[]; ticked: Record<string, boolean>; setTicked: (f: (t: Record<string, boolean>) => Record<string, boolean>) => void }) {
  return (
    <ul className="space-y-2.5 text-sm">
      {items.map((x) => (
        <li key={x}>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={!!ticked[x]} onChange={() => setTicked((t) => ({ ...t, [x]: !t[x] }))} className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]" />
            <span className={cn(ticked[x] && "text-muted-foreground line-through")}>{x}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
