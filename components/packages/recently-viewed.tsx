"use client";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { History, X } from "lucide-react";
import { useSaved } from "@/components/saved/saved-provider";
import { cn } from "@/lib/utils";

const KEY = "tv-recent";
const listeners = new Set<() => void>();
let cache: string | null = null;

function read(): string {
  try { cache = localStorage.getItem(KEY) ?? "[]"; } catch { cache = "[]"; }
  return cache;
}
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };

export function recordView(slug: string) {
  try {
    const list = (JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[]).filter((s) => s !== slug);
    localStorage.setItem(KEY, JSON.stringify([slug, ...list].slice(0, 8)));
    cache = null;
    listeners.forEach((l) => l());
  } catch {}
}

function clear() {
  try { localStorage.removeItem(KEY); cache = null; listeners.forEach((l) => l()); } catch {}
}

/** Holidays this visitor opened recently, kept in their browser. Renders nothing until there are some. */
export function RecentlyViewed({ exclude, className }: { exclude?: string; className?: string }) {
  const raw = useSyncExternalStore(subscribe, () => cache ?? read(), () => "[]");
  const { catalog } = useSaved();
  let slugs: string[] = [];
  try { slugs = JSON.parse(raw); } catch {}
  const items = slugs.filter((s) => s !== exclude).map((s) => catalog.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => !!c).slice(0, 6);
  if (!items.length) return null;

  return (
    <section className={cn("print:hidden", className)} aria-label="Recently viewed">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase"><History className="size-4" /> Recently viewed</p>
        <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><X className="size-3.5" /> Clear</button>
      </div>
      <ul className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {items.map((c) => (
          <li key={c.slug} className="shrink-0">
            <Link href={`/packages/${c.slug}`} className="group flex w-56 items-center gap-3 rounded-2xl border bg-card p-2 pr-3 transition hover:border-primary">
              <Image src={c.image} alt="" width={64} height={64} className="size-14 rounded-xl object-cover" />
              <span className="min-w-0"><span className="block truncate font-semibold group-hover:text-brand">{c.title}</span><span className="text-xs text-muted-foreground">{c.nights} night{c.nights > 1 ? "s" : ""}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
