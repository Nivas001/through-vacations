// Shapes mirror the future Supabase tables: packages, bookings, enquiries, messages, subscribers, branches, site_settings.

export type Region = "India" | "International";

export type TravelStyle =
  | "Couples"
  | "Honeymoon"
  | "Family"
  | "Friends"
  | "Group"
  | "Corporate"
  | "Student"
  | "Beach"
  | "Nature"
  | "City"
  | "Culture";

export type DayPace = "Easy" | "Active" | "Adventure" | "Travel day" | "Free";

export type ItineraryDay = {
  title: string;
  description: string;
  /** Short stops shown as chips, in the order of the day. */
  stops?: string[];
  /** A planner's aside, written in our voice. */
  tip?: string;
  pace?: DayPace;
  /** Where you sleep that night; "Departure" on the last day. */
  overnight?: string;
};

export type TravelPackage = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  destination: string;
  region: Region;
  nights: number;
  days: number;
  durationLabel: string;
  summary: string;
  image: string;
  imageAlt: string;
  poster?: string;
  gallery: string[];
  /** Indicative per-person starting price. null = quote on request. */
  price: number | null;
  currency: "INR";
  priceNote: string;
  /** ISO date; the price is hidden after this date. */
  validUntil: string | null;
  styles: TravelStyle[];
  bestMonths: number[]; // 1-12
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  sourceUrl: string;
  facts?: TripFacts;
  featured: boolean;
  published: boolean;
};

export type TripFacts = {
  /** Airport or railhead you arrive at. */
  gateway: string;
  /** IATA-style code shown on boarding-pass UI. */
  code: string;
  /** Typical flight or journey from Chennai; always approximate. */
  fromChennai: string;
  international: boolean;
  /** Paperwork line, no guarantees. */
  paperwork: string;
  /** Suggested nights range [min, max]. */
  nights: [number, number];
  /** Rough travel "weight" 1 (light) - 5 (heavy) for flights and transfers. */
  transfer: 1 | 2 | 3 | 4 | 5;
  /** Overnight bases, in order; used to count hotel changes. */
  bases: string[];
};

export type Mood = {
  id: string;
  label: string;
  blurb: string;
  styles: TravelStyle[];
  image: string;
};

export type BookingStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "paid"
  | "completed"
  | "cancelled";

export type Traveller = { name: string; age?: number };

export type AddOn = "flights" | "visa" | "extra-nights" | "travel-insurance";

/** The two offices. Every lead is owned by one of them. */
export type BranchId = "pondicherry" | "chennai";

export type Branch = {
  id: BranchId;
  name: string;
  city: string;
  /** Street address; empty until the owner confirms it, and the UI then says "by appointment". */
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  manager: string;
  /** Free-text query for the embedded map. */
  mapQuery: string;
};

export type LeadSource = "website" | "walk-in" | "phone" | "whatsapp" | "instagram" | "referral";

export type PaymentMethod = "upi" | "cash" | "card" | "bank";

/** Money received against a booking: an advance, an instalment or the balance. */
export type Payment = { id: string; amount: number; method: PaymentMethod; note: string; at: string };

/** Site-wide offer banner, switched on from the travel desk. */
export type Announcement = { enabled: boolean; text: string; href: string; cta: string };

/** A promotion shown on the Offers page, managed from the travel desk. */
export type Offer = {
  id: string;
  title: string;
  /** Holiday it links to; its photo and duration are reused. */
  packageSlug: string;
  /** Per-person "from" price; null shows "Quote on request". */
  price: number | null;
  /** Optional struck-through price; only set when the business publishes one. */
  was: number | null;
  badge: string;
  description: string;
  /** ISO date; the offer hides itself after this day. */
  validUntil: string | null;
  active: boolean;
};

/** One line in a record's timeline: status changes, notes, assignments. */
export type Activity = { at: string; text: string };

export type Booking = {
  id: string;
  reference: string;
  packageSlug: string;
  packageTitle: string;
  startDate: string; // ISO
  adults: number;
  children: number;
  rooms: number;
  addOns: AddOn[];
  lead: { name: string; email: string; phone: string; city: string; country: string };
  notes: string;
  estimate: number | null;
  status: BookingStatus;
  internalNotes: string;
  createdAt: string;
  branch?: BranchId;
  source?: LeadSource;
  history?: Activity[];
  payments?: Payment[];
  /** ISO date to get back to the customer. */
  followUp?: string;
};

export type EnquiryStatus = "new" | "contacted" | "quoted" | "won" | "closed";

export type Enquiry = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  departureCity: string;
  departureCountry: string;
  destinations: string;
  dates: string;
  flexibleDates: boolean;
  travellers: number;
  budget: string;
  currency: string;
  styles: TravelStyle[];
  notes: string;
  status: EnquiryStatus;
  internalNotes: string;
  createdAt: string;
  branch?: BranchId;
  source?: LeadSource;
  history?: Activity[];
  followUp?: string;
};

export type MessageStatus = "new" | "replied" | "archived";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  branch: BranchId;
  status: MessageStatus;
  createdAt: string;
};

export type Subscriber = { id: string; email: string; createdAt: string };

export type SiteSettings = {
  headline: string;
  intro: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  location: string;
};
