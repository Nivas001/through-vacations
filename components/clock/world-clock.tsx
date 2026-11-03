"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowUpRight, CalendarDays, ChartSpline, Check, Ellipsis, House, Moon, PhoneCall, Plus, RotateCcw, Search, Share, Sun, SunMoon, ToggleRight, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cities, defaultCityIds, instantAt, monthNames, offsetMinutes, relativeLabel, shiftLabel, zoneTime, type City } from "@/lib/time-zones";
import { cn } from "@/lib/utils";

/* Preferences ---------------------------------------------------------------- */

const themes = {
  teal: ["#3a8696", "#1b3f4a"], gold: ["#c08a12", "#6b4a06"], red: ["#c22c35", "#6d1218"],
  blue: ["#1f78bd", "#0f3d63"], purple: ["#8a49b3", "#3e2560"], green: ["#219463", "#0f4a30"],
} as const;
type ThemeKey = keyof typeof themes;
type Mode = "auto" | "dark" | "light";
type Prefs = { ids: string[]; home: string; selected: string; theme: ThemeKey; mode: Mode; h24: boolean; seconds: boolean; timeline: boolean };

const KEY = "tv-world-clock";
const defaults: Prefs = { ids: defaultCityIds, home: "india", selected: "dubai", theme: "teal", mode: "dark", h24: false, seconds: false, timeline: false };

function loadPrefs(): Prefs {
  try {
    const p = { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") } as Prefs;
    p.ids = p.ids.filter((id) => cities.some((c) => c.id === id));
    if (!p.ids.length) p.ids = defaults.ids;
    if (!p.ids.includes(p.home)) p.home = p.ids[0];
    if (!p.ids.includes(p.selected)) p.selected = p.ids[0];
    if (!(p.theme in themes)) p.theme = "teal";
    return p;
  } catch {
    return defaults;
  }
}

const byId = (id: string) => cities.find((c) => c.id === id)!;

/* Shell: renders only in the browser, where the clock and saved preferences live. */

export function WorldClock() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);
  if (now === null) return <div className="mx-auto h-[640px] w-full max-w-2xl animate-pulse rounded-[2rem] bg-muted" aria-busy="true" />;
  return <ClockApp now={now} />;
}

/* The app ---------------------------------------------------------------------- */

function ClockApp({ now }: { now: number }) {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [shift, setShift] = useState(0); // minutes away from now
  const [editing, setEditing] = useState(false);
  const [dialog, setDialog] = useState<null | "add" | "date" | "settings">(null);
  const { resolvedTheme } = useTheme();
  const dark = prefs.mode === "dark" || (prefs.mode === "auto" && resolvedTheme !== "light");
  const [from, to] = themes[prefs.theme];

  const set = (p: Partial<Prefs>) => setPrefs((x) => {
    const next = { ...x, ...p };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    return next;
  });

  const t = now + shift * 60000;
  const home = byId(prefs.home);
  const homeOff = offsetMinutes(home.zone, t);
  // Offsets only change at daylight-saving boundaries, so the order is recomputed once a minute.
  const minute = Math.floor(t / 60000);
  const list = useMemo(
    () => prefs.ids.map(byId).map((c) => ({ c, off: offsetMinutes(c.zone, minute * 60000) })).sort((a, b) => a.off - b.off || a.c.name.localeCompare(b.c.name)),
    [prefs.ids, minute],
  );
  const selected = byId(prefs.selected);

  /* drag across the clocks to move through time */
  const drag = useRef<{ x: number; shift: number; active: boolean; id: number } | null>(null);
  const swallowClick = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, shift, active: false, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.active && Math.abs(dx) > 8) { d.active = true; e.currentTarget.setPointerCapture(d.id); }
    if (d.active) setShift(d.shift + Math.round(dx / 18) * 15);
  };
  const onPointerUp = () => {
    if (drag.current?.active) swallowClick.current = true;
    drag.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 60 : 15;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setShift((s) => s + step); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setShift((s) => s - step); }
    else if (e.key === "Escape" || e.key.toLowerCase() === "n") setShift(0);
  };

  async function share() {
    const lines = list.map(({ c }) => `${c.name}: ${fmt(c.zone, t, prefs.h24).time} ${fmt(c.zone, t, prefs.h24).ampm} · ${fmt(c.zone, t, prefs.h24).date}`);
    const text = `${shift ? `At ${fmt(home.zone, t, prefs.h24).time} ${fmt(home.zone, t, prefs.h24).ampm} in ${home.name}` : "Right now"}:\n${lines.join("\n")}\n\nWorld clock by Through Vacations: ${location.origin}/time-zones`;
    if (navigator.share) {
      try { await navigator.share({ title: "World clock", text }); } catch {}
      return;
    }
    try { await navigator.clipboard.writeText(text); toast.success("Times copied to share"); } catch { toast.error("Could not copy"); }
  }

  const surface = dark ? "bg-[#050507] text-white" : "bg-white text-[#070b24] ring-1 ring-black/5";
  const card = dark ? "bg-[#0e1016] border-white/10" : "bg-[#f4f6fb] border-black/[.07]";
  const muted = dark ? "text-white/60" : "text-[#070b24]/55";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <section aria-label="World clock" className={cn("mx-auto w-full max-w-2xl rounded-[2rem] p-3 shadow-[0_40px_80px_-40px_rgb(7_11_36/.6)] sm:p-5", surface)}>
        <div className="flex items-center justify-between px-2 pt-1 pb-3">
          <p className={cn("flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase", muted)}>
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ff8a3d] opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-[#ff8a3d]" /></span>
            {shift ? "Time travel" : "Live"}
          </p>
          <button type="button" onClick={() => setEditing((v) => !v)} aria-pressed={editing} aria-label={editing ? "Done editing" : "Edit cities"}
            className={cn("grid h-9 min-w-9 place-items-center rounded-full px-2 text-sm font-bold transition", editing ? "bg-sun text-sun-foreground" : dark ? "hover:bg-white/10" : "hover:bg-black/5")}>
            {editing ? "Done" : <Ellipsis className="size-6" />}
          </button>
        </div>

        <ul
          className="grid touch-pan-y grid-cols-1 gap-2 outline-none select-none focus-visible:ring-4 focus-visible:ring-sun/50 sm:gap-2.5"
          tabIndex={0}
          aria-label="Cities. Drag sideways or use the arrow keys to move through time."
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          onClickCapture={(e) => { if (swallowClick.current) { e.stopPropagation(); e.preventDefault(); swallowClick.current = false; } }}
        >
          {list.map(({ c, off }) => {
            const f = fmt(c.zone, t, prefs.h24, prefs.seconds);
            const isSel = c.id === prefs.selected;
            const isHome = c.id === prefs.home;
            const night = f.hour < 6 || f.hour >= 19;
            return (
              <li key={c.id} className="relative">
                <button
                  type="button"
                  onClick={() => set({ selected: c.id })}
                  aria-pressed={isSel}
                  className={cn("relative block w-full overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 sm:px-6 sm:py-5", isSel ? "border-transparent text-white" : card, shift && !isSel && (dark ? "border-white/25" : "border-black/20"), editing && "pr-24 sm:pr-28")}
                  style={isSel ? { background: `linear-gradient(115deg, ${from} 0%, ${to} 100%)` } : { backgroundImage: `linear-gradient(100deg, ${from}${dark ? "26" : "1f"} 0%, transparent 40%)` }}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 truncate text-lg font-bold sm:text-2xl">{c.name}{isHome && <House className="size-4 shrink-0 opacity-80" aria-label="Home" />}</span>
                      <span className={cn("mt-0.5 flex items-center gap-1.5 text-xs font-semibold tabular-nums sm:text-sm", isSel ? "text-white/80" : muted)}>
                        {relativeLabel(off - homeOff)}
                        {night ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="flex items-baseline justify-end gap-1.5 leading-none">
                        <span className="font-display text-[2.6rem] font-extrabold tracking-tight tabular-nums sm:text-6xl">{f.time}</span>
                        {f.ampm && <span className="text-2xl font-light sm:text-4xl">{f.ampm}</span>}
                      </span>
                      <span className={cn("mt-1 block text-[0.62rem] font-semibold tracking-[0.12em] uppercase sm:text-xs", isSel ? "text-white/85" : muted)}>{f.date}</span>
                    </span>
                  </span>
                  {prefs.timeline && <Timeline zone={c.zone} homeZone={home.zone} t={t} dark={dark || isSel} />}
                </button>
                {editing && (
                  <span className="absolute top-1/2 right-3 flex -translate-y-1/2 gap-1.5">
                    {!isHome && <IconBtn label={`Make ${c.name} home`} onClick={() => set({ home: c.id })} dark={dark}><House className="size-4" /></IconBtn>}
                    {prefs.ids.length > 1 && <IconBtn label={`Remove ${c.name}`} onClick={() => {
                      const ids = prefs.ids.filter((x) => x !== c.id);
                      set({ ids, home: isHome ? ids[0] : prefs.home, selected: isSel ? ids[0] : prefs.selected });
                    }} dark={dark} danger><X className="size-4" /></IconBtn>}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* time travel */}
        <div className="mt-5 px-1">
          <div className="flex justify-center">
            <button type="button" onClick={() => setShift(0)} disabled={!shift}
              className={cn("h-11 rounded-full border px-6 text-sm font-bold tracking-[0.12em] uppercase transition", dark ? "border-white/20" : "border-black/15", shift ? "bg-sun text-sun-foreground border-transparent hover:brightness-95" : "")}>
              {shift ? <>{shiftLabel(shift).replace(/ (from|before) now$/, "")} <span className="opacity-70">{shift > 0 ? "from" : "before"}</span> now</> : "Now"}
            </button>
          </div>
          <label className="mt-4 block">
            <span className="sr-only">Move through time</span>
            <input type="range" min={-1440} max={1440} step={15} value={Math.max(-1440, Math.min(1440, shift))} onChange={(e) => setShift(Number(e.target.value))}
              className="time-range w-full" style={{ ["--fill" as string]: from }} />
          </label>
          <div className={cn("mt-1 flex justify-between text-[0.65rem] font-bold tracking-widest uppercase", muted)}><span>−24 h</span><span>Drag the clocks or slide</span><span>+24 h</span></div>
        </div>

        {/* toolbar */}
        <nav aria-label="Clock tools" className={cn("mt-5 flex items-center justify-between rounded-2xl px-2 py-2", dark ? "bg-white/5" : "bg-black/[.03]")}>
          <ToolBtn label="Add a city" onClick={() => setDialog("add")} dark={dark}><Plus className="size-7" /></ToolBtn>
          <span className="flex items-center gap-1 sm:gap-3">
            <ToolBtn label="Pick a date and time" onClick={() => setDialog("date")} dark={dark}><CalendarDays className="size-6" /></ToolBtn>
            <ToolBtn label="Day and night view" onClick={() => set({ timeline: !prefs.timeline })} active={prefs.timeline} dark={dark}><ChartSpline className="size-6" /></ToolBtn>
            <ToolBtn label="Share these times" onClick={share} dark={dark}><Share className="size-6" /></ToolBtn>
          </span>
          <ToolBtn label="Clock settings" onClick={() => setDialog("settings")} dark={dark}><ToggleRight className="size-7" /></ToolBtn>
        </nav>
      </section>

      <Aside selected={selected} home={home} t={t} h24={prefs.h24} from={from} to={to} />

      <AddDialog open={dialog === "add"} onOpenChange={(o) => setDialog(o ? "add" : null)} have={prefs.ids} onAdd={(id) => { set({ ids: [...prefs.ids, id], selected: id }); setDialog(null); toast.success(`${byId(id).name} added`); }} />
      <DateDialog open={dialog === "date"} onOpenChange={(o) => setDialog(o ? "date" : null)} home={home} t={t} onPick={(at) => { setShift(Math.round((at - Date.now()) / 60000)); setDialog(null); }} />
      <SettingsDialog open={dialog === "settings"} onOpenChange={(o) => setDialog(o ? "settings" : null)} prefs={prefs} set={set} onReset={() => { set({ ids: defaults.ids, home: defaults.home, selected: defaults.selected }); setShift(0); toast.success("Cities reset"); }} />
    </div>
  );
}

/* Pieces ------------------------------------------------------------------------ */

function fmt(zone: string, t: number, h24: boolean, seconds = false) {
  const z = zoneTime(zone, t);
  const h = h24 ? z.hour : z.hour % 12 || 12;
  const time = `${String(h).padStart(2, "0")}:${String(z.minute).padStart(2, "0")}${seconds ? `:${String(z.second).padStart(2, "0")}` : ""}`;
  return { time, ampm: h24 ? "" : z.hour < 12 ? "am" : "pm", hour: z.hour, date: `${z.weekday}, ${z.day} ${monthNames[z.month - 1]}` };
}

/** 24 cells aligned to the home day; each shows this city's hour, shaded night / day / good-to-call. */
function Timeline({ zone, homeZone, t, dark }: { zone: string; homeZone: string; t: number; dark: boolean }) {
  const h = zoneTime(homeZone, t);
  const base = instantAt(homeZone, h.year, h.month, h.day, 0, 0);
  const pos = Math.max(0, Math.min(100, ((t - base) / 864e5) * 100));
  return (
    <span className="relative mt-3 grid grid-cols-24 gap-px overflow-hidden rounded-md" aria-hidden>
      {Array.from({ length: 24 }, (_, i) => {
        const z = zoneTime(zone, base + i * 36e5);
        const tone = z.hour >= 8 && z.hour < 21 ? "bg-emerald-400/70" : z.hour >= 6 && z.hour < 22 ? "bg-amber-300/60" : dark ? "bg-white/10" : "bg-black/10";
        return <span key={i} className={cn("grid h-6 place-items-center text-[0.55rem] font-bold tabular-nums sm:text-[0.6rem]", tone, dark ? "text-white/80" : "text-black/60")}>{z.hour}</span>;
      })}
      <span className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgb(0_0_0/.4)]" style={{ left: `${pos}%` }} />
    </span>
  );
}

function Aside({ selected, home, t, h24, from, to }: { selected: City; home: City; t: number; h24: boolean; from: string; to: string }) {
  const win = selected.id === home.id ? null : callWindow(selected.zone, home.zone, t);
  const hm = (zone: string, at: number) => { const f = fmt(zone, at, h24); return `${f.time} ${f.ampm}`.trim(); };
  return (
    <aside className="space-y-4 lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-[1.5rem] p-6 text-white" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
        <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase opacity-80"><PhoneCall className="size-4" /> Best time to call</p>
        {selected.id === home.id ? (
          <p className="mt-3 text-lg font-semibold">Pick another city to see the easiest hours to talk with {home.name}.</p>
        ) : win ? (
          <>
            <p className="mt-3 font-display text-3xl leading-tight font-extrabold">{hm(home.zone, win[0])} to {hm(home.zone, win[1])}</p>
            <p className="mt-1 text-sm opacity-85">{home.name} time, when it is {hm(selected.zone, win[0])} to {hm(selected.zone, win[1])} in {selected.name}.</p>
          </>
        ) : (
          <p className="mt-3 text-lg font-semibold">No easy overlap today. Early morning in one place is late night in the other, so a message works better than a call.</p>
        )}
        <p className="mt-4 text-xs opacity-75">Both places between 8 am and 10 pm. Daylight saving is handled automatically.</p>
      </div>
      {selected.slug ? (
        <Link href={`/packages/${selected.slug}`} className="group flex items-center justify-between gap-3 rounded-[1.5rem] border bg-card p-5 transition hover:border-primary">
          <span><span className="block text-xs font-bold tracking-[0.18em] text-brand uppercase">Thinking of {selected.name}?</span><span className="mt-1 block font-display text-xl font-extrabold">See the holiday</span></span>
          <ArrowUpRight className="size-6 text-brand transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ) : (
        <Link href={`/plan?trip=${encodeURIComponent(selected.name)}`} className="group flex items-center justify-between gap-3 rounded-[1.5rem] border bg-card p-5 transition hover:border-primary">
          <span><span className="block text-xs font-bold tracking-[0.18em] text-brand uppercase">Travelling to {selected.name}?</span><span className="mt-1 block font-display text-xl font-extrabold">Ask us for a plan</span></span>
          <ArrowUpRight className="size-6 text-brand" />
        </Link>
      )}
      <div className="rounded-[1.5rem] border bg-card p-5 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Handy for travellers</p>
        <ul className="mt-2 space-y-1.5">
          <li>• Drag the clocks sideways to see any time.</li>
          <li>• Tap a city to plan calls with home.</li>
          <li>• Use ⋯ to change your home city or remove one.</li>
          <li>• Your cities are saved on this device.</li>
        </ul>
      </div>
    </aside>
  );
}

/** Longest stretch of the home day when both cities are between 8 am and 10 pm. */
function callWindow(zone: string, homeZone: string, t: number): [number, number] | null {
  const h = zoneTime(homeZone, t);
  const base = instantAt(homeZone, h.year, h.month, h.day, 0, 0);
  const ok = (at: number) => { const a = zoneTime(zone, at).hour, b = zoneTime(homeZone, at).hour; return a >= 8 && a < 22 && b >= 8 && b < 22; };
  let best: [number, number] | null = null, start: number | null = null;
  for (let m = 0; m <= 1440; m += 15) {
    const at = base + m * 60000;
    if (m < 1440 && ok(at)) { if (start === null) start = at; }
    else if (start !== null) { if (!best || at - start > best[1] - best[0]) best = [start, at]; start = null; }
  }
  return best;
}

function ToolBtn({ label, onClick, active, dark, children }: { label: string; onClick: () => void; active?: boolean; dark: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} aria-pressed={active}
      className={cn("grid size-12 place-items-center rounded-xl transition", active ? "bg-sun text-sun-foreground" : dark ? "hover:bg-white/10" : "hover:bg-black/5")}>
      {children}
    </button>
  );
}

function IconBtn({ label, onClick, dark, danger, children }: { label: string; onClick: () => void; dark: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className={cn("grid size-9 place-items-center rounded-full transition", danger ? "bg-rose-500 text-white hover:bg-rose-600" : dark ? "bg-white/15 text-white hover:bg-white/25" : "bg-black/10 hover:bg-black/15")}>
      {children}
    </button>
  );
}

function AddDialog({ open, onOpenChange, have, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; have: string[]; onAdd: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [at] = useState(() => Date.now());
  const rows = cities.filter((c) => !have.includes(c.id) && `${c.name} ${c.country}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setQ(""); }}>
      <DialogContent className="max-h-[80dvh] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="p-4 pb-2"><DialogTitle className="font-display text-2xl font-extrabold">Add a city</DialogTitle><DialogDescription>Holiday spots, family abroad, or anywhere you call.</DialogDescription></DialogHeader>
        <label className="relative mx-4 mb-2 block">
          <span className="sr-only">Search cities</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search, e.g. London, Bali" className="h-11 w-full rounded-xl border bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
        </label>
        <ul className="max-h-[52dvh] overflow-y-auto px-2 pb-3" data-lenis-prevent>
          {rows.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => onAdd(c.id)} className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-secondary">
                <span className="min-w-0"><span className="block font-semibold">{c.name}</span><span className="block truncate text-xs text-muted-foreground">{c.country}</span></span>
                <span className="shrink-0 text-sm font-semibold tabular-nums">{fmt(c.zone, at, false).time} {fmt(c.zone, at, false).ampm}</span>
              </button>
            </li>
          ))}
          {!rows.length && <li className="px-3 py-8 text-center text-sm text-muted-foreground">No more cities match “{q}”.</li>}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

function DateDialog({ open, onOpenChange, home, t, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; home: City; t: number; onPick: (at: number) => void }) {
  const z = zoneTime(home.zone, t);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {open && <DateForm home={home} initialDate={`${z.year}-${pad(z.month)}-${pad(z.day)}`} initialTime={`${pad(z.hour)}:${pad(z.minute)}`} onPick={onPick} />}
      </DialogContent>
    </Dialog>
  );
}

function DateForm({ home, initialDate, initialTime, onPick }: { home: City; initialDate: string; initialTime: string; onPick: (at: number) => void }) {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  return (
    <form onSubmit={(e) => { e.preventDefault(); const [y, m, d] = date.split("-").map(Number); const [h, mi] = time.split(":").map(Number); if (y && m && d) onPick(instantAt(home.zone, y, m, d, h || 0, mi || 0)); }} className="grid gap-4">
      <DialogHeader><DialogTitle className="font-display text-2xl font-extrabold">Pick a moment</DialogTitle><DialogDescription>In {home.name} time. Every city follows.</DialogDescription></DialogHeader>
      <label className="grid gap-1.5 text-sm font-medium">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl border bg-background px-3" required /></label>
      <label className="grid gap-1.5 text-sm font-medium">Time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-11 rounded-xl border bg-background px-3" required /></label>
      <button type="submit" className="h-11 rounded-full bg-primary text-sm font-bold text-primary-foreground transition hover:bg-sun hover:text-sun-foreground">Show this time</button>
    </form>
  );
}

function SettingsDialog({ open, onOpenChange, prefs, set, onReset }: { open: boolean; onOpenChange: (o: boolean) => void; prefs: Prefs; set: (p: Partial<Prefs>) => void; onReset: () => void }) {
  const modes: { v: Mode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [{ v: "auto", label: "Auto", icon: SunMoon }, { v: "dark", label: "Dark", icon: Moon }, { v: "light", label: "Light", icon: Sun }];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle className="font-display text-2xl font-extrabold">Clock settings</DialogTitle><DialogDescription>Saved on this device.</DialogDescription></DialogHeader>
        <div className="grid gap-5">
          <div>
            <p className="mb-2 text-sm font-medium">Appearance</p>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Appearance">
              {modes.map(({ v, label, icon: Icon }) => (
                <button key={v} type="button" role="radio" aria-checked={prefs.mode === v} onClick={() => set({ mode: v })}
                  className={cn("flex h-16 flex-col items-center justify-center gap-1 rounded-xl border text-xs font-semibold transition", prefs.mode === v ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50")}>
                  <Icon className="size-5" />{label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Colour</p>
            <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Colour">
              {(Object.keys(themes) as ThemeKey[]).map((k) => (
                <button key={k} type="button" role="radio" aria-checked={prefs.theme === k} aria-label={k} onClick={() => set({ theme: k })}
                  className={cn("grid size-10 place-items-center rounded-full text-white ring-offset-2 ring-offset-background transition", prefs.theme === k && "ring-2 ring-foreground")}
                  style={{ background: `linear-gradient(135deg, ${themes[k][0]}, ${themes[k][1]})` }}>
                  {prefs.theme === k && <Check className="size-4" />}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between gap-3 text-sm font-medium">24-hour clock <Switch checked={prefs.h24} onCheckedChange={(v) => set({ h24: v })} /></label>
          <label className="flex items-center justify-between gap-3 text-sm font-medium">Show seconds <Switch checked={prefs.seconds} onCheckedChange={(v) => set({ seconds: v })} /></label>
          <label className="flex items-center justify-between gap-3 text-sm font-medium">Day and night bars <Switch checked={prefs.timeline} onCheckedChange={(v) => set({ timeline: v })} /></label>
          <button type="button" onClick={onReset} className="inline-flex items-center gap-2 justify-self-start text-sm font-semibold text-muted-foreground hover:text-foreground"><RotateCcw className="size-4" /> Reset cities</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
