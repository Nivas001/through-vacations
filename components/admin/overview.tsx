"use client";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, IndianRupee, MessageSquareText, Sparkles } from "lucide-react";
import { bookingStatuses, useDb } from "@/lib/data/store";
import { formatINR } from "@/lib/site";
import { StatusBadge } from "./status-badge";

export function Overview() {
  const { bookings, enquiries } = useDb();
  const open = bookings.filter((b) => !["completed", "cancelled"].includes(b.status)).length;
  const pipeline = bookings.filter((b) => b.estimate && b.status !== "cancelled").reduce((n, b) => n + (b.estimate ?? 0), 0);
  const data = bookingStatuses.map((s) => ({ status: s, count: bookings.filter((b) => b.status === s).length }));
  const kpis = [
    { icon: Sparkles, k: "New bookings", v: bookings.filter((b) => b.status === "new").length },
    { icon: CalendarCheck, k: "Open bookings", v: open },
    { icon: MessageSquareText, k: "New quote requests", v: enquiries.filter((e) => e.status === "new").length },
    { icon: IndianRupee, k: "Indicative pipeline", v: formatINR(pipeline) },
  ];
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ icon: Icon, k, v }) => (
          <div key={k} className="rounded-2xl border bg-card p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-brand"><Icon className="size-5" /></span>
            <p className="mt-4 font-display text-4xl font-extrabold">{v}</p>
            <p className="text-sm text-muted-foreground">{k}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="font-sans text-sm font-extrabold">Bookings by stage</h2>
          <div className="mt-4 h-64" role="img" aria-label="Bar chart of bookings by status">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="status" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={24} />
                <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Bar dataKey="count" fill="var(--chart-2)" radius={[8, 8, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between"><h2 className="font-sans text-sm font-extrabold">Latest bookings</h2><Link href="/admin/bookings" className="text-sm text-brand">View all</Link></div>
          <ul className="mt-3 divide-y">
            {bookings.slice(0, 5).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span><span className="block font-medium">{b.lead.name}</span><span className="text-muted-foreground">{b.packageTitle} · {b.reference}</span></span>
                <StatusBadge status={b.status} />
              </li>
            ))}
            {!bookings.length && <li className="py-6 text-center text-sm text-muted-foreground">No bookings yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
