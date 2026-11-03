"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { BranchId } from "@/lib/types";

export type BranchView = BranchId | "all";

const Ctx = createContext<{ view: BranchView; setView: (v: BranchView) => void }>({ view: "all", setView: () => {} });
const KEY = "tv-admin-branch";

export function BranchViewProvider({ initial, children }: { initial: BranchView; children: React.ReactNode }) {
  const [view, setViewState] = useState<BranchView>(initial);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as BranchView | null;
      // Restoring the last chosen office on mount syncs with localStorage, an external system.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (initial === "all" && (saved === "pondicherry" || saved === "chennai" || saved === "all")) setViewState(saved);
    } catch {}
  }, [initial]);
  const setView = (v: BranchView) => {
    setViewState(v);
    try { localStorage.setItem(KEY, v); } catch {}
  };
  return <Ctx.Provider value={{ view, setView }}>{children}</Ctx.Provider>;
}

export const useBranchView = () => useContext(Ctx);

/** Rows without a branch (older records) show in every view. */
export const inView = (view: BranchView, row: { branch?: BranchId }) => view === "all" || !row.branch || row.branch === view;
