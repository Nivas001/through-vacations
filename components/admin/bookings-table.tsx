"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRightLeft, CalendarCheck, Download, ExternalLink, MessageSquareText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bookingStatuses, deleteBooking, deleteEnquiry, enquiryStatuses, setFollowUp, updateBooking, updateEnquiry, useDb, useHydrated } from "@/lib/data/store";
import { downloadCsv } from "@/lib/csv";
import { branchName, formatINR } from "@/lib/site";
import type { Booking, BookingStatus, BranchId, Enquiry, EnquiryStatus } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { inView, useBranchView } from "./branch-view";
import { NewBookingDialog, type BookingPrefill } from "./new-booking-dialog";
import { PaymentsPanel, balanceOf } from "./payments";
import { FollowUpBadge, FollowUpPicker } from "./follow-up";
import { MessageTemplates, bookingTemplates, enquiryTemplates } from "./templates";
import { BranchBadge, ContactActions, Detail, Empty, PageHeader, SearchBox, StatusTabs, Timeline, ago, labelCls, selectCls, sortBy, sourceLabel, when } from "./ui";

const matches = (q: string, ...fields: (string | number | undefined)[]) => !q || fields.join(" ").toLowerCase().includes(q.toLowerCase());

const useQueryParam = () => useSearchParams().get("q") ?? "";

function useStatusParam<T extends string>(options: T[]) {
  const s = useSearchParams().get("status");
  return (options as string[]).includes(s ?? "") ? (s as T) : "all";
}

/* Bookings ------------------------------------------------------------------ */

type BookingSort = "newest" | "oldest" | "departure" | "value";

export function BookingsTable() {
  const { bookings } = useDb();
  const hydrated = useHydrated();
  const { view } = useBranchView();
  const [filter, setFilter] = useState<BookingStatus | "all">(useStatusParam(bookingStatuses));
  const [q, setQ] = useState(useQueryParam());
  const [sort, setSort] = useState<BookingSort>("newest");
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const scoped = bookings.filter((b) => inView(view, b));
  const counts = Object.fromEntries(bookingStatuses.map((s) => [s, scoped.filter((b) => b.status === s).length]));
  const rows = useMemo(() => {
    const r = scoped.filter((b) => (filter === "all" || b.status === filter) && matches(q, b.reference, b.lead.name, b.lead.phone, b.lead.email, b.packageTitle, b.lead.city));
    if (sort === "departure") return sortBy(r, (b) => b.startDate, "asc");
    if (sort === "value") return sortBy(r, (b) => b.estimate ?? 0, "desc");
    return sortBy(r, (b) => b.createdAt, sort === "newest" ? "desc" : "asc");
  }, [scoped, filter, q, sort]);
  const sel = bookings.find((b) => b.id === openId);

  return (
    <div>
      <PageHeader title="Bookings" sub={`${scoped.length} bookings${view === "all" ? " across both offices" : ` at ${branchName(view)}`}`}>
        <Button variant="outline" className="h-9" onClick={() => downloadCsv("bookings.csv", rows.map((b) => ({ reference: b.reference, status: b.status, office: branchName(b.branch), source: b.source ?? "", holiday: b.packageTitle, start: b.startDate, adults: b.adults, children: b.children, rooms: b.rooms, name: b.lead.name, email: b.lead.email, phone: b.lead.phone, city: b.lead.city, estimate: b.estimate ?? "", paid: (b.payments ?? []).reduce((n, p) => n + p.amount, 0), due: balanceOf(b), follow_up: b.followUp ?? "", created: b.createdAt })))} disabled={!rows.length}><Download /> Export</Button>
        <Button className="h-9" onClick={() => setCreating(true)}><Plus /> New booking</Button>
      </PageHeader>

      <div className="mb-4 space-y-3">
        <StatusTabs options={bookingStatuses} value={filter} onChange={setFilter} counts={counts} />
        <div className="flex flex-wrap items-center gap-2">
          <SearchBox value={q} onChange={setQ} placeholder="Search name, phone, reference…" />
          <select aria-label="Sort" className={selectCls + " normal-case"} value={sort} onChange={(e) => setSort(e.target.value as BookingSort)}>
            <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="departure">Departing soonest</option><option value="value">Highest value</option>
          </select>
        </div>
      </div>

      {hydrated && !rows.length ? (
        <Empty icon={CalendarCheck} title={q || filter !== "all" ? "No bookings match" : "No bookings yet"} sub={q || filter !== "all" ? "Try a different search or status." : "Website bookings and ones you add appear here."} />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
            <Table>
              <TableHeader><TableRow><TableHead>Traveller</TableHead><TableHead>Holiday</TableHead><TableHead>Departs</TableHead><TableHead className="text-right">Value</TableHead><TableHead>Office</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((b) => (
                  <TableRow key={b.id} className="cursor-pointer" onClick={() => setOpenId(b.id)}>
                    <TableCell><span className="block font-medium">{b.lead.name}</span><span className="font-mono text-xs text-muted-foreground">{b.reference} · {ago(b.createdAt)}</span></TableCell>
                    <TableCell>{b.packageTitle}<span className="block text-xs text-muted-foreground">{b.adults + b.children} travellers</span></TableCell>
                    <TableCell>{when(b.startDate)}</TableCell>
                    <TableCell className="text-right tabular-nums">{b.estimate ? formatINR(b.estimate) : "—"}{b.estimate && b.status !== "cancelled" ? <span className={"block text-xs " + (balanceOf(b) ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300")}>{balanceOf(b) ? `${formatINR(balanceOf(b))} due` : "Paid in full"}</span> : null}</TableCell>
                    <TableCell><BranchBadge branch={b.branch} /></TableCell>
                    <TableCell><span className="flex flex-col items-start gap-1"><StatusBadge status={b.status} /><FollowUpBadge date={b.followUp} /></span></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ul className="grid grid-cols-1 gap-2 md:hidden">
            {rows.map((b) => (
              <li key={b.id}>
                <button type="button" onClick={() => setOpenId(b.id)} className="w-full rounded-2xl border bg-card p-4 text-left transition active:scale-[0.99]">
                  <span className="flex items-start justify-between gap-3"><span className="min-w-0"><span className="block truncate font-semibold">{b.lead.name}</span><span className="block truncate text-sm text-muted-foreground">{b.packageTitle}</span></span><StatusBadge status={b.status} /></span>
                  <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><span>Departs {when(b.startDate)}</span><span>{b.adults + b.children} pax</span>{b.estimate ? <span className="font-semibold text-foreground">{formatINR(b.estimate)}</span> : null}<BranchBadge branch={b.branch} /><FollowUpBadge date={b.followUp} /></span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <Sheet open={!!sel} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">{sel && <BookingDetail key={sel.id} b={sel} onDeleted={() => setOpenId(null)} />}</SheetContent>
      </Sheet>
      <NewBookingDialog open={creating} onOpenChange={setCreating} defaultBranch={view === "all" ? "pondicherry" : view} />
    </div>
  );
}

function BookingDetail({ b, onDeleted }: { b: Booking; onDeleted: () => void }) {
  const [notes, setNotes] = useState(b.internalNotes);
  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2"><StatusBadge status={b.status} /><BranchBadge branch={b.branch} /></div>
        <SheetTitle className="font-display text-3xl font-extrabold">{b.lead.name}</SheetTitle>
        <SheetDescription><span className="font-mono">{b.reference}</span> · {b.packageTitle} · received {when(b.createdAt)}</SheetDescription>
      </SheetHeader>
      <div className="space-y-6 px-4 pb-8 text-sm">
        <ContactActions name={b.lead.name} phone={b.lead.phone} email={b.lead.email} message={`thank you for choosing Through Vacations for ${b.packageTitle}. Your booking reference is ${b.reference}.`} />
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className={labelCls}>Status</span>
            <select className={selectCls + " w-full"} value={b.status} onChange={(e) => { const s = e.target.value as BookingStatus; updateBooking(b.id, { status: s }, `Status changed to ${s}`); toast.success(`Marked ${s}`); }}>{bookingStatuses.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="block"><span className={labelCls}>Office</span>
            <select className={selectCls + " w-full"} value={b.branch ?? ""} onChange={(e) => { const br = e.target.value as BranchId; updateBooking(b.id, { branch: br }, `Moved to the ${branchName(br)} office`); toast.success(`Assigned to ${branchName(br)}`); }}>
              <option value="pondicherry">Pondicherry</option><option value="chennai">Chennai</option>
            </select>
          </label>
        </div>
        <PaymentsPanel b={b} />
        <FollowUpPicker value={b.followUp} onChange={(d, note) => setFollowUp("booking", b.id, d, note)} />
        <MessageTemplates phone={b.lead.phone} templates={bookingTemplates(b)} />
        <Detail rows={[
          ["Holiday", <Link key="h" href={`/packages/${b.packageSlug}`} target="_blank" className="inline-flex items-center gap-1 text-brand hover:underline">{b.packageTitle}<ExternalLink className="size-3" /></Link>],
          ["Departs", when(b.startDate)],
          ["Party", `${b.adults} adults${b.children ? `, ${b.children} children` : ""}`],
          ["Rooms", String(b.rooms)],
          ["Value", b.estimate ? formatINR(b.estimate) : "On quote"],
          ["Came through", sourceLabel(b.source)],
          ["Phone", b.lead.phone],
          ["Email", b.lead.email || "—"],
          ["From", `${b.lead.city}, ${b.lead.country}`],
          ["Add-ons", b.addOns.join(", ") || "None"],
        ]} />
        {b.notes && <div className="rounded-xl bg-muted p-3"><p className={labelCls}>Customer note</p><p>{b.notes}</p></div>}
        <label className="block"><span className={labelCls}>Internal notes</span><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only the team sees this" /></label>
        <Button disabled={notes === b.internalNotes} onClick={() => { updateBooking(b.id, { internalNotes: notes }, "Internal note updated"); toast.success("Notes saved"); }}>Save notes</Button>
        <Timeline items={b.history} />
        <DeleteButton noun="booking" onConfirm={() => { deleteBooking(b.id); onDeleted(); toast.success(`Booking ${b.reference} deleted`); }} />
      </div>
    </>
  );
}

/* Quote requests ------------------------------------------------------------ */

export function EnquiriesTable() {
  const { enquiries } = useDb();
  const hydrated = useHydrated();
  const { view } = useBranchView();
  const [filter, setFilter] = useState<EnquiryStatus | "all">(useStatusParam(enquiryStatuses));
  const [q, setQ] = useState(useQueryParam());
  const [openId, setOpenId] = useState<string | null>(null);
  const [convert, setConvert] = useState<{ id: string; prefill: BookingPrefill } | null>(null);

  const scoped = enquiries.filter((e) => inView(view, e));
  const counts = Object.fromEntries(enquiryStatuses.map((s) => [s, scoped.filter((e) => e.status === s).length]));
  const rows = sortBy(scoped.filter((e) => (filter === "all" || e.status === filter) && matches(q, e.reference, e.name, e.phone, e.email, e.destinations, e.departureCity)), (e) => e.createdAt, "desc");
  const sel = enquiries.find((e) => e.id === openId);

  return (
    <div>
      <PageHeader title="Quote requests" sub="Tailor-made trip requests from the website and the desks.">
        <Button variant="outline" className="h-9" disabled={!rows.length} onClick={() => downloadCsv("quote-requests.csv", rows.map((e) => ({ reference: e.reference, status: e.status, office: branchName(e.branch), source: e.source ?? "", name: e.name, email: e.email, phone: e.phone, from: `${e.departureCity} ${e.departureCountry}`, destinations: e.destinations, dates: e.dates, travellers: e.travellers, budget: `${e.budget} ${e.currency}`, created: e.createdAt })))}><Download /> Export</Button>
      </PageHeader>

      <div className="mb-4 space-y-3">
        <StatusTabs options={enquiryStatuses} value={filter} onChange={setFilter} counts={counts} />
        <SearchBox value={q} onChange={setQ} placeholder="Search name, destination, phone…" />
      </div>

      {hydrated && !rows.length ? (
        <Empty icon={MessageSquareText} title={q || filter !== "all" ? "No requests match" : "No quote requests yet"} sub="Requests from the Plan a trip form appear here." />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Wants</TableHead><TableHead>When</TableHead><TableHead>Pax</TableHead><TableHead>Office</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((e) => (
                  <TableRow key={e.id} className="cursor-pointer" onClick={() => setOpenId(e.id)}>
                    <TableCell><span className="block font-medium">{e.name}</span><span className="font-mono text-xs text-muted-foreground">{e.reference} · {ago(e.createdAt)}</span></TableCell>
                    <TableCell className="max-w-[16rem] truncate">{e.destinations}</TableCell>
                    <TableCell className="max-w-[10rem] truncate">{e.dates || "—"}</TableCell>
                    <TableCell>{e.travellers}</TableCell>
                    <TableCell><BranchBadge branch={e.branch} /></TableCell>
                    <TableCell><span className="flex flex-col items-start gap-1"><StatusBadge status={e.status} /><FollowUpBadge date={e.followUp} /></span></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ul className="grid grid-cols-1 gap-2 md:hidden">
            {rows.map((e) => (
              <li key={e.id}>
                <button type="button" onClick={() => setOpenId(e.id)} className="w-full rounded-2xl border bg-card p-4 text-left transition active:scale-[0.99]">
                  <span className="flex items-start justify-between gap-3"><span className="min-w-0"><span className="block truncate font-semibold">{e.name}</span><span className="block truncate text-sm text-muted-foreground">{e.destinations}</span></span><StatusBadge status={e.status} /></span>
                  <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><span>{ago(e.createdAt)}</span><span>{e.travellers} pax</span>{e.dates && <span className="truncate">{e.dates}</span>}<BranchBadge branch={e.branch} /><FollowUpBadge date={e.followUp} /></span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <Sheet open={!!sel} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {sel && <EnquiryDetail key={sel.id} e={sel} onDeleted={() => setOpenId(null)} onConvert={() => setConvert({ id: sel.id, prefill: { name: sel.name, email: sel.email, phone: sel.phone, city: sel.departureCity, adults: sel.travellers, branch: sel.branch, notes: `From quote ${sel.reference}: ${sel.destinations}. ${sel.notes}`.trim(), source: sel.source } })} />}
        </SheetContent>
      </Sheet>
      <NewBookingDialog open={!!convert} onOpenChange={(o) => !o && setConvert(null)} prefill={convert?.prefill} defaultBranch={view === "all" ? "pondicherry" : view}
        onCreated={(b) => { if (convert) updateEnquiry(convert.id, { status: "won" }, `Converted to booking ${b.reference}`); setOpenId(null); }} />
    </div>
  );
}

function EnquiryDetail({ e, onDeleted, onConvert }: { e: Enquiry; onDeleted: () => void; onConvert: () => void }) {
  const [notes, setNotes] = useState(e.internalNotes);
  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2"><StatusBadge status={e.status} /><BranchBadge branch={e.branch} /></div>
        <SheetTitle className="font-display text-3xl font-extrabold">{e.name}</SheetTitle>
        <SheetDescription><span className="font-mono">{e.reference}</span> · received {when(e.createdAt)}</SheetDescription>
      </SheetHeader>
      <div className="space-y-6 px-4 pb-8 text-sm">
        <ContactActions name={e.name} phone={e.phone} email={e.email} message={`thanks for your Through Vacations quote request (${e.reference}) for ${e.destinations}. I'm putting options together for you.`} />
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className={labelCls}>Status</span>
            <select className={selectCls + " w-full"} value={e.status} onChange={(ev) => { const s = ev.target.value as EnquiryStatus; updateEnquiry(e.id, { status: s }, `Status changed to ${s}`); toast.success(`Marked ${s}`); }}>{enquiryStatuses.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="block"><span className={labelCls}>Office</span>
            <select className={selectCls + " w-full"} value={e.branch ?? ""} onChange={(ev) => { const br = ev.target.value as BranchId; updateEnquiry(e.id, { branch: br }, `Moved to the ${branchName(br)} office`); toast.success(`Assigned to ${branchName(br)}`); }}>
              <option value="pondicherry">Pondicherry</option><option value="chennai">Chennai</option>
            </select>
          </label>
        </div>
        {e.status !== "won" && e.status !== "closed" && (
          <Button variant="outline" className="w-full border-primary text-brand" onClick={onConvert}><ArrowRightLeft /> Convert to booking</Button>
        )}
        <FollowUpPicker value={e.followUp} onChange={(d, note) => setFollowUp("enquiry", e.id, d, note)} />
        <MessageTemplates phone={e.phone} templates={enquiryTemplates(e)} />
        <Detail rows={[
          ["Wants", e.destinations],
          ["Dates", `${e.dates || "—"}${e.flexibleDates ? " (flexible)" : ""}`],
          ["Travellers", String(e.travellers)],
          ["Budget pp", e.budget ? `${e.budget} ${e.currency}` : "Not given"],
          ["Style", e.styles.join(", ") || "—"],
          ["Came through", sourceLabel(e.source)],
          ["Phone", e.phone],
          ["Email", e.email],
          ["From", `${e.departureCity}, ${e.departureCountry}`],
        ]} />
        {e.notes && <div className="rounded-xl bg-muted p-3"><p className={labelCls}>Their note</p><p>{e.notes}</p></div>}
        <label className="block"><span className={labelCls}>Internal notes</span><Textarea rows={3} value={notes} onChange={(ev) => setNotes(ev.target.value)} placeholder="Only the team sees this" /></label>
        <Button disabled={notes === e.internalNotes} onClick={() => { updateEnquiry(e.id, { internalNotes: notes }, "Internal note updated"); toast.success("Notes saved"); }}>Save notes</Button>
        <Timeline items={e.history} />
        <DeleteButton noun="request" onConfirm={() => { deleteEnquiry(e.id); onDeleted(); toast.success(`Request ${e.reference} deleted`); }} />
      </div>
    </>
  );
}

export function DeleteButton({ noun, onConfirm }: { noun: string; onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-3">
      <p className="flex-1 text-sm">Delete this {noun}? This cannot be undone.</p>
      <Button variant="ghost" size="sm" onClick={() => setArmed(false)}>Keep</Button>
      <Button variant="destructive" size="sm" onClick={onConfirm}>Delete</Button>
    </div>
  ) : (
    <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setArmed(true)}><Trash2 /> Delete {noun}</Button>
  );
}
