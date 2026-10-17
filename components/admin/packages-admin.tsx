"use client";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { packages as seed } from "@/lib/mock/packages";
import { formatINR } from "@/lib/site";
import type { TravelPackage } from "@/lib/types";

export function PackagesAdmin() {
  const [list, setList] = useState<TravelPackage[]>(seed);
  const [edit, setEdit] = useState<TravelPackage | null>(null);
  const patch = (id: string, p: Partial<TravelPackage>) => setList((l) => l.map((x) => (x.id === id ? { ...x, ...p } : x)));

  function blank(): TravelPackage {
    return { ...seed[0], id: `new-${Date.now()}`, slug: "new-holiday", title: "New holiday", tagline: "", destination: "", summary: "", price: null, published: false, featured: false, highlights: [], inclusions: [], itinerary: [] };
  }
  function save(p: TravelPackage) {
    setList((l) => (l.some((x) => x.id === p.id) ? l.map((x) => (x.id === p.id ? p : x)) : [p, ...l]));
    setEdit(null);
    toast.success("Saved locally (demo). Not stored until Supabase is connected.");
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between"><p className="text-sm text-muted-foreground">{list.length} holidays</p><Button onClick={() => setEdit(blank())}><Plus /> New holiday</Button></div>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Holiday</TableHead><TableHead>Region</TableHead><TableHead>Length</TableHead><TableHead>Price</TableHead><TableHead>Featured</TableHead><TableHead>Published</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {list.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}<span className="block text-xs text-muted-foreground">{p.destination}</span></TableCell>
                <TableCell>{p.region}</TableCell><TableCell>{p.durationLabel}</TableCell>
                <TableCell>{p.price ? formatINR(p.price) : "On quote"}</TableCell>
                <TableCell><Switch checked={p.featured} onCheckedChange={(v) => patch(p.id, { featured: v })} aria-label={`Feature ${p.title}`} /></TableCell>
                <TableCell><Switch checked={p.published} onCheckedChange={(v) => patch(p.id, { published: v })} aria-label={`Publish ${p.title}`} /></TableCell>
                <TableCell><Button variant="ghost" size="icon" aria-label={`Edit ${p.title}`} onClick={() => setEdit(p)}><Pencil /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Sheet open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">{edit && <Editor key={edit.id} p={edit} onSave={save} />}</SheetContent>
      </Sheet>
    </div>
  );
}

function Editor({ p, onSave }: { p: TravelPackage; onSave: (p: TravelPackage) => void }) {
  const [v, setV] = useState(p);
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
  const set = <K extends keyof TravelPackage>(k: K, val: TravelPackage[K]) => setV((x) => ({ ...x, [k]: val }));
  return (
    <>
      <SheetHeader><SheetTitle className="font-display text-3xl">Edit holiday</SheetTitle><SheetDescription>Local preview only until the database is connected.</SheetDescription></SheetHeader>
      <div className="grid gap-4 px-4 pb-6">
        <F label="Title"><Input value={v.title} onChange={(e) => set("title", e.target.value)} /></F>
        <F label="Tagline"><Input value={v.tagline} onChange={(e) => set("tagline", e.target.value)} /></F>
        <F label="Destination"><Input value={v.destination} onChange={(e) => set("destination", e.target.value)} /></F>
        <div className="grid grid-cols-2 gap-4">
          <F label="Price per person (₹, blank = quote)"><Input inputMode="numeric" value={v.price ?? ""} onChange={(e) => set("price", e.target.value ? Number(e.target.value.replace(/\D/g, "")) : null)} /></F>
          <F label="Price valid until"><Input type="date" value={v.validUntil ?? ""} onChange={(e) => set("validUntil", e.target.value || null)} /></F>
        </div>
        <F label="Summary"><Textarea rows={3} value={v.summary} onChange={(e) => set("summary", e.target.value)} /></F>
        <F label="Highlights (one per line)"><Textarea rows={3} value={v.highlights.join("\n")} onChange={(e) => set("highlights", lines(e.target.value))} /></F>
        <F label="Inclusions (one per line)"><Textarea rows={4} value={v.inclusions.join("\n")} onChange={(e) => set("inclusions", lines(e.target.value))} /></F>
        <F label="Itinerary (one day per line: Title | Description)"><Textarea rows={5} value={v.itinerary.map((d) => `${d.title} | ${d.description}`).join("\n")} onChange={(e) => set("itinerary", lines(e.target.value).map((l) => { const [t, ...r] = l.split("|"); return { title: t.trim(), description: r.join("|").trim() }; }))} /></F>
        <Button onClick={() => onSave(v)}>Save holiday</Button>
      </div>
    </>
  );
}

const F = ({ label, children }: { label: string; children: React.ReactNode }) => <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
