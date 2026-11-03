"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Copy, ExternalLink, Package, Pencil, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { savePackages, useDb, useHydrated } from "@/lib/data/store";
import { packages as seed } from "@/lib/mock/packages";
import { slugify } from "@/lib/data/packages";
import { formatINR } from "@/lib/site";
import type { Region, TravelPackage, TravelStyle } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DeleteButton } from "./bookings-table";
import { Empty, PageHeader, SearchBox, selectCls } from "./ui";

const allStyles: TravelStyle[] = ["Couples", "Honeymoon", "Family", "Friends", "Group", "Corporate", "Student", "Beach", "Nature", "City", "Culture"];
const media = [...new Set(seed.flatMap((p) => [p.image, ...p.gallery]))];

export function PackagesAdmin() {
  const db = useDb();
  const hydrated = useHydrated();
  const list = db.packages ?? seed;
  const [edit, setEdit] = useState<TravelPackage | null>(null);
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [state, setState] = useState<"all" | "live" | "draft">("all");

  const rows = list.filter((p) => (region === "all" || p.region === region) && (state === "all" || (state === "live" ? p.published : !p.published)) && (!q || `${p.title} ${p.destination}`.toLowerCase().includes(q.toLowerCase())));
  const patch = (id: string, p: Partial<TravelPackage>) => savePackages(list.map((x) => (x.id === id ? { ...x, ...p } : x)));

  function blank(): TravelPackage {
    return { ...seed[0], id: `new-${Date.now()}`, slug: "new-holiday", title: "New holiday", tagline: "", destination: "", summary: "", price: null, validUntil: null, published: false, featured: false, highlights: [], inclusions: [], exclusions: [], itinerary: [], styles: [], facts: undefined, sourceUrl: "" };
  }
  function save(p: TravelPackage) {
    const clean = { ...p, slug: p.slug === "new-holiday" || !p.slug ? slugify(p.title) : p.slug, nights: Math.max(1, p.nights), days: Math.max(1, p.nights + 1), durationLabel: `${p.nights} night${p.nights > 1 ? "s" : ""} / ${p.nights + 1} days` };
    savePackages(list.some((x) => x.id === p.id) ? list.map((x) => (x.id === p.id ? clean : x)) : [clean, ...list]);
    setEdit(null);
    toast.success(`${clean.title} saved`);
  }

  return (
    <div>
      <PageHeader title="Holidays" sub={`${list.filter((p) => p.published).length} live · ${list.filter((p) => !p.published).length} drafts · ${list.filter((p) => p.featured).length} featured on the homepage`}>
        <Button className="h-9" onClick={() => setEdit(blank())}><Plus /> New holiday</Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Search holidays…" />
        <select aria-label="Region" className={selectCls + " normal-case"} value={region} onChange={(e) => setRegion(e.target.value as Region | "all")}><option value="all">All regions</option><option>India</option><option>International</option></select>
        <select aria-label="State" className={selectCls + " normal-case"} value={state} onChange={(e) => setState(e.target.value as typeof state)}><option value="all">Live and drafts</option><option value="live">Live only</option><option value="draft">Drafts only</option></select>
      </div>

      {hydrated && !rows.length ? <Empty icon={Package} title="No holidays match" /> : (
        <ul className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {rows.map((p) => (
            <li key={p.id} className={cn("flex min-w-0 gap-3 rounded-2xl border bg-card p-3", !p.published && "border-dashed")}>
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28">
                <Image src={p.image} alt="" fill sizes="112px" className={cn("object-cover", !p.published && "opacity-50 grayscale")} />
                {p.featured && <span className="absolute top-1.5 left-1.5 grid size-6 place-items-center rounded-full bg-sun text-sun-foreground" title="Featured"><Star className="size-3.5 fill-current" /></span>}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="truncate font-semibold">{p.title}</p><p className="truncate text-xs text-muted-foreground">{p.region} · {p.durationLabel}</p></div>
                  <Button variant="ghost" size="icon-sm" aria-label={`Edit ${p.title}`} onClick={() => setEdit(p)}><Pencil /></Button>
                </div>
                <p className="mt-1 text-sm font-semibold">{p.price ? <>{formatINR(p.price)} <span className="text-xs font-normal text-muted-foreground">pp</span></> : <span className="text-muted-foreground">Quote on request</span>}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs">
                  <label className="flex items-center gap-1.5"><Switch size="sm" checked={p.published} onCheckedChange={(v) => { patch(p.id, { published: v }); toast.success(v ? `${p.title} is live` : `${p.title} hidden`); }} aria-label={`Publish ${p.title}`} />Live</label>
                  <label className="flex items-center gap-1.5"><Switch size="sm" checked={p.featured} onCheckedChange={(v) => patch(p.id, { featured: v })} aria-label={`Feature ${p.title}`} />Featured</label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted-foreground">Edits are saved in this browser for review. They go live on the public website once the database is connected.</p>

      <Sheet open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {edit && <Editor key={edit.id} p={edit} isNew={!list.some((x) => x.id === edit.id)} onSave={save}
            onDuplicate={() => { const copy = { ...edit, id: `new-${Date.now()}`, slug: `${edit.slug}-copy`, title: `${edit.title} (copy)`, published: false, featured: false }; savePackages([copy, ...list]); setEdit(copy); toast.success("Duplicated as a draft"); }}
            onDelete={() => { savePackages(list.filter((x) => x.id !== edit.id)); setEdit(null); toast.success("Holiday deleted"); }} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Editor({ p, isNew, onSave, onDuplicate, onDelete }: { p: TravelPackage; isNew: boolean; onSave: (p: TravelPackage) => void; onDuplicate: () => void; onDelete: () => void }) {
  const [v, setV] = useState(p);
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
  const set = <K extends keyof TravelPackage>(k: K, val: TravelPackage[K]) => setV((x) => ({ ...x, [k]: val }));
  const valid = v.title.trim().length > 1 && v.destination.trim().length > 1;
  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-display text-3xl font-extrabold">{isNew ? "New holiday" : "Edit holiday"}</SheetTitle>
        <SheetDescription>{isNew ? "Saved as a draft until you switch it live." : <Link href={`/packages/${p.slug}`} target="_blank" className="inline-flex items-center gap-1 text-brand hover:underline">View on the website <ExternalLink className="size-3" /></Link>}</SheetDescription>
      </SheetHeader>
      <div className="grid gap-5 px-4 pb-8">
        <div className="flex flex-wrap gap-6 rounded-xl bg-muted p-3 text-sm">
          <label className="flex items-center gap-2"><Switch checked={v.published} onCheckedChange={(x) => set("published", x)} /> Live on website</label>
          <label className="flex items-center gap-2"><Switch checked={v.featured} onCheckedChange={(x) => set("featured", x)} /> Featured</label>
        </div>
        <F label="Title"><Input value={v.title} onChange={(e) => set("title", e.target.value)} /></F>
        <F label="Tagline"><Input value={v.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="A short, warm line" /></F>
        <div className="grid grid-cols-2 gap-4">
          <F label="Destination"><Input value={v.destination} onChange={(e) => set("destination", e.target.value)} /></F>
          <F label="Region"><select className={selectCls + " h-8 w-full normal-case"} value={v.region} onChange={(e) => set("region", e.target.value as Region)}><option>India</option><option>International</option></select></F>
          <F label="Nights"><Input type="number" min={1} max={30} value={v.nights} onChange={(e) => set("nights", Math.max(1, Number(e.target.value) || 1))} /></F>
          <F label="Price per person (₹)"><Input inputMode="numeric" placeholder="Blank = quote" value={v.price ?? ""} onChange={(e) => set("price", e.target.value ? Number(e.target.value.replace(/\D/g, "")) : null)} /></F>
          <F label="Price valid until"><Input type="date" value={v.validUntil ?? ""} onChange={(e) => set("validUntil", e.target.value || null)} /></F>
        </div>
        <G label="Cover image">
          <div className="grid max-h-56 grid-cols-4 gap-2 overflow-y-auto rounded-xl border p-2 sm:grid-cols-5">
            {media.map((src) => (
              <button key={src} type="button" onClick={() => set("image", src)} aria-pressed={v.image === src} aria-label={`Use ${src.split("/").pop()}`} className={cn("relative aspect-square overflow-hidden rounded-lg ring-2 ring-transparent transition", v.image === src && "ring-primary")}>
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                {v.image === src && <span className="absolute inset-0 grid place-items-center bg-primary/40 text-white"><Check className="size-5" /></span>}
              </button>
            ))}
          </div>
        </G>
        <G label="Kind of trip">
          <div className="flex flex-wrap gap-1.5">
            {allStyles.map((s) => { const on = v.styles.includes(s); return <button key={s} type="button" aria-pressed={on} onClick={() => set("styles", on ? v.styles.filter((x) => x !== s) : [...v.styles, s])} className={cn("rounded-full border px-3 py-1 text-xs font-semibold transition", on ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50")}>{s}</button>; })}
          </div>
        </G>
        <F label="Summary"><Textarea rows={3} value={v.summary} onChange={(e) => set("summary", e.target.value)} /></F>
        <F label="Highlights (one per line)"><Textarea rows={3} value={v.highlights.join("\n")} onChange={(e) => set("highlights", lines(e.target.value))} /></F>
        <F label="Inclusions (one per line)"><Textarea rows={4} value={v.inclusions.join("\n")} onChange={(e) => set("inclusions", lines(e.target.value))} /></F>
        <F label="Exclusions (one per line)"><Textarea rows={3} value={v.exclusions.join("\n")} onChange={(e) => set("exclusions", lines(e.target.value))} /></F>
        <F label="Itinerary (one day per line: Title | Description)"><Textarea rows={6} value={v.itinerary.map((d) => `${d.title} | ${d.description}`).join("\n")} onChange={(e) => set("itinerary", lines(e.target.value).map((l, i) => { const [t, ...r] = l.split("|"); return { ...v.itinerary[i], title: t.trim(), description: r.join("|").trim() }; }))} /></F>
        <div className="flex flex-wrap gap-2">
          <Button disabled={!valid} onClick={() => onSave(v)}>Save holiday</Button>
          {!isNew && <Button variant="outline" onClick={onDuplicate}><Copy /> Duplicate</Button>}
        </div>
        {!isNew && <DeleteButton noun="holiday" onConfirm={onDelete} />}
      </div>
    </>
  );
}

const F = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block min-w-0 space-y-1.5"><span className="flex items-center gap-1.5 text-sm leading-none font-medium">{label}</span>{children}</label>;
/** For groups of buttons, which must not sit inside a <label>. */
const G = ({ label, children }: { label: string; children: React.ReactNode }) => <div role="group" aria-label={label} className="min-w-0 space-y-1.5"><p className="flex items-center gap-1.5 text-sm leading-none font-medium">{label}</p>{children}</div>;
