"use client";
// Mock persistence for bookings/enquiries until Supabase is connected.
// Every export here maps 1:1 to a future table call (insert / select / update).
import { useSyncExternalStore } from "react";
import type { Booking, BookingStatus, Enquiry, EnquiryStatus } from "../types";
import { seedBookings, seedEnquiries } from "../mock/seed";

const KEY = "tv-mock-db-v1";
type Db = { bookings: Booking[]; enquiries: Enquiry[] };

let cache: Db | null = null;
const listeners = new Set<() => void>();
const EMPTY: Db = { bookings: [], enquiries: [] };

function read(): Db {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Db) : { bookings: seedBookings, enquiries: seedEnquiries };
  } catch {
    cache = { bookings: seedBookings, enquiries: seedEnquiries };
  }
  return cache;
}

function write(next: Db) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode: keep in-memory only */
  }
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useDb(): Db {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const ref = (prefix: string) =>
  `${prefix}-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;

export async function createBooking(
  input: Omit<Booking, "id" | "reference" | "status" | "internalNotes" | "createdAt">,
): Promise<Booking> {
  const b: Booking = {
    ...input,
    id: crypto.randomUUID(),
    reference: ref("TV"),
    status: "new",
    internalNotes: "",
    createdAt: new Date().toISOString(),
  };
  write({ ...read(), bookings: [b, ...read().bookings] });
  return b;
}

export async function createEnquiry(
  input: Omit<Enquiry, "id" | "reference" | "status" | "internalNotes" | "createdAt">,
): Promise<Enquiry> {
  const e: Enquiry = {
    ...input,
    id: crypto.randomUUID(),
    reference: ref("Q"),
    status: "new",
    internalNotes: "",
    createdAt: new Date().toISOString(),
  };
  write({ ...read(), enquiries: [e, ...read().enquiries] });
  return e;
}

export function updateBooking(id: string, patch: Partial<Pick<Booking, "status" | "internalNotes">>) {
  write({ ...read(), bookings: read().bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
}

export function updateEnquiry(id: string, patch: Partial<Pick<Enquiry, "status" | "internalNotes">>) {
  write({ ...read(), enquiries: read().enquiries.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
}

export const bookingStatuses: BookingStatus[] = ["new", "contacted", "confirmed", "paid", "completed", "cancelled"];
export const enquiryStatuses: EnquiryStatus[] = ["new", "contacted", "quoted", "won", "closed"];
