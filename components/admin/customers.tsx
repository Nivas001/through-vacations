"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDb, useHydrated } from "@/lib/data/store";
import { downloadCsv } from "@/lib/csv";
import { branchName, formatINR } from "@/lib/site";
import type { Booking, BranchId, Enquiry } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { inView, useBranchView } from "./branch-view";
import { BranchBadge, ContactActions, Empty, PageHeader, SearchBox, ago, labelCls, sortBy, when } from "./ui";

type Customer = { key: string; name: string; phone: string; email: string; city: string; branch?: BranchId; bookings: Booking[]; enquiries: Enquiry[]; value: number; last: string };

const keyOf = (phone: string, email: string) => phone.replace(/\D/g, "").slice(-10) || email.toLowerCase();

/** Customers are derived: one row per phone number (or email) across bookings and quote requests. */
function useCustomers(): Customer[] {
  const { bookings, enquiries } = useDb();
  return useMemo(() => {
    const map = new Map<string, Customer>();
    const get = (name: string, phone: string, email: string, city: string, branch?: BranchId) => {
      const k = keyOf(phone, email);
      if (!map.has(k)) map.set(k, { key: k, name, phone, email, city, branch, bookings: [], enquiries: [], value: 0, last: "" });
      return map.get(k)!;
    };
    for (const b of bookings) {
      const c = get(b.lead.name, b.lead.phone, b.lead.email, b.lead.city, b.branch);
      c.bookings.push(b);
      if (b.status !== "cancelled") c.value += b.estimate ?? 0;
      if (b.createdAt > c.last) c.last = b.createdAt;
    }
    for (const e of enquiries) {
      const c = get(e.name, e.phone, e.email, e.departureCity, e.branch);
      c.enquiries.push(e);
      if (e.createdAt > c.last) c.last = e.createdAt;
    }
    return [...map.values()];
  }, [bookings, enquiries]);
}

export function CustomersAdmin() {
  const all = useCustomers();
  const hydrated = useHydrated();
  const { view } = useBranchView();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"recent" | "value" | "trips">("recent");
  const [open, setOpen] = useState<string | null>(null);
  const scoped = all.filter((c) => inView(view, c));
  const filtered = scoped.filter((c) => !q || `${c.name} ${c.phone} ${c.email} ${c.city}`.toLowerCase().includes(q.toLowerCase()));
  const rows = sort === "value" ? sortBy(filtered, (c) => c.value, "desc") : sort === "trips" ? sortBy(filtered, (c) => c.bookings.length, "desc") : sortBy(filtered, (c) => c.last, "desc");
  const sel = all.find((c) => c.key === open);
  const repeat = scoped.filter((c) => c.bookings.length > 1).length;

  return (
    <div>
      <PageHeader title="Customers" sub={`${scoped.length} people · ${repeat} booked more than once`}>
        <Button variant="outline" className="h-9" disabled={!rows.length} onClick={() => downloadCsv("customers.csv", rows.map((c) => ({ name: c.name, phone: c.phone, email: c.email, city: c.city, office: branchName(c.branch), bookings: c.bookings.length, quote_requests: c.enquiries.length, value: c.value, last_contact: c.last })))}><Download /> Export</Button>
      </PageHeader>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Search name, phone, city…" />
        <select aria-label="Sort" className="h-9 rounded-lg border bg-background px-2.5 text-sm" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="recent">Most recent</option><option value="value">Highest value</option><option value="trips">Most trips</option>
        </select>
      </div>

      {hydrated && !rows.length ? <Empty icon={Users} title="No customers found" sub="Everyone who books or asks for a quote is listed here automatically." /> : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
            <Table>
              <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>City</TableHead><TableHead>Bookings</TableHead><TableHead>Requests</TableHead><TableHead className="text-right">Value</TableHead><TableHead>Office</TableHead><TableHead>Last contact</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.key} className="cursor-pointer" onClick={() => setOpen(c.key)}>
                    <TableCell><span className="block font-medium">{c.name}</span><span className="text-xs text-muted-foreground">{c.phone}</span></TableCell>
                    <TableCell>{c.city}</TableCell>
                    <TableCell>{c.bookings.length}</TableCell>
                    <TableCell>{c.enquiries.length}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.value ? formatINR(c.value) : "—"}</TableCell>
                    <TableCell><BranchBadge branch={c.branch} /></TableCell>
                    <TableCell className="text-muted-foreground">{ago(c.last)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ul className="grid grid-cols-1 gap-2 md:hidden">
            {rows.map((c) => (
              <li key={c.key}>
                <button type="button" onClick={() => setOpen(c.key)} className="flex w-full items-center gap-3 rounded-2xl border bg-card p-4 text-left">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground">{c.name.slice(0, 1)}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{c.name}</span><span className="block truncate text-xs text-muted-foreground">{c.city} · {c.bookings.length} bookings · {c.enquiries.length} requests</span></span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">{c.value ? formatINR(c.value) : ""}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <Sheet open={!!sel} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {sel && (
            <>
              <SheetHeader>
                <BranchBadge branch={sel.branch} className="w-fit" />
                <SheetTitle className="font-display text-3xl font-extrabold">{sel.name}</SheetTitle>
                <SheetDescription>{sel.city} · {sel.phone}{sel.email ? ` · ${sel.email}` : ""}</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-4 pb-8 text-sm">
                <ContactActions name={sel.name} phone={sel.phone} email={sel.email} message="greetings from Through Vacations!" />
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[["Bookings", sel.bookings.length], ["Requests", sel.enquiries.length], ["Value", sel.value ? formatINR(sel.value) : "—"]].map(([k, v]) => (
                    <div key={k as string} className="rounded-xl bg-muted p-3"><p className="truncate font-display text-xl font-extrabold">{v}</p><p className="text-xs text-muted-foreground">{k}</p></div>
                  ))}
                </div>
                {!!sel.bookings.length && (
                  <div><p className={labelCls}>Bookings</p>
                    <ul className="space-y-2">{sel.bookings.map((b) => (
                      <li key={b.id}><Link href={`/admin/bookings?status=${b.status}`} className="flex items-center justify-between gap-3 rounded-xl border p-3 hover:border-primary"><span className="min-w-0"><span className="block truncate font-semibold">{b.packageTitle}</span><span className="text-xs text-muted-foreground">{b.reference} · departs {when(b.startDate)}</span></span><StatusBadge status={b.status} /></Link></li>
                    ))}</ul>
                  </div>
                )}
                {!!sel.enquiries.length && (
                  <div><p className={labelCls}>Quote requests</p>
                    <ul className="space-y-2">{sel.enquiries.map((e) => (
                      <li key={e.id}><Link href={`/admin/enquiries?status=${e.status}`} className="flex items-center justify-between gap-3 rounded-xl border p-3 hover:border-primary"><span className="min-w-0"><span className="block truncate font-semibold">{e.destinations}</span><span className="text-xs text-muted-foreground">{e.reference} · {when(e.createdAt)}</span></span><StatusBadge status={e.status} /></Link></li>
                    ))}</ul>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
