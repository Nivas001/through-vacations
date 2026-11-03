"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBooking, leadSources, useDb } from "@/lib/data/store";
import { packages as catalogue } from "@/lib/mock/packages";
import { formatINR } from "@/lib/site";
import type { Booking, BranchId, LeadSource } from "@/lib/types";
import { selectCls, sourceLabel } from "./ui";

export type BookingPrefill = { name?: string; email?: string; phone?: string; city?: string; adults?: number; children?: number; branch?: BranchId; notes?: string; source?: LeadSource };

export function NewBookingDialog({ open, onOpenChange, prefill, defaultBranch, onCreated }: {
  open: boolean; onOpenChange: (o: boolean) => void; prefill?: BookingPrefill; defaultBranch: BranchId; onCreated?: (b: Booking) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        {open && <Form key={JSON.stringify(prefill ?? {})} prefill={prefill} defaultBranch={defaultBranch} onDone={(b) => { onOpenChange(false); onCreated?.(b); }} />}
      </DialogContent>
    </Dialog>
  );
}

function Form({ prefill, defaultBranch, onDone }: { prefill?: BookingPrefill; defaultBranch: BranchId; onDone: (b: Booking) => void }) {
  const { packages } = useDb();
  const list = (packages ?? catalogue).filter((p) => p.published);
  const [v, setV] = useState({
    slug: list[0]?.slug ?? "", date: "", adults: prefill?.adults ?? 2, children: prefill?.children ?? 0, rooms: 1,
    name: prefill?.name ?? "", email: prefill?.email ?? "", phone: prefill?.phone ?? "", city: prefill?.city ?? "",
    branch: prefill?.branch ?? defaultBranch, source: prefill?.source ?? ("walk-in" as LeadSource), estimate: "", notes: prefill?.notes ?? "",
  });
  const [tried, setTried] = useState(false);
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((x) => ({ ...x, [k]: val }));
  const pkg = list.find((p) => p.slug === v.slug);
  const suggested = pkg?.price ? pkg.price * (v.adults + v.children) : null;
  const missing = { name: v.name.trim().length < 2, phone: v.phone.replace(/\D/g, "").length < 7, date: !v.date };

  async function save() {
    setTried(true);
    if (!pkg || Object.values(missing).some(Boolean)) return toast.error("Fill in the highlighted fields");
    const b = await createBooking({
      packageSlug: pkg.slug, packageTitle: pkg.title, startDate: v.date, adults: v.adults, children: v.children, rooms: v.rooms, addOns: [],
      lead: { name: v.name.trim(), email: v.email.trim(), phone: v.phone.trim(), city: v.city.trim() || "—", country: "India" },
      notes: v.notes, estimate: v.estimate ? Number(v.estimate.replace(/\D/g, "")) : suggested, branch: v.branch, source: v.source, status: "confirmed",
    });
    toast.success(`Booking ${b.reference} created`);
    onDone(b);
  }

  const err = (k: keyof typeof missing) => (tried && missing[k] ? "border-destructive ring-3 ring-destructive/20" : "");

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl font-extrabold">New booking</DialogTitle>
        <DialogDescription>For walk-ins, phone and WhatsApp customers. It is created as confirmed.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Holiday" className="sm:col-span-2">
          <select className={selectCls + " h-10 w-full normal-case"} value={v.slug} onChange={(e) => set("slug", e.target.value)}>
            {list.map((p) => <option key={p.slug} value={p.slug}>{p.title} · {p.durationLabel}</option>)}
          </select>
        </F>
        <F label="Start date"><Input type="date" className={"h-10 " + err("date")} value={v.date} onChange={(e) => set("date", e.target.value)} /></F>
        <div className="grid grid-cols-3 gap-2">
          <F label="Adults"><Input type="number" min={1} max={60} className="h-10" value={v.adults} onChange={(e) => set("adults", Math.max(1, Number(e.target.value) || 1))} /></F>
          <F label="Kids"><Input type="number" min={0} max={30} className="h-10" value={v.children} onChange={(e) => set("children", Math.max(0, Number(e.target.value) || 0))} /></F>
          <F label="Rooms"><Input type="number" min={1} max={30} className="h-10" value={v.rooms} onChange={(e) => set("rooms", Math.max(1, Number(e.target.value) || 1))} /></F>
        </div>
        <F label="Customer name"><Input className={"h-10 " + err("name")} value={v.name} onChange={(e) => set("name", e.target.value)} autoComplete="off" /></F>
        <F label="Phone / WhatsApp"><Input type="tel" className={"h-10 " + err("phone")} value={v.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="off" /></F>
        <F label="Email (optional)"><Input type="email" className="h-10" value={v.email} onChange={(e) => set("email", e.target.value)} autoComplete="off" /></F>
        <F label="City"><Input className="h-10" value={v.city} onChange={(e) => set("city", e.target.value)} /></F>
        <F label="Office">
          <select className={selectCls + " h-10 w-full"} value={v.branch} onChange={(e) => set("branch", e.target.value as BranchId)}>
            <option value="pondicherry">Pondicherry</option><option value="chennai">Chennai</option>
          </select>
        </F>
        <F label="Came through">
          <select className={selectCls + " h-10 w-full"} value={v.source} onChange={(e) => set("source", e.target.value as LeadSource)}>
            {leadSources.map((s) => <option key={s} value={s}>{sourceLabel(s)}</option>)}
          </select>
        </F>
        <F label="Agreed amount (₹)" className="sm:col-span-2">
          <Input inputMode="numeric" className="h-10" placeholder={suggested ? `Suggested ${formatINR(suggested)} from the published price` : "Enter the quoted total"} value={v.estimate} onChange={(e) => set("estimate", e.target.value.replace(/[^\d]/g, ""))} />
        </F>
        <F label="Notes" className="sm:col-span-2"><Textarea rows={3} value={v.notes} onChange={(e) => set("notes", e.target.value)} /></F>
      </div>
      <DialogFooter className="mt-2">
        <Button className="h-10 rounded-full px-6" onClick={save}>Create booking</Button>
      </DialogFooter>
    </>
  );
}

function F({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={"block min-w-0 space-y-1.5 " + (className ?? "")}><span className="flex items-center gap-1.5 text-sm leading-none font-medium">{label}</span>{children}</label>;
}
