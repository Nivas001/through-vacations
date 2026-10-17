import type { Booking, Enquiry } from "../types";

// Clearly synthetic demo rows so the admin screens are not empty. Removed once Supabase is live.
const d = (daysAgo: number) => new Date(Date.UTC(2026, 9, 16) - daysAgo * 864e5).toISOString();
const future = (days: number) => new Date(Date.UTC(2026, 9, 16) + days * 864e5).toISOString().slice(0, 10);

export const seedBookings: Booking[] = [
  {
    id: "seed-b1", reference: "TV-DEMO01", packageSlug: "andaman", packageTitle: "Andaman Islands",
    startDate: future(40), adults: 2, children: 0, rooms: 1, addOns: ["flights"],
    lead: { name: "Demo Traveller", email: "demo1@example.com", phone: "+91 90000 00001", city: "Chennai", country: "India" },
    notes: "Demo record", estimate: 49998, status: "new", internalNotes: "", createdAt: d(1),
  },
  {
    id: "seed-b2", reference: "TV-DEMO02", packageSlug: "coorg", packageTitle: "Coorg",
    startDate: future(25), adults: 2, children: 0, rooms: 1, addOns: [],
    lead: { name: "Demo Couple", email: "demo2@example.com", phone: "+91 90000 00002", city: "Pondicherry", country: "India" },
    notes: "Demo record", estimate: null, status: "contacted", internalNotes: "Called once", createdAt: d(3),
  },
  {
    id: "seed-b3", reference: "TV-DEMO03", packageSlug: "bangkok-pattaya", packageTitle: "Bangkok & Pattaya",
    startDate: future(70), adults: 4, children: 1, rooms: 2, addOns: ["visa"],
    lead: { name: "Demo Family", email: "demo3@example.com", phone: "+91 90000 00003", city: "Bengaluru", country: "India" },
    notes: "Demo record", estimate: 75996, status: "confirmed", internalNotes: "", createdAt: d(6),
  },
];

export const seedEnquiries: Enquiry[] = [
  {
    id: "seed-e1", reference: "Q-DEMO01", name: "Demo Student Group", email: "demo4@example.com", phone: "+91 90000 00004",
    departureCity: "Pondicherry", departureCountry: "India", destinations: "Industrial visit, Bengaluru", dates: "Next term",
    flexibleDates: true, travellers: 30, budget: "per head quote", currency: "INR", styles: ["Student", "Group"],
    notes: "Demo record", status: "new", internalNotes: "", createdAt: d(2),
  },
  {
    id: "seed-e2", reference: "Q-DEMO02", name: "Demo Honeymooners", email: "demo5@example.com", phone: "+91 90000 00005",
    departureCity: "Singapore", departureCountry: "Singapore", destinations: "Bali", dates: "December",
    flexibleDates: false, travellers: 2, budget: "3000", currency: "SGD", styles: ["Honeymoon"],
    notes: "Demo record", status: "quoted", internalNotes: "", createdAt: d(5),
  },
];
