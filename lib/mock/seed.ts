import type { Booking, BranchId, ContactMessage, Enquiry, LeadSource, Payment, Subscriber } from "../types";

// Synthetic demo rows so the travel desk is not empty. Dates are relative to the first load,
// so charts always show recent activity. Removed once Supabase is live.
const DAY = 864e5;
const ago = (now: number, days: number, hour = 11) => {
  const d = new Date(now - days * DAY);
  d.setHours(hour, (days * 17) % 60, 0, 0);
  // Today's rows must not land later than now: spread them over the last few hours instead.
  if (d.getTime() > now) return new Date(now - (hour - 7) * 23 * 60e3).toISOString();
  return d.toISOString();
};
const ahead = (now: number, days: number) => new Date(now + days * DAY).toISOString().slice(0, 10);

type B = [ref: string, slug: string, title: string, inDays: number, adults: number, kids: number, name: string, city: string, branch: BranchId, source: LeadSource, status: Booking["status"], daysAgo: number];

const bookingRows: B[] = [
  ["TV-8K2QF", "andaman", "Andaman Islands", 34, 2, 0, "Priya Raman", "Chennai", "chennai", "website", "new", 0],
  ["TV-8JZ7M", "kashmir", "Kashmir", 52, 2, 0, "Arjun & Meera", "Pondicherry", "pondicherry", "instagram", "new", 1],
  ["TV-8JW1C", "phuket-krabi", "Phuket & Krabi", 41, 4, 0, "Karthik Subramanian", "Chennai", "chennai", "whatsapp", "contacted", 2],
  ["TV-8JR4D", "coorg", "Coorg", 18, 2, 1, "Lakshmi Narayanan", "Villupuram", "pondicherry", "walk-in", "confirmed", 4],
  ["TV-8JN9A", "bali", "Bali", 64, 2, 0, "Rahul & Divya", "Bengaluru", "pondicherry", "website", "contacted", 5],
  ["TV-8JH2B", "dubai", "Dubai", 27, 3, 2, "Mohammed Irfan", "Chennai", "chennai", "phone", "paid", 7],
  ["TV-8JC6E", "maldives", "Maldives", 76, 2, 0, "Sneha Krishnan", "Chennai", "chennai", "website", "confirmed", 9],
  ["TV-8J77K", "munnar-alleppey", "Munnar & Alleppey", 12, 5, 2, "Ganesh Family", "Cuddalore", "pondicherry", "referral", "paid", 12],
  ["TV-8J2PL", "pondicherry", "Pondicherry", 6, 6, 0, "Vignesh & friends", "Chennai", "chennai", "instagram", "confirmed", 15],
  ["TV-8HX3N", "malaysia", "Malaysia", 45, 2, 2, "Fathima Begum", "Pondicherry", "pondicherry", "walk-in", "contacted", 19],
  ["TV-8HQ8R", "shimla-manali-amritsar", "Shimla, Manali & Amritsar", -6, 2, 0, "Senthil & Kavya", "Chennai", "chennai", "website", "completed", 26],
  ["TV-8HJ1S", "singapore", "Singapore", 58, 4, 1, "Anand Venkatesh", "Tiruvannamalai", "pondicherry", "phone", "new", 3],
  ["TV-8HD5T", "goa", "Goa", -14, 8, 0, "Rohit (college group)", "Chennai", "chennai", "whatsapp", "completed", 33],
  ["TV-8H84U", "sri-lanka", "Sri Lanka", 30, 2, 0, "Deepa Sundar", "Pondicherry", "pondicherry", "website", "cancelled", 38],
  ["TV-8H2WV", "ladakh", "Ladakh", 95, 4, 0, "Harish Kumar", "Chennai", "chennai", "website", "new", 6],
  ["TV-8GW7X", "udaipur-jaipur", "Udaipur & Jaipur", 22, 2, 0, "Nandhini Raj", "Pondicherry", "pondicherry", "instagram", "paid", 44],
  ["TV-8GR2Y", "andaman", "Andaman Islands", 15, 4, 2, "Suresh Babu", "Chennai", "chennai", "walk-in", "paid", 10],
  ["TV-8GM5Z", "andaman", "Andaman Islands", 48, 2, 0, "Keerthi & Arun", "Pondicherry", "pondicherry", "instagram", "confirmed", 8],
  ["TV-8GH8A", "kashmir", "Kashmir", 39, 3, 1, "Jayanthi Mohan", "Chennai", "chennai", "website", "confirmed", 13],
  ["TV-8GC1B", "maldives", "Maldives", 120, 2, 0, "Prakash & Swathi", "Chennai", "chennai", "referral", "contacted", 4],
  ["TV-8G74C", "phuket-krabi", "Phuket & Krabi", 26, 2, 0, "Ashwin Raj", "Pondicherry", "pondicherry", "whatsapp", "paid", 18],
];

/** Rough per-person figures for the demo pipeline only. Real amounts come from quotes. */
const demoPerPerson: Record<string, number> = {
  andaman: 24999, kashmir: 32000, "phuket-krabi": 38000, coorg: 14500, bali: 52000, dubai: 61000, maldives: 98000,
  "munnar-alleppey": 18500, pondicherry: 7500, malaysia: 44000, "shimla-manali-amritsar": 41000, singapore: 56000,
  goa: 16000, "sri-lanka": 39000, ladakh: 47000, "udaipur-jaipur": 29000,
};

const phone = (i: number) => `+91 90000 ${String(10000 + i * 137).slice(0, 5)}`;
const email = (name: string) => `${name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@example.com`;

const day = (now: number, offset: number) => new Date(now + offset * DAY).toISOString().slice(0, 10);

/** Advance on confirmation, balance before travel: the usual pattern at the desk. */
function seedPayments(now: number, status: Booking["status"], total: number, daysAgo: number, i: number): Payment[] {
  const advance = Math.round((total * 0.3) / 1000) * 1000;
  const methods = ["upi", "bank", "cash", "upi"] as const;
  const out: Payment[] = [];
  if (["confirmed", "paid", "completed"].includes(status)) out.push({ id: `seed-p${i}a`, amount: advance, method: methods[i % 4], note: "Advance", at: ago(now, Math.max(0, daysAgo - 1), 12) });
  if (["paid", "completed"].includes(status)) out.push({ id: `seed-p${i}b`, amount: total - advance, method: methods[(i + 1) % 4], note: "Balance", at: ago(now, Math.max(0, daysAgo - 3), 15) });
  return out;
}

export function seedBookings(now: number): Booking[] {
  return bookingRows.map(([reference, packageSlug, packageTitle, inDays, adults, children, name, city, branch, source, status, daysAgo], i) => {
    const createdAt = ago(now, daysAgo, 9 + (i % 9));
    const history = [{ at: createdAt, text: source === "website" ? "Request received from the website" : `Added by the ${branch === "chennai" ? "Chennai" : "Pondicherry"} desk (${source})` }];
    if (status !== "new") history.push({ at: ago(now, Math.max(0, daysAgo - 1), 15), text: `Status changed to ${status}` });
    const estimate = (demoPerPerson[packageSlug] ?? 30000) * (adults + children);
    return {
      payments: seedPayments(now, status, estimate, daysAgo, i),
      followUp: status === "contacted" ? day(now, i % 3 === 0 ? -1 : i % 3 === 1 ? 0 : 2) : status === "new" && i % 2 ? day(now, 0) : undefined,
      id: `seed-b${i + 1}`, reference, packageSlug, packageTitle, startDate: ahead(now, inDays), adults, children,
      rooms: Math.max(1, Math.ceil(adults / 2)), addOns: i % 3 === 0 ? ["flights"] : i % 4 === 1 ? ["visa", "travel-insurance"] : [],
      lead: { name, email: email(name), phone: phone(i), city, country: "India" },
      notes: i % 2 ? "" : "Prefer a sea-facing room if possible.", estimate,
      status, internalNotes: status === "contacted" ? "Called, sending options on WhatsApp." : "", createdAt, branch, source, history,
    } satisfies Booking;
  });
}

type E = [ref: string, name: string, city: string, country: string, wants: string, dates: string, flexible: boolean, pax: number, budget: string, currency: string, styles: Enquiry["styles"], status: Enquiry["status"], branch: BranchId, source: LeadSource, daysAgo: number, notes: string];

const enquiryRows: E[] = [
  ["Q-8K3AB", "Sri Venkateswara College", "Pondicherry", "India", "Industrial visit to Bengaluru", "January, 3 days", true, 42, "6000", "INR", ["Student", "Group"], "new", "pondicherry", "phone", 0, "Need a bus, two faculty rooms and factory visit permissions."],
  ["Q-8K1CD", "Aishwarya Menon", "Singapore", "Singapore", "Bali honeymoon", "Mid December", false, 2, "3000", "SGD", ["Honeymoon"], "new", "chennai", "website", 1, "Private pool villa please."],
  ["Q-8JY2E", "Balaji Textiles", "Chennai", "India", "Corporate offsite, Goa or Coorg", "February", true, 25, "", "INR", ["Corporate", "Group"], "contacted", "chennai", "whatsapp", 2, "Conference hall for one afternoon."],
  ["Q-8JT5F", "Ramesh Iyer", "Dubai", "United Arab Emirates", "Kerala with parents", "April", true, 5, "2500", "AED", ["Family"], "quoted", "pondicherry", "website", 4, "Two seniors, avoid long drives."],
  ["Q-8JP8G", "Shalini Prakash", "Chennai", "India", "Thailand girls' trip", "March", false, 6, "45000", "INR", ["Friends"], "quoted", "chennai", "instagram", 6, ""],
  ["Q-8JK3H", "Tamil & Preethi", "Pondicherry", "India", "Maldives or Mauritius", "Any time next year", true, 2, "150000", "INR", ["Honeymoon", "Couples"], "won", "pondicherry", "walk-in", 9, "Wedding on 14 Feb."],
  ["Q-8JF6J", "Daniel Joseph", "London", "United Kingdom", "Golden triangle + Rajasthan", "October", false, 3, "2000", "GBP", ["Culture", "Family"], "contacted", "pondicherry", "website", 11, ""],
  ["Q-8J97K", "Kumaran Associates", "Chennai", "India", "Dubai incentive trip", "May", false, 18, "", "INR", ["Corporate"], "new", "chennai", "phone", 3, "Top sales team, 4 nights."],
  ["Q-8J43L", "Meenakshi Sundaram", "Karaikal", "India", "Kashmir", "Late May", true, 4, "35000", "INR", ["Family", "Nature"], "closed", "pondicherry", "website", 21, "Went with another agent."],
  ["Q-8HY1M", "Nikhil Rao", "Chennai", "India", "Ladakh bike trip", "July", false, 4, "", "INR", ["Friends"], "quoted", "chennai", "instagram", 16, ""],
  ["Q-8HS6N", "Gayathri Devi", "Pondicherry", "India", "Sri Lanka", "December holidays", true, 4, "40000", "INR", ["Family"], "won", "pondicherry", "referral", 28, ""],
  ["Q-8HM2P", "Vikram Chandran", "Chennai", "India", "Singapore with kids", "Summer vacation", true, 4, "", "INR", ["Family", "City"], "new", "chennai", "website", 0, "Universal Studios is a must."],
];

export function seedEnquiries(now: number): Enquiry[] {
  return enquiryRows.map(([reference, name, departureCity, departureCountry, destinations, dates, flexibleDates, travellers, budget, currency, styles, status, branch, source, daysAgo, notes], i) => {
    const createdAt = ago(now, daysAgo, 10 + (i % 8));
    const history = [{ at: createdAt, text: source === "website" ? "Quote request received from the website" : `Logged by the ${branch === "chennai" ? "Chennai" : "Pondicherry"} desk (${source})` }];
    if (status !== "new") history.push({ at: ago(now, Math.max(0, daysAgo - 1), 16), text: `Status changed to ${status}` });
    return {
      id: `seed-e${i + 1}`, reference, name, email: email(name), phone: phone(i + 40), departureCity, departureCountry, destinations, dates,
      flexibleDates, travellers, budget, currency, styles, notes, status, internalNotes: "", createdAt, branch, source, history,
      followUp: status === "quoted" ? day(now, i % 2 ? 0 : -2) : status === "contacted" ? day(now, 1 + (i % 4)) : undefined,
    } satisfies Enquiry;
  });
}

export function seedMessages(now: number): ContactMessage[] {
  return [
    { id: "seed-m1", name: "Revathi S", email: "revathi.s@example.com", phone: "+91 90000 22001", subject: "Visa help for Dubai", message: "Do you help with the Dubai tourist visa if I book flights myself?", branch: "chennai", status: "new", createdAt: ago(now, 0, 9) },
    { id: "seed-m2", name: "Joseph Antony", email: "joseph.a@example.com", phone: "+91 90000 22002", subject: "Office visit", message: "Can I come to the Pondicherry office on Saturday to discuss a family trip?", branch: "pondicherry", status: "new", createdAt: ago(now, 1, 14) },
    { id: "seed-m3", name: "Harini K", email: "harini.k@example.com", phone: "+91 90000 22003", subject: "Passport renewal", message: "Do you assist with passport renewal appointments?", branch: "pondicherry", status: "replied", createdAt: ago(now, 5, 12) },
    { id: "seed-m4", name: "Sathish M", email: "sathish.m@example.com", phone: "+91 90000 22004", subject: "School trip", message: "Looking for a 2-day trip for 60 students from Chennai.", branch: "chennai", status: "archived", createdAt: ago(now, 12, 10) },
  ];
}

export function seedSubscribers(now: number): Subscriber[] {
  return ["anitha.r", "prakash.v", "joel.d", "keerthana.m", "suresh.b", "aparna.n", "farhan.k"].map((u, i) => ({
    id: `seed-s${i + 1}`, email: `${u}@example.com`, createdAt: ago(now, i * 4 + 1, 8 + i),
  }));
}
