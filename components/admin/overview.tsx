"use client";
import Link from "next/link";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, BellRing, CalendarCheck, IndianRupee, Inbox, Plane, Plus, TrendingDown, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/admin-auth";
import { useDb, useHydrated } from "@/lib/data/store";
import { branchName, formatINR } from "@/lib/site";
import type { BranchId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { inView, useBranchView } from "./branch-view";
import { NewBookingDialog } from "./new-booking-dialog";
import { BranchBadge, Kpi, ago, sourceLabel, when } from "./ui";
import { balanceOf, paidOf } from "./payments";
import { FollowUpBadge, followState } from "./follow-up";

const DAY = 864e5;
const won = ["confirmed", "paid", "completed"];
const compact = (n: number) => (n >= 1e5 ? `₹${(n / 1e5).toFixed(n >= 1e6 ? 1 : 2).replace(/\.?0+$/, "")}L` : formatINR(n));

export function Overview() {
  const db = useDb();
  const hydrated = useHydrated();
  const session = useSession();
  const { view } = useBranchView();
  const [now] = useState(() => Date.now());
  const [creating, setCreating] = useState(false);

  if (!hydrated) return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}<Skeleton className="h-80 rounded-2xl sm:col-span-2 xl:col-span-4" /></div>;

  const bookings = db.bookings.filter((b) => inView(view, b));
  const enquiries = db.enquiries.filter((e) => inView(view, e));
  const messages = db.messages.filter((m) => inView(view, m));
  const inLast = (iso: string, from: number, to = 0) => { const t = new Date(iso).getTime(); return t > now - from * DAY && t <= now - to * DAY; };

  const leadsThis = bookings.filter((b) => inLast(b.createdAt, 7)).length + enquiries.filter((e) => inLast(e.createdAt, 7)).length;
  const leadsPrev = bookings.filter((b) => inLast(b.createdAt, 14, 7)).length + enquiries.filter((e) => inLast(e.createdAt, 14, 7)).length;
  const confirmedValue = bookings.filter((b) => won.includes(b.status)).reduce((n, b) => n + (b.estimate ?? 0), 0);
  const pipeline = bookings.filter((b) => ["new", "contacted"].includes(b.status)).reduce((n, b) => n + (b.estimate ?? 0), 0);
  const decided = enquiries.filter((e) => e.status === "won" || e.status === "closed");
  const winRate = decided.length ? Math.round((enquiries.filter((e) => e.status === "won").length / decided.length) * 100) : null;
  const collected = bookings.reduce((n, b) => n + paidOf(b), 0);
  const outstanding = bookings.filter((b) => ["confirmed", "paid", "completed"].includes(b.status)).reduce((n, b) => n + balanceOf(b), 0);
  const follows = [
    ...bookings.filter((b) => b.followUp && !["completed", "cancelled"].includes(b.status)).map((b) => ({ id: b.id, date: b.followUp!, title: b.lead.name, sub: `Booking · ${b.packageTitle}`, href: `/admin/bookings?q=${b.reference}` })),
    ...enquiries.filter((e) => e.followUp && !["won", "closed"].includes(e.status)).map((e) => ({ id: e.id, date: e.followUp!, title: e.name, sub: `Quote · ${e.destinations}`, href: `/admin/enquiries?q=${e.reference}` })),
  ].filter((f) => followState(f.date) !== "later").sort((a, b) => a.date.localeCompare(b.date));
  const dueNow = follows.filter((f) => ["overdue", "today"].includes(followState(f.date) ?? "")).length;
  const toAction = bookings.filter((b) => b.status === "new").length + enquiries.filter((e) => e.status === "new").length + messages.filter((m) => m.status === "new").length;

  const weeks = Array.from({ length: 8 }, (_, i) => {
    const to = (7 - i) * 7;
    const start = new Date(now - (to + 7) * DAY + DAY);
    return {
      week: start.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      Bookings: bookings.filter((b) => inLast(b.createdAt, to + 7, to)).length,
      "Quote requests": enquiries.filter((e) => inLast(e.createdAt, to + 7, to)).length,
    };
  });

  const byDest = Object.entries(bookings.filter((b) => b.status !== "cancelled").reduce<Record<string, number>>((m, b) => ({ ...m, [b.packageTitle]: (m[b.packageTitle] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const sources = Object.entries([...bookings, ...enquiries].reduce<Record<string, number>>((m, r) => ({ ...m, [r.source ?? "website"]: (m[r.source ?? "website"] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
  const today = new Date(now).toISOString().slice(0, 10);
  const soon = new Date(now + 45 * DAY).toISOString().slice(0, 10);
  const departures = bookings.filter((b) => ["confirmed", "paid"].includes(b.status) && b.startDate >= today && b.startDate <= soon).sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, 6);
  const inbox = [
    ...bookings.filter((b) => b.status === "new").map((b) => ({ id: b.id, at: b.createdAt, title: b.lead.name, sub: `Booking · ${b.packageTitle}`, href: "/admin/bookings?status=new", status: b.status, branch: b.branch })),
    ...enquiries.filter((e) => e.status === "new").map((e) => ({ id: e.id, at: e.createdAt, title: e.name, sub: `Quote · ${e.destinations}`, href: "/admin/enquiries?status=new", status: e.status, branch: e.branch })),
    ...messages.filter((m) => m.status === "new").map((m) => ({ id: m.id, at: m.createdAt, title: m.name, sub: `Message · ${m.subject}`, href: "/admin/messages", status: m.status, branch: m.branch })),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6);

  const hour = new Date(now).getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const delta = leadsThis - leadsPrev;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{new Date(now).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{greet}{session?.role === "owner" ? "" : `, ${session?.name}`}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{toAction ? `${toAction} new item${toAction > 1 ? "s" : ""}` : "No new items"}{dueNow ? ` · ${dueNow} follow-up${dueNow > 1 ? "s" : ""} due` : ""} · {view === "all" ? "both offices" : `${branchName(view)} office`}</p>
        </div>
        <Button className="h-9" onClick={() => setCreating(true)}><Plus /> New booking</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon={Users} label="New leads, 7 days" value={leadsThis} hint={delta === 0 ? "Same as the week before" : `${delta > 0 ? "+" : ""}${delta} vs the week before`} />
        <Kpi icon={IndianRupee} tone="emerald" label="Confirmed value" value={compact(confirmedValue)} hint={`${compact(pipeline)} more in open bookings`} />
        <Kpi icon={Wallet} tone="sun" label="Collected" value={compact(collected)} hint={outstanding ? `${compact(outstanding)} still due on confirmed trips` : "Nothing outstanding"} />
        <Kpi icon={winRate !== null && winRate < 50 ? TrendingDown : CalendarCheck} tone="rose" label="Quote win rate" value={winRate === null ? "—" : `${winRate}%`} hint={`${decided.length} decided requests`} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Leads per week" sub="Last 8 weeks, by the week they arrived">
          <div className="mb-2 flex gap-4 text-xs text-muted-foreground" aria-hidden>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[var(--series-1)]" />Bookings</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[var(--series-2)]" />Quote requests</span>
          </div>
          <div className="h-64" role="img" aria-label={`Stacked bar chart of bookings and quote requests per week. ${weeks.map((w) => `${w.week}: ${w.Bookings} bookings, ${w["Quote requests"]} requests`).join("; ")}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeks} margin={{ left: -18, right: 4, top: 4 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} interval="preserveStartEnd" tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} width={40} tick={{ fill: "var(--muted-foreground)" }} />
                <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.6 }} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)", color: "var(--popover-foreground)", fontSize: 12 }} labelFormatter={(l) => `Week of ${l}`} />
                <Bar dataKey="Bookings" stackId="a" fill="var(--series-1)" stroke="var(--card)" strokeWidth={2} maxBarSize={36} isAnimationActive={false} />
                <Bar dataKey="Quote requests" stackId="a" fill="var(--series-2)" stroke="var(--card)" strokeWidth={2} radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Needs attention" action={<Link href="/admin/bookings?status=new" className="text-sm font-semibold text-brand">Open</Link>}>
          {inbox.length ? (
            <ul className="-mx-2 divide-y">
              {inbox.map((r) => (
                <li key={r.id}>
                  <Link href={r.href} className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-muted">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">{r.title.slice(0, 1)}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{r.title}</span><span className="block truncate text-xs text-muted-foreground">{r.sub}</span></span>
                    <span className="shrink-0 text-xs text-muted-foreground">{ago(r.at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="py-10 text-center text-sm text-muted-foreground">Nothing new. Nice work.</p>}
        </Card>
      </div>

      {view === "all" && <OfficeSplit db={db} now={now} />}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Follow-ups" sub="Overdue, today and the next 7 days">
          {follows.length ? (
            <ul className="-mx-2 divide-y">
              {follows.slice(0, 6).map((f) => (
                <li key={f.id}>
                  <Link href={f.href} className="flex items-center gap-2 rounded-lg px-2 py-2.5 transition hover:bg-muted">
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{f.title}</span><span className="block truncate text-xs text-muted-foreground">{f.sub}</span></span>
                    <FollowUpBadge date={f.date} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <Quiet icon={BellRing} text="No follow-ups due. Set one from any booking or request." />}
        </Card>
        <Card title="Upcoming departures" sub="Confirmed and paid, next 45 days" action={<Link href="/admin/bookings" className="text-sm font-semibold text-brand">All</Link>}>
          {departures.length ? (
            <ul className="space-y-2">
              {departures.map((b) => {
                const days = Math.round((new Date(b.startDate).getTime() - now) / DAY);
                return (
                  <li key={b.id} className="flex items-center gap-3 rounded-xl border p-2.5">
                    <span className="grid w-12 shrink-0 place-items-center rounded-lg bg-primary py-1 text-primary-foreground"><span className="text-[0.6rem] font-bold uppercase">{new Date(b.startDate).toLocaleDateString("en-IN", { month: "short" })}</span><span className="font-display text-xl leading-none font-extrabold">{new Date(b.startDate).getDate()}</span></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{b.packageTitle}</span><span className="block truncate text-xs text-muted-foreground">{b.lead.name} · {b.adults + b.children} pax</span></span>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-bold", days <= 7 ? "bg-rose-500/12 text-rose-600 dark:text-rose-300" : "bg-muted text-muted-foreground")}>{days <= 0 ? "Today" : `${days}d`}</span>
                  </li>
                );
              })}
            </ul>
          ) : <Quiet icon={Plane} text="No confirmed departures in the next 45 days." />}
        </Card>

        <Card title="Most booked" sub="Bookings by holiday, excluding cancelled">
          <BarList rows={byDest.map(([k, v]) => ({ label: k, value: v }))} unit="booking" />
        </Card>

        <Card title="Where leads come from" sub="Bookings and quote requests">
          <BarList rows={sources.map(([k, v]) => ({ label: sourceLabel(k), value: v }))} unit="lead" />
        </Card>
      </div>

      <Card title="Latest bookings" action={<Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-semibold text-brand">View all <ArrowUpRight className="size-3.5" /></Link>}>
        <ul className="-mx-2 divide-y">
          {[...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map((b) => (
            <li key={b.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2 py-3 text-sm">
              <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{b.lead.name}</span><span className="block truncate text-muted-foreground">{b.packageTitle} · departs {when(b.startDate)}</span></span>
              <BranchBadge branch={b.branch} className="hidden sm:inline-flex" />
              <span className="w-24 text-right tabular-nums">{b.estimate ? formatINR(b.estimate) : "—"}</span>
              <StatusBadge status={b.status} />
            </li>
          ))}
        </ul>
      </Card>

      <NewBookingDialog open={creating} onOpenChange={setCreating} defaultBranch={view === "all" ? "pondicherry" : view} />
    </div>
  );
}

function OfficeSplit({ db, now }: { db: ReturnType<typeof useDb>; now: number }) {
  const offices: BranchId[] = ["pondicherry", "chennai"];
  const stats = offices.map((id) => {
    const b = db.bookings.filter((x) => x.branch === id);
    const e = db.enquiries.filter((x) => x.branch === id);
    return {
      id,
      leads30: [...b, ...e].filter((x) => new Date(x.createdAt).getTime() > now - 30 * DAY).length,
      confirmed: b.filter((x) => won.includes(x.status)).reduce((n, x) => n + (x.estimate ?? 0), 0),
      open: b.filter((x) => ["new", "contacted"].includes(x.status)).length + e.filter((x) => ["new", "contacted", "quoted"].includes(x.status)).length,
      unread: db.messages.filter((m) => m.branch === id && m.status === "new").length,
    };
  });
  const maxValue = Math.max(1, ...stats.map((s) => s.confirmed));
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((s) => (
        <Link key={s.id} href="/admin/branches" className="group rounded-2xl border bg-card p-5 transition hover:border-primary">
          <div className="flex items-center justify-between gap-3"><BranchBadge branch={s.id} /><ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-brand" /></div>
          <p className="mt-3 font-display text-2xl font-extrabold">{branchName(s.id)} office</p>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div><dt className="text-xs text-muted-foreground">Leads, 30d</dt><dd className="font-display text-2xl font-extrabold">{s.leads30}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Open</dt><dd className="font-display text-2xl font-extrabold">{s.open}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Unread</dt><dd className="font-display text-2xl font-extrabold">{s.unread}</dd></div>
          </dl>
          <div className="mt-4">
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Confirmed value</span><span className="font-semibold">{compact(s.confirmed)}</span></div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(s.confirmed / maxValue) * 100}%` }} /></div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function Card({ title, sub, action, children }: { title: string; sub?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0"><h2 className="font-sans text-sm font-extrabold">{title}</h2>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</div>
        {action}
      </div>
      {children}
    </section>
  );
}

function BarList({ rows, unit, capitalize }: { rows: { label: string; value: number }[]; unit: string; capitalize?: boolean }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <Quiet icon={Inbox} text="No data yet." />;
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${r.value} ${unit}${r.value === 1 ? "" : "s"}`}>
          <div className="flex justify-between gap-3 text-sm"><span className={cn("truncate", capitalize && "capitalize")}>{r.label}</span><span className="font-semibold tabular-nums">{r.value}</span></div>
          <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-[var(--series-1)]" style={{ width: `${(r.value / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

function Quiet({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return <p className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground"><Icon className="size-5" />{text}</p>;
}

