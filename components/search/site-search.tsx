"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, CornerDownLeft, FileText, Luggage, MapPin, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type SearchItem = { kind: "Holiday" | "Destination" | "Story" | "Page"; title: string; sub: string; href: string; image?: string; keywords?: string };

const OPEN_EVENT = "tv:search";
export const openSearch = () => window.dispatchEvent(new Event(OPEN_EVENT));

const icons = { Holiday: Luggage, Destination: MapPin, Story: BookOpen, Page: FileText };
const suggestions = ["Honeymoon", "Beach", "Kashmir", "Visa", "Family"];

/** Command-palette search. Opens with Ctrl/Cmd+K, "/" or the header button. */
export function SiteSearch({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener(OPEN_EVENT, onOpen); };
  }, []);

  const results = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return items.filter((i) => i.kind === "Holiday").slice(0, 6);
    return items
      .map((i) => {
        const hay = `${i.title} ${i.sub} ${i.keywords ?? ""}`.toLowerCase();
        if (!terms.every((t) => hay.includes(t))) return null;
        const score = (i.title.toLowerCase().startsWith(terms[0]) ? 3 : 0) + (i.title.toLowerCase().includes(terms[0]) ? 2 : 0) + (i.kind === "Holiday" ? 1 : 0);
        return { i, score };
      })
      .filter((x): x is { i: SearchItem; score: number } => !!x)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.i);
  }, [items, q]);

  const go = (href: string) => { setOpen(false); setQ(""); router.push(href); };

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active].href); }
  }

  useEffect(() => { list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active]);

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(""); }}>
      <DialogContent showCloseButton={false} className="top-[12vh] max-h-[76dvh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Search the site</DialogTitle>
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKeyDown} placeholder="Search holidays, places, stories…"
            aria-label="Search" aria-controls="search-results" aria-activedescendant={results[active] ? `sr-${active}` : undefined}
            className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" />
          <kbd className="hidden rounded-md border px-1.5 py-0.5 text-[0.7rem] text-muted-foreground sm:block">Esc</kbd>
        </div>
        {!q && (
          <div className="flex flex-wrap gap-1.5 border-b px-4 py-3">
            {suggestions.map((s) => <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground">{s}</button>)}
          </div>
        )}
        <div className="overflow-y-auto p-2">
          {!q && <p className="px-2 pt-1 pb-2 text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">Popular holidays</p>}
          {results.length ? (
            <ul ref={list} id="search-results" role="listbox" className="grid gap-0.5">
              {results.map((r, i) => {
                const Icon = icons[r.kind];
                return (
                  <li key={r.href + r.kind} id={`sr-${i}`} data-index={i} role="option" aria-selected={i === active}>
                    <button type="button" onMouseMove={() => setActive(i)} onClick={() => go(r.href)} className={cn("flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition", i === active && "bg-secondary")}>
                      {r.image ? (
                        <Image src={r.image} alt="" width={48} height={48} className="size-11 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><Icon className="size-5" /></span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{r.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{r.kind} · {r.sub}</span>
                      </span>
                      {i === active ? <CornerDownLeft className="size-4 shrink-0 text-brand" /> : <ArrowRight className="size-4 shrink-0 text-muted-foreground/50" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="font-semibold">Nothing for “{q}” yet</p>
              <p className="mt-1 text-sm text-muted-foreground">We plan trips well beyond this list.</p>
              <button type="button" onClick={() => go(`/plan?trip=${encodeURIComponent(q)}`)} className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">Ask for a quote <ArrowRight className="size-4" /></button>
            </div>
          )}
        </div>
        <div className="hidden items-center gap-4 border-t bg-muted/50 px-4 py-2 text-[0.7rem] text-muted-foreground sm:flex">
          <span><kbd className="font-sans">↑↓</kbd> to move</span><span><kbd className="font-sans">Enter</kbd> to open</span><span className="ml-auto"><kbd className="font-sans">Ctrl K</kbd> anywhere</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
