"use client";
// Demo sign-in for the travel desk. This is a front-door for presentations, not security:
// the data it guards lives in the viewer's own browser. Replace with Supabase Auth
// (email magic link or password) when the database is connected.
import { useSyncExternalStore } from "react";
import type { BranchId } from "./types";

const KEY = "tv-admin-session";

export const DEMO_LOGIN = { email: "owner@throughvacations.com", password: "through2026" };

export type Session = { email: string; name: string; role: "owner" | "staff"; branch: BranchId | "all"; at: string };

/** Demo team. Staff accounts default to their own branch. */
const accounts: (Omit<Session, "at"> & { password: string })[] = [
  { email: DEMO_LOGIN.email, password: DEMO_LOGIN.password, name: "Owner", role: "owner", branch: "all" },
  { email: "pondy@throughvacations.com", password: "pondy2026", name: "Pondicherry desk", role: "staff", branch: "pondicherry" },
  { email: "chennai@throughvacations.com", password: "chennai2026", name: "Chennai desk", role: "staff", branch: "chennai" },
];

let cache: Session | null | undefined;
const listeners = new Set<() => void>();

function read(): Session | null {
  if (cache !== undefined) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    cache = null;
  }
  return cache ?? null;
}

function write(s: Session | null) {
  cache = s;
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

/** undefined while hydrating, null when signed out. */
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

export async function signIn(email: string, password: string): Promise<Session | null> {
  await new Promise((r) => setTimeout(r, 450));
  const a = accounts.find((x) => x.email === email.trim().toLowerCase() && x.password === password);
  if (!a) return null;
  const { password: _pw, ...rest } = a;
  void _pw;
  const s: Session = { ...rest, at: new Date().toISOString() };
  write(s);
  return s;
}

export function signOut() {
  write(null);
}

export const demoAccounts = accounts.map(({ email, password, name }) => ({ email, password, name }));
