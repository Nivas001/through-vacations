"use client";
// Mock persistence until Supabase is connected. Everything lives in this browser's localStorage.
// Every export maps 1:1 to a future table call (insert / select / update / delete).
import { useSyncExternalStore } from "react";
import type {
  Activity, Announcement, Booking, Offer, BookingStatus, Branch, BranchId, ContactMessage, Enquiry, EnquiryStatus, LeadSource,
  MessageStatus, Payment, PaymentMethod, SiteSettings, Subscriber, TravelPackage,
} from "../types";
import { seedBookings, seedEnquiries, seedMessages, seedSubscribers } from "../mock/seed";
import { branchForCity, branches as defaultBranches, siteDefaults } from "../site";

const KEY = "tv-mock-db-v3";

export type Db = {
  bookings: Booking[];
  enquiries: Enquiry[];
  messages: ContactMessage[];
  subscribers: Subscriber[];
  /** null until the admin edits a holiday; the published catalogue is used until then. */
  packages: TravelPackage[] | null;
  settings: SiteSettings;
  branches: Branch[];
  announcement: Announcement;
  offers: Offer[];
};

/** The two promotions published on Instagram. Prices reconfirmed in every quote. */
const defaultOffers: Offer[] = [
  { id: "offer-andaman", title: "Andaman for two", packageSlug: "andaman", price: 24999, was: null, badge: "Instagram offer", description: "Port Blair and Havelock with stays, meals and transfers. Published price per person for two travellers.", validUntil: null, active: true },
  { id: "offer-bangkok", title: "Bangkok & Pattaya getaway", packageSlug: "bangkok-pattaya", price: 18999, was: null, badge: "Instagram offer", description: "City tour, Alcazar show and Coral Island. Published price per person on twin sharing.", validUntil: null, active: true },
];

const defaultAnnouncement: Announcement = { enabled: false, text: "Plan your December holidays early. Limited dates for Kashmir, Maldives and Thailand.", href: "/plan", cta: "Get a quote" };

let cache: Db | null = null;
const listeners = new Set<() => void>();
const EMPTY: Db = { bookings: [], enquiries: [], messages: [], subscribers: [], packages: null, settings: siteDefaults, branches: defaultBranches, announcement: defaultAnnouncement, offers: defaultOffers };

function seed(): Db {
  const now = Date.now();
  return {
    bookings: seedBookings(now), enquiries: seedEnquiries(now), messages: seedMessages(now), subscribers: seedSubscribers(now),
    packages: null, settings: siteDefaults, branches: defaultBranches, announcement: defaultAnnouncement, offers: defaultOffers,
  };
}

function read(): Db {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    // Spread over a fresh seed so rows saved by an older version gain any new collections.
    cache = raw ? { ...seed(), ...(JSON.parse(raw) as Partial<Db>) } : seed();
  } catch {
    cache = seed();
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
  // Keep tabs in sync: a booking made on the site shows up in an open admin tab.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null;
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};

export function useDb(): Db {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** False during prerender and the first client render; use it to avoid flashing empty states. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

const ref = (prefix: string) =>
  `${prefix}-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
const stamp = (text: string): Activity => ({ at: new Date().toISOString(), text });

/* Bookings ---------------------------------------------------------------- */

type NewBooking = Omit<Booking, "id" | "reference" | "status" | "internalNotes" | "createdAt" | "history"> & { status?: BookingStatus };

export async function createBooking(input: NewBooking): Promise<Booking> {
  const source = input.source ?? "website";
  const b: Booking = {
    ...input,
    id: crypto.randomUUID(),
    reference: ref("TV"),
    status: input.status ?? "new",
    internalNotes: "",
    createdAt: new Date().toISOString(),
    branch: input.branch ?? branchForCity(input.lead.city),
    source,
    history: [stamp(source === "website" ? "Request received from the website" : `Added by the desk (${source})`)],
  };
  write({ ...read(), bookings: [b, ...read().bookings] });
  return b;
}

export function updateBooking(id: string, patch: Partial<Pick<Booking, "status" | "internalNotes" | "branch">>, note?: string) {
  write({
    ...read(),
    bookings: read().bookings.map((b) => (b.id === id ? { ...b, ...patch, history: [...(b.history ?? []), ...(note ? [stamp(note)] : [])] } : b)),
  });
}

export function addPayment(bookingId: string, p: { amount: number; method: PaymentMethod; note: string }) {
  write({
    ...read(),
    bookings: read().bookings.map((b) => {
      if (b.id !== bookingId) return b;
      const payments: Payment[] = [...(b.payments ?? []), { ...p, id: crypto.randomUUID(), at: new Date().toISOString() }];
      const paid = payments.reduce((n, x) => n + x.amount, 0);
      // Fully paid bookings move to "paid" on their own; completed and cancelled ones stay put.
      const settle = !!b.estimate && paid >= b.estimate && ["new", "contacted", "confirmed"].includes(b.status);
      const history = [...(b.history ?? []), stamp(`Payment of ₹${p.amount.toLocaleString("en-IN")} received (${p.method})`), ...(settle ? [stamp("Status changed to paid")] : [])];
      return { ...b, payments, history, status: settle ? "paid" : b.status };
    }),
  });
}

export function deletePayment(bookingId: string, paymentId: string) {
  write({
    ...read(),
    bookings: read().bookings.map((b) => (b.id === bookingId ? { ...b, payments: (b.payments ?? []).filter((p) => p.id !== paymentId), history: [...(b.history ?? []), stamp("A payment entry was removed")] } : b)),
  });
}

export function setFollowUp(kind: "booking" | "enquiry", id: string, date: string | undefined, note: string) {
  const db = read();
  const apply = <T extends { id: string; followUp?: string; history?: Activity[] }>(rows: T[]) =>
    rows.map((r) => (r.id === id ? { ...r, followUp: date, history: [...(r.history ?? []), stamp(note)] } : r));
  write(kind === "booking" ? { ...db, bookings: apply(db.bookings) } : { ...db, enquiries: apply(db.enquiries) });
}

export function deleteBooking(id: string) {
  write({ ...read(), bookings: read().bookings.filter((b) => b.id !== id) });
}

/* Quote requests ---------------------------------------------------------- */

type NewEnquiry = Omit<Enquiry, "id" | "reference" | "status" | "internalNotes" | "createdAt" | "history">;

export async function createEnquiry(input: NewEnquiry): Promise<Enquiry> {
  const source = input.source ?? "website";
  const e: Enquiry = {
    ...input,
    id: crypto.randomUUID(),
    reference: ref("Q"),
    status: "new",
    internalNotes: "",
    createdAt: new Date().toISOString(),
    branch: input.branch ?? branchForCity(input.departureCity),
    source,
    history: [stamp(source === "website" ? "Quote request received from the website" : `Logged by the desk (${source})`)],
  };
  write({ ...read(), enquiries: [e, ...read().enquiries] });
  return e;
}

export function updateEnquiry(id: string, patch: Partial<Pick<Enquiry, "status" | "internalNotes" | "branch">>, note?: string) {
  write({
    ...read(),
    enquiries: read().enquiries.map((e) => (e.id === id ? { ...e, ...patch, history: [...(e.history ?? []), ...(note ? [stamp(note)] : [])] } : e)),
  });
}

export function deleteEnquiry(id: string) {
  write({ ...read(), enquiries: read().enquiries.filter((e) => e.id !== id) });
}

/* Contact messages and newsletter ------------------------------------------ */

export async function createMessage(input: Omit<ContactMessage, "id" | "status" | "createdAt">): Promise<ContactMessage> {
  const m: ContactMessage = { ...input, id: crypto.randomUUID(), status: "new", createdAt: new Date().toISOString() };
  write({ ...read(), messages: [m, ...read().messages] });
  return m;
}

export function updateMessage(id: string, status: MessageStatus) {
  write({ ...read(), messages: read().messages.map((m) => (m.id === id ? { ...m, status } : m)) });
}

export function deleteMessage(id: string) {
  write({ ...read(), messages: read().messages.filter((m) => m.id !== id) });
}

/** Returns false when the address is already subscribed. */
export async function addSubscriber(email: string): Promise<boolean> {
  const clean = email.trim().toLowerCase();
  if (read().subscribers.some((s) => s.email === clean)) return false;
  write({ ...read(), subscribers: [{ id: crypto.randomUUID(), email: clean, createdAt: new Date().toISOString() }, ...read().subscribers] });
  return true;
}

export function deleteSubscriber(id: string) {
  write({ ...read(), subscribers: read().subscribers.filter((s) => s.id !== id) });
}

/* Holidays, branches, settings -------------------------------------------- */

export function savePackages(list: TravelPackage[]) {
  write({ ...read(), packages: list });
}

export function saveBranch(branch: Branch) {
  write({ ...read(), branches: read().branches.map((b) => (b.id === branch.id ? branch : b)) });
}

export function saveSettings(settings: SiteSettings) {
  write({ ...read(), settings });
}

export function saveAnnouncement(a: Announcement) {
  write({ ...read(), announcement: a });
}

export function saveOffers(offers: Offer[]) {
  write({ ...read(), offers });
}

/** Look up a booking or quote request the way a customer would: reference plus the phone or email they gave. */
export function findTrip(reference: string, contact: string): { kind: "booking"; row: Booking } | { kind: "enquiry"; row: Enquiry } | null {
  const ref = reference.trim().toUpperCase();
  const digits = contact.replace(/\D/g, "").slice(-10);
  const email = contact.trim().toLowerCase();
  const ok = (phone: string, mail: string) => (digits.length >= 7 && phone.replace(/\D/g, "").slice(-10) === digits) || (!!email.includes("@") && mail.toLowerCase() === email);
  const b = read().bookings.find((x) => x.reference.toUpperCase() === ref && ok(x.lead.phone, x.lead.email));
  if (b) return { kind: "booking", row: b };
  const e = read().enquiries.find((x) => x.reference.toUpperCase() === ref && ok(x.phone, x.email));
  return e ? { kind: "enquiry", row: e } : null;
}

export function resetDemo() {
  write(seed());
}

export function exportBackup() {
  return JSON.stringify({ exportedAt: new Date().toISOString(), ...read() }, null, 2);
}

export const bookingStatuses: BookingStatus[] = ["new", "contacted", "confirmed", "paid", "completed", "cancelled"];
export const enquiryStatuses: EnquiryStatus[] = ["new", "contacted", "quoted", "won", "closed"];
export const messageStatuses: MessageStatus[] = ["new", "replied", "archived"];
export const leadSources: LeadSource[] = ["website", "walk-in", "phone", "whatsapp", "instagram", "referral"];
export const branchIds: BranchId[] = ["pondicherry", "chennai"];
export const paymentMethods: PaymentMethod[] = ["upi", "cash", "bank", "card"];
