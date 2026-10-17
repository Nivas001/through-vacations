"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CatalogItem = { slug: string; title: string; destination: string; image: string; nights: number };

type Ctx = { saved: string[]; toggle: (slug: string) => void; has: (slug: string) => void | boolean; catalog: CatalogItem[]; open: boolean; setOpen: (o: boolean) => void };
const SavedCtx = createContext<Ctx | null>(null);
const KEY = "tv-saved";

/** Wishlist kept in this browser only (localStorage). */
export function SavedProvider({ catalog, children }: { catalog: CatalogItem[]; children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(raw)) setSaved(raw.filter((s) => typeof s === "string"));
    } catch {}
  }, []);
  const toggle = useCallback((slug: string) => {
    setSaved((cur) => {
      const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  const value = useMemo<Ctx>(() => ({ saved, toggle, has: (s) => saved.includes(s), catalog, open, setOpen }), [saved, toggle, catalog, open]);
  return <SavedCtx.Provider value={value}>{children}</SavedCtx.Provider>;
}

export function useSaved() {
  const c = useContext(SavedCtx);
  if (!c) throw new Error("useSaved must be used inside SavedProvider");
  return c;
}
