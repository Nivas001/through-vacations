"use client";
import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Pencil, Plus, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { saveOffers, useDb, useHydrated } from "@/lib/data/store";
import { packages as catalogue } from "@/lib/mock/packages";
import { formatINR } from "@/lib/site";
import type { Offer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DeleteButton } from "./bookings-table";
import { Empty, PageHeader, selectCls, when } from "./ui";

export function OffersAdmin() {
  const db = useDb();
  const hydrated = useHydrated();
  const list = db.offers;
  const pkgs = (db.packages ?? catalogue).filter((p) => p.published);
  const [edit, setEdit] = useState<Offer | null>(null);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const state = (o: Offer) => (!o.active ? "Off" : o.validUntil && o.validUntil < today ? "Expired" : "Live");

  function save(o: Offer) {
    saveOffers(list.some((x) => x.id === o.id) ? list.map((x) => (x.id === o.id ? o : x)) : [o, ...list]);
    setEdit(null);
    toast.success(o.active ? `${o.title} is live on the Offers page` : `${o.title} saved (off)`);
  }

  return (
    <div>
      <PageHeader title="Offers" sub={`${list.filter((o) => state(o) === "Live").length} live on the website · shown on the homepage and the Offers page`}>
        <a href="/offers" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium hover:bg-muted"><ExternalLink className="size-4" /> View page</a>
        <Button className="h-9" onClick={() => setEdit({ id: `offer-${Date.now()}`, title: "", packageSlug: pkgs[0]?.slug ?? "", price: null, was: null, badge: "Limited offer", description: "", validUntil: null, active: true })}><Plus /> New offer</Button>
      </PageHeader>

      {hydrated && !list.length ? <Empty icon={Tag} title="No offers yet" sub="Create one to feature a deal on the website." /> : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {list.map((o) => {
            const p = pkgs.find((x) => x.slug === o.packageSlug);
            const s = state(o);
            return (
              <li key={o.id} className={cn("flex min-w-0 gap-3 rounded-2xl border bg-card p-3", s !== "Live" && "border-dashed")}>
                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">{p && <Image src={p.image} alt="" fill sizes="96px" className={cn("object-cover", s !== "Live" && "opacity-50 grayscale")} />}</div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><p className="truncate font-semibold">{o.title}</p><p className="truncate text-xs text-muted-foreground">{p?.title ?? "Holiday hidden"} · {o.badge}</p></div>
                    <Button variant="ghost" size="icon-sm" aria-label={`Edit ${o.title}`} onClick={() => setEdit(o)}><Pencil /></Button>
                  </div>
                  <p className="mt-1 text-sm font-semibold">{o.price ? formatINR(o.price) : "On request"} <span className="text-xs font-normal text-muted-foreground">pp{o.validUntil ? ` · until ${when(o.validUntil)}` : ""}</span></p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs">
                    <span className={cn("rounded-full px-2 py-0.5 font-bold", s === "Live" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : s === "Expired" ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground")}>{s}</span>
                    <label className="flex items-center gap-1.5"><Switch size="sm" checked={o.active} onCheckedChange={(v) => { saveOffers(list.map((x) => (x.id === o.id ? { ...x, active: v } : x))); toast.success(v ? "Offer switched on" : "Offer switched off"); }} aria-label={`Show ${o.title}`} />Show</label>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Sheet open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {edit && <Editor key={edit.id} o={edit} pkgs={pkgs} isNew={!list.some((x) => x.id === edit.id)} onSave={save} onDelete={() => { saveOffers(list.filter((x) => x.id !== edit.id)); setEdit(null); toast.success("Offer deleted"); }} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Editor({ o, pkgs, isNew, onSave, onDelete }: { o: Offer; pkgs: typeof catalogue; isNew: boolean; onSave: (o: Offer) => void; onDelete: () => void }) {
  const [v, setV] = useState(o);
  const set = <K extends keyof Offer>(k: K, val: Offer[K]) => setV((x) => ({ ...x, [k]: val }));
  const num = (s: string) => (s ? Number(s.replace(/\D/g, "")) || null : null);
  const valid = v.title.trim().length > 2 && !!v.packageSlug;
  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-display text-3xl font-extrabold">{isNew ? "New offer" : "Edit offer"}</SheetTitle>
        <SheetDescription>Shown on the Offers page and the homepage while it is on and in date.</SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 px-4 pb-8">
        <label className="flex items-center justify-between gap-3 rounded-xl bg-muted px-3 py-2.5 text-sm font-medium">Show on the website <Switch checked={v.active} onCheckedChange={(x) => set("active", x)} /></label>
        <F label="Offer title"><Input value={v.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Kashmir early-bird" /></F>
        <F label="Holiday"><select className={selectCls + " h-9 w-full normal-case"} value={v.packageSlug} onChange={(e) => set("packageSlug", e.target.value)}>{pkgs.map((p) => <option key={p.slug} value={p.slug}>{p.title} · {p.durationLabel}</option>)}</select></F>
        <div className="grid grid-cols-2 gap-4">
          <F label="From price pp (₹)"><Input inputMode="numeric" value={v.price ?? ""} onChange={(e) => set("price", num(e.target.value))} placeholder="Blank = on request" /></F>
          <F label="Was (optional, ₹)"><Input inputMode="numeric" value={v.was ?? ""} onChange={(e) => set("was", num(e.target.value))} placeholder="Shown struck through" /></F>
          <F label="Badge"><Input value={v.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Early bird" /></F>
          <F label="Valid until"><Input type="date" value={v.validUntil ?? ""} onChange={(e) => set("validUntil", e.target.value || null)} /></F>
        </div>
        <F label="Short description"><Textarea rows={3} maxLength={180} value={v.description} onChange={(e) => set("description", e.target.value)} placeholder="What makes this a good deal" /></F>
        <Button disabled={!valid} onClick={() => onSave({ ...v, title: v.title.trim() })}>Save offer</Button>
        {!isNew && <DeleteButton noun="offer" onConfirm={onDelete} />}
      </div>
    </>
  );
}

const F = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block min-w-0 space-y-1.5"><span className="text-sm leading-none font-medium">{label}</span>{children}</label>;
