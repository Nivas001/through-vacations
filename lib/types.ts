// Shapes mirror the future Supabase tables: packages, bookings, enquiries, site_settings.

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
};

export type SiteSettings = {
  headline: string;
  intro: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  location: string;
};
