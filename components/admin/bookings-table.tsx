"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bookingStatuses, enquiryStatuses, updateBooking, updateEnquiry, useDb } from "@/lib/data/store";
import { downloadCsv } from "@/lib/csv";
import { formatINR } from "@/lib/site";
import type { Booking, BookingStatus, Enquiry, EnquiryStatus } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { toast } from "sonner";

const when = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });
const selectCls = "h-9 rounded-lg border bg-background px-2.5 text-sm capitalize";

export function BookingsTable() {
  const { bookings } = useDb();
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = bookings.filter((b) => filter === "all" || b.status === filter);
  const sel = bookings.find((b) => b.id === openId);

  return (
    <div>
      <Toolbar count={rows.length} noun="bookings" filter={filter} onFilter={(v) => setFilter(v as never)} options={bookingStatuses}
        onExport={() => downloadCsv("bookings.csv", rows.map((b) => ({ reference: b.reference, status: b.status, holiday: b.packageTitle, start: b.startDate, adults: b.adults, children: b.children, rooms: b.rooms, name: b.lead.name, email: b.lead.email, phone: b.lead.phone, city: b.lead.city, estimate: b.estimate ?? "", created: b.createdAt })))} />
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Ref</TableHead><TableHead>Traveller</TableHead><TableHead>Holiday</TableHead><TableHead>Start</TableHead><TableHead>Pax</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((b) => (
              <TableRow key={b.id} className="cursor-pointer" onClick={() => setOpenId(b.id)}>
                <TableCell className="font-mono text-xs">{b.reference}</TableCell>
                <TableCell className="font-medium">{b.lead.name}</TableCell>
                <TableCell>{b.packageTitle}</TableCell>
                <TableCell>{when(b.startDate)}</TableCell>
                <TableCell>{b.adults + b.children}</TableCell>
                <TableCell><StatusBadge status={b.status} /></TableCell>
              </TableRow>
            ))}
            {!rows.length && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No bookings.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Sheet open={!!sel} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          {sel && <BookingDetail b={sel} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function BookingDetail({ b }: { b: Booking }) {
  const [notes, setNotes] = useState(b.internalNotes);
  return (
    <>
      <SheetHeader><SheetTitle className="font-display text-3xl">{b.reference}</SheetTitle><SheetDescription>{b.packageTitle} · requested {when(b.createdAt)}</SheetDescription></SheetHeader>
      <div className="space-y-5 px-4 pb-6 text-sm">
        <label className="block"><span className="mb-1.5 block text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Status</span>
          <select className={selectCls + " w-full"} value={b.status} onChange={(e) => { updateBooking(b.id, { status: e.target.value as BookingStatus }); toast.success("Status updated (demo)"); }}>{bookingStatuses.map((s) => <option key={s}>{s}</option>)}</select></label>
        <Detail rows={[["Traveller", b.lead.name], ["Email", b.lead.email], ["Phone", b.lead.phone], ["From", `${b.lead.city}, ${b.lead.country}`], ["Start date", when(b.startDate)], ["Party", `${b.adults} adults, ${b.children} children, ${b.rooms} rooms`], ["Add-ons", b.addOns.join(", ") || "None"], ["Estimate", b.estimate ? formatINR(b.estimate) : "On quote"], ["Customer note", b.notes || "None"]]} />
        <label className="block"><span className="mb-1.5 block text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Internal notes</span>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        <Button onClick={() => { updateBooking(b.id, { internalNotes: notes }); toast.success("Notes saved (demo)"); }}>Save notes</Button>
      </div>
    </>
  );
}

export function EnquiriesTable() {
  const { enquiries } = useDb();
  const [filter, setFilter] = useState<"all" | EnquiryStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = enquiries.filter((e) => filter === "all" || e.status === filter);
  const sel = enquiries.find((e) => e.id === openId);
  return (
    <div>
      <Toolbar count={rows.length} noun="quote requests" filter={filter} onFilter={(v) => setFilter(v as never)} options={enquiryStatuses}
        onExport={() => downloadCsv("quote-requests.csv", rows.map((e) => ({ reference: e.reference, status: e.status, name: e.name, email: e.email, phone: e.phone, from: `${e.departureCity} ${e.departureCountry}`, destinations: e.destinations, dates: e.dates, travellers: e.travellers, budget: `${e.budget} ${e.currency}`, created: e.createdAt })))} />
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Ref</TableHead><TableHead>Name</TableHead><TableHead>Wants</TableHead><TableHead>From</TableHead><TableHead>Pax</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.id} className="cursor-pointer" onClick={() => setOpenId(e.id)}>
                <TableCell className="font-mono text-xs">{e.reference}</TableCell><TableCell className="font-medium">{e.name}</TableCell>
                <TableCell>{e.destinations}</TableCell><TableCell>{e.departureCity}, {e.departureCountry}</TableCell><TableCell>{e.travellers}</TableCell>
                <TableCell><StatusBadge status={e.status} /></TableCell>
              </TableRow>
            ))}
            {!rows.length && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No quote requests.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Sheet open={!!sel} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">{sel && <EnquiryDetail e={sel} />}</SheetContent>
      </Sheet>
    </div>
  );
}

function EnquiryDetail({ e }: { e: Enquiry }) {
  const [notes, setNotes] = useState(e.internalNotes);
  return (
    <>
      <SheetHeader><SheetTitle className="font-display text-3xl">{e.reference}</SheetTitle><SheetDescription>Received {when(e.createdAt)}</SheetDescription></SheetHeader>
      <div className="space-y-5 px-4 pb-6 text-sm">
        <label className="block"><span className="mb-1.5 block text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Status</span>
          <select className={selectCls + " w-full"} value={e.status} onChange={(ev) => { updateEnquiry(e.id, { status: ev.target.value as EnquiryStatus }); toast.success("Status updated (demo)"); }}>{enquiryStatuses.map((s) => <option key={s}>{s}</option>)}</select></label>
        <Detail rows={[["Name", e.name], ["Email", e.email], ["Phone", e.phone], ["From", `${e.departureCity}, ${e.departureCountry}`], ["Wants", e.destinations], ["Dates", `${e.dates || "—"}${e.flexibleDates ? " (flexible)" : ""}`], ["Travellers", String(e.travellers)], ["Budget", e.budget ? `${e.budget} ${e.currency}` : "Not given"], ["Style", e.styles.join(", ") || "—"], ["Notes", e.notes || "None"]]} />
        <label className="block"><span className="mb-1.5 block text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Internal notes</span>
          <Textarea rows={4} value={notes} onChange={(ev) => setNotes(ev.target.value)} /></label>
        <Button onClick={() => { updateEnquiry(e.id, { internalNotes: notes }); toast.success("Notes saved (demo)"); }}>Save notes</Button>
      </div>
    </>
  );
}

function Toolbar({ count, noun, filter, onFilter, options, onExport }: { count: number; noun: string; filter: string; onFilter: (v: string) => void; options: string[]; onExport: () => void }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <p className="mr-auto text-sm text-muted-foreground">{count} {noun}</p>
      <select aria-label="Filter by status" className={selectCls} value={filter} onChange={(e) => onFilter(e.target.value)}><option value="all">All statuses</option>{options.map((o) => <option key={o}>{o}</option>)}</select>
      <Button variant="outline" onClick={onExport}><Download /> Export CSV</Button>
    </div>
  );
}

function Detail({ rows }: { rows: [string, string][] }) {
  return <dl className="grid gap-3">{rows.map(([k, v]) => <div key={k}><dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{k}</dt><dd className="mt-0.5 font-medium break-words">{v}</dd></div>)}</dl>;
}
