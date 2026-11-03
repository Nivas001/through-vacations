"use client";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDb, useHydrated } from "@/lib/data/store";
import { packages as catalogue } from "@/lib/mock/packages";
import type { Booking } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { inView, useBranchView } from "./branch-view";
import { BranchBadge, Empty, PageHeader } from "./ui";

const DAY = 864e5;
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Trip = { b: Booking; start: string; end: string };

/** Month view of who is travelling when, from booking start dates and trip length. */
export function DeparturesCalendar() {
  const db = useDb();
  const hydrated = useHydrated();
  const { view } = useBranchView();
  const [cursor, setCursor] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [today] = useState(() => key(new Date()));

  if (!hydrated) return <><PageHeader title="Calendar" /><Skeleton className="h-[36rem] rounded-2xl" /></>;

  const nightsOf = (slug: string) => (db.packages ?? catalogue).find((p) => p.slug === slug)?.nights ?? 0;
  const trips: Trip[] = db.bookings
    .filter((b) => b.status !== "cancelled" && inView(view, b))
    .map((b) => ({ b, start: b.startDate, end: key(new Date(new Date(b.startDate).getTime() + nightsOf(b.packageSlug) * DAY)) }));

  const year = cursor.getFullYear(), month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first grid
  const daysIn = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((lead + daysIn) / 7) * 7 }, (_, i) => { const d = new Date(year, month, i - lead + 1); return { d, k: key(d), inMonth: d.getMonth() === month }; });
  const monthStart = key(first), monthEnd = key(new Date(year, month, daysIn));
  const inMonth = trips.filter((t) => t.start <= monthEnd && t.end >= monthStart).sort((a, b) => a.start.localeCompare(b.start));
  const departing = inMonth.filter((t) => t.start >= monthStart);
  const travellers = departing.reduce((n, t) => n + t.b.adults + t.b.children, 0);
  const shift = (n: number) => setCursor(new Date(year, month + n, 1));

  return (
    <div>
      <PageHeader title="Calendar" sub={`${departing.length} departure${departing.length === 1 ? "" : "s"} and ${travellers} traveller${travellers === 1 ? "" : "s"} in ${cursor.toLocaleDateString("en-IN", { month: "long" })}`}>
        <div className="flex items-center gap-1 rounded-full border bg-card p-1">
          <Button variant="ghost" size="icon-sm" aria-label="Previous month" onClick={() => shift(-1)}><ChevronLeft /></Button>
          <span className="min-w-32 text-center text-sm font-bold">{cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
          <Button variant="ghost" size="icon-sm" aria-label="Next month" onClick={() => shift(1)}><ChevronRight /></Button>
        </div>
        <Button variant="outline" className="h-9" onClick={() => { const d = new Date(); setCursor(new Date(d.getFullYear(), d.getMonth(), 1)); }}>Today</Button>
      </PageHeader>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="grid grid-cols-7 border-b bg-muted/50 text-center text-[0.7rem] font-bold tracking-wider text-muted-foreground uppercase">
          {weekdays.map((d) => <div key={d} className="py-2"><span className="sm:hidden">{d.slice(0, 1)}</span><span className="hidden sm:inline">{d}</span></div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map(({ d, k, inMonth: inside }) => {
            const here = trips.filter((t) => t.start <= k && t.end >= k);
            return (
              <div key={k} className={cn("min-h-16 border-r border-b p-1 last:border-r-0 sm:min-h-28 sm:p-1.5 [&:nth-child(7n)]:border-r-0", !inside && "bg-muted/40 text-muted-foreground")}>
                <span className={cn("grid size-6 place-items-center rounded-full text-xs font-semibold", k === today && "bg-primary text-primary-foreground")}>{d.getDate()}</span>
                {/* phones: dots; larger screens: trip chips */}
                <div className="mt-1 flex flex-wrap gap-0.5 sm:hidden">
                  {here.slice(0, 4).map((t) => <span key={t.b.id} className={cn("size-1.5 rounded-full", t.b.branch === "chennai" ? "bg-sky-500" : "bg-violet-500")} />)}
                </div>
                <ul className="mt-1 hidden space-y-0.5 sm:block">
                  {here.slice(0, 3).map((t) => {
                    const starts = t.start === k;
                    return (
                      <li key={t.b.id}>
                        <Link href={`/admin/bookings?q=${t.b.reference}`} title={`${t.b.packageTitle} · ${t.b.lead.name}`}
                          className={cn("block truncate rounded px-1.5 py-0.5 text-[0.68rem] leading-tight font-semibold transition hover:brightness-95",
                            t.b.branch === "chennai" ? "bg-sky-500/15 text-sky-800 dark:text-sky-200" : "bg-violet-500/15 text-violet-800 dark:text-violet-200",
                            !starts && "opacity-60")}>
                          {starts && <Plane className="mr-0.5 inline size-2.5" />}{t.b.packageTitle}
                        </Link>
                      </li>
                    );
                  })}
                  {here.length > 3 && <li className="px-1.5 text-[0.65rem] text-muted-foreground">+{here.length - 3} more</li>}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-500" />Pondicherry</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-sky-500" />Chennai</span>
        <span className="flex items-center gap-1.5"><Plane className="size-3" />Departure day; faded days are the rest of the trip</span>
      </p>

      <h2 className="mt-8 mb-3 font-sans text-sm font-extrabold">Trips this month</h2>
      {inMonth.length ? (
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {inMonth.map((t) => (
            <li key={t.b.id}>
              <Link href={`/admin/bookings?q=${t.b.reference}`} className="flex items-center gap-3 rounded-2xl border bg-card p-3 transition hover:border-primary">
                <span className="grid w-12 shrink-0 place-items-center rounded-lg bg-primary py-1 text-primary-foreground"><span className="text-[0.6rem] font-bold uppercase">{new Date(t.start).toLocaleDateString("en-IN", { month: "short" })}</span><span className="font-display text-xl leading-none font-extrabold">{new Date(t.start).getDate()}</span></span>
                <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{t.b.packageTitle}</span><span className="block truncate text-xs text-muted-foreground">{t.b.lead.name} · {t.b.adults + t.b.children} pax · back {new Date(t.end).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></span>
                <span className="flex shrink-0 flex-col items-end gap-1"><StatusBadge status={t.b.status} /><BranchBadge branch={t.b.branch} /></span>
              </Link>
            </li>
          ))}
        </ul>
      ) : <Empty icon={CalendarDays} title="No trips this month" sub="Confirmed and open bookings appear here by travel date." />}
    </div>
  );
}
