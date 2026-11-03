"use client";
import { useState } from "react";
import { Clock, ExternalLink, MapPin, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { saveBranch, useDb, useHydrated } from "@/lib/data/store";
import { formatINR, mapEmbed, mapLink } from "@/lib/site";
import type { Branch } from "@/lib/types";
import { BranchBadge, PageHeader } from "./ui";

const won = ["confirmed", "paid", "completed"];

export function BranchesAdmin() {
  const db = useDb();
  const hydrated = useHydrated();
  return (
    <div>
      <PageHeader title="Offices" sub="Details for Pondicherry and Chennai. These feed the Contact page once the database is connected." />
      {!hydrated ? <div className="grid gap-6 xl:grid-cols-2"><Skeleton className="h-[40rem] rounded-2xl" /><Skeleton className="h-[40rem] rounded-2xl" /></div> : (
        <div className="grid gap-6 xl:grid-cols-2">
          {db.branches.map((b) => {
            const bookings = db.bookings.filter((x) => x.branch === b.id);
            const enquiries = db.enquiries.filter((x) => x.branch === b.id);
            return (
              <BranchCard key={b.id} branch={b} stats={[
                ["Bookings", bookings.length],
                ["Requests", enquiries.length],
                ["Confirmed", formatINR(bookings.filter((x) => won.includes(x.status)).reduce((n, x) => n + (x.estimate ?? 0), 0))],
              ]} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function BranchCard({ branch, stats }: { branch: Branch; stats: [string, React.ReactNode][] }) {
  const [v, setV] = useState(branch);
  const dirty = JSON.stringify(v) !== JSON.stringify(branch);
  const set = (k: keyof Branch, val: string) => setV((x) => ({ ...x, [k]: val }));
  const query = v.address ? `${v.address}, ${v.city}` : v.mapQuery;

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border bg-card">
      <div className="relative h-48 bg-muted">
        <iframe title={`Map of the ${v.name} office`} src={mapEmbed(query)} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><BranchBadge branch={branch.id} /><h2 className="mt-2 font-display text-3xl font-extrabold">{v.name} office</h2></div>
          <a href={mapLink(query)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">Open in Maps <ExternalLink className="size-3.5" /></a>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          {stats.map(([k, val]) => <div key={k} className="min-w-0 rounded-xl bg-muted p-3"><dd className="truncate font-display text-xl font-extrabold">{val}</dd><dt className="text-xs text-muted-foreground">{k}</dt></div>)}
        </dl>
        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); saveBranch(v); toast.success(`${v.name} office saved`); }}>
          <F label="Street address" icon={MapPin} className="sm:col-span-2"><Input value={v.address} placeholder="Leave blank to show “Visits by appointment”" onChange={(e) => set("address", e.target.value)} /></F>
          <F label="City"><Input value={v.city} onChange={(e) => set("city", e.target.value)} /></F>
          <F label="Opening hours" icon={Clock}><Input value={v.hours} onChange={(e) => set("hours", e.target.value)} /></F>
          <F label="Phone" icon={Phone}><Input value={v.phone} onChange={(e) => set("phone", e.target.value)} /></F>
          <F label="WhatsApp (digits with country code)"><Input inputMode="numeric" value={v.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))} /></F>
          <F label="Email"><Input type="email" value={v.email} onChange={(e) => set("email", e.target.value)} /></F>
          <F label="Office lead" icon={UserRound}><Input value={v.manager} placeholder="Who runs this desk" onChange={(e) => set("manager", e.target.value)} /></F>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={!dirty}>Save office</Button>
            {dirty && <Button type="button" variant="ghost" onClick={() => setV(branch)}>Discard</Button>}
          </div>
        </form>
      </div>
    </section>
  );
}

function F({ label, icon: Icon, children, className }: { label: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode; className?: string }) {
  return <label className={"block min-w-0 space-y-1.5 " + (className ?? "")}><span className="flex items-center gap-1.5 text-sm leading-none font-medium">{Icon && <Icon className="size-3.5 text-muted-foreground" />}{label}</span>{children}</label>;
}
